"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ChatPreview } from "@/schemas/chat-preview.schema";

interface HistoryContextType {
  chats: ChatPreview[] | null | undefined;
  addChat: (chat: ChatPreview) => void;
  updateChat: (chat: ChatPreview) => void;
  removeChat: (chatId: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({
  chats,
  children,
}: {
  chats: ChatPreview[] | null | undefined;
  children: ReactNode;
}) {
  const [localChats, setLocalChats] = useState<
    ChatPreview[] | null | undefined
  >();

  useEffect(() => setLocalChats(chats), [chats]);

  const addChat = (newChat: ChatPreview) => {
    setLocalChats((prev) => (prev ? [...prev, newChat] : prev));
  };

  const updateChat = (updatedChat: ChatPreview) => {
    setLocalChats((prev) =>
      prev
        ? [...prev.filter((chat) => chat.id !== updatedChat.id), updatedChat]
        : prev,
    );
  };

  const removeChat = (chatId: string) => {
    setLocalChats((prev) =>
      prev ? [...prev.filter((chat) => chat.id !== chatId)] : prev,
    );
  };

  return (
    <HistoryContext.Provider
      value={{ chats: localChats, addChat, updateChat, removeChat }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export default function useHistory() {
  const context = useContext(HistoryContext);

  if (context === undefined)
    throw new Error("useHistory must be used within a HistoryProvider");

  return context;
}
