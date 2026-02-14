import * as z from "zod";

export const loginSchema = z.object({
  userId: z.string().min(4, {
    message: "UserId must be at least 6 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});
