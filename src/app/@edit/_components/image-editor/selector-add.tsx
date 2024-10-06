import { SquareDashedMousePointer } from "lucide-react";
import { MouseEvent } from "react";
import TooltipIconButton from "@/components/buttons/tooltip-icon-button";
import useCanvas from "@/hooks/use-canvas";

export default function SelectorAdd() {
  const { canvasRef } = useCanvas();

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {};

  return (
    <TooltipIconButton text="Selectors" onClick={handleClick}>
      <SquareDashedMousePointer />
    </TooltipIconButton>
  );
}
