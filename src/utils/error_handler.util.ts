import { AppError } from "#utils/app_error.util.js";
import { sendResponse } from "#utils/response.util.js";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return sendResponse(false, res, err.status, err.res_code, {
      message: err.message,
    });
  }

  console.error(`Logged INTERNAL error`, err);
  return sendResponse(false, res, 500, "AUTH_FAILURE_004");
};
