import { LoginServiceDeps } from "#types/auth.type.js";
import { PostgreDB } from "../../db/postgre.db.js";
import { LoginService } from "./login.service.js";
import { TokenService } from "./token.service.js";

export const createLoginService = (deps?: LoginServiceDeps) => {
  const db = deps?.db ?? new PostgreDB();
  const tokenService =
    deps?.tokenService ??
    new TokenService({
      db,
      repos: {
        sessionRepo: deps?.repos?.sessionRepo,
      },
    });

  return new LoginService({
    db,
    tokenService,
    repos: {
      userRepo: deps?.repos?.userRepo,
    },
  });
};
