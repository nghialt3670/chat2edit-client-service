"use client";

import { LinearProgress } from "@mui/material";
import { useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatStatus from "@/lib/types/chat-status";
import useChat from "@/lib/hooks/use-chat";
import Message from "@/lib/types/message";
import UserMessage from "./user-message";
import BotMessage from "./bot-message";

export function MessageList() {
  const scrollRef = useRef<HTMLUListElement>(null);
  const { status, messages } = useChat();

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollIntoView(false);
  }, [status, messages]);

  return (
    <ScrollArea className="size-full rounded-md border min-w-80">
      {status === ChatStatus.Initializing ? (
        <LinearProgress color={"inherit"} />
      ) : (
        <ul ref={scrollRef} className="p-4 space-y-6">
          {messages.map((msg, idx) =>
            idx % 2 === 0 ? (
              <UserMessage key={msg.id} message={msg} />
            ) : (
              <BotMessage key={msg.id} message={msg} />
            ),
          )}
          {status === ChatStatus.Responding && (
            <BotMessage key={nanoid()} message={undefined} />
          )}
          {status === ChatStatus.ResponseError && (
            <BotMessage key={nanoid()} message={null} />
          )}
        </ul>
      )}
    </ScrollArea>
  );
}
