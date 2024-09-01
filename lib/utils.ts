"client only";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import localforage from "localforage";
import { nanoid } from "nanoid";
import {
  CANVAS_DATA_URL_QUALITY,
  IMAGE_DATA_URL_EXPORT_FORMAT,
  IMAGE_MAX_HEIGHT_PIXELS,
  IMAGE_MAX_WIDTH_PIXELS,
} from "./configs/file";
import { createCanvasFromFile } from "./fabric";
import Attachment from "./types/attachment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function readFileAsDataURL(
  file: File | Blob,
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function readFileAsText(
  file: File | Blob,
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function fetchJSON(
  url: string,
  method?: "GET" | "POST" | "PUT" | "DELETE",
  body?: any,
): Promise<Object | null> {
  try {
    const response = await fetch(url, { method, body });
    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    logError(error);
    return null;
  }
}

export async function fetchFile(
  url: string,
  method?: "GET" | "POST" | "PUT" | "DELETE",
  body?: any,
): Promise<File | null> {
  try {
    const response = await fetch(url, { method, body });
    if (!response.ok) return null;

    const blob = await response.blob();

    const contentDisposition = response.headers.get("Content-Disposition");
    if (!contentDisposition) return null;

    const filename = getFilenameFromContentDisposition(contentDisposition);
    if (!filename) return null;

    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    logError(error);
    return null;
  }
}

export function getFilenameFromContentDisposition(
  contentDisposition: string,
): string | null {
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(contentDisposition);

  if (matches != null && matches[1]) {
    const filename = matches[1].replace(/['"]/g, "");
    return filename;
  }
  return null;
}

function imageFileToDataURL(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate the new dimensions while preserving the aspect ratio
          if (
            width > IMAGE_MAX_WIDTH_PIXELS ||
            height > IMAGE_MAX_HEIGHT_PIXELS
          ) {
            const widthRatio = IMAGE_MAX_WIDTH_PIXELS / width;
            const heightRatio = IMAGE_MAX_HEIGHT_PIXELS / height;
            const ratio = Math.min(widthRatio, heightRatio);
            width = width * ratio;
            height = height * ratio;
          }

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            return resolve(null);
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw the image on the canvas and resize it
          ctx.drawImage(img, 0, 0, width, height);

          // Get the resized image as a dataURL
          const dataURL = canvas.toDataURL(
            file.type || `image/${IMAGE_DATA_URL_EXPORT_FORMAT}`,
          );
          resolve(dataURL);
        } catch (error) {
          console.log(error instanceof Error ? error.message : error);
          resolve(null);
        }
      };

      img.onerror = () => resolve(null);
    };

    reader.onerror = () => resolve(null);

    try {
      reader.readAsDataURL(file);
    } catch {
      resolve(null);
    }
  });
}

export async function canvasFileToDataURL(file: File): Promise<string | null> {
  const canvas = await createCanvasFromFile(file);
  return canvas
    ? canvas.toDataURL({
        format: IMAGE_DATA_URL_EXPORT_FORMAT,
        quality: CANVAS_DATA_URL_QUALITY,
        multiplier: 1,
      })
    : null;
}

export async function fileToAttachment(file: File): Promise<Attachment> {
  const attachment: Attachment = {
    type: file.type,
    name: file.name,
    size: file.size,
    file: file,
  };
  if (file.type.startsWith("image/")) {
    const dataURL = await imageFileToDataURL(file);
    if (dataURL) attachment.dataURL = dataURL;
  } else if (file.name.endsWith(".canvas")) {
    const dataURL = await canvasFileToDataURL(file);
    if (dataURL) attachment.dataURL = dataURL;
  }

  return attachment;
}

export async function logError(error: unknown) {
  console.error(error instanceof Error ? error.stack : error);
}

export function scrollToBottom(container: HTMLElement | null, smooth = false) {
  if (container?.children.length) {
    const lastElement = container?.lastChild as HTMLElement;

    lastElement?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
      inline: "nearest",
    });
  }
}

export function parseZipComment(
  comment: string,
): Record<string, string | undefined> {
  return comment
    .split(";")
    .reduce<Record<string, string | undefined>>((acc, pair) => {
      const [key, value] = pair.split("=");
      acc[key] = value;
      return acc;
    }, {});
}

export default async function getFileFromAttachment(attachment: Attachment) {
  const { file, fileId } = attachment;
  if (file) return file;
  if (!fileId) return null;
  const storedFile = (await localforage.getItem(fileId)) as File | null;
  if (storedFile) return storedFile;
  const fetchedFile = await fetchFile(`/api/file/${fileId}`);
  if (!fetchedFile) return null;
  localforage.setItem(fileId, fetchedFile);
  return fetchedFile;
}
