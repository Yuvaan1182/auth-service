import { captureResponse } from "./capture-response.middleware";
import type { NextFunction, Request, Response, RequestHandler } from "express";

import type { Collector } from "../collector";
import { normalizeHeaders } from "../utils/normalize-headers.utils";
import { toHttpMethod } from "../utils/http-method.utils";

export function createExpressMiddleware(collector: Collector): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();

    const responseCapture = captureResponse(res);

    res.on("finish", async () => {
      const duration = Date.now() - startedAt;

      await collector.collect({
        method: toHttpMethod(req.method),

        route: req.baseUrl + (req.route?.path ?? req.path),

        path: req.originalUrl,

        request: {
          headers: req.headers,
          params: req.params,
          query: req.query,
          body: req.body,
        },

        response: {
          status: res.statusCode,
          headers: normalizeHeaders(res.getHeaders()),
          body: responseCapture.getBody(),
        },

        duration,
      });
    });

    next();
  };
}
