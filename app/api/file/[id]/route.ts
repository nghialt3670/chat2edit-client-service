import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/lib/configs/db";
import connectToDatabase from "@/lib/mongo";
import { logError } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Error connect to MongoDB");

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME,
    });

    const fileId = new mongoose.Types.ObjectId(params.id);
    const fileDoc = await db.collection("files.files").findOne({ _id: fileId });

    if (!fileDoc)
      return NextResponse.json({ error: "File not found" }, { status: 404 });

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
