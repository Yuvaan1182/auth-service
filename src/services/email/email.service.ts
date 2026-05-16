import { RedisServiceInterface } from "#interface/redis.service.interface.js";
import { emailQueue } from "#queue/email.queue.js";
import { EmailServiceDeps } from "#types/auth.type.js";
import { PostgreDB } from "../../db/postgre.db.js";

export class EmailService {
  private redisService: RedisServiceInterface;
  private db: PostgreDB;

  constructor(deps: EmailServiceDeps) {
    this.redisService = deps.redisService;
    this.db = deps.db;
  }

  async queueVerificationMail(email: string, token: string) {
    await emailQueue.add(
      "send_verification_email",
      { email, token },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnFail: 100,
        removeOnComplete: true,
      },
    );
  }
}
