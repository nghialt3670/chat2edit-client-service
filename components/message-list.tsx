"use client";

import { nanoid } from "nanoid";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatStatus from "@/lib/types/chat-status";
import Message from "@/lib/types/message";
import UserMessage from "./user-message";
import BotMessage from "./bot-message";

export function MessageList({
  status,
  messages,
}: {
  status: ChatStatus;
  messages: Message[];
}) {
  const prevMessages = messages.slice(0, messages.length - 1);
  const lastMessage = messages[messages.length - 1];

  const renderLastMessage = () => {
    if (!lastMessage) return undefined;
    if (status === ChatStatus.Idle)
      return <BotMessage key={lastMessage.id} message={lastMessage} />;
    return (
      <UserMessage
        key={lastMessage.id}
        message={lastMessage}
        isError={status === ChatStatus.RequestError}
      />
    );
  };

  return (
    <ScrollArea className="size-full rounded-md border">
      <ul className="p-4 space-y-6">
        {prevMessages.map((msg, idx) =>
          idx % 2 === 0 ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <BotMessage key={msg.id} message={msg} />
          ),
        )}
        {renderLastMessage()}
        {status === ChatStatus.Responding && (
          <BotMessage key={nanoid()} message={undefined} />
        )}
        {status === ChatStatus.ResponseError && (
          <BotMessage key={nanoid()} message={null} />
        )}
      </ul>
    </ScrollArea>
  );
}
