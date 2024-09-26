import { z } from "zod";
import {
  MAX_MESSAGE_ATTACHMENTS,
  MESSAGE_TEXT_MAX_LENGTH,
} from "@/config/message";
import attachmentSchema from "./attachment.schema";
import objectIdSchema from "./object-id.schema";

const messageSchema = z.object({
  id: objectIdSchema,
  type: z.enum(["request", "response"]),
  text: z.string().min(1).max(MESSAGE_TEXT_MAX_LENGTH),
  attachments: z.array(attachmentSchema).max(MAX_MESSAGE_ATTACHMENTS),
});

export type Message = z.infer<typeof messageSchema>;

export default messageSchema;
