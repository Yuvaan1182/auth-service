import z from "zod";

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().min(1, { message: "Token is required." }),
  }),
  body: z.object({
    userId: z.string().min(1, { message: "User id is required" }),
  }),
});

export const resentMailSchema = z.object({
  body: z.object({
    email: z.email({ message: "Invalid email address" }),
  }),
});
