import { Chat as ChatModel } from "@prisma/client";
import Message from "./message";

export default interface Chat
  extends Omit<ChatModel, "accountId" | "lastMessageId"> {
  messages?: Message[];
}
