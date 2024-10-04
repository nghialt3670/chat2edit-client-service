import { Download } from "lucide-react";
import TooltipIconButton from "../../../../components/buttons/tooltip-icon-button";
import useCanvas from "@/hooks/use-canvas";

export default function ImageDownload() {
  const { canvasRef } = useCanvas();

  const handleDownloadClick = () => {
    const fabricCanvas = canvasRef.current;
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
    <TooltipIconButton text="Download image" onClick={handleDownloadClick}>
      <Download />
    </TooltipIconButton>
  );
}