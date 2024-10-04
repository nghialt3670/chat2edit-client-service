import { cn } from "@/lib/utils";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import useCanvas from "@/hooks/use-canvas";
import { LinearProgress } from "@mui/material";
import { EDITOR_RESIZE_UPDATE_DELAY_MS } from "@/config/timer";
import { Canvas } from "fabric";

export default function ScrollableCanvas() {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const { canvasRef, isLoading } = useCanvas();
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    canvasRef.current = new Canvas(canvasElementRef.current!)
    return () => {
      canvasRef.current?.dispose();
    };
  }, [])
  
  useEffect(() => {
    if (!canvasRef.current) return
    const background = canvasRef.current.backgroundImage;
    const objects = canvasRef.current.getObjects();
    const isEmpty = !background;
    console.log(background)
    setIsEmpty(isEmpty)
  }, [canvasRef.current?.backgroundImage])

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);

      resizeTimeoutRef.current = setTimeout(() => {
        for (const entry of entries) {
          if (!canvasRef.current) return;

          const canvas = canvasRef.current;
          const maxWidth = entry.contentRect.width;
          const maxHeight = entry.contentRect.height;

          canvas.setWidth(maxWidth - 1);
          canvas.setHeight(maxHeight - 116);

          const backgroundImage = canvas.backgroundImage;

          if (!backgroundImage) return;

          const zoomRatio = maxWidth / backgroundImage.getScaledWidth();
          const fitHeight = backgroundImage.getScaledHeight() * zoomRatio;

          canvasRef.current.setZoom(zoomRatio);
          canvasRef.current.setHeight(fitHeight);
        }
      }, EDITOR_RESIZE_UPDATE_DELAY_MS);
    });

    const canvasContainer = document.querySelector("#canvas-container");
    if (canvasContainer) resizeObserver.observe(canvasContainer);

    return () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <ScrollArea
        id="canvas-container"
        className={cn(
          "relative w-full rounded-md border",
          isEmpty ? "h-full" : "h-fit",
        )}
      >
        <canvas ref={canvasElementRef} />
        {isLoading && (
          <LinearProgress
            color={"inherit"}
            className="absolute left-0 right-0"
          />
        )}
      </ScrollArea>
  )
}