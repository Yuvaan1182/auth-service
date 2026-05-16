import { RedisServiceInterface } from "#interface/redis.service.interface.js";
import { Mocked, vi } from "vitest";

export const mockRedisService: Mocked<RedisServiceInterface> = {
  connect: vi.fn(),
  setKeyWithTTL: vi.fn(),
  getValWithKey: vi.fn(),
  delKey: vi.fn(),
};
