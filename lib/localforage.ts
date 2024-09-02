import localforage from "localforage";
import { fetchFile, imageFileToDataURL } from "./utils";
import { canvasFileToDataURL } from "./fabric";
import Attachment from "./types/attachment";

const dataURLStore = localforage.createInstance({
  name: "data_url",
});

const fileStore = localforage.createInstance({
  name: "file",
});

export async function getFile(attachment: Attachment) {
  const { file, fileId } = attachment;
  if (file) return file;
  if (!fileId) return null;
  const storedFile = (await fileStore.getItem(fileId)) as File | null;
  if (storedFile) return storedFile;
  const fetchedFile = await fetchFile(`/api/file/${fileId}`);
  if (!fetchedFile) return null;
  fileStore.setItem(fileId, fetchedFile);
  return fetchedFile;
}

export async function getDataURL(attachment: Attachment) {
  const { fileId, dataURL } = attachment;
  if (dataURL) return dataURL;
  if (!fileId) return null;
  const storedDataURL = (await dataURLStore.getItem(fileId)) as string | null;
  if (storedDataURL) return storedDataURL;
  const file = await getFile(attachment);
  if (!file) return;
  let newDataURL;
  if (file.type.startsWith("image/"))
    newDataURL = await imageFileToDataURL(file);
  else if (file.name.endsWith(".canvas"))
    newDataURL = await canvasFileToDataURL(file);
  if (!newDataURL) return null;
  dataURLStore.setItem(fileId, newDataURL);
  return newDataURL;
}
