import { createContext, useContext, ReactNode } from "react";
import Chat from "../types/chat";

const ChatsContext = createContext<Chat[] | undefined>(undefined);

export default ChatsContext;
