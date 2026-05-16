import { Router } from "express";
import { registerRoutes } from "./register.routes.js";
import { loginRoutes } from "./login.routes.js";

export const createAuthRoutes = () => {
  const router = Router();

  router.use("/register", registerRoutes);
  router.use("/login", loginRoutes);

  return router;
};
