import { loginController } from "#controllers/login.controller.js";
import { validate } from "#middlewares/zod_middleware/validate.zod.middleware.js";
import { loginSchema } from "#schema/login.schema.js";
import { Router } from "express";
import { serviceContainer } from "#container/service.container.js";

export const loginRoutes = () => {
  const router = Router();

  const controller = loginController(serviceContainer.loginService);

  router.post("/", validate(loginSchema), controller.login);

  return router;
};
