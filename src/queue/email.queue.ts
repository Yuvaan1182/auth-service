import { env } from "#config/env.config.js";
import { Queue } from "bullmq";

export const emailQueue = new Queue("emailQueue", {
  connection: {
    host: env.cache_host,
    port: env.cache_port,
    password: env.cache_password,
  },
});
