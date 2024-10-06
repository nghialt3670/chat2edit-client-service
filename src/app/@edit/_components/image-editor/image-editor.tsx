"use client";

import { FabricImage } from "fabric";
import { useEffect } from "react";
import { toast } from "sonner";
import { readFileAsDataURL, readFileAsText } from "@/lib/utils";
import useEditFile from "@/hooks/use-edit-file";
import ZoomingCanvas from "./zooming-canvas";
import useCanvas from "@/hooks/use-canvas";
import Toolbar from "./toolbar";

export default function ImageEditor() {
  const { editFile } = useEditFile();
  const { canvasRef, setIsLoading } = useCanvas();

  useEffect(() => {
    const initFabricCanvas = async () => {
      if (!editFile || !canvasRef.current) return;

      canvasRef.current.setViewportTransform([1, 0, 0, 1, 0, 0]);

      if (editFile.type.startsWith("image/")) {
        const dataURL = await readFileAsDataURL(editFile);
        if (dataURL)
          canvasRef.current.backgroundImage = await FabricImage.fromURL(
            dataURL.toString(),
          );
      } else if (editFile.name.endsWith(".fcanvas")) {
        const json = await readFileAsText(editFile);
        if (json) await canvasRef.current.loadFromJSON(json);
      } else {
        toast("Failed to load image");
      }

      const backgroundImage = canvasRef.current.backgroundImage;

      if (backgroundImage) {
        const widthRatio =
          canvasRef.current.getWidth() / backgroundImage.getScaledWidth();
        const heightRatio =
          canvasRef.current.getHeight() / backgroundImage.getScaledHeight();
        const zoomRatio = Math.min(widthRatio, heightRatio);
        canvasRef.current.setZoom(zoomRatio);
      }

      canvasRef.current.renderAll();
    };

    initFabricCanvas();
  }, [editFile]);

  return (
    <div className="size-full flex flex-col space-y-4">
      <Toolbar />
      <ZoomingCanvas />
    </div>
  );
}
