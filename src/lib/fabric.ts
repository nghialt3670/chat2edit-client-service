"client only";

import { Canvas, FabricImage } from "fabric";
import { readFileAsDataURL, readFileAsText } from "./utils";

const FABRIC_ADDITIONAL_PROPS = [
  "filename",
  "lable_to_score",
  "inpained",
  "is_query",
];

export async function initCanvasFromImage(file: File): Promise<Canvas> {
  const dataURL = await readFileAsDataURL(file);
  if (!dataURL) throw new Error("Fail to read image file");
  const canvas = new Canvas();
  const url = dataURL.toString();
  canvas.backgroundImage = await FabricImage.fromURL(url);
  canvas.backgroundImage.set("filename", file.name);
  return canvas;
}

export async function loadCanvasFromFile(file: File): Promise<Canvas> {
  const json = await readFileAsText(file);
  if (!json) throw new Error("Failed to read canvas file");
  const canvas = new Canvas();
  await canvas.loadFromJSON(json);
  resizeCanvasToFit(canvas);
  return canvas;
}

export function saveCanvasToFile(canvas: Canvas): File {
  const obj = canvas.toObject(FABRIC_ADDITIONAL_PROPS);
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  const filename = canvas.backgroundImage?.get("filename") + ".fcanvas" || "unknown.fcanvas"
  const file = new File([blob], filename, { type: 'application/json' });
  return file;
}

export function resizeCanvasToFit(canvas: Canvas): void {
  if (!canvas.backgroundImage) throw new Error("Missing background image");
  const width = canvas.backgroundImage.getScaledWidth();
  const height = canvas.backgroundImage.getScaledHeight();
  canvas.setDimensions({ width, height });
}
