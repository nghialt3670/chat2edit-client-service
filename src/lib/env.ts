import { configDotenv } from "dotenv";
import { z } from "zod";

configDotenv();

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  AUTH_TRUST_HOST: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  BACKEND_API_BASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production"]),
});

const ENV = envSchema.parse(process.env);

export default ENV;
