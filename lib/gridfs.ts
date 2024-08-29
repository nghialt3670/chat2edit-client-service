import mongoose from "mongoose";

export async function uploadFilesToGridFS(
  files: File[],
  db: mongoose.mongo.Db,
  bucketName: string,
): Promise<mongoose.Types.ObjectId[]> {
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName });

  return await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadStream = bucket.openUploadStream(file.name, {
        contentType: file.type,
      });

      uploadStream.end(buffer);

      return new Promise((resolve, reject) => {
        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", (error) => reject(error));
      });
    }),
  );
}

export async function downloadFilesFromGridFS(
  fileIds: mongoose.Types.ObjectId[],
  db: mongoose.mongo.Db,
  bucketName: string,
): Promise<(File | null)[]> {
  const collection = db.collection(`${bucketName}.files`);
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName });

  return await Promise.all(
    fileIds.map(async (fileId) => {
      const fileDoc = await collection.findOne({ _id: fileId });
      if (!fileDoc) return null;

      const readStream = bucket.openDownloadStream(fileId);
      const chunks: Buffer[] = [];

      return new Promise<File>((resolve, reject) => {
        readStream.on("data", (chunk) => chunks.push(chunk));
        readStream.on("end", () => {
          const file = new File(
            [Buffer.concat(chunks)],
            fileDoc.filename || "unknown",
            {
              type: fileDoc.contentType || "application/octet-stream",
            },
          );
          resolve(file);
        });
        readStream.on("error", reject);
      });
    }),
  );
}

export async function deleteFilesFromGridFS(
  fileIds: mongoose.Types.ObjectId[],
  db: mongoose.mongo.Db,
  bucketName: string,
): Promise<void> {
  const fileCollection = db.collection(`${bucketName}.files`);
  const chunkCollection = db.collection(`${bucketName}.chunks`);

  await Promise.all(
    fileIds.map(async (fileId) => {
      await fileCollection.deleteOne({ _id: fileId });
      await chunkCollection.deleteMany({ files_id: fileId });
    }),
  );
}
