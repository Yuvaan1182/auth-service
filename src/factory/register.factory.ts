import { RegisterServiceDeps } from "#types/auth.type.js";
import { RegisterService } from "#services/auth/register.service.js";
import { appContainer } from "#container/app.container.js";
import { repoContainer } from "#container/repo.container.js";

export const createRegisterService = () => {
  return new RegisterService({
    userRepo: repoContainer.userRepo,
    tokenRepo: repoContainer.tokenRepo,
    redisService: appContainer.redis,
    emailService: appContainer.email,
  } as RegisterServiceDeps);
};
