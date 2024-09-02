import { Attachment as AttachmentModel } from "@prisma/client";

export default interface Attachment
  extends Omit<AttachmentModel, "id" | "accountId" | "messageId"> {
  dataURL?: string;
  file?: File;
}
