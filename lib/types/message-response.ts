import Attachment from "./attachment";

export default interface MessageResponse {
  text: string;
  attachments: Attachment[];
}
