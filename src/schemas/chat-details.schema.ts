import { z } from "zod";
import chatSettingsSchema from "./chat-settings.schema";
import objectIdSchema from "./object-id.schema";
import messageSchema from "./message.schema";

const chatPreviewResponseSchema = z.object({
  id: objectIdSchema,
  shareId: objectIdSchema.optional(),
  messages: z.array(messageSchema),
  settings: chatSettingsSchema,
});

export type ChatDetails = z.infer<typeof chatPreviewResponseSchema>;

export default chatPreviewResponseSchema;
