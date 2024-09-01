"use client";

import { ReactNode, useContext } from "react";
import MessagesContext from "../contexts/messages-context";
import Message from "../types/message";

export function MessagesProvider({
  messages,
  children,
}: {
  messages: Message[];
  children: ReactNode;
}) {
  return (
    <MessagesContext.Provider value={messages}>
      {children}
    </MessagesContext.Provider>
  );
}

export default function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined)
    throw new Error("useMessages must be used within a MessagesProvider");

  return context;
}
