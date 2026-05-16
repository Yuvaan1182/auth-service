import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

export const addTraceId = (
  req: Request & { trace_id?: string },
  res: Response,
  next: NextFunction,
) => {
  const trace_id =
    typeof req.headers["x-trace-id"] === "string"
      ? req.headers["x-trace-id"]
      : randomUUID();
  req.trace_id = trace_id;
  res.set("x-trace-id", trace_id);
  next();
};
