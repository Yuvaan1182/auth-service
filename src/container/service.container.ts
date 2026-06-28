import { LoginService } from "#services/auth/login.service.js";
import { RegisterService } from "#services/auth/register.service.js";
import { TokenService } from "#services/auth/token.service.js";
import { appContainer } from "./app.container.js";
import { repoContainer } from "./repo.container.js";

export class ServiceContainer {
  private _registerService?: RegisterService;
  private _loginService?: LoginService;
  private _tokenService?: TokenService;

  async init() {
    console.log("ServiceContainer.init: initializing services...");

    const registerService = new RegisterService({
      userRepo: repoContainer.userRepo,
      tokenRepo: repoContainer.tokenRepo,
      redisService: appContainer.redis,
      emailService: appContainer.email,
    });

    const tokenService = new TokenService({
      sessionRepo: repoContainer.sessionRepo,
    });

    const loginService = new LoginService({
      userRepo: repoContainer.userRepo,
      tokenService: tokenService,
    });

    this._loginService = loginService;
    this._registerService = registerService;
    this._tokenService = tokenService;

    console.log("ServiceContainer.init: services initialized");
  }

  private require<T>(value: T | undefined): T {
    if (!value) {
      throw new Error("ServiceContainer not initialized");
    }
    return value;
  }

  get registerService() {
    return this.require(this._registerService);
  }

  get loginService() {
    return this.require(this._loginService);
  }

  get tokenService() {
    return this.require(this._tokenService);
  }
}

export const serviceContainer = new ServiceContainer();
