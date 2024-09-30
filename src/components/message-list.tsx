"use client";

import { LinearProgress } from "@mui/material";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useChat from "@/hooks/use-chat";
import Attachment from "./attachment";
import Message from "./message";
import { nanoid } from "nanoid";

export default function MessageList() {
  const scrollRef = useRef<HTMLUListElement>(null);
  const { status, messages } = useChat();

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollIntoView(false);
  }, [status, messages]);

  return (
    <ScrollArea className="relative size-full rounded-lg border min-w-80">
      {status === "initializing" && (
        <LinearProgress
          color={"inherit"}
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        />
      )}
      <ul ref={scrollRef} className="p-4 space-y-6">
        {messages.map((msg) =>
          msg.type === "request" ? (
            <Message message={msg}>
              <Message.Text className="bg-accent ml-auto" />
              <Message.Attachments>
                {msg.attachments.map((att) => (
                  <Attachment className="w-80 ml-auto" attachment={att}>
                    <Attachment.Options />
                  </Attachment>
                ))}
              </Message.Attachments>
            </Message>
          ) : (
            <Message message={msg}>
              <Message.Text />
              <Message.Attachments>
                {msg.attachments.map((att) => (
                  <Attachment attachment={att}>
                    <Attachment.Options />
                  </Attachment>
                ))}
              </Message.Attachments>
            </Message>
          ),
        )}
        {status === "responding" && <Message.Responding />}
        {status === "no-response" && <Message.Error />}
      </ul>
    </ScrollArea>
  );
}
