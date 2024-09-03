import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { MESSAGE_FILES_BUCKET_NAME } from "@/lib/configs/db";
import { deleteFromGridFS } from "@/lib/gridfs";
import connectToMongoDB from "@/lib/mongo";
import { logError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToMongoDB();
    const db = mongoose.connection.db;
    const bucketName = MESSAGE_FILES_BUCKET_NAME;
    if (!db) throw new Error("Error connect to MongoDB");

    const { id } = params;

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ status: 401 });

    const messages = await prisma.message.findMany({
      where: { chatId: id },
      select: { attachments: true },
    });

    await prisma.chat.delete({
      where: { id, accountId: session.user.id },
    });

    try {
      messages.flatMap((message) =>
        message.attachments
          .map((att) => att.fileId)
          .map((fileId) => deleteFromGridFS(fileId, db, bucketName)),
      );
    } catch (error) {
      logError(error);
    }

    return NextResponse.json({});
  } catch (error) {
    logError(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
