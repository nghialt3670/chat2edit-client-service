import { Fullscreen } from "lucide-react";
import { MouseEvent } from "react";
import TooltipIconButton from "@/components/buttons/tooltip-icon-button";
import useCanvas from "@/hooks/use-canvas";

export default function ImageFit() {
  const { canvasRef } = useCanvas();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!canvasRef.current) return;

    // Reset zoom
    canvasRef.current.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const backgroundImage = canvasRef.current.backgroundImage;

    if (!backgroundImage) return;

    const widthRatio =
      canvasRef.current.getWidth() / backgroundImage.getScaledWidth();
    const heightRatio =
      canvasRef.current.getHeight() / backgroundImage.getScaledHeight();
    const zoomRatio = Math.min(widthRatio, heightRatio);

    // Set zoom to fit background
    canvasRef.current.setZoom(zoomRatio);
  };

  return (
    <TooltipIconButton text="Fit" onClick={handleClick}>
      <Fullscreen />
    </TooltipIconButton>
  );
}
