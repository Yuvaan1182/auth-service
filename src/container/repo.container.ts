import { SessionRepo } from "#repo/session.repo.js";
import { TokenRepo } from "#repo/token.repo.js";
import { UserRepo } from "#repo/user.repo.js";
import { appContainer } from "./app.container.js";

export class RepositoryContainer {
  private _userRepo?: UserRepo;
  private _tokenRepo?: TokenRepo;
  private _sessionRepo?: SessionRepo;

  async init() {
    console.log(
      "RepositoryContainer.init: creating repositories from db client...",
    );
    const client = appContainer.db.getClient();

    this._userRepo = new UserRepo(client);
    this._tokenRepo = new TokenRepo(client);
    this._sessionRepo = new SessionRepo(client);
    console.log("RepositoryContainer.init: repositories created");
  }

  get userRepo() {
    if (!this._userRepo) {
      throw new Error("RepositoryContainer not initialized");
    }

    return this._userRepo;
  }

  get tokenRepo() {
    if (!this._tokenRepo) {
      throw new Error("RepositoryContainer not initialized");
    }

    return this._tokenRepo;
  }

  get sessionRepo() {
    if (!this._sessionRepo) {
      throw new Error("RepositoryContainer not initialized");
    }

    return this._sessionRepo;
  }
}

export const repoContainer = new RepositoryContainer();
