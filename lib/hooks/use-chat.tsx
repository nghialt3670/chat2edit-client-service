"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import { Language } from "@prisma/client";
import ChatContext, { ChatContextType } from "../contexts/chat-context";
import { PROVIDER_TO_TASK } from "../configs/provider";
import ChatStatus from "../types/chat-status";
import Message from "../types/message";
import Task from "../types/task";

export function ChatProvider({
  value,
  children,
}: {
  value: ChatContextType;
  children: ReactNode;
}) {
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export default function useChat() {
  const contextChat = useContext(ChatContext);
  const [chatId, setChatId] = useState<string>();
  const [shareId, setShareId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [task, setTask] = useState<Task>(Task.ImageEditing);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.Initializing);

  useEffect(() => {
    if (!contextChat) {
      setStatus(ChatStatus.Idle);
    } else {
      if (contextChat.id === chatId) return;
      setChatId(contextChat.id);
      setShareId(contextChat.shareId ?? undefined);
      setMessages(contextChat.messages);
      setTask(PROVIDER_TO_TASK[contextChat.provider]);
      setLanguage(contextChat.language);
      if (contextChat.messages.length % 2 === 0) setStatus(ChatStatus.Idle);
      else setStatus(ChatStatus.ResponseError);
    }
  }, [contextChat]);

  const resetChat = () => {
    setChatId(undefined);
    setShareId(undefined);
    setMessages([]);
  };

  return {
    chatId,
    setChatId,
    shareId,
    setShareId,
    messages,
    setMessages,
    task,
    setTask,
    language,
    setLanguage,
    status,
    setStatus,
    resetChat,
  };
}
