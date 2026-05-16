import { validate } from "#middlewares/zod_middleware/validate.zod.middleware.js";
import { loginSchema } from "#schema/login.schema.js";
import { Router } from "express";

export const loginRoutes = () => {
  const router = Router();

  router.post("/", validate(loginSchema));

  return router;
};
