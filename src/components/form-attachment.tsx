import { XSquare } from "lucide-react";
import React from "react";
import { Attachment as IAttachment } from "@/schemas/attachment.schema";
import useAttachments from "@/hooks/use-attachments";
import IconButton from "./buttons/icon-button";
import Attachment from "./attachment";

export default function FormAttachment({
  attachment,
}: {
  attachment: IAttachment;
}) {
  const { removeUploaded } = useAttachments();

  const handleRemoveClick = () => {
    removeUploaded(attachment);
    fetch(`/api/attachments/${attachment.id}`, { method: "DELETE" });
  };

  return (
    <li className="size-fit relative group" key={attachment.id}>
      <IconButton
        className="absolute flex justify-center items-center size-7 top-0 -right-0.5 z-10 group-hover:opacity-60 md:opacity-0 hover:bg-transparent opacity-60"
        type={"button"}
        onClick={handleRemoveClick}
      >
        <XSquare />
      </IconButton>
      <Attachment className="size-20" attachment={attachment} />
    </li>
  );
}
