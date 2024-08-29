"use client";

import { ReactNode, useContext } from "react";
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
  const context = useContext(ChatsContext);
  if (context === undefined)
    throw new Error("useMessages must be used within a MessagesProvider");

  return context;
}
