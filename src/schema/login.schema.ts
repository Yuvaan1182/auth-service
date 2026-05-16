import z from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters." })
      .max(30, { message: "Password cannot exceed 30 characters." }),
  }),
});
