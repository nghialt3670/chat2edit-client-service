"use client";

import { Download, Edit, Ellipsis, Reply } from "lucide-react";
import { ComponentProps, useTransition } from "react";
import { CircularProgress } from "@mui/material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useEditAttachment from "@/lib/hooks/use-edit-attachment";
import useAttachment from "@/lib/hooks/use-attachment";
import { createCanvasFromFile } from "@/lib/fabric";
import { Button } from "@/components/ui/button";
import Attachment from "@/lib/types/attachment";
import { fetchFile } from "@/lib/utils";

export default function AttachmentOptions({
  className,
  attachment,
}: ComponentProps<"button"> & { attachment: Attachment }) {
  const { editAttachment, setEditAttachment } = useEditAttachment();
  const { attachments, addAttachment } = useAttachment();
  const [isDownloading, startDownloading] = useTransition();

  const handleDownloadSelect = (e: Event) => {
    e.preventDefault();
    startDownloading(async () => {
      const { dataURL, file, fileId, name } = attachment;
      const link = document.createElement("a");
      if (dataURL) {
        link.href = dataURL;
        link.download = name;
        link.click();
        return;
      }
      if (!file && fileId) {
        const fetchedFile = await fetchFile(`/api/file/${fileId}`);
        if (fetchedFile) attachment.file = fetchedFile;
        else return;
      } else return;
      if (name.endsWith(".canvas")) {
        const canvas = await createCanvasFromFile(attachment.file);
        const dataURL = canvas?.toDataURL();
        const parts = name.split(".");
        parts.pop();
        const newFilename = parts.join(".");
        if (!dataURL) return;
        link.href = dataURL;
        link.download = newFilename;
        link.click();
        return;
      }
      const url = URL.createObjectURL(attachment.file);
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const disableEdit = attachment.fileId === editAttachment?.fileId;
  const disableReply = attachments
    .map((att) => att.fileId)
    .includes(attachment.fileId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} size={"icon"} variant={"ghost"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit mr-4">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onSelect={() => setEditAttachment(attachment)}
          disabled={disableEdit}
        >
          <Edit className="mr-2 size-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onSelect={handleDownloadSelect}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <CircularProgress color="inherit" size={16} className="mr-2" />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          <span>Download</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onSelect={() => addAttachment(attachment)}
          disabled={disableReply}
        >
          <Reply className="mr-2 size-4" />
          <span>Reply</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
