import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  ADMIN_REGISTRATION_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const messages = parsed.error.issues.map((issue) => issue.message).join(", ");
  throw new Error(`Invalid environment configuration: ${messages}`);
}

export const env = parsed.data;
