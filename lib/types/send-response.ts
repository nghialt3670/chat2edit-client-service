import Message from "./message";
import Chat from "./chat";

export default interface SendResponse {
  currChat: Chat;
  savedReqMessage: boolean;
  resMessage?: Message;
}
