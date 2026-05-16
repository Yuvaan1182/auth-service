import { vi } from "vitest";

export const mock_password_util = {
  hashString: vi.fn(),
  isStrongPassword: vi.fn(),
};

vi.mock("#utils/password.util.js", () => mock_password_util);
