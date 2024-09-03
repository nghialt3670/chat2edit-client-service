"use client";

import { Language } from "@prisma/client";
import { Select, SelectContent, SelectItem } from "./ui/select";
import ButtonSelectTrigger from "./button-select-trigger";
import TooltipIconButton from "./tooltip-icon-button";
import useChat from "@/lib/hooks/use-chat";
import { ButtonProps } from "./ui/button";

export default function LanguageSelect({ className }: ButtonProps) {
  const { chatId, language, setLanguage } = useChat();

  const renderLanguageText = () => {
    switch (language) {
      case Language.VIETNAMESE:
        return <p>vi</p>;
      case Language.ENGLISH:
        return <p>en</p>;
    }
  };
  return (
    <Select
      value={language}
      onValueChange={(language: Language) => setLanguage(language)}
      disabled={!!chatId}
    >
      <ButtonSelectTrigger className={className}>
        <TooltipIconButton icon={renderLanguageText()} text="Select language" />
      </ButtonSelectTrigger>
      <SelectContent className="mr-1">
        <SelectItem value="ENGLISH">English</SelectItem>
        <SelectItem value="VIETNAMESE">Vietnamese</SelectItem>
      </SelectContent>
    </Select>
  );
}
