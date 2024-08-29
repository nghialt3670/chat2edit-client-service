import mongoose from "mongoose";

import { NextRequest, NextResponse } from "next/server";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/lib/configs/db";
import SendMessageResponse from "@/lib/types/send-message-response";
import ChatResponse from "@/lib/types/chat-response";
import { uploadFilesToGridFS } from "@/lib/gridfs";
import connectToMongoDB from "@/lib/mongo";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const chatId = formData.get("chatId") as string | undefined;
  const text = formData.get("text") as string;
  const files = (formData.getAll("files") as File[]) || [];
  const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;

  let response: SendMessageResponse = { savedRequest: false };

  try {
    await connectToMongoDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Error connect to MongoDB");

    if (!text) throw new Error("Message's text field is required");

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ status: 401 });

    let chat;
    if (chatId) {
      chat = await prisma.chat.findFirstOrThrow({
        where: { id: chatId, accountId: session.user.id },
      });
    } else {
      chat = await prisma.chat.create({
        data: { accountId: session.user.id },
      });
      response.newChatId = chat.id;
    }

    if (chat.isError)
      throw new Error(
        "Cannot send a new message before resolving the current chat error",
      );

    const fileObjIds = await uploadFilesToGridFS(files, db, bucketName);
    const fileIds = fileObjIds.map((id) => id.toString());
    const reqMessage = await prisma.message.create({
      data: { chatId: chat.id, text, fileIds },
    });
    response.savedRequest = true;

    const endpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v1/chat`;
    const reqBody = JSON.stringify({
      conversation_id: chat.id,
      text,
      file_ids: fileIds,
      bucket_name: bucketName,
    });
    const chatResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: reqBody,
    });

    if (!chatResponse.ok) throw new Error("Chat service error");

    const payload = (await chatResponse.json()) as ChatResponse;
    const resMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        text: payload.text,
        fileIds: payload.file_ids,
      },
    });

    response.response = {
      text: resMessage.text,
      fileIds: resMessage.fileIds,
    };

    const title = resMessage ? resMessage.text : reqMessage.text;
    const lastMessageId = resMessage ? resMessage.id : reqMessage.id;

    await prisma.chat.update({
      where: { id: chat.id },
      data: { title, lastMessageId },
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  } finally {
    return NextResponse.json(response);
  }
}
