import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import sharp from "sharp";
import JSZip from "jszip";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/lib/configs/db";
import { logError, parseZipComment } from "@/lib/utils";
import SendResponse from "@/lib/types/send-response";
import { formDataSchema } from "@/lib/configs/form";
import { uploadToGridFS } from "@/lib/gridfs";
import connectToMongoDB from "@/lib/mongo";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const rawFormData = {
    chatId: formData.get("chatId"),
    text: formData.get("text"),
    files: formData.getAll("files"),
    provider: formData.get("provider"),
    language: formData.get("language"),
  };

  const parsedFormData = formDataSchema.safeParse(rawFormData);

  if (!parsedFormData.success) {
    console.log(parsedFormData.error.errors.map((e) => e.message));
    return NextResponse.json(
      { error: parsedFormData.error.errors.map((e) => e.message) },
      { status: 400 },
    );
  }

  const { chatId, text, files, provider, language } = parsedFormData.data;
  const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;
  let response: SendResponse;

  try {
    await connectToMongoDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Error connect to MongoDB");

    const session = await auth();
    const accountId = session?.user?.id;
    if (!accountId) return NextResponse.json({ status: 401 });

    let chat;
    if (chatId) {
      chat = await prisma.chat.findUniqueOrThrow({
        where: { id: chatId },
      });
      if (chat.provider !== provider) throw new Error("Providers mismatch");
      if (chat.language !== language) throw new Error("Languages mismatch");
      if (chat.accountId !== accountId) throw new Error("Unauthorized");
      if (chat.isError) throw new Error("Chat error not resolved");
    } else {
      chat = await prisma.chat.create({
        data: { accountId, provider, language },
      });
    }

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

    response = {
      currChat: chat,
      savedReqMessage: true,
    };

    const chatEndpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v2/chat/${chat.id}`;
    const chatResponse = await fetch(chatEndpoint, {
      method: "POST",
      body: formData,
    });

    if (!chatResponse.ok) {
      await prisma.chat.update({
        where: { id: chat.id },
        data: { isError: true },
      });
      throw new Error("Chat service error");
    }

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

    response.resMessage = { ...resMessage, attachments: resAttachments };

    const title = resMessage ? resMessage.text : reqMessage.text;
    const lastMessageId = resMessage ? resMessage.id : reqMessage.id;

    response.currChat = await prisma.chat.update({
      where: { id: chat.id },
      data: { title, lastMessageId, isError: false },
      omit: { accountId: true, lastMessageId: true },
    });
  } catch (error) {
    logError(error);
  } finally {
    return NextResponse.json(response!);
  }
}
