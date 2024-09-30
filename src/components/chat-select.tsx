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
import TooltipIconButton from "./buttons/tooltip-icon-button";
import { ChatPreview } from "@/schemas/chat-preview.schema";
import ButtonSelectTrigger from "./button-select-trigger";
import { cn, isEmptyObject } from "@/lib/utils";
import useHistory from "@/hooks/use-history";
import { ButtonProps } from "./ui/button";
import useChat from "@/hooks/use-chat";

export default function ChatSelect({ className }: ButtonProps) {
  const router = useRouter();
  const { chats } = useHistory();
  const { chatId, setStatus } = useChat();

  //TODO: Fix new chat not in order when added

  if (chats === null) {
    return <div></div>;
  }

  if (chats === undefined) {
    return <div></div>;
  }

  const handleValueChange = (newChatId: string) => {
    if (newChatId === chatId) return;
    setStatus("initializing");
    router.push(`/${newChatId}`);
  };

  const groupedChats: Record<string, ChatPreview[]> = {};
  chats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  chats.forEach((chat) => {
    const date = format(new Date(chat.updatedAt), "yyyy-MM-dd");
    if (!groupedChats[date]) groupedChats[date] = [];
    groupedChats[date].push(chat);
  });

  return (
    <Select onValueChange={handleValueChange}>
      <ButtonSelectTrigger className={className}>
        <TooltipIconButton text="Chat history">
          <History />
        </TooltipIconButton>
      </ButtonSelectTrigger>
      <SelectContent className="w-full">
        {isEmptyObject(groupedChats) && <p className="opacity-50 m-2">No chat history</p>}
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
    </Select>
  );
}
