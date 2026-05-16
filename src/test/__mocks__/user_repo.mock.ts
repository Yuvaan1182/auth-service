import { vi } from "vitest";

export const mockUserRepo = {
  findUserByEmail: vi.fn(),
  createUser: vi.fn(),
};

vi.mock("#repo/user.repo.js", () => {
  return {
    UserRepo: vi.fn().mockImplementation(() => ({
      createUser: mockUserRepo.createUser,
      findUserByEmail: mockUserRepo.findUserByEmail,
    })),
  };
});
