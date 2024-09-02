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
  return (
    <ChatsContext.Provider value={chats}>{children}</ChatsContext.Provider>
  );
}

export default function useChats() {
  const contextChats = useContext(ChatsContext);
  const [chats, setChats] = useState<Chat[]>([]);

  if (contextChats === undefined)
    throw new Error("useChats must be used within a ChatsProvider");

  useEffect(() => {
    setChats(contextChats);
  }, [contextChats]);

  const updateChat = (updatedChat: Chat) => {
    setChats((prev) => [
      ...prev.filter((chat) => chat.id !== updatedChat.id),
      updatedChat,
    ]);
  };

  const removeChat = (chatId: string) => {
    setChats((prev) => [...prev.filter((chat) => chat.id !== chatId)]);
  };

  return {
    chats,
    updateChat,
    removeChat,
  };
}
