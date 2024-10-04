"use client";

import { Image, Sheet } from "lucide-react";
import { ReactNode } from "react";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import TooltipIconButton from "../../../components/buttons/tooltip-icon-button";
import { Provider } from "@/schemas/chat-settings.schema";
import ButtonSelectTrigger from "../../../components/buttons/button-select-trigger";
import { ButtonProps } from "@/components/ui/button";
import { PROVIDER_TO_TASK } from "@/config/provider";
import useChat from "@/hooks/use-chat";

export default function TaskSelect({ className }: ButtonProps) {
  const { chatId, provider, setProvider } = useChat();

  const taskToProvider: Record<string, Provider> = {
    "image-editing": "fabric",
    "sheet-editing": "pandas",
  };

  const taskToIcon: Record<string, ReactNode> = {
    "image-editing": <Image />,
    "sheet-editing": <Sheet />,
  };

  const task = PROVIDER_TO_TASK[provider];
  const icon = taskToIcon[task];

  return (
    <Select
      value={task}
      onValueChange={(task) => setProvider(taskToProvider[task])}
      disabled={!!chatId}
    >
      <ButtonSelectTrigger className={className}>
        <TooltipIconButton text="Select task">{icon}</TooltipIconButton>
      </ButtonSelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value={"image-editing"}>
          <span className="truncate">Image editing</span>
        </SelectItem>
        <SelectItem value={"sheet-editing"}>
          <span className="truncate">Sheet editing</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
