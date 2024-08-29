"use client";

import { ReactNode, useContext } from "react";
import MessagesContext from "../contexts/messages-context";
import DatalessMessage from "../types/dataless-message";

export function MessagesProvider({
  messages,
  children,
}: {
  messages: DatalessMessage[];
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
