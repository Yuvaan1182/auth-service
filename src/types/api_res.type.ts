import { responseCode } from "#constants/response_codes.js";

export interface API_RES<T = unknown> {
  success: boolean;
  res_code: responseCode;
  message: string;
  data?: T;
  traceId?: string;
}
