import crypto from "crypto";

export const generateToken = (): string => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
