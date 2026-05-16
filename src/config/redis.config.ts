import { createClient } from "redis";
import { env } from "./env.config.js";

export const redisClient = createClient({
  url: `redis://${env.cache_host}:${env.cache_port}`,
  password: env.cache_password,
});

redisClient.on("error", (err) => {
  console.error("AUTH_REDIS_Client_ERROR:", err);
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
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
