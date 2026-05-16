export const responseCodes = {
  /** --- Success Codes --- */
  AUTH_SUCCESS_001: "User Registration Success: User registered successfully",
  AUTH_SUCCESS_002:
    "User Email Verified Sucess: User email verified successfully",

  /** --- Failure codes --- */
  AUTH_FAILURE_001: "User Registration failed: User already exists",
  AUTH_FAILURE_002: "User Registration failed: Email rejected by the server",
  AUTH_FAILURE_003:
    "User Registration failed: Zod Validation Error. Invalid Input.",
  AUTH_FAILURE_004:
    "User Registration failed: Something went wrong, Please try again later.",
  AUTH_FAILURE_005:
    "User Registration failed: Weak Password strength. Try with a strong password",

  /** ----- Redis Service Failure codes ----- */
  AUTH_FAILURE_006: "Redis Failure: Failure in storing keys in redis cache.",
  AUTH_FAILURE_007: "Redis Failure: Key not found in redis cache.",
  AUTH_FAILURE_011: "Redis Failure: Failed in deleting keys from redis cache",

  /** ------ Email Verification Failure codes ------ */
  AUTH_FAILURE_008:
    "Email Verificaiton failed: Token not exist. User email is not verified, Please try again later",
  AUTH_FAILURE_009:
    "Email Verificaiton failed: Fallback check, token not exist/expired in db. User email is not verified, Please try again later",
  AUTH_FAILURE_010:
    "Email Verificaiton failed: Invalid token or token expired. Please try again later.",

  /** ----- Resent Email Verification Failure codes ----- */
  AUTH_FAILURE_012:
    "Resent Verification failed: Incorrect Email. User does not exists",
  AUTH_FAILURE_013:
    "Resent Verification failed: Mail service is not working. Please try after some time.",
} as const;

export type responseCode = keyof typeof responseCodes;
