import { Paperclip } from "lucide-react";
import { MouseEvent } from "react";
import TooltipIconButton from "@/components/buttons/tooltip-icon-button";
import useCanvas from "@/hooks/use-canvas";
import { saveCanvasToFile } from "@/lib/fabric";
import attachmentSchema from "@/schemas/attachment.schema";
import useAttachments from "@/hooks/use-attachments";
import { toast } from "sonner";

export default function ImageAttach() {
  const { canvasRef } = useCanvas();
  const { insertUploaded } = useAttachments();

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (!canvasRef.current) return;

    try {
        const file = saveCanvasToFile(canvasRef.current)

        const formData = new FormData();
        formData.set("file", file)

        const endpoint = "/api/attachments/files"
        const response = await fetch(endpoint, {method: "POST", body: formData})

        if (!response.ok) throw new Error()

        const payload = await response.json()
        const attachment = attachmentSchema.parse(payload)

        insertUploaded(attachment)
    } catch {
        toast("Failed to attach image")
    }
  };

  return (
    <TooltipIconButton text="Attach" onClick={handleClick}>
      <Paperclip />
    </TooltipIconButton>
  );
}
