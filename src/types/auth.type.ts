import z from "zod";
import { verifyEmailSchema } from "../schema/auth.schema.js";
import { RedisServiceInterface } from "#interface/redis.service.interface.js";
import { RegisterService } from "#services/auth/register.service.js";
import { PostgreDB } from "../db/postgre.db.js";
import { EmailService } from "#services/email/email.service.js";
import { RegisterRepos } from "./register.type.js";
import { LoginRepos } from "./login.type.js";
import { TokenRepos } from "./token.type.js";
import { TokenService } from "#services/auth/token.service.js";
import { LogoutRepos } from "./logout.type.js";

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

export type LoginServiceDeps = {
  db: PostgreDB;
  redisService: RedisServiceInterface;
  emailService: EmailService;
  tokenService: TokenService;
  repos?: Partial<LoginRepos>;
};

export type TokenServiceDeps = {
  repos?: Partial<TokenRepos>;
};

export type RefreshServiceDeps = {
  db: PostgreDB;
  tokenService: TokenService;
  repos?: Partial<TokenRepos>;
};

export type LogoutServiceDeps = {
  db: PostgreDB;
  repos?: Partial<LogoutRepos>;
};
