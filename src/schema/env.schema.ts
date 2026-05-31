import { z } from "zod";

export const env_schema = z.object({
  /** --- APP --- */
  PORT: z.string().optional(),
  CLIENT_URL: z.string(),

  /** -- JWT --- */
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_MFA_SECRET: z.string(),

  /** --- DB --- */
  POSTGRES_PORT: z.string().optional(),
  POSTGRES_HOST: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASS: z.string(),

  /** --- Cache --- */
  REDIS_PORT: z.string().optional(),
  REDIS_HOST: z.string(),
  REDIS_PASS: z.string(),

  /** --- Mail --- */
  APP_MAIL_HOST: z.string(),
  APP_MAIL_PORT: z.string(),
  APP_MAIL_USER: z.email(),
  APP_MAIL_PASS: z.string(),
  APP_MAIL_SERVICE_PROVIDER: z.string(),
});
