import { mockRedisService } from "../__mocks__/redis_service.mock.js";
``;
import { mockUserRepo } from "../__mocks__/user_repo.mock.js";
import { mockTokenRepo } from "../__mocks__/token_repo.mock.js";
import { mockPrisma } from "../__mocks__/prisma.mock.js";
import { mockTokenGenerator } from "../__mocks__/token_genertor.mock.js";
import { mockEmailQueue } from "../__mocks__/email_queue.mock.js";

import request from "supertest";
import { randomUUID } from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TokenPurpose } from "#prisma/index.js";
import { createApp } from "../../app.js";

const URL = "/api/v1/auth/register";

describe(`register api POST ${URL}`, () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (cb) => cb({}));
  });

  const trace_id = randomUUID();
  const app = createApp();

  it("should return validation error WHEN payload is empty", async () => {
    const payload = {};
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe(
      "User Registration failed: Zod Validation Error. Invalid Input.",
    );
  });

  it("should return validation error WHEN email & password is not present", async () => {
    const payload = {
      name: "test person",
    };
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe(
      "User Registration failed: Zod Validation Error. Invalid Input.",
    );
  });

  it("should return validation error WHEN password is not present", async () => {
    const payload = {
      name: "test person",
      email: "test@mail.com",
    };
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe(
      "User Registration failed: Zod Validation Error. Invalid Input.",
    );
  });

  it("should return validation error WHEN password length is less then 8", async () => {
    const payload = {
      name: "test person",
      email: "test@mail.com",
      password: "123456",
    };
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe(
      "User Registration failed: Zod Validation Error. Invalid Input.",
    );
  });

  it("should return validation error WHEN email format wrong", async () => {
    const payload = {
      name: "test person",
      email: "test@mail.com",
      password: "123456",
    };
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe(
      "User Registration failed: Zod Validation Error. Invalid Input.",
    );
  });

  it("should return validation error WHEN email format wrong", async () => {
    const payload = {
      name: "test person",
      email: "invalid email",
      password: "123456",
    };
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe(
      "User Registration failed: Zod Validation Error. Invalid Input.",
    );
  });

  it("should return user already exist WHEN when user email present in db", async () => {
    const payload = {
      name: "test person",
      email: `test-${Date.now()}@mail.com`,
      password: "Abc@1234callthehelplinefa",
    };

    /** --- mocking db --- */
    mockUserRepo.findUserByEmail.mockResolvedValue({ id: "user-id" });

    /** --- make api call with mock data --- */
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    /** --- check result --- */
    expect(mockUserRepo.findUserByEmail).toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: "User Registration failed: User already exists",
      res_code: "AUTH_FAILURE_001",
      data: { message: "User already exist. Please login." },
    });
  });

  it("should return validation error WHEN name is not present", async () => {
    const payload = {
      name: "test person",
      email: `test-${Date.now()}@mail.com`,
    };

    /** --- make api req --- */
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    /** --- check result --- */
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "User Registration failed: Zod Validation Error. Invalid Input.",
    );
    expect(res.body.res_code).toBe("AUTH_FAILURE_003");
  });

  it("should return user WHEN when user data is correct", async () => {
    const payload = {
      name: "test person",
      email: `test-${Date.now()}@mail.com`,
      password: "P@ssw0rd!Secure2026",
    };

    /** --- mocking db | utility | services --- */
    mockUserRepo.findUserByEmail.mockResolvedValue(null);
    mockTokenGenerator.generateToken.mockReturnValue("token");
    mockTokenGenerator.hashToken.mockReturnValue("token-hash");
    mockTokenRepo.createToken.mockResolvedValue({});
    mockUserRepo.createUser.mockResolvedValue({
      id: "user-id",
    });
    mockRedisService.setKeyWithTTL.mockResolvedValue(true);
    mockRedisService.delKey.mockResolvedValue(true);
    mockEmailQueue.emailQueue.add.mockRejectedValue({});

    /** --- make api req --- */
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    /** --- check result --- */
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(mockTokenRepo.createToken).toHaveBeenCalled();
    expect(mockTokenRepo.createToken).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenHash: "token-hash",
        purpose: TokenPurpose.EMAIL_VERIFICATION,
        userId: "user-id",
      }),
      expect.anything(),
    );

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe(
      "Verification email sent. Please verify your email.",
    );
    expect(res.body.message).toBe(
      "User Registration Success: User registered successfully",
    );
    expect(res.body.res_code).toBe("AUTH_SUCCESS_001");
  });

  it("should return user already exist WHEN email is duplicate (case-insensitive)", async () => {
    const payload = {
      name: "test person",
      email: "Test@mail.com",
      password: "Abc@1234",
    };

    /** --- mocking db | utility | services --- */
    mockUserRepo.findUserByEmail.mockResolvedValue({ id: "user-id" });

    /** --- make api req --- */
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    /** --- check result --- */
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "User Registration failed: User already exists",
    );
    expect(res.body.res_code).toBe("AUTH_FAILURE_001");
  });

  it("should return error WHEN db transaction failed", async () => {
    const payload = {
      name: "test person",
      email: "test@mail.com",
      password: "P@ssw0rd!Secure2026#Extra",
    };

    /** --- mocking db | utility | services --- */
    mockUserRepo.findUserByEmail.mockResolvedValue(null);
    mockPrisma.$transaction.mockRejectedValue(new Error("Transaction Failed"));

    /** --- make api req --- */
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    /** --- check result --- */
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "User Registration failed: Something went wrong, Please try again later.",
    );
    expect(res.body.res_code).toBe("AUTH_FAILURE_004");
  });

  it("should not return error WHEN email queue fails", async () => {
    const payload = {
      name: "test person",
      email: "test@mail.com",
      password: "P@ssw0rd!Secure2026#Extra",
    };

    /** --- mocking db | utility | services --- */
    mockUserRepo.findUserByEmail.mockResolvedValue(null);
    mockTokenGenerator.generateToken.mockReturnValue("token");
    mockTokenGenerator.hashToken.mockReturnValue("token-hash");
    mockTokenRepo.createToken.mockResolvedValue({});
    mockUserRepo.createUser.mockResolvedValue({ id: "user-id" });
    mockEmailQueue.emailQueue.add.mockRejectedValue({});
    mockRedisService.setKeyWithTTL.mockResolvedValue(true);

    /** --- make api req --- */
    const res = await request(app)
      .post(URL)
      .set("x-trace-id", trace_id)
      .send(payload);

    /** --- check result --- */
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(
      "User Registration Success: User registered successfully",
    );
    expect(res.body.res_code).toBe("AUTH_SUCCESS_001");
  });
});

// describe("Create User", () => {
//   it("should create a user when payload is correct", () => {});
// });
