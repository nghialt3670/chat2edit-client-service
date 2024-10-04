"use client";

import { Canvas as FabricCanvas, FabricImage, FabricObject } from "fabric";
import { useEffect, useRef, useState } from "react";
import { cn, readFileAsDataURL, readFileAsText } from "@/lib/utils";
import useEditFile from "@/hooks/use-edit-file";
import useCanvas from "@/hooks/use-canvas";
import ScrollableCanvas from "./scrollable-canvas";
import Toolbar from "./toolbar";

export default function ImageEditor() {
  const { editFile } = useEditFile();
  const { canvasRef, setIsLoading } = useCanvas();

  useEffect(() => {
    const initFabricCanvas = async () => {
      if (
        !editFile ||
        !canvasRef.current ||
        (!editFile.type.startsWith("image/") &&
          !editFile.name.endsWith(".canvas"))
      ) {
        setIsLoading(false);
        return;
      }

      if (editFile.type.startsWith("image/")) {
        const dataURL = await readFileAsDataURL(editFile);
        if (dataURL)
          canvasRef.current.backgroundImage = await FabricImage.fromURL(
            dataURL.toString(),
          );
      } else if (editFile.name.endsWith(".canvas")) {
        const json = await readFileAsText(editFile);
        if (json) await canvasRef.current.loadFromJSON(json);
      } else {
        return;
      }

      const backgroundImage = canvasRef.current.backgroundImage;
      if (backgroundImage) {
        const canvasWidth = canvasRef.current.getWidth();
        const backgroundWidth = backgroundImage.getScaledWidth();
        const backgroundHeight = backgroundImage.getScaledHeight();
        const zoomRatio = canvasWidth / backgroundWidth;
        const fitHeight = zoomRatio * backgroundHeight;
        canvasRef.current.setZoom(zoomRatio);
        canvasRef.current.setHeight(fitHeight);
      }

      canvasRef.current.renderAll();
      setIsLoading(false);
    };

    setIsLoading(true);
    initFabricCanvas();
  }, [editFile]);

  return (
    <div className="size-full flex flex-col space-y-4">
      <Toolbar />
      <ScrollableCanvas />
    </div>
  );
}