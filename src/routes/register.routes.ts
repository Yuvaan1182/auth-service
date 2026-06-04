import { registerController } from "#controllers/register.controller.js";
import { validate } from "#middlewares/zod_middleware/validate.zod.middleware.js";
import { resentMailSchema, verifyEmailSchema } from "#schema/email.schema.js";
import { registerSchema } from "#schema/register.schema.js";
import { createRegisterService } from "#services/auth/register.factory.js";
import { Router } from "express";

export const registerRoutes = () => {
  const router = Router();

  const service = createRegisterService();
  const controller = registerController(service);

  /** --- register user --- */
  router.post("/", validate(registerSchema), controller.register);

  /** --- verify email --- */
  router.post(
    "/verify-email",
    validate(verifyEmailSchema),
    controller.verifyEmail,
  );

  /**
   * @TODO: set limit to resend verification email in time window per user
   * */
  /** --- resent verification mail --- */
  router.post(
    "/resend-verification",
    validate(resentMailSchema),
    controller.resendVerification,
  );

  return router;
};
