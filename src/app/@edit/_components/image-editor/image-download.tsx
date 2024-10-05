import { Download, Save } from "lucide-react";
import TooltipIconButton from "@/components/buttons/tooltip-icon-button";
import useCanvas from "@/hooks/use-canvas";

export default function ImageDownload() {
  const { canvasRef } = useCanvas();

  const handleDownloadClick = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const fitCanvas = await canvas.clone(["filename"])
    const backgroundImage = fitCanvas.backgroundImage;

    if (!backgroundImage) return;

    const width = backgroundImage.getScaledWidth()
    const height = backgroundImage.getScaledHeight()
    fitCanvas.setDimensions({width, height});

    const dataURL = fitCanvas.toDataURL();
    const link = document.createElement("a");
    const filename = backgroundImage.get("filename");

    link.href = dataURL;
    link.download = filename;
    link.click();
  };

  return (
    <TooltipIconButton text="Download image" onClick={handleDownloadClick}>
      <Save />
    </TooltipIconButton>
  );
}
