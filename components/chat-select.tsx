"use client";

import { useRouter } from "next/navigation";
import { History } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import ButtonSelectTrigger from "./button-select-trigger";
import TooltipIconButton from "./tooltip-icon-button";
import ChatStatus from "@/lib/types/chat-status";
import { cn, isEmptyObject } from "@/lib/utils";
import useChats from "@/lib/hooks/use-chats";
import useChat from "@/lib/hooks/use-chat";
import { ButtonProps } from "./ui/button";
import Chat from "@/lib/types/chat";

export function ChatSelect({ className }: ButtonProps) {
  const router = useRouter();
  const { chats } = useChats();
  const { chatId, setStatus } = useChat();

  //TODO: Fix new chat not in order when added

  const handleValueChange = (newChatId: string) => {
    if (newChatId === chatId) return;
    setStatus(ChatStatus.Initializing);
    router.push(`/${newChatId}`);
  };

  const groupedChats: Record<string, Chat[]> = {};
  chats.forEach((chat) => {
    const date = format(new Date(chat.updatedAt), "yyyy-MM-dd");
    if (!groupedChats[date]) groupedChats[date] = [];
    groupedChats[date].push(chat);
  });

  return (
    <Select onValueChange={handleValueChange}>
      <ButtonSelectTrigger className={className}>
        <TooltipIconButton icon={<History />} text="Chat history" />
      </ButtonSelectTrigger>
      {!isEmptyObject(groupedChats) && (
        <SelectContent className="w-full">
          {!isEmptyObject(groupedChats) &&
            Object.keys(groupedChats).map((date) => (
              <SelectGroup key={date}>
                <SelectLabel className="flex justify-center items-center">
                  <span className="text-xs">{date}</span>
                </SelectLabel>
                {groupedChats[date].map((chat) => (
                  <SelectItem
                    key={chat.id}
                    className={cn(
                      "text-nowrap w-full h-10 pr-10 overflow-hidden hover:cursor-pointer",
                      chat.id === chatId && "bg-accent",
                    )}
                    value={chat.id}
                  >
                    <div className="flex items-center w-60 text-nowrap overflow-hidden">
                      <span className="truncate">{chat.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
        </SelectContent>
      )}
    </Select>
  );
}
