import { SessionRepo } from "#repo/session.repo.js";
import { TokenRepo } from "#repo/token.repo.js";
import { UserRepo } from "#repo/user.repo.js";

export type LoginRepos = {
  userRepo?: UserRepo;
  sessionRepo?: SessionRepo;
};

export type CreateSession = {
  userId: string;
  sessionId: string;
  refreshTokenHash: string;

  ipAddress?: string;
  userAgent?: string;

  browser?: string;
  os?: string;
  device?: string;

  expiresAt: Date;
};

export type RefreshToken = {
  sub: string;
  type: string;
  sid: string;
};
