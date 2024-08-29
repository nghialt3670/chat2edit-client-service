import { createContext } from "react";
import DatalessMessage from "../types/dataless-message";

const MessagesContext = createContext<DatalessMessage[] | undefined>(undefined);

export default MessagesContext;
