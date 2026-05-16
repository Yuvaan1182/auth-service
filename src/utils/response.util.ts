import { responseCode, responseCodes } from "#constants/response_codes.js";
import { API_RES } from "#types/api_res.type.js";
import { Response } from "express";

export const sendResponse = <T>(
  success: boolean,
  res: Response,
  status: number,
  res_code: responseCode,
  data?: T,
) => {
  const response: API_RES<T> = {
    success,
    res_code,
    message: responseCodes[res_code],
    data: data,
  };
  return res.status(status).json(response);
};
