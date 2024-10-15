import {
  SquareDashedMousePointer,
  SquareMousePointer,
} from "lucide-react";
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
      canvasRef.current.on("mouse:down", (opt) => {
        if (!canvasRef.current) return;

        const x = opt.viewportPoint.x;
        const y = opt.viewportPoint.y;

        const box = new Rect({
          left: x,
          top: y,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 4,
          strokeUniform: true,
          is_query: true
        });

        boxRef.current = box;
        canvasRef.current.add(box);
        canvasRef.current.renderAll();

        canvasRef.current.on("mouse:move", (opt) => {
          if (!canvasRef.current || !boxRef.current) return;

          const x = opt.viewportPoint.x;
          const y = opt.viewportPoint.y;

          boxRef.current.width = Math.abs(boxRef.current.left - x);
          boxRef.current.height = Math.abs(boxRef.current.top - y);

          if (x < boxRef.current.getX()) boxRef.current.setX(x);
          if (y < boxRef.current.getY()) boxRef.current.setY(y);

          canvasRef.current.renderAll();
        });
      });

      canvasRef.current.on("mouse:up", (opt) => {
        setIsActive(false);
        if (!canvasRef.current) return;
        canvasRef.current.off("mouse:down");
        canvasRef.current.off("mouse:move");
      });
    } else {
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