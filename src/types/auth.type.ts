import z from "zod";
import { RedisServiceInterface } from "#interface/redis.service.interface.js";
import { RegisterService } from "#services/auth/register.service.js";
import { PostgreDB } from "#db/postgre.db.js";
import { EmailService } from "#services/email/email.service.js";
import { RegisterRepos } from "./register.type.js";
import { LoginRepos } from "./login.type.js";
import { TokenRepos } from "./token.type.js";
import { TokenService } from "#services/auth/token.service.js";
import { LogoutRepos } from "./logout.type.js";
import { verifyEmailSchema } from "#schema/email.schema.js";
import { UserRepo } from "#repo/user.repo.js";
import { TokenRepo } from "#repo/token.repo.js";
import { RedisService } from "#redis/redis.service.js";
import { SessionRepo } from "#repo/session.repo.js";

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export interface RegisterServiceDeps {
  userRepo: UserRepo;
  tokenRepo: TokenRepo;
  redisService: RedisService;
  emailService: EmailService;
}

export type EmailServiceDeps = {
  db: PostgreDB;
  redisService: RedisServiceInterface;
};

export type LoginServiceDeps = {
  userRepo: UserRepo;
  tokenService: TokenService;
};

export type TokenServiceDeps = {
  sessionRepo: SessionRepo;
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
