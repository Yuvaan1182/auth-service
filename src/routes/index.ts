import { Router } from "express";
import { setRateLimit } from "#middlewares/app_middleware/rate_limiter.middleware.js";
import { createAuthRoutes } from "./auth.routes.js";

export const createRoutes = () => {
  const authRoutes = createAuthRoutes();

  const router = Router();
  router.use(setRateLimit);
  router.use("/auth/v1/", authRoutes);

  return router;
};
