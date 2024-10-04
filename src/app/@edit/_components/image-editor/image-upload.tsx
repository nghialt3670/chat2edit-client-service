import { Upload } from "lucide-react";
import { FabricImage } from "fabric";
import { toast } from "sonner";
import { useRef } from "react";
import TooltipIconButton from "../../../../components/buttons/tooltip-icon-button";
import { readFileAsDataURL } from "@/lib/utils";
import useCanvas from "@/hooks/use-canvas";

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { canvasRef } = useCanvas();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!canvasRef.current) return;
    if (!event.target.files) return;

    const file = event.target.files[0];
    const dataURL = await readFileAsDataURL(file);

    if (!dataURL) {
      toast("Failed to upload image");
      return;
    }

    const backgroundImage = await FabricImage.fromURL(dataURL.toString());
    backgroundImage.set("filename", file.name);
    
    canvasRef.current.backgroundImage = backgroundImage;

    const canvasWidth = canvasRef.current.getWidth();
    const backgroundWidth = backgroundImage.getScaledWidth();
    const backgroundHeight = backgroundImage.getScaledHeight();

    const zoomRatio = canvasWidth / backgroundWidth;
    const fitHeight = zoomRatio * backgroundHeight;

    canvasRef.current.setZoom(zoomRatio);
    canvasRef.current.setHeight(fitHeight);
    canvasRef.current.renderAll();
  };

  return (
    <TooltipIconButton
      text="Upload image"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        hidden
      />
      <Upload />
    </TooltipIconButton>
  );
}