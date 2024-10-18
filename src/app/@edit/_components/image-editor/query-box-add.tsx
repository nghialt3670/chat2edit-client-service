import { SquareDashedMousePointer, SquareMousePointer } from "lucide-react";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { Rect } from "fabric";
import TooltipIconButton from "@/components/buttons/tooltip-icon-button";
import useCanvas from "@/hooks/use-canvas";

export default function QueryBoxAdd() {
  const { canvasRef } = useCanvas();
  const [isActive, setIsActive] = useState<boolean>(false);
  const boxRef = useRef<Rect | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
  
    if (isActive) {
      // On mouse down, start drawing the rectangle
      canvasRef.current.on("mouse:down", (opt) => {
        if (!canvasRef.current) return;
  
        // Get the pointer position adjusted for zoom and pan
        const pointer = canvasRef.current.getPointer(opt.e);
        const x = pointer.x;
        const y = pointer.y;
  
        const box = new Rect({
          left: x,
          top: y,
          fill: "transparent",
          stroke: "black",
          strokeWidth: canvasRef.current.backgroundImage!.getScaledHeight() / 100,
          strokeUniform: true,  // Keep stroke size consistent during scaling
          is_query: true,
        });
  
        boxRef.current = box;
        canvasRef.current.add(box);
        canvasRef.current.renderAll();
  
        // On mouse move, adjust the size of the rectangle
        canvasRef.current.on("mouse:move", (opt) => {
          if (!canvasRef.current || !boxRef.current) return;
  
          const pointer = canvasRef.current.getPointer(opt.e);
          const x = pointer.x;
          const y = pointer.y;
  
          boxRef.current.set({
            width: Math.abs(boxRef.current.left - x),
            height: Math.abs(boxRef.current.top - y),
          });
  
          // Adjust position if dragging towards top-left
          if (x < boxRef.current.left) boxRef.current.set({ left: x });
          if (y < boxRef.current.top) boxRef.current.set({ top: y });
  
          canvasRef.current.renderAll();
        });
  
        // Handle object scaling
        canvasRef.current.on('object:scaling', (event) => {
          if (!canvasRef.current) return;
          
          const target = event.target;
          if (target.type === 'rect') {
            const newWidth = target.width * target.scaleX;
            const newHeight = target.height * target.scaleY;
  
            target.set({
              width: newWidth,
              height: newHeight,
              scaleX: 1, // Reset scaleX after applying size
              scaleY: 1  // Reset scaleY after applying size
            });
  
            canvasRef.current.renderAll();
          }
        });
      });
  
      // On mouse up, finalize the rectangle
      canvasRef.current.on("mouse:up", () => {
        setIsActive(false);
        if (!canvasRef.current) return;
  
        // Remove event listeners
        canvasRef.current.off("mouse:down");
        canvasRef.current.off("mouse:move");
      });
    }
  }, [isActive]);
  

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    setIsActive(!isActive);
  };

  return (
    <TooltipIconButton text="Selectors" onClick={handleClick}>
      {isActive ? <SquareMousePointer /> : <SquareDashedMousePointer />}
    </TooltipIconButton>
  );
}
