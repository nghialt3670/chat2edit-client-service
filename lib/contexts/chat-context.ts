import { createContext } from "react";
import Chat from "../types/chat";

export type ChatContextType =
  | (Required<Pick<Chat, "messages">> & Omit<Chat, "messages">)
  | undefined;

const ChatContext = createContext<ChatContextType>(undefined);

export default ChatContext;
