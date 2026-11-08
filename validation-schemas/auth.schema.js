
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

// Register
export const registerSchema = z
  .object({
    username: z.string().min(2),
    email: z.string().email(),
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

// Login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Forgot password
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

// Reset password
export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
    new_password: passwordSchema,
    new_password_confirmation: z.string(),
  })
  .refine(
    (data) => data.new_password === data.new_password_confirmation,
    {
      message: "Passwords do not match",
      path: ["new_password_confirmation"],
    }
  );
