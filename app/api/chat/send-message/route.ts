import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import sharp from "sharp";
import JSZip from "jszip";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/lib/configs/db";
import SendMessageResponse from "@/lib/types/send-message-response";
import { logError, parseZipComment } from "@/lib/utils";
import EditProvider from "@/lib/types/edit-provider";
import { uploadToGridFS } from "@/lib/gridfs";
import ChatTask from "@/lib/types/chat-task";
import Language from "@/lib/types/language";
import connectToMongoDB from "@/lib/mongo";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

function taskToProvider(task: ChatTask) {
  switch (task) {
    case ChatTask.ImageEditing:
      return EditProvider.Fabric;
    default:
      throw new Error("Unsupported task");
  }
}

function taskToPrismaTask(task: ChatTask): "IMAGE_EDITING" {
  switch (task) {
    case ChatTask.ImageEditing:
      return "IMAGE_EDITING";
    default:
      throw new Error("Unsupported task");
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const chatId = formData.get("chatId") as string | undefined;
  const text = formData.get("text") as string | undefined;
  const files = (formData.getAll("files") as File[]) || [];
  const task = formData.get("task") as ChatTask | undefined;
  const language = formData.get("lang") as Language | undefined;
  const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;

  let response: SendMessageResponse = { savedRequest: false };

  try {
    await connectToMongoDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Error connect to MongoDB");

    if (!text) throw new Error("Text is required");
    if (!(typeof text !== "string")) throw new Error("Text must be string");
    if (!task) throw new Error("Task is required");
    if (!(task in ChatTask)) throw new Error(`Task "${task}" is invalid`);
    if (!language) throw new Error("Language is required");
    if (!(language in Language))
      throw new Error(`Language "${language}" is invalid`);

    const provider = taskToProvider(task);
    formData.set("provider", provider);

    const session = await auth();
    const accountId = session?.user?.id;
    if (!accountId) return NextResponse.json({ status: 401 });

    let chat;
    if (chatId) {
      chat = await prisma.chat.findFirstOrThrow({
        where: { id: chatId, accountId },
      });
    } else {
      chat = await prisma.chat.create({
        data: { accountId, task, language, isError: true },
      });
      response.newChatId = chat.id;
    }

    if (chat.isError)
      throw new Error(
        "Cannot send a new message before resolving the current chat error",
      );

    const reqMessage = await prisma.message.create({
      data: { chatId: chat.id, text },
    });

    await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileId = await uploadToGridFS(
          buffer,
          file.name,
          file.type,
          db,
          bucketName,
        );
        if (!fileId) {
          await prisma.message.delete({ where: { id: reqMessage.id } });
          throw new Error("Error while uploading request files");
        }
        const { width, height } = await sharp(buffer).metadata();
        return await prisma.attachment.create({
          data: {
            accountId,
            messageId: reqMessage.id,
            type: file.type,
            name: file.name,
            size: file.size,
            fileId,
            width,
            height,
          },
        });
      }),
    );

    response.savedRequest = true;

    const chatEndpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v2/chat/${chat.id}`;
    const chatResponse = await fetch(chatEndpoint, {
      method: "POST",
      body: formData,
    });

    if (!chatResponse.ok) throw new Error("Chat service error");

    const blob = await chatResponse.arrayBuffer();
    const zip = await JSZip.loadAsync(blob);
    const resText = await zip.files["message.txt"].async("text");

    const resMessage = await prisma.message.create({
      data: { chatId: chat.id, text: resText },
    });

    let resAttachments;
    try {
      resAttachments = await Promise.all(
        Object.keys(zip.files)
          .filter((filename) => filename !== "message.txt")
          .map(async (filename) => {
            const file = zip.files[filename];
            const buffer = await file.async("nodebuffer");
            let { contentType, width, height } = parseZipComment(file.comment);
            if (!contentType) throw new Error("Content Type is required");

            const fileId = await uploadToGridFS(
              buffer,
              filename,
              contentType,
              db,
              bucketName,
            );
            if (!fileId)
              throw new Error("Error while uploading response files");

            return await prisma.attachment.create({
              data: {
                accountId,
                messageId: resMessage.id,
                type: contentType,
                name: file.name,
                size: buffer.length,
                fileId,
                width: width ? parseInt(width) : undefined,
                height: height ? parseInt(height) : undefined,
              },
            });
          }),
      );
    } catch (error) {
      logError(error);
    }

    if (!resAttachments) {
      await prisma.message.delete({ where: { id: resMessage.id } });
      throw new Error("Error while create response attachments");
    }

    response.response = {
      text: resMessage.text,
      attachments: resAttachments.map((att) => ({
        type: att.type,
        name: att.name,
        size: att.size,
        fileId: att.fileId,
        width: att.width ?? undefined,
        height: att.height ?? undefined,
      })),
    };

    const title = resMessage ? resMessage.text : reqMessage.text;
    const lastMessageId = resMessage ? resMessage.id : reqMessage.id;

    await prisma.chat.update({
      where: { id: chat.id },
      data: { title, lastMessageId, isError: false },
    });
  } catch (error) {
    logError(error);
  } finally {
    return NextResponse.json(response);
  }
}
