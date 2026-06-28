import { UserRepo } from "#repo/user.repo.js";
import { LoginServiceDeps } from "#types/auth.type.js";
import { AppError } from "#utils/app_error.util.js";
import { hashString, verifyString } from "#utils/password.util.js";
import { env } from "#config/env.config.js";

// POST   /auth/introspect   (optional, for token validation across services)
/**
 * @TODO
 * 1. session device based user login handling
 * 2. fix retry login for logged in user
 */
export class LoginService {
  constructor(private deps: LoginServiceDeps) {}

  async login(email: string, password: string) {
    /** -------- check :: user exists -------- */
    const user = await this.deps.userRepo.findUserByEmail(email);

    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401, "AUTH_FAILURE_014");
    }

    /** -------- check :: if valid user -------- */
    const validUser = await verifyString(user.password, password);

    if (!validUser) {
      throw new AppError("Invalid email or password", 401, "AUTH_FAILURE_014");
    }

    // if (user.isActive) {

    // }

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
