"use client";

import { Canvas as FabricCanvas, FabricImage, FabricObject } from "fabric";
import { Download, Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { readFileAsDataURL, readFileAsText } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

export default function ImageEditor({
  file,
  maxWidth,
  maxHeight,
}: {
  file?: File;
  maxWidth: number;
  maxHeight: number;
}) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas>();
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const canvasWidth = maxWidth - 32;
  const canvasHeight = maxHeight - 91;

  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    if (!fabricCanvasRef.current.width) return;
    try {
      fabricCanvasRef.current.setWidth(maxWidth - 32);
      fabricCanvasRef.current.setHeight(maxHeight - 91);
      if (fabricCanvasRef.current.backgroundImage) {
        const zoomRatio =
          fabricCanvasRef.current.getWidth() /
          fabricCanvasRef.current.backgroundImage.getScaledWidth();
        fabricCanvasRef.current.setZoom(zoomRatio);
        fabricCanvasRef.current.setHeight(
          fabricCanvasRef.current.backgroundImage.getScaledHeight() * zoomRatio,
        );
      }
    } catch {
      return;
    }
  }, [maxWidth, maxHeight]);

  useEffect(() => {
    const initFabricCanvas = async () => {
      if (canvasElementRef.current) {
        fabricCanvasRef.current = new FabricCanvas(canvasElementRef.current, {
          width: canvasWidth,
          height: canvasHeight,
        });
      }

      if (file && fabricCanvasRef.current) {
        if (file.type.startsWith("image/")) {
          const dataURL = await readFileAsDataURL(file);
          if (dataURL)
            fabricCanvasRef.current.backgroundImage = await FabricImage.fromURL(
              dataURL.toString(),
            );
        } else if (file.name.endsWith(".canvas")) {
          const json = await readFileAsText(file);
          if (json) await fabricCanvasRef.current.loadFromJSON(json);
        } else {
          return;
        }

        const backgroundImage = fabricCanvasRef.current.backgroundImage;
        if (backgroundImage) {
          const zoomRatio =
            fabricCanvasRef.current.getWidth() /
            backgroundImage.getScaledWidth();
          fabricCanvasRef.current.setZoom(zoomRatio);
          fabricCanvasRef.current.setHeight(
            backgroundImage.getScaledHeight() * zoomRatio,
          );
        }

        fabricCanvasRef.current.renderAll();
        setIsLoading(false);
      }
    };

    const disposeFabric = () => {
      if (fabricCanvasRef.current) fabricCanvasRef.current.dispose();
    };

    initFabricCanvas();
    return disposeFabric;
  }, [file]);

  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvasRef.current) return;
    if (!event.target.files?.length) return;
    const file = event.target.files[0];
    const dataURL = await readFileAsDataURL(file);
    if (!dataURL) return;
    const backgroundImage = await FabricImage.fromURL(dataURL.toString());
    backgroundImage.set("filename", file.name);
    fabricCanvasRef.current.backgroundImage = backgroundImage;
    const zoomRatio = canvasWidth / backgroundImage.getScaledWidth();
    fabricCanvasRef.current.setZoom(zoomRatio);
    fabricCanvasRef.current.setHeight(
      backgroundImage.getScaledHeight() * zoomRatio,
    );
    fabricCanvasRef.current.renderAll();
  };

  const handleRemoveObject = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadClick = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL();
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = fabricCanvasRef.current.backgroundImage?.get("filename");
      link.click();
    }
  };

  return (
    <div className="size-full flex flex-col p-4 space-y-4">
      <div className="flex flex-row rounded-md border">
        <input
          type="file"
          accept="image/*"
          onChange={handleAddImage}
          ref={fileInputRef}
          hidden
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={handleUploadClick}
              >
                <Upload />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={handleDownloadClick}
              >
                <Download />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ScrollArea className="w-full h-fit rounded-md border">
        <canvas ref={canvasElementRef}>{isLoading && <Loader2 />}</canvas>
      </ScrollArea>
    </div>
  );
}
