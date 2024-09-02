import { Message as MessageModel } from "@prisma/client";
import Attachment from "./attachment";

export default interface Message extends Omit<MessageModel, "chatId"> {
  attachments: Attachment[];
}
