import { PostgreDB } from "#db/postgre.db.js";
import { RedisService } from "#redis/redis.service.js";
import { EmailService } from "#services/email/email.service.js";

export class AppContainer {
  public readonly db: PostgreDB;
  public readonly redis: RedisService;
  public readonly email: EmailService;

  constructor() {
    this.db = new PostgreDB();
    this.redis = new RedisService();

    this.email = new EmailService({
      db: this.db,
      redisService: this.redis,
    });

    console.log(
      "AppContainer constructed: db and redis instances created (not connected)",
    );
  }

  async init() {
    console.log("AppContainer.init: connecting db and redis...");
    await this.db.connect();
    await this.redis.connect();
    console.log("AppContainer.init: db and redis connected");
  }
}

export const appContainer = new AppContainer();
