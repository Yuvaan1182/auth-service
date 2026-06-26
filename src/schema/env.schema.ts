import { z } from "zod";

export const env_schema = z.object({
  /** --- APP --- */
  PORT: z.coerce.number().default(8000),
  CLIENT_URL: z.string(),

  /** --- LOGGER --- */
  LOG_LEVEL: z.string(),

  /** -- JWT --- */
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_MFA_SECRET: z.string(),

  /** --- DB --- */
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_HOST: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASS: z.string(),

  /** --- Cache --- */
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_HOST: z.string(),
  REDIS_PASS: z.string(),

  /** --- Mail --- */
  APP_MAIL_HOST: z.string(),
  APP_MAIL_PORT: z.coerce.number(),
  APP_MAIL_USER: z.string(),
  APP_MAIL_PASS: z.string(),
  APP_MAIL_SECURE: z.enum(["true", "false"]).transform((v) => v === "true"),
  APP_MAIL_FROM: z.string(),
});
