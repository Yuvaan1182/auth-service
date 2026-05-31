import z from "zod";
import { verifyEmailSchema } from "../schema/auth.schema.js";
import { RedisServiceInterface } from "#interface/redis.service.interface.js";
import { RegisterService } from "#services/auth/register.service.js";
import { PostgreDB } from "../db/postgre.db.js";
import { EmailService } from "#services/email/email.service.js";
import { RegisterRepos } from "./register.type.js";
import { LoginRepos } from "./login.type.js";

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export type RegisterDeps = {
  db: PostgreDB;
  redisService: RedisServiceInterface;
  emailService: EmailService;
  repos?: Partial<RegisterRepos>;
};

export type EmailServiceDeps = {
  db: PostgreDB;
  redisService: RedisServiceInterface;
};

export type AuthServiceDeps = {
  registerService: RegisterService;
};

export type LoginDeps = {
  db: PostgreDB;
  redisService: RedisServiceInterface;
  emailService: EmailService;
  repos?: Partial<LoginRepos>;
};
