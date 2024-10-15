import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import TooltipIconButton from "@/components/buttons/tooltip-icon-button";
import attachmentSchema from "@/schemas/attachment.schema";
import useAttachments from "@/hooks/use-attachments";
import { saveCanvasToFile } from "@/lib/fabric";
import useCanvas from "@/hooks/use-canvas";

export default function ImageAttach() {
  const { canvasRef } = useCanvas();
  const { insertUploaded } = useAttachments();

  const handleClick = async () => {
    if (!canvasRef.current) return;

    try {
      const file = saveCanvasToFile(canvasRef.current);

      const formData = new FormData();
      formData.set("file", file);

      const endpoint = "/api/attachments/files";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error();

      const payload = await response.json();
      const attachment = attachmentSchema.parse(payload);

      insertUploaded(attachment);
    } catch {
      toast("Failed to attach image");
    }
  };

  return (
    <TooltipIconButton text="Attach" onClick={handleClick}>
      <Paperclip />
    </TooltipIconButton>
  );
}
