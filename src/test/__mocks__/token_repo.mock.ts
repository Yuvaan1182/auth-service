import { vi } from "vitest";

export const mockTokenRepo = {
  createToken: vi.fn(),
  findTokenByUserIdAndPurpose: vi.fn(),
};

vi.mock("#repo/token.repo.js", () => {
  return {
    TokenRepo: class {
      createToken = mockTokenRepo.createToken;
    },
  };
});
