import { env } from "#config/env.config.js";
import { SessionRepo } from "#repo/session.repo.js";
import { TokenServiceDeps } from "#types/auth.type.js";
import { hashString } from "#utils/password.util.js";
import jwt from "jsonwebtoken";

export class TokenService {
  constructor(private deps: TokenServiceDeps) {}

  generateMFAToken(userId: string) {
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

  generateRefreshToken(userId: string, sessionId: string) {
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

  generateAccessToken(userId: string, sessionId: string) {
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

  async issueTokens(userId: string) {
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
    const session = await this.deps.sessionRepo.createSession({
      sessionId,
      userId,
      refreshTokenHash,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }
}
