"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Send, Upload } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import messageSchema, { Message } from "@/schemas/message.schema";
import TooltipIconButton from "./buttons/tooltip-icon-button";
import { PROVIDER_TO_FILE_ACCEPT } from "@/config/provider";
import attachmentSchema from "@/schemas/attachment.schema";
import { MESSAGE_TEXT_MAX_LENGTH } from "@/config/message";
import objectIdSchema from "@/schemas/object-id.schema";
import useAttachments from "@/hooks/use-attachments";
import FormAttachment from "./form-attachment";
import useChat from "@/hooks/use-chat";
import Attachment from "./attachment";
import { nanoid } from "nanoid";

export default function MessageForm() {
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const { uploadeds, setUploadeds } = useAttachments();
  const {
    chatId,
    setChatId,
    setMessages,
    provider,
    language,
    status,
    setStatus,
    setIsNew,
  } = useChat();

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    setStatus("uploading");
    try {
      const response = await fetch("/api/attachments/files/batch", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error();
      const payload = await response.json();
      const uploadeds = z.array(attachmentSchema).parse(payload);
      setUploadeds(uploadeds);
    } catch (error) {
      toast("Fail to upload files");
    } finally {
      textInputRef.current?.focus();
      event.target.value = "";
      setStatus("idling");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    let currChatId = chatId;

    if (!currChatId)
      try {
        setStatus("initializing");
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify({ settings: { provider, language } });
        const response = await fetch("/api/chats", {
          method: "POST",
          headers,
          body,
        });
        if (!response.ok) throw new Error();
        const payload = await response.json();
        currChatId = objectIdSchema.parse(payload);
        setChatId(currChatId);
        history.pushState({}, "", `/${currChatId}`);
      } catch {
        toast("Failed to create chat");
      } finally {
        setStatus("idling");
      }

    try {
      setStatus("sending");
      const attachmentIds = uploadeds.map((att) => att.id);
      const headers = { "Content-Type": "application/json" };
      const body = JSON.stringify({ text, attachmentIds });
      const endpoint = `/api/messages?chatId=${currChatId}`;
      const response = await fetch(endpoint, { method: "POST", headers, body });
      if (!response.ok) throw new Error();
      const message: Message = {
        id: nanoid(),
        type: "request",
        text,
        attachments: uploadeds,
      };
      setMessages((prev) => [...prev, message]);
      setText("");
      setUploadeds([]);
    } catch {
      toast("Failed to send message");
    } finally {
      setStatus("idling");
    }

    try {
      setStatus("responding");
      const endpoint = `/api/messages/send?chatId=${chatId}`;
      const response = await fetch("/api/messages/send");
      if (!response.ok) throw new Error();
      const payload = await response.json();
      const message = messageSchema.parse(payload);
      setMessages((prev) => [...prev, message]);
      setStatus("idling");
    } catch {
      setStatus("no-response");
    }
  };

  const accept = PROVIDER_TO_FILE_ACCEPT[provider];

  return (
    <form className="p-1 border rounded-lg" onSubmit={handleSubmit}>
      <input
        type="file"
        multiple
        hidden
        accept={accept}
        ref={fileInputRef}
        onChange={handleChange}
      />
      {uploadeds.length > 0 && (
        <ul className="m-2 p-2 flex flex-wrap gap-6 max-h-32 scroll-m-11 justify-between after:flex-auto overflow-y-auto">
          {uploadeds.map((att) => (
            <Attachment className="size-20" attachment={att}>
              <Attachment.Remove />
            </Attachment>
          ))}
        </ul>
      )}
      <div className="flex flex-row justify-between">
        <TooltipIconButton
          text="Upload attachments"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload />
        </TooltipIconButton>
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
          text="Send message"
          type="submit"
          disabled={status !== "idling" || !text.trim()}
        >
          <Send />
        </TooltipIconButton>
      </div>
    </form>
  );
}
