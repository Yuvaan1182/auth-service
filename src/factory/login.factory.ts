import { LoginServiceDeps } from "#types/auth.type.js";
import { LoginService } from "#services/auth/login.service.js";
import { repoContainer } from "#container/repo.container.js";
import { serviceContainer } from "#container/service.container.js";

export const createLoginService = (deps?: LoginServiceDeps) => {
  return new LoginService({
    userRepo: repoContainer.userRepo,
    tokenService: serviceContainer.tokenService,
  });
};
