import mongoose from "mongoose";

export async function uploadToGridFS(
  buffer: Buffer,
  filename: string,
  contentType: string,
  db: mongoose.mongo.Db,
  bucketName: string,
): Promise<string | null> {
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName });
  const uploadStream = bucket.openUploadStream(filename, { contentType });
  uploadStream.end(buffer);
  return new Promise((resolve) => {
    uploadStream.on("finish", () => resolve(uploadStream.id.toString()));
    uploadStream.on("error", () => resolve(null));
  });
}

export async function deleteFromGridFS(
  fileId: string,
  db: mongoose.mongo.Db,
  bucketName: string,
): Promise<void> {
  const fileCollection = db.collection(`${bucketName}.files`);
  const chunkCollection = db.collection(`${bucketName}.chunks`);
  const objId = new mongoose.Types.ObjectId(fileId);
  await fileCollection.deleteOne({ _id: objId });
  await chunkCollection.deleteMany({ file_id: objId });
}
