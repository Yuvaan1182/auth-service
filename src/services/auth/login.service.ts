import jwt from "jsonwebtoken";
import { UserRepo } from "#repo/user.repo.js";
import { LoginDeps } from "#types/auth.type.js";
import { AppError } from "#utils/app_error.util.js";
import { hashString, verifyString } from "#utils/password.util.js";
import { env } from "#config/env.config.js";

// POST   /auth/login
// POST   /auth/logout
// POST   /auth/refresh
// POST   /auth/introspect   (optional, for token validation across services)
export class LoginService {
  constructor(private deps: LoginDeps) {}

  private generateMFAToken(userId: string) {
    return jwt.sign(
      {
        sub: userId,
        type: "mfa",
        mfaPending: true,
      },
      env.jwt_mfa_secret,
      {
        expiresIn: "5m",
      },
    );
  }

  private generateRefreshToken(userId: string, sessionId: string) {
    return jwt.sign(
      {
        sub: userId,
        sid: sessionId,
        type: "refresh",
      },
      env.jwt_refresh_secret,
      {
        expiresIn: "7d",
      },
    );
  }

  private generateAccessToken(userId: string, sessionId: string) {
    return jwt.sign(
      {
        sub: userId,
        sid: sessionId,
        type: "access",
      },
      env.jwt_access_secret,
      {
        expiresIn: "15m",
      },
    );
  }

  private async issueTokens(userId: string) {
    /** -------- generate unique sessionId -------- */
    const sessionId = crypto.randomUUID();

    /** -------- generate jowt based refresh & access token -------- */
    const refreshToken = this.generateRefreshToken(userId, sessionId);
    const accessToken = this.generateAccessToken(userId, sessionId);

    /** -------- generate refresh token hash to store in sesson db -------- */
    const refreshTokenHash = await hashString(refreshToken);

    /** -------- create 7 day expiry -------- */
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    /** -------- save session -------- */
    const session = await this.deps.repos?.sessionRepo?.createSession({
      sessionId,
      userId,
      refreshTokenHash,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

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
      const tempToken = this.generateMFAToken(user.id);
      return {
        mfaEnabled: true,
        token: tempToken,
      };
    }

    /** -------- issue tokens -------- */
    const tokens = await this.issueTokens(user.id);

    return {
      mfaEnabled: false,
      ...tokens,
    };
  }
}
