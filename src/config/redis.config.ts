import { createClient } from "redis";
import { env } from "./env.config.js";

let redisClient: ReturnType<typeof createClient> | null = null;

export const connectRedis = async () => {
  try {
    if (!redisClient) {
      console.log("connectRedis: creating redis client...");
      redisClient = createClient({
        url: `redis://${env.cache_host}:${env.cache_port}`,
        password: env.cache_password,
      });

      redisClient.on("error", (err) => {
        console.error("AUTH_REDIS_Client_ERROR:", err);
      });
    }

    if (!redisClient.isOpen) {
      console.log(
        `connectRedis: connecting to redis ${env.cache_host}:${env.cache_port}`,
      );
      await redisClient.connect();
      console.log(
        `🚀 Auth_CACHE: redis service running on port: ${env.cache_port}`,
      );
    }

    return redisClient;
  } catch (error) {
    console.error("REDIS_ERROR: ", error);
    throw error;
  }
};

export type RedisClient = Awaited<ReturnType<typeof connectRedis>>;
