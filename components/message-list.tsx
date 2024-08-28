"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "@/lib/types/Message";
import UserMessage from "./user-message";

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <ScrollArea className="size-full rounded-md border">
      <ul className="p-4 space-y-4">
        {messages.map((msg, idx) =>
          idx % 2 === 0 ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <UserMessage key={msg.id} message={msg} />
          ),
        )}
      </ul>
    </ScrollArea>
  );
}
