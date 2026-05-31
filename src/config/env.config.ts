import dotenv from "dotenv";
dotenv.config({ path: ".auth.env", debug: true });
import { env_schema } from "../schema/env.schema.js";

/** --- parsing & validate env variables --- */
const parsed = env_schema.parse(process.env);

/** --- db url creation --- */
const db_url = `postgresql://${parsed.POSTGRES_USER}:${parsed.POSTGRES_PASS}@${parsed.POSTGRES_HOST}:${parsed.POSTGRES_PORT}/${parsed.POSTGRES_DB}`;

/** --- setting db url in env: to make sure that db url is always present --- */
process.env.DATABASE_URL = db_url;

export const env = {
  /** --- APP --- */
  port: Number(parsed.PORT) || 8000,
  client_url: parsed.CLIENT_URL,

  /** --- JWT --- */
  jwt_access_secret: parsed.JWT_ACCESS_SECRET,
  jwt_refresh_secret: parsed.JWT_REFRESH_SECRET,
  jwt_mfa_secret: parsed.JWT_MFA_SECRET,

  /** --- DB --- */
  db_port: Number(parsed.POSTGRES_PORT) || 5432,
  db_host: parsed.POSTGRES_HOST,
  db_name: parsed.POSTGRES_DB,
  db_user: parsed.POSTGRES_USER,
  db_password: parsed.POSTGRES_PASS,
  db_url: db_url,

  /** --- CACHE --- */
  cache_port: Number(parsed.REDIS_PORT) || 6379,
  cache_host: parsed.REDIS_HOST,
  cache_password: parsed.REDIS_PASS,

  /** --- MAIL --- */
  app_mail_user: parsed.APP_MAIL_USER,
  app_mail_pass: parsed.APP_MAIL_PASS,
  app_mail_host: parsed.APP_MAIL_HOST,
  app_mail_port: Number(parsed.APP_MAIL_PORT) || 465,
  app_mail_service_provider: parsed.APP_MAIL_SERVICE_PROVIDER,
};
