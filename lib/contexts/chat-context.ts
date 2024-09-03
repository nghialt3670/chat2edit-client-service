import { createContext, Dispatch, SetStateAction } from "react";
import { Language } from "@prisma/client";
import ChatStatus from "../types/chat-status";
import Message from "../types/message";
import Task from "../types/task";

export interface ChatContextType {
  chatId: string | undefined;
  setChatId: Dispatch<SetStateAction<string | undefined>>;
  shareId: string | undefined;
  setShareId: Dispatch<SetStateAction<string | undefined>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  task: Task;
  setTask: Dispatch<SetStateAction<Task>>;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  status: ChatStatus;
  setStatus: Dispatch<SetStateAction<ChatStatus>>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export default ChatContext;
