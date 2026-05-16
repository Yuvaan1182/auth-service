import { connectRedis, RedisClient } from "#config/redis.config.js";
import { AppError } from "#utils/app_error.util.js";
import { RedisServiceInterface } from "#interface/redis.service.interface.js";

export class RedisService implements RedisServiceInterface {
  private redis!: RedisClient;

  async connect(): Promise<void> {
    if (!this.redis) {
      this.redis = await connectRedis();
    }
  }

  async setKeyWithTTL(
    key: string,
    val: string,
    ttl: number, // in SECS
  ): Promise<boolean> {
    try {
      const isSet = await this.redis.set(key, val, { EX: ttl });
      if (isSet !== "OK") {
        throw new AppError(
          "Redis failure, unable to set keys.",
          400,
          "AUTH_FAILURE_006",
        );
      }
      return true;
    } catch (error) {
      console.error(
        `Redis Service - setKeyWithTTL - failed: Error setting key: ${key} in Redis:`,
        { key, error },
      );
      throw error;
    }
  }

  async getValWithKey(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error(
        "Redis service - getValWithKey - failed: failure in reading keys from redis.",
        key,
      );
      throw new AppError("Redis read failed", 500, "AUTH_FAILURE_007");
    }
  }

  async delKey(key: string): Promise<boolean> {
    try {
      const deleted = await this.redis.del(key);
      return deleted > 0;
    } catch (error) {
      console.error(
        "Redis service - delKey - failed: failure in deleting keys from redis.",
        key,
      );
      throw new AppError("Redis read failed", 500, "AUTH_FAILURE_011");
    }
  }
}
