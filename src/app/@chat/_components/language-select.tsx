"use client";

import ButtonSelectTrigger from "../../../components/buttons/button-select-trigger";
import {
  Select,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import TooltipIconButton from "../../../components/buttons/tooltip-icon-button";
import { ButtonProps } from "../../../components/ui/button";
import { Language } from "@/schemas/chat-settings.schema";
import useChat from "@/hooks/use-chat";

export default function LanguageSelect({ className }: ButtonProps) {
  const { chatId, language, setLanguage } = useChat();

  return (
    <Select
      value={language}
      onValueChange={(language: Language) => setLanguage(language)}
      disabled={!!chatId}
    >
      <ButtonSelectTrigger className={className}>
        <TooltipIconButton text="Select language">{language}</TooltipIconButton>
      </ButtonSelectTrigger>
      <SelectContent className="mr-1">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="vi">Vietnamese</SelectItem>
      </SelectContent>
    </Select>
  );
}
