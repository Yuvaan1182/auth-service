import { RegisterService } from "#services/auth/register.service.js";
import { appContainer } from "./app.container.js";
import { repoContainer } from "./repo.container.js";

export class ServiceContainer {
  private _registerService?: RegisterService;

  async init() {
    console.log("ServiceContainer.init: initializing services...");
    this._registerService = new RegisterService({
      userRepo: repoContainer.userRepo,
      tokenRepo: repoContainer.tokenRepo,
      redisService: appContainer.redis,
      emailService: appContainer.email,
    });
    console.log("ServiceContainer.init: register service initialized");
  }

  get registerService() {
    if (!this._registerService) {
      throw new Error("ServiceContainer not initialized");
    }

    return this._registerService;
  }
}

export const serviceContainer = new ServiceContainer();
