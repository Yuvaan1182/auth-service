import { RedisService } from "#redis/redis.service.js";
import { EmailService } from "#services/email/email.service.js";
import { RegisterDeps } from "#types/auth.type.js";
import { PostgreDB } from "#db/postgre.db.js";
import { RegisterService } from "#services/auth/register.service.js";

export const createRegisterService = (deps?: Partial<RegisterDeps>) => {
  const db = deps?.db ?? new PostgreDB();
  const redisService = deps?.redisService ?? new RedisService();
  const emailService =
    deps?.emailService ??
    new EmailService({
      db,
      redisService,
    });

  return new RegisterService({
    db,
    redisService,
    emailService,
    repos: deps?.repos,
  } as RegisterDeps);
};
