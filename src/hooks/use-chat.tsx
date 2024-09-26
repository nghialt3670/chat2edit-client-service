"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Language, Provider } from "@/schemas/chat-settings.schema";
import { ChatDetails } from "@/schemas/chat-details.schema";
import { Message } from "@/schemas/message.schema";
import { ChatStatus } from "@/types/chat";

export interface ChatContextType {
  chatId: string | undefined;
  setChatId: Dispatch<SetStateAction<string | undefined>>;
  shareId: string | undefined;
  setShareId: Dispatch<SetStateAction<string | undefined>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  provider: Provider;
  setProvider: Dispatch<SetStateAction<Provider>>;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  status: ChatStatus;
  setStatus: Dispatch<SetStateAction<ChatStatus>>;
  isNew: boolean;
  setIsNew: Dispatch<SetStateAction<boolean>>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  chat,
  children,
}: {
  chat: ChatDetails | null | undefined;
  children: ReactNode;
}) {
  const [chatId, setChatId] = useState<string>();
  const [shareId, setShareId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>("initializing");
  const [provider, setProvider] = useState<Provider>("fabric");
  const [language, setLanguage] = useState<Language>("en");
  const [isNew, setIsNew] = useState<boolean>(false);

  useEffect(() => {
    if (chat) {
      setChatId(chat.id);
      setShareId(chat.shareId);
      setMessages(chat.messages);
      setProvider(chat.settings.provider);
      setLanguage(chat.settings.language);
      if (chat.messages.length % 2 === 0) setStatus("idling");
      else setStatus("error-response");
    } else {
      setStatus("idling");
    }
  }, [chat]);

  const resetChat = () => {
    setStatus("idling");
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
        provider,
        setProvider,
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
