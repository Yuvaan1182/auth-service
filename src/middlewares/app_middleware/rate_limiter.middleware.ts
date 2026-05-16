import rateLimit from "express-rate-limit";

export const createRateLimit = (
  limit: number = 100,
  window: number = 20 * 60 * 1000,
) =>
  rateLimit({
    windowMs: window,
    max: limit,
    message: `Too many requests, please try again later.`,
    statusCode: 429,
  });

export const setRateLimit = createRateLimit();
