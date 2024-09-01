"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Send, Upload, XSquare } from "lucide-react";
import localforage from "localforage";
import { nanoid } from "nanoid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAttachment from "@/lib/hooks/use-attachment";
import AttachmentPreview from "./attachment-preview";
import useFormFile from "@/lib/hooks/use-form-file";
import ChatStatus from "@/lib/types/chat-status";
import Attachment from "@/lib/types/attachment";
import { fileToAttachment } from "@/lib/utils";
import ImageFile from "./image-file";
import { Button } from "./ui/button";

export default function MessageForm({
  status,
  onSubmit,
}: {
  status: ChatStatus;
  onSubmit: (text: string, attachments: Attachment[]) => void;
}) {
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const { attachments, setAttachments, removeAttachment } = useAttachment();

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const attachments = await Promise.all(files.map(fileToAttachment));
    setAttachments(attachments);
    event.target.value = "";
    textInputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(text, attachments);
    setText("");
    setAttachments([]);
  };

  return (
    <form className="border rounded-md" onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleChange}
      />
      {attachments.length > 0 && (
        <ul className="m-2 p-2 flex flex-wrap gap-6 max-h-32 scroll-m-11 justify-between after:flex-auto overflow-y-auto">
          {attachments.map((attachment, idx) => (
            <li
              className="size-fit relative group"
              key={attachment.name + attachment.size}
            >
              <Button
                className="absolute flex justify-center items-center size-7 top-0 -right-0.5 z-10 group-hover:opacity-60 md:opacity-0 hover:bg-transparent opacity-60"
                size={"icon"}
                variant={"ghost"}
                type={"button"}
                onClick={() => removeAttachment(attachment)}
              >
                <XSquare />
              </Button>
              <AttachmentPreview className="size-20" attachment={attachment} />
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-row justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type={"button"}
                size={"icon"}
                variant={"ghost"}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          className="mx-2 bg-transparent outline-none w-[calc(100%-6rem)]"
          type="text"
          spellCheck="false"
          placeholder="Type your message..."
          maxLength={60}
          required
          value={text}
          ref={textInputRef}
          onChange={(e) => setText(e.target.value)}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                type="submit"
                disabled={status !== ChatStatus.Idle}
              >
                <Send />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </form>
  );
}
