import { env } from "#config/env.config.js";
import { SessionRepo } from "#repo/session.repo.js";
import { RefreshServiceDeps } from "#types/auth.type.js";
import { RefreshToken } from "#types/login.type.js";
import { AppError } from "#utils/app_error.util.js";
import { hashString, verifyString } from "#utils/password.util.js";
import jwt from "jsonwebtoken";

export class RefreshService {
  constructor(private deps: RefreshServiceDeps) {}
  async refresh(token: string) {
    /** -------- check if refresh token is provided -------- */
    if (!token) {
      throw new AppError(
        "Missing token. Please provide token.",
        401,
        "AUTH_FAILURE_015",
      );
    }

    /** -------- retrieve sessionId and userId from refresh token -------- */
    const payload = jwt.verify(token, env.jwt_refresh_secret) as RefreshToken;

    /** -------- initialize db client -------- */
    const client = await this.deps.db.getClient();
    const sessionRepo = this.deps.repos?.sessionRepo ?? new SessionRepo(client);

    /** -------- check if the session exists or revoked -------- */
    const session = await sessionRepo.findSession({ sessionId: payload.sid });

    if (!session || session.revoked) {
      throw new AppError(
        "User session expired. Please login again.",
        401,
        "AUTH_FAILURE_016",
      );
    }

    /** -------- check if expired or revoked refresh token is reused -------- */

    const verifiedToken = await verifyString(session.refreshTokenHash, token);

    if (!verifiedToken) {
      /** -------- revoke session -------- */
      await sessionRepo.revokeSession({ sessionId: payload.sid });

      throw new AppError(
        "Unauthorized access warning. Please login again.",
        401,
        "AUTH_FAILURE_017",
      );
    }

    /** -------- rotate refresh token -------- */
    const refreshToken = this.deps.tokenService.generateRefreshToken(
      payload.sub,
      payload.sid,
    );
    const tokenHash = await hashString(refreshToken);

    const updatedSession = await sessionRepo.rotateSession({
      sessionId: payload.sid,
      tokenHash,
    });

    /** -------- issue new access Token -------- */
    const newAccessToken = this.deps.tokenService.generateAccessToken(
      payload.sub,
      payload.sid,
    );

    /** TODO: create cookie in controller for refresh token
       * res.cookie(
          "refreshToken",
            refreshToken,
            {
              httpOnly: true,
              secure: false,
              sameSite: "strict",
            }
          )
       */
    return {
      refreshToken,
      accessToken: newAccessToken,
    };
  }
}
