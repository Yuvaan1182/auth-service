import { loginController } from "#controllers/login.controller.js";
import { validate } from "#middlewares/zod_middleware/validate.zod.middleware.js";
import { loginSchema } from "#schema/login.schema.js";
import { createLoginService } from "#services/auth/login.factory.js";
import { Router } from "express";

export const loginRoutes = () => {
  const router = Router();

  const service = createLoginService();
  const controller = loginController(service);

  router.post("/", validate(loginSchema), controller.login);

  return router;
};
