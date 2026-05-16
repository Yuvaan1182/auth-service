import { TokenRepo } from "#repo/token.repo.js";
import { UserRepo } from "#repo/user.repo.js";

export type RegisterRepos = {
  userRepo?: UserRepo;
  tokenRepo?: TokenRepo;
};
