import { ChangeEvent, useRef } from "react";
import { ImageUp } from "lucide-react";
import { FabricImage } from "fabric";
import { toast } from "sonner";
import TooltipIconButton from "@/components/buttons/tooltip-icon-button";
import { readFileAsDataURL } from "@/lib/utils";
import useCanvas from "@/hooks/use-canvas";

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { canvasRef } = useCanvas();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
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

    const widthRatio =
      canvasRef.current.getWidth() / backgroundImage.getScaledWidth();
    const heightRatio =
      canvasRef.current.getHeight() / backgroundImage.getScaledHeight();
    const zoomRatio = Math.min(widthRatio, heightRatio);

    canvasRef.current.setZoom(zoomRatio);

    canvasRef.current.backgroundImage = backgroundImage;
    canvasRef.current.renderAll();
  };

  return (
    <TooltipIconButton
      text="Upload"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        hidden
      />
      <ImageUp />
    </TooltipIconButton>
  );
}
