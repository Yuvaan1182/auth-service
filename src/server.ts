import { createApp } from "./app.js";
import { env } from "#config/env.config.js";
import { ServerOptions } from "#types/server.type.js";
import { RedisService } from "#redis/redis.service.js";
import { PostgreDB } from "#db/postgre.db.js";

export const startServer = async (
  options: ServerOptions = {},
): Promise<void> => {
  /** deps initialization */
  const redis = options.redis ?? new RedisService();
  const port = options.port ?? env.port;
  const db = options.db ?? new PostgreDB();

  /** --- create app --- */
  const app = options.createApp ?? createApp();

  /** --- create connections --- */
  await db.connect();
  await redis.connect();

  /** --- start server --- */
  app.listen(port, () => {
    console.info(`🚀 Auth_APP: running on port: ${port}`);
  });
};
