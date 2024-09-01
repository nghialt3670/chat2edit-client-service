import { createContext } from "react";
import Message from "../types/message";

const MessagesContext = createContext<Message[] | undefined>(undefined);

export default MessagesContext;
