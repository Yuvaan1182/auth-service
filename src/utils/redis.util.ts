import { APP_PREFIX } from "#constants/app.constants.js";

export const generateCacheKey = (
  key: string,
  unique_identifier: string,
): string => {
  return `${APP_PREFIX}:${key}:${unique_identifier}:`;
};
