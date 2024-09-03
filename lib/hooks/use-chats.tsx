"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import ChatsContext from "../contexts/chats-context";
import Chat from "../types/chat";

export function ChatsProvider({
  chats,
  children,
}: {
  chats: Chat[];
  children: ReactNode;
}) {
  const [localChats, setLocalChats] = useState<Chat[]>([]);

  useEffect(() => {
    setLocalChats(chats);
  }, [chats]);

  const updateChat = (updatedChat: Chat) => {
    setLocalChats((prev) => [
      ...prev.filter((chat) => chat.id !== updatedChat.id),
      updatedChat,
    ]);
  };

  const removeChat = (chatId: string) => {
    setLocalChats((prev) => [...prev.filter((chat) => chat.id !== chatId)]);
  };

  return (
    <ChatsContext.Provider
      value={{ chats: localChats, updateChat, removeChat }}
    >
      {children}
    </ChatsContext.Provider>
  );
}

export default function useChats() {
  const context = useContext(ChatsContext);
  if (context === undefined)
    throw new Error("useChats must be used within a ChatsProvider");

  return context;
}
