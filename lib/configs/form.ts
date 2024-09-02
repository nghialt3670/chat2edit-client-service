import { Language, Provider } from "@prisma/client";
import { z } from "zod";
import Task from "../types/task";

export const MESSAGE_TEXT_MAX_LENGTH = 100;
export const MESSAGE_FILE_MAX_SIZE = 5 * 1024 * 1024;
export const MESSAGE_FILES_MAX_LENGTH = 5;
export const TASK_TO_FILE_ACCEPT: Record<Task, string> = {
  "image-editing": "image/*",
  "sheet-editing": ".csv, .xls, .xlsx",
};

export const formDataSchema = z.object({
  chatId: z.union([z.string().nullable(), z.undefined()]),
  text: z
    .string()
    .min(1, "Text is required")
    .max(MESSAGE_TEXT_MAX_LENGTH, "Text must be at most 100 characters"),
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size <= MESSAGE_FILE_MAX_SIZE, {
        message: `Each file must be at most ${MESSAGE_FILE_MAX_SIZE / (1024 * 1024)} MB`,
      }),
    )
    .max(
      MESSAGE_FILES_MAX_LENGTH,
      `You can upload up to ${MESSAGE_FILES_MAX_LENGTH} files`,
    ),
  provider: z.nativeEnum(Provider, {
    errorMap: () => ({ message: "Invalid provider" }),
  }),
  language: z.nativeEnum(Language, {
    errorMap: () => ({ message: "Invalid language" }),
  }),
});
