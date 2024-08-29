"client only";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
    console.error(error instanceof Error ? error.message : error);
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
    console.error(error instanceof Error ? error.message : error);
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
