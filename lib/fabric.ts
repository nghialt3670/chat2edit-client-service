"client only";

import { Canvas, FabricImage } from "fabric";
import { readFileAsDataURL, readFileAsText } from "./utils";

export async function initCanvasFromFile(file: File): Promise<Canvas> {
  const dataURL = await readFileAsDataURL(file);
  const canvas = new Canvas();
  if (dataURL) {
    canvas.backgroundImage = await FabricImage.fromURL(dataURL.toString());
    canvas.backgroundImage.set("filename", file.name);
  }
  return canvas;
}

export async function createCanvasFromFile(file: File): Promise<Canvas | null> {
  const json = await readFileAsText(file);
  if (!json) return null;
  const canvas = new Canvas();
  canvas.renderOnAddRemove = false;
  await canvas.loadFromJSON(json);
  resizeCanvas(canvas);
  return canvas;
}

export function resizeCanvas(canvas: Canvas): void {
  if (canvas.backgroundImage) {
    canvas.setWidth(canvas.backgroundImage.getScaledWidth());
    canvas.setHeight(canvas.backgroundImage.getScaledHeight());
  }
}
