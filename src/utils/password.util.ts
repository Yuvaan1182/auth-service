import { MIN_ENTROPY, MIN_LENGTH } from "#constants/app.constants.js";
import argon from "argon2";

export const hashString = async (input_string: string): Promise<string> => {
  return argon.hash(input_string, {
    type: argon.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
};

export const verifyString = async (
  hash: string,
  input_string: string,
): Promise<boolean> => {
  return argon.verify(hash, input_string);
};

export const isStrongPassword = (password: string): boolean => {
  const character_set = new Set(password);
  const character_set_size = character_set.size;

  const entropy = password.length * Math.log2(character_set_size);

  return (
    password.length >= MIN_LENGTH &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    entropy >= MIN_ENTROPY
  );
};
