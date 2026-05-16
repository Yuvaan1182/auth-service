import { vi } from "vitest";

export const mockTokenGenerator = {
  generateToken: vi.fn(),
  hashToken: vi.fn(),
};

vi.mock("#utils/token_generator.util.js", () => mockTokenGenerator);
