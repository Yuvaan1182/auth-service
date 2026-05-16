import { registerController } from "#controllers/register.controller.js";
import { createRateLimit } from "#middlewares/app_middleware/rate_limiter.middleware.js";
import { validate } from "#middlewares/zod_middleware/validate.zod.middleware.js";
import { registerSchema, verifyEmailSchema } from "#schema/auth.schema.js";
import { createRegisterService } from "#services/auth/register.factory.js";
import { Router } from "express";

export const registerRoutes = () => {
  const router = Router();

  const registerService = createRegisterService();
  const controller = registerController(registerService);

  /** --- register user --- */
  router.post("/", validate(registerSchema), controller.register);

  /** --- verify email --- */
  router.post(
    "/verify-email",
    validate(verifyEmailSchema),
    controller.verifyEmail,
  );

  const setRateLimit = createRateLimit(2);
  /** --- resent verification mail --- */
  router.post("/resend-verification", controller.resendVerification);

  return router;
};
