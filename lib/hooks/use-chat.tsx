"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import { Language } from "@prisma/client";
import { PROVIDER_TO_TASK } from "../configs/provider";
import ChatContext from "../contexts/chat-context";
import ChatStatus from "../types/chat-status";
import Message from "../types/message";
import Task from "../types/task";
import Chat from "../types/chat";

export function ChatProvider({
  chat,
  children,
}: {
  chat?: Required<Pick<Chat, "messages">> & Omit<Chat, "messages">;
  children: ReactNode;
}) {
  const [chatId, setChatId] = useState<string>();
  const [shareId, setShareId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [task, setTask] = useState<Task>(Task.ImageEditing);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.Initializing);
  const [isNew, setIsNew] = useState<boolean>(false);

  useEffect(() => {
    if (chat) {
      setChatId(chat.id);
      if (chat.shareId) setShareId(chat.shareId);
      setMessages(chat.messages);
      setTask(PROVIDER_TO_TASK[chat.provider]);
      setLanguage(chat.language);
      if (chat.messages.length % 2 === 0) setStatus(ChatStatus.Idle);
      else setStatus(ChatStatus.ResponseError);
    } else {
      const language = localStorage.getItem("language") as Language;
      if (language) setLanguage(language);
      setStatus(ChatStatus.Idle);
    }
  }, [chat]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const resetChat = () => {
    setStatus(ChatStatus.Idle);
    setChatId(undefined);
    setShareId(undefined);
    setIsNew(false);
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
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
        isNew,
        setIsNew,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
}
