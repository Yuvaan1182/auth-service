import { EMAIL_TOKEN_EXPIRY_SECONDS } from "#constants/app.constants.js";
import { TokenPurpose } from "#prisma/index.js";
import { TokenRepo } from "#repo/token.repo.js";
import { UserRepo } from "#repo/user.repo.js";
import { RegisterDeps } from "#types/auth.type.js";
import { AppError } from "#utils/app_error.util.js";
import { hashString, isStrongPassword } from "#utils/password.util.js";
import { generateCacheKey } from "#utils/redis.util.js";
import { generateToken, hashToken } from "#utils/token_generator.util.js";

export class RegisterService {
  constructor(private deps: RegisterDeps) {}

  private async cacheKey(key: string, val: string, ttl: number): Promise<void> {
    try {
      await this.deps.redisService.setKeyWithTTL(key, val, ttl);
    } catch (error) {
      console.error("AUTH_REGISTER: Redis error:", error);
    }
  }

  async register(email: string, password: string, name: string) {
    /** -------- processing :: input data ---------- */
    email = email.toLowerCase();

    const client = await this.deps.db.getClient();
    const userRepo = this.deps.repos?.userRepo ?? new UserRepo(client);

    /** -------- check :: user already exists -------- */
    const existingUser = await userRepo.findUserByEmail(email);

    if (existingUser) {
      throw new AppError(
        "User already exist. Please login.",
        400,
        "AUTH_FAILURE_001",
      );
    }

    /** -------- check :: password is a strong password -------- */
    const passwordIsStrong = isStrongPassword(password);

    if (passwordIsStrong === false) {
      throw new AppError(
        "Password enter is weak. Please try again with strong password",
        400,
        "AUTH_FAILURE_005",
      );
    }

    /** -------- generate token & hash token -------- */
    const token = generateToken();
    const tokenHash = hashToken(token);

    /** -------- hash password -------- */
    const passwordHash = await hashString(password);

    /** -------- save :: user in db -------- */
    const user = await userRepo.createUser({
      email,
      password: passwordHash,
      name,
    });

    /** -------- save :: token in cache -------- */
    const key = generateCacheKey("user:auth_token:", user.id);
    void this.cacheKey(key, tokenHash, 300);

    /** -------- queue :: verfication email -------- */
    void this.deps.emailService
      .queueVerificationMail(email, token)
      .catch((err) =>
        console.error("AUTH_REGISTER: Error sending verification email:", err),
      );

    return user;
  }

  async verifyEmail(userId: string, providedToken: string): Promise<boolean> {
    /** -------- pre-process :: data -------- */
    const tokenHash = hashToken(providedToken);

    /** -------- check :: token exist in cache -------- */
    const cachedTokenKey = generateCacheKey("user:auth_token:", userId);
    const cachedTokenHash =
      await this.deps.redisService.getValWithKey(cachedTokenKey);

    /** -------- delete :: token from cache -------- */
    if (cachedTokenHash) {
      await this.deps.redisService.delKey(cachedTokenKey);
      return cachedTokenHash === tokenHash;
    }

    return false;
  }

  async resendVerification(email: string) {
    /** -------- initialize :: variables -------- */
    const client = await this.deps.db.getClient();
    const userRepo = this.deps.repos?.userRepo ?? new UserRepo(client);

    /** -------- get :: user from db -------- */
    const user = await userRepo.findUserByEmail(email);

    /** -------- check :: if user exists -------- */
    if (!user) {
      throw new AppError("User not exist.", 400, "AUTH_FAILURE_012");
    }

    /** -------- delete :: existing token in cache -------- */
    const cachedTokenKey = generateCacheKey("user:auth_token", user.id);
    const cachedToken =
      await this.deps.redisService.getValWithKey(cachedTokenKey);

    if (cachedToken) {
      this.deps.redisService.delKey(cachedTokenKey);
    }

    /** -------- generate & hash token -------- */
    const token = generateToken();
    const tokenHash = hashToken(token);

    /** -------- save :: token in cache -------- */
    const key = generateCacheKey("user:auth_token:", user.id);
    void this.cacheKey(key, tokenHash, 300);

    /** -------- queue :: verfication email -------- */
    void this.deps.emailService
      .queueVerificationMail(email, token)
      .catch((err) =>
        console.error("AUTH_REGISTER: Error sending verification email:", err),
      );

    return true;
  }
}
