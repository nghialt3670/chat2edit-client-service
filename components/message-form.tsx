"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Send, Upload, XSquare } from "lucide-react";
import { nanoid } from "nanoid";
import {
  MESSAGE_TEXT_MAX_LENGTH,
  TASK_TO_FILE_ACCEPT,
} from "@/lib/configs/form";
import useAttachment from "@/lib/hooks/use-attachment";
import TooltipIconButton from "./tooltip-icon-button";
import AttachmentPreview from "./attachment-preview";
import ChatStatus from "@/lib/types/chat-status";
import Attachment from "@/lib/types/attachment";
import { Button } from "./ui/button";
import Task from "@/lib/types/task";

export default function MessageForm({
  status,
  task,
  onSubmit,
}: {
  status: ChatStatus;
  task: Task;
  onSubmit: (text: string, attachments: Attachment[]) => void;
}) {
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const { attachments, setAttachments, removeAttachment } = useAttachment();

  const fileToAttachment = async (file: File): Promise<Attachment> => ({
    fileId: nanoid(),
    type: file.type,
    name: file.name,
    size: file.size,
    file: file,
    width: null,
    height: null,
    imageId: null,
  });

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

  const accept = TASK_TO_FILE_ACCEPT[task];

  return (
    <form className="border rounded-md" onSubmit={handleSubmit}>
      <input
        type="file"
        multiple
        hidden
        accept={accept}
        ref={fileInputRef}
        onChange={handleChange}
      />
      {attachments.length > 0 && (
        <ul className="m-2 p-2 flex flex-wrap gap-6 max-h-32 scroll-m-11 justify-between after:flex-auto overflow-y-auto">
          {attachments.map((attachment, idx) => (
            <li className="size-fit relative group" key={attachment.fileId}>
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
        <TooltipIconButton
          icon={<Upload />}
          text="Upload attachments"
          type={"button"}
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          className="mx-2 bg-transparent outline-none w-[calc(100%-6rem)]"
          type="text"
          spellCheck="false"
          placeholder="Type your message..."
          maxLength={MESSAGE_TEXT_MAX_LENGTH}
          required
          value={text}
          ref={textInputRef}
          onChange={(e) => setText(e.target.value)}
        />
        <TooltipIconButton
          icon={<Send />}
          text="Send message"
          type={"submit"}
          disabled={status !== ChatStatus.Idle}
        />
      </div>
    </form>
  );
}
