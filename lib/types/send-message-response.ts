import MessageResponse from "./message-response";

export default interface SendMessageResponse {
  newChatId?: string;
  savedRequest: boolean;
  response?: MessageResponse;
}
