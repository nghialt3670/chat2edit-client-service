import { z } from "zod";
import chatSettingsSchema from "./chat-settings.schema";
import objectIdSchema from "./object-id.schema";
import messageSchema from "./message.schema";

const chatDetailsSchema = z.object({
  id: objectIdSchema,
  shareId: objectIdSchema.optional(),
  messages: z.array(messageSchema),
  settings: chatSettingsSchema,
});

export type ChatDetails = z.infer<typeof chatDetailsSchema>;

export default chatDetailsSchema;
