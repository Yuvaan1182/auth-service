import { LoginService } from "#services/auth/login.service.js";
import { asyncHandler } from "#utils/async_handler.util.js";
import { sendResponse } from "#utils/response.util.js";
import { Request, Response } from "express";

export const loginController = (loginService: LoginService) => ({
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const tokens = await loginService.login(email, password);

    return sendResponse(true, res, 201, "AUTH_SUCCESS_001", {
      message: "User logged in successfully.",
      data: tokens,
    });
  }),
});
