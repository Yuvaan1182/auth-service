import pino from "pino";
import { env } from "./env.config.js";

export const logger = pino({
  level: env.log_level || "info",

  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});
