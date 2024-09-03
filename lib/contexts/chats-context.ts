import { createContext } from "react";
import Chat from "../types/chat";

export interface ChatsContextType {
  chats: Chat[];
  updateChat: (chat: Chat) => void;
  removeChat: (chatId: string) => void;
}

const ChatsContext = createContext<ChatsContextType | undefined>(undefined);

export default ChatsContext;
