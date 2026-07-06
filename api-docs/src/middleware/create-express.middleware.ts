import { resolveRoute } from "../utils";
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
      /** ignore invalid 404 request to be stored */
      if (!req.route) {
        return;
      }

      const duration = Date.now() - startedAt;
      const route = resolveRoute(req);

      if (!route) {
        return;
      }

      await collector.collect({
        method: toHttpMethod(req.method),

        route: route,

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
