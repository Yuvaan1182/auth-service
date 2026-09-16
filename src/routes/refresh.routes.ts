import { Router } from "express";
import { serviceContainer } from "#container/service.container.js";
import { validate } from "#middlewares/zod_middleware/validate.zod.middleware.js";
import { refreshSchema } from "#schema/refresh.schema.js";
import { refreshController } from "#controllers/refresh.controller.js";

export const refreshRoutes = () => {
  const router = Router();

  const controller = refreshController(serviceContainer.refreshService);

  router.post("/", validate(refreshSchema), controller.refresh);

  return router;
};
