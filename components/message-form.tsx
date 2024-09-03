"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Send, Upload, XSquare } from "lucide-react";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  formDataSchema,
  MESSAGE_TEXT_MAX_LENGTH,
  TASK_TO_FILE_ACCEPT,
} from "@/lib/configs/form";
import { SHOW_RESPONDING_MESSAGE_DELAY_MS } from "@/lib/configs/timer";
import { TASK_TO_PROVIDER } from "@/lib/configs/provider";
import useAttachment from "@/lib/hooks/use-attachment";
import TooltipIconButton from "./tooltip-icon-button";
import SendResponse from "@/lib/types/send-response";
import AttachmentPreview from "./attachment-preview";
import ChatStatus from "@/lib/types/chat-status";
import Attachment from "@/lib/types/attachment";
import useChats from "@/lib/hooks/use-chats";
import useChat from "@/lib/hooks/use-chat";
import Message from "@/lib/types/message";
import { fetchJSON } from "@/lib/utils";
import { Button } from "./ui/button";

export default function MessageForm() {
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const { attachments, setAttachments, removeAttachment } = useAttachment();
  const { updateChat } = useChats();
  const { chatId, setChatId, setMessages, task, language, status, setStatus } =
    useChat();

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const reqMessage: Message = {
      id: nanoid(),
      text,
      attachments,
      createdAt: new Date(),
    };

    const formValues = {
      chatId,
      text: reqMessage.text,
      files: attachments.map((att) => att.file),
      provider: TASK_TO_PROVIDER[task],
      language,
    };

    setText("");
    setAttachments([]);

    try {
      formDataSchema.parse(formValues);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors;
        console.error("Validation errors:", errors);
        return;
      }
    }

    setMessages((prev) => [...prev, reqMessage]);
    setStatus(ChatStatus.Sending);
    setTimeout(
      () => setStatus(ChatStatus.Responding),
      SHOW_RESPONDING_MESSAGE_DELAY_MS,
    );

    const formData = new FormData();
    if (chatId) formData.set("chatId", chatId);
    formData.set("provider", TASK_TO_PROVIDER[task]);
    formData.set("text", reqMessage.text);
    formData.set("language", language);
    attachments.forEach((att) => formData.append("files", att.file!));

    const response = (await fetchJSON(
      "/api/chat/send-message",
      "POST",
      formData,
    )) as SendResponse | null;

    if (!response) {
      setStatus(ChatStatus.RequestError);
      return;
    }

    const { currChat, savedReqMessage, resMessage } = response;

    if (currChat) {
      updateChat(currChat);
      if (currChat.id !== chatId) {
        setChatId(currChat.id);
        history.pushState({}, "", `/${currChat.id}`);
      }
    }

    if (!savedReqMessage) {
      setStatus(ChatStatus.RequestError);
      return;
    }

    if (!resMessage) {
      setStatus(ChatStatus.ResponseError);
      return;
    }

    setStatus(ChatStatus.Idle);
    setMessages((prev) => [...prev, resMessage]);
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
          disabled={status !== ChatStatus.Idle || !text.trim()}
        />
      </div>
    </form>
  );
}
