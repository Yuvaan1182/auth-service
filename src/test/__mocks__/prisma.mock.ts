import { vi } from "vitest";

export const mockPrisma = {
  $transaction: vi.fn(),
};

vi.mock("#config/prisma.config.js", () => ({ prisma: mockPrisma }));
