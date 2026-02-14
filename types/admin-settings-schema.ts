import { z } from "zod";

export const adminProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  userId: z.string().min(3, "User ID must be at least 3 characters"),
});

export const adminPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
