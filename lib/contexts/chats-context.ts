import { createContext } from "react";
import Chat from "../types/chat";

const ChatsContext = createContext<Chat[] | undefined>(undefined);

export default ChatsContext;
