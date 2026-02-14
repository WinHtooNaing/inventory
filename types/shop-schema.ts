import { z } from "zod";

export const shopSchema = z.object({
  name: z.string().min(3, "Shop name too short"),
  userId: z.string().min(4, "UserId must be at least 4 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
