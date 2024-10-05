import { useEffect, useRef, useState } from "react";
import { LinearProgress } from "@mui/material";
import { Canvas, Point } from "fabric";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { EDITOR_RESIZE_UPDATE_DELAY_MS } from "@/config/timer";
import useCanvas from "@/hooks/use-canvas";
import { cn } from "@/lib/utils";

export default function ZoomingCanvas() {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const { canvasRef, isLoading } = useCanvas();
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    canvasRef.current = new Canvas(canvasElementRef.current!);
    canvasRef.current.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvasRef.current!.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      const point = new Point();
      point.setXY(opt.e.offsetX, opt.e.offsetY);
      canvasRef.current!.zoomToPoint(point, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    return () => {
      canvasRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);

      resizeTimeoutRef.current = setTimeout(() => {
        for (const entry of entries) {
          if (!canvasRef.current) return;

          const width = entry.contentRect.width;
          const height = entry.contentRect.height;

          canvasRef.current.setDimensions({ width, height });
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
      className={"relative w-full h-full rounded-md border"}
    >
      <canvas ref={canvasElementRef} />
      {isLoading && (
        <LinearProgress color={"inherit"} className="absolute left-0 right-0" />
      )}
    </ScrollArea>
  );
}
