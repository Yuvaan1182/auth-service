import { sendResponse } from "#utils/response.util.js";
import { Request, Response, NextFunction } from "express";
import { z, ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        sendResponse(false, res, 409, "AUTH_FAILURE_003", {
          message: "Invalid Input",
          errors: err.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        });
        return;
      }
      next(err);
    }
  };
