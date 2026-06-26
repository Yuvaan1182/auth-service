import express from "express";
import cors from "cors";
import { addTraceId } from "#middlewares/app_middleware/trace.middleware.js";
import { errorHandler } from "#utils/error_handler.util.js";
import { createRoutes } from "#routes/index.js";
import { pinoHttp } from "pino-http";
import { logger } from "#config/logger.config.js";

export const createApp = () => {
  const routes = createRoutes();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(addTraceId);
  app.use(
    pinoHttp({
      logger,
    }),
  );

  app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
  });
  /** -------- debug route to check server started -------- */
  app.get("/", (req, res) => res.send("<h1>Hello world</h1>"));

  app.use("/api/v1", routes);

  app.use(errorHandler);

  return app;
};
