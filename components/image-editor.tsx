"use client";

import { Canvas as FabricCanvas, FabricImage, FabricObject } from "fabric";
import { useEffect, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { LinearProgress } from "@mui/material";
import { EDITOR_RESIZE_UPDATE_DELAY_MS } from "@/lib/configs/timer";
import { cn, readFileAsDataURL, readFileAsText } from "@/lib/utils";
import useEditAttachment from "@/lib/hooks/use-edit-attachment";
import TooltipIconButton from "./tooltip-icon-button";
import { ScrollArea } from "./ui/scroll-area";
import { getFile } from "@/lib/localforage";

export default function ImageEditor() {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null,
  );
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>();
  const { editAttachment } = useEditAttachment();

  useEffect(() => {
    const updateFile = async () => {
      if (!editAttachment) return;
      const file = await getFile(editAttachment);
      setFile(file);
    };
    setIsInitializing(true);
    updateFile();
  }, [editAttachment]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);

      resizeTimeoutRef.current = setTimeout(() => {
        for (let entry of entries) {
          if (!fabricCanvasRef.current) return;
          const canvas = fabricCanvasRef.current;
          const maxWidth = entry.contentRect.width;
          const maxHeight = entry.contentRect.height;
          canvas.setWidth(maxWidth - 1);
          canvas.setHeight(maxHeight - 116);
          const backgroundImage = canvas.backgroundImage;
          if (!backgroundImage) return;
          const zoomRatio = maxWidth / backgroundImage.getScaledWidth();
          const fitHeight = backgroundImage.getScaledHeight() * zoomRatio;
          fabricCanvasRef.current.setZoom(zoomRatio);
          fabricCanvasRef.current.setHeight(fitHeight);
        }
      }, EDITOR_RESIZE_UPDATE_DELAY_MS);
    });

    const resizablePanel = document.querySelector("#editor-panel");
    if (resizablePanel) resizeObserver.observe(resizablePanel);

    return () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const initFabricCanvas = async () => {
      if (canvasElementRef.current)
        fabricCanvasRef.current = new FabricCanvas(canvasElementRef.current);

      const fabricCanvas = fabricCanvasRef.current;
      if (
        !file ||
        !fabricCanvas ||
        (!file.type.startsWith("image/") && !file.name.endsWith(".canvas"))
      ) {
        setIsInitializing(false);
        return;
      }

      if (file.type.startsWith("image/")) {
        const dataURL = await readFileAsDataURL(file);
        if (dataURL)
          fabricCanvas.backgroundImage = await FabricImage.fromURL(
            dataURL.toString(),
          );
      } else if (file.name.endsWith(".canvas")) {
        const json = await readFileAsText(file);
        if (json) await fabricCanvas.loadFromJSON(json);
      } else {
        return;
      }

      const backgroundImage = fabricCanvas.backgroundImage;
      if (backgroundImage) {
        const canvasWidth = fabricCanvas.getWidth();
        const backgroundWidth = backgroundImage.getScaledWidth();
        const backgroundHeight = backgroundImage.getScaledHeight();
        const zoomRatio = canvasWidth / backgroundWidth;
        const fitHeight = zoomRatio * backgroundHeight;
        fabricCanvas.setZoom(zoomRatio);
        fabricCanvas.setHeight(fitHeight);
      }

      fabricCanvas.renderAll();
      setIsInitializing(false);
      setIsEmpty(false);
    };

    const disposeFabric = () => {
      if (fabricCanvasRef.current) fabricCanvasRef.current.dispose();
    };
    setIsInitializing(true);
    initFabricCanvas();
    return disposeFabric;
  }, [file]);

  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    if (!event.target.files) return;

    const file = event.target.files[0];
    const dataURL = await readFileAsDataURL(file);
    if (!dataURL) return;

    const backgroundImage = await FabricImage.fromURL(dataURL.toString());
    backgroundImage.set("filename", file.name);
    fabricCanvas.backgroundImage = backgroundImage;

    const canvasWidth = fabricCanvas.getWidth();
    const backgroundWidth = backgroundImage.getScaledWidth();
    const backgroundHeight = backgroundImage.getScaledHeight();
    const zoomRatio = canvasWidth / backgroundWidth;
    const fitHeight = zoomRatio * backgroundHeight;
    fabricCanvas.setZoom(zoomRatio);
    fabricCanvas.setHeight(fitHeight);

    setIsEmpty(false);
    fabricCanvas.renderAll();
  };

  const handleRemoveObject = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  const handleDownloadClick = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      const backgroundImage = fabricCanvas.backgroundImage;
      if (!backgroundImage) return;
      const dataURL = fabricCanvas.toDataURL();
      const link = document.createElement("a");
      const filename = backgroundImage.get("filename");
      link.href = dataURL;
      link.download = filename;
      link.click();
    }
  };

  return (
    <div className="size-full flex flex-col space-y-4">
      <div className="flex flex-row rounded-md border">
        <input
          type="file"
          accept="image/*"
          onChange={handleAddImage}
          ref={fileInputRef}
          hidden
        />
        <TooltipIconButton
          icon={<Upload />}
          text="Upload image"
          onClick={() => fileInputRef.current?.click()}
        />
        <TooltipIconButton
          icon={<Download />}
          text="Download image"
          onClick={handleDownloadClick}
        />
      </div>
      <ScrollArea
        id="editor-panel"
        className={cn(
          "relative w-full rounded-md border",
          isEmpty ? "h-full" : "h-fit",
        )}
      >
        <canvas ref={canvasElementRef}></canvas>
        {isInitializing && (
          <LinearProgress color={"inherit"} style={{position: "absolute", top: 0}} />
        )}
      </ScrollArea>
    </div>
  );
}
