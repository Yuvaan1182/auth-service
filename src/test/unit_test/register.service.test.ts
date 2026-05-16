// register.service.spec.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppError } from "#utils/app_error.util.js";

// ---- mocks ----
vi.mock("#constants/app.constants.js", () => ({
  EMAIL_TOKEN_EXPIRY_SECONDS: 300,
}));

vi.mock("#utils/password.util.js", () => ({
  hashString: vi.fn(),
  isStrongPassword: vi.fn(),
}));

vi.mock("#utils/token_generator.util.js", () => ({
  generateToken: vi.fn(),
  hashToken: vi.fn(),
}));

vi.mock("#utils/redis.util.js", () => ({
  generateCacheKey: vi.fn(),
}));

import { hashString, isStrongPassword } from "#utils/password.util.js";

import { generateToken, hashToken } from "#utils/token_generator.util.js";

import { generateCacheKey } from "#utils/redis.util.js";
import { RegisterService } from "#services/auth/register.service.js";

describe("RegisterService 🧪", () => {
  let service: RegisterService;

  let mockDeps: any;
  let mockUserRepo: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUserRepo = {
      findUserByEmail: vi.fn(),
      createUser: vi.fn(),
    };

    mockDeps = {
      db: {
        getClient: vi.fn().mockResolvedValue({}),
      },

      repos: {
        userRepo: mockUserRepo,
      },

      redisService: {
        setKeyWithTTL: vi.fn(),
        getValWithKey: vi.fn(),
        delKey: vi.fn(),
      },

      emailService: {
        queueVerificationMail: vi.fn().mockResolvedValue(undefined),
      },
    };

    service = new RegisterService(mockDeps);
  });

  describe("register()", () => {
    it("should register a new user successfully", async () => {
      mockUserRepo.findUserByEmail.mockResolvedValue(null);

      (isStrongPassword as any).mockReturnValue(true);

      (generateToken as any).mockReturnValue("plain-token");

      (hashToken as any).mockReturnValue("hashed-token");

      (hashString as any).mockResolvedValue("hashed-password");

      mockUserRepo.createUser.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
      });

      (generateCacheKey as any).mockReturnValue("user:auth_token:user-1");

      const result = await service.register(
        "TEST@example.com",
        "StrongPassword123!",
        "John",
      );

      expect(mockUserRepo.findUserByEmail).toHaveBeenCalledWith(
        "test@example.com",
      );

      expect(isStrongPassword).toHaveBeenCalledWith("StrongPassword123!");

      expect(hashString).toHaveBeenCalledWith("StrongPassword123!");

      expect(mockUserRepo.createUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "hashed-password",
        name: "John",
      });

      expect(mockDeps.redisService.setKeyWithTTL).toHaveBeenCalledWith(
        "user:auth_token:user-1",
        "hashed-token",
        300,
      );

      expect(mockDeps.emailService.queueVerificationMail).toHaveBeenCalledWith(
        "test@example.com",
        "plain-token",
      );

      expect(result).toEqual({
        id: "user-1",
        email: "test@example.com",
      });
    });

    it("should throw if user already exists", async () => {
      mockUserRepo.findUserByEmail.mockResolvedValue({
        id: "existing-user",
      });

      await expect(
        service.register("test@example.com", "Password123!", "John"),
      ).rejects.toBeInstanceOf(AppError);

      expect(mockUserRepo.createUser).not.toHaveBeenCalled();
    });

    it("should throw if password is weak", async () => {
      mockUserRepo.findUserByEmail.mockResolvedValue(null);

      (isStrongPassword as any).mockReturnValue(false);

      await expect(
        service.register("test@example.com", "123", "John"),
      ).rejects.toBeInstanceOf(AppError);

      expect(mockUserRepo.createUser).not.toHaveBeenCalled();
    });

    it("should continue even if redis caching fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockUserRepo.findUserByEmail.mockResolvedValue(null);

      (isStrongPassword as any).mockReturnValue(true);

      (generateToken as any).mockReturnValue("plain-token");

      (hashToken as any).mockReturnValue("hashed-token");

      (hashString as any).mockResolvedValue("hashed-password");

      mockUserRepo.createUser.mockResolvedValue({
        id: "user-1",
      });

      (generateCacheKey as any).mockReturnValue("user:auth_token:user-1");

      mockDeps.redisService.setKeyWithTTL.mockRejectedValue(
        new Error("Redis exploded 💥"),
      );

      const result = await service.register(
        "test@example.com",
        "StrongPassword123!",
        "John",
      );

      expect(result).toEqual({
        id: "user-1",
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("verifyEmail()", () => {
    it("should verify token successfully", async () => {
      (hashToken as any).mockReturnValue("hashed-token");

      (generateCacheKey as any).mockReturnValue("user:auth_token:user-1");

      mockDeps.redisService.getValWithKey.mockResolvedValue("hashed-token");

      const result = await service.verifyEmail("user-1", "plain-token");

      expect(mockDeps.redisService.delKey).toHaveBeenCalledWith(
        "user:auth_token:user-1",
      );

      expect(result).toBe(true);
    });

    it("should return false for invalid token", async () => {
      (hashToken as any).mockReturnValue("wrong-token");

      (generateCacheKey as any).mockReturnValue("user:auth_token:user-1");

      mockDeps.redisService.getValWithKey.mockResolvedValue("hashed-token");

      const result = await service.verifyEmail("user-1", "plain-token");

      expect(result).toBe(false);
    });

    it("should return false if token not found in cache", async () => {
      (hashToken as any).mockReturnValue("hashed-token");

      (generateCacheKey as any).mockReturnValue("user:auth_token:user-1");

      mockDeps.redisService.getValWithKey.mockResolvedValue(null);

      const result = await service.verifyEmail("user-1", "plain-token");

      expect(result).toBe(false);

      expect(mockDeps.redisService.delKey).not.toHaveBeenCalled();
    });
  });

  describe("resendVerification()", () => {
    it("should throw if user does not exist", async () => {
      mockUserRepo.findUserByEmail.mockResolvedValue(null);

      await expect(
        service.resendVerification("missing@example.com"),
      ).rejects.toBeInstanceOf(AppError);
    });

    it("should delete existing cached token before generating a new one", async () => {
      mockUserRepo.findUserByEmail.mockResolvedValue({
        id: "user-1",
      });

      // old token exists
      mockDeps.redisService.getValWithKey.mockResolvedValue("old-token");

      (generateToken as any).mockReturnValue("new-token");

      (hashToken as any).mockReturnValue("hashed-new-token");

      (generateCacheKey as any)
        .mockReturnValueOnce("user:auth_tokenuser-1") // old cache lookup
        .mockReturnValueOnce("user:auth_token:user-1"); // new cache save

      const result = await service.resendVerification("test@example.com");

      expect(mockDeps.redisService.delKey).toHaveBeenCalledWith(
        "user:auth_tokenuser-1",
      );

      expect(mockDeps.redisService.setKeyWithTTL).toHaveBeenCalledWith(
        "user:auth_token:user-1",
        "hashed-new-token",
        300,
      );

      expect(mockDeps.emailService.queueVerificationMail).toHaveBeenCalledWith(
        "test@example.com",
        "new-token",
      );

      expect(result).toBe(true);
    });

    it("should generate and send new token if cache is empty", async () => {
      mockUserRepo.findUserByEmail.mockResolvedValue({
        id: "user-1",
      });

      mockDeps.redisService.getValWithKey.mockResolvedValue(null);

      (generateToken as any).mockReturnValue("new-token");

      (hashToken as any).mockReturnValue("hashed-new-token");

      (generateCacheKey as any)
        .mockReturnValueOnce("user:auth_tokenuser-1")
        .mockReturnValueOnce("user:auth_token:user-1");

      const result = await service.resendVerification("test@example.com");

      expect(mockDeps.redisService.delKey).not.toHaveBeenCalled();

      expect(mockDeps.redisService.setKeyWithTTL).toHaveBeenCalledWith(
        "user:auth_token:user-1",
        "hashed-new-token",
        300,
      );

      expect(mockDeps.emailService.queueVerificationMail).toHaveBeenCalledWith(
        "test@example.com",
        "new-token",
      );

      expect(result).toBe(true);
    });
  });
});
