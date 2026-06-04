import { UserRepo } from "#repo/user.repo.js";
import { LoginServiceDeps } from "#types/auth.type.js";
import { AppError } from "#utils/app_error.util.js";
import { hashString, verifyString } from "#utils/password.util.js";
import { env } from "#config/env.config.js";

// POST   /auth/introspect   (optional, for token validation across services)
/**
 * @TODO: session device based user login handling
 */
export class LoginService {
  constructor(private deps: LoginServiceDeps) {}

  async login(email: string, password: string) {
    /** -------- initializing const -------- */
    const client = await this.deps.db.getClient();
    const userRepo = this.deps.repos?.userRepo ?? new UserRepo(client);

    /** -------- check :: user exists -------- */
    const user = await userRepo.findUserByEmail(email);

    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401, "AUTH_FAILURE_014");
    }

    /** -------- check :: if valid user -------- */
    const validUser = await verifyString(user.password, password);

    if (!validUser) {
      throw new AppError("Invalid email or password", 401, "AUTH_FAILURE_014");
    }

    /** -------- check :: mfa enabled for user -------- */
    const mfaEnabled = user.mfa;

    if (validUser && mfaEnabled) {
      const tempToken = this.deps.tokenService.generateMFAToken(user.id);
      return {
        mfaEnabled: true,
        mfaToken: tempToken,
      };
    }

    /** -------- issue tokens -------- */
    const tokens = await this.deps.tokenService.issueTokens(user.id);

    return {
      mfaEnabled: false,
      ...tokens,
    };
  }
}
