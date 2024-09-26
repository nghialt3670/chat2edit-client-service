import { z } from "zod";

const languageSchema = z.enum(["vi", "en"]);
const providerSchema = z.enum(["fabric", "pandas"]);

const chatSettingsSchema = z.object({
  provider: providerSchema,
  language: languageSchema,
});

export type Provider = z.infer<typeof providerSchema>;
export type Language = z.infer<typeof languageSchema>;
export type ChatSettings = z.infer<typeof chatSettingsSchema>;

export default chatSettingsSchema;
