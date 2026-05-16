import { asyncHandler } from "#utils/async_handler.util.js";
import { Request, Response } from "express";
import { sendResponse } from "#utils/response.util.js";
import { VerifyEmailInput } from "#types/auth.type.js";
import { AppError } from "#utils/app_error.util.js";
import { RegisterService } from "#services/auth/register.service.js";

export const registerController = (registerService: RegisterService) => ({
  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    const user = await registerService.register(email, password, name);

    return sendResponse(true, res, 201, "AUTH_SUCCESS_001", {
      message: "Verification email sent. Please verify your email.",
      user: {
        id: user.id,
        createdAt: user.createdAt,
        email: user.email,
        isActive: user.isActive,
        name: user.name,
        verified: user.verified,
      },
    });
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query as VerifyEmailInput["query"];
    const { userId } = req.body as VerifyEmailInput["body"];

    const isVerified = await registerService.verifyEmail(userId, token);

    if (!isVerified) {
      throw new AppError(
        "Invalid Token or Token Expired. Please try again.",
        400,
        "AUTH_FAILURE_010",
      );
    }

    return sendResponse(true, res, 200, "AUTH_SUCCESS_002");
  }),

  resendVerification: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const isResendMailSent = await registerService.resendVerification(email);

    if (!isResendMailSent) {
      throw new AppError(
        "Verification mail cannot be sent. Please try after some time",
        400,
        "AUTH_FAILURE_013",
      );
    }
  }),
});
