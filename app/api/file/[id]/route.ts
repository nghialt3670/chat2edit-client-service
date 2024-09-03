import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { MESSAGE_FILES_BUCKET_NAME } from "@/lib/configs/db";
import connectToMongoDB from "@/lib/mongo";
import { logError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const session = await auth();
    const accountId = session?.user?.id;
    if (!accountId) return NextResponse.json({}, { status: 401 });

    await connectToMongoDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Error connect to MongoDB");
    const bucketName = MESSAGE_FILES_BUCKET_NAME;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName });

    const attachment = await prisma.attachment.findFirst({
      where: { fileId: id },
    });
    if (!attachment) return NextResponse.json({}, { status: 404 });
    if (attachment.accountId !== accountId)
      return NextResponse.json({}, { status: 403 });

    const fileId = new mongoose.Types.ObjectId(id);
    const fileDoc = await db
      .collection(`${bucketName}.files`)
      .findOne({ _id: fileId });
    if (!fileDoc) return NextResponse.json({}, { status: 404 });

    const readStream = bucket.openDownloadStream(fileId);
    const readableStream = new ReadableStream({
      start(controller) {
        readStream.on("data", (chunk) => controller.enqueue(chunk));
        readStream.on("end", () => controller.close());
        readStream.on("error", (err) => controller.error(err));
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": fileDoc.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileDoc.filename || "unknown"}"`,
      },
    });
  } catch (error) {
    logError(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
