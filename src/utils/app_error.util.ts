import { responseCode } from "#constants/response_codes.js";

export class AppError extends Error {
  status: number;
  isOperational: boolean;
  res_code: responseCode;

  constructor(message: string, status: number, res_code: responseCode) {
    super(message);
    this.status = status;
    this.res_code = res_code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
