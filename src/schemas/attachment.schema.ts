import { z } from "zod";
import objectIdSchema from "./object-id.schema";

export const thumbnailSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const uploadedFileSchema = z.object({
  name: z.string(),
  size: z.number(),
  contentType: z.string(),
  thumbnail: thumbnailSchema.optional(),
});

const attachmentSchema = z.object({
  id: objectIdSchema,
  type: z.enum(["file", "link", "ref"]),
  file: uploadedFileSchema.optional(),
  link: z.string().url().optional(),
  ref: objectIdSchema.optional(),
});

export type UploadedFile = z.infer<typeof uploadedFileSchema>;
export type Attachment = z.infer<typeof attachmentSchema>;

export default attachmentSchema;
