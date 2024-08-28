"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { MessageList } from "./message-list";
import Message from "@/lib/types/Message";
import MessageForm from "./message-form";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async (text: string, files: File[]) => {
    const reqMessage = { id: nanoid(), text, files };
    setMessages((prev) => [...prev, reqMessage]);
  };

  return (
    <div className="size-full flex flex-col p-4 space-y-4">
      <MessageList messages={messages} />
      <MessageForm onSubmit={handleSubmit} />
    </div>
  );
}
