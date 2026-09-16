import { RefreshService } from "#services/auth/refresh.service.js";
import { asyncHandler } from "#utils/async_handler.util.js";
import { sendResponse } from "#utils/response.util.js";
import { Request, Response } from "express";

export const refreshController = (refreshService: RefreshService) => ({
  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    const tokens = await refreshService.refresh(token);

    return sendResponse(true, res, 200, "AUTH_SUCCESS_005", {
      message: "Tokens rotated successfully",
      data: tokens,
    });
  }),
});
