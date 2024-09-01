import Attachment from "./attachment";

export default interface Message {
  id: string;
  text: string;
  attachments: Attachment[];
}
