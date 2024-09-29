import { z } from "zod";
import chatSettingsSchema from "./chat-settings.schema";
import dateStringSchema from "./date-string.schema";
import objectIdSchema from "./object-id.schema";

const chatPreviewSchema = z.object({
  id: objectIdSchema,
  title: z.string(),
  settings: chatSettingsSchema,
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export type ChatPreview = z.infer<typeof chatPreviewSchema>;

export default chatPreviewSchema;
