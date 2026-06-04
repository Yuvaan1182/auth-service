import { env } from "#config/env.config.js";
import { SessionRepo } from "#repo/session.repo.js";
import { LogoutServiceDeps } from "#types/auth.type.js";
import { RefreshToken } from "#types/login.type.js";
import { AppError } from "#utils/app_error.util.js";
import jwt from "jsonwebtoken";

export class LogoutService {
  constructor(private deps: LogoutServiceDeps) {}

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError("Invalid Request", 401, "AUTH_FAILURE_018");
    }

    /** -------- retrive sid from refresh token -------- */
    const payload = jwt.verify(
      refreshToken,
      env.jwt_refresh_secret,
    ) as RefreshToken;

    /** -------- retrive user current session -------- */
    const client = await this.deps.db.getClient();
    const sessionRepo = this.deps.repos?.sessionRepo ?? new SessionRepo(client);

    const session = await sessionRepo.findSession({ sessionId: payload.sid });

    /** -------- check if session exist -------- */
    if (!session) {
      throw new AppError(
        "User session does not exists.",
        401,
        "AUTH_FAILURE_019",
      );
    }

    /** -------- revoke session -------- */
    const sessionRevoked = await this.deps.repos?.sessionRepo?.revokeSession({
      sessionId: payload.sid,
    });

    if (!sessionRevoked) {
      throw new AppError("Internal Server Error.", 500, "AUTH_FAILURE_020");
    }

    return true;
  }

  //   @TODO: Logout all
}
