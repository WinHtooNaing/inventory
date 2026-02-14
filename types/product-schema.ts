import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Product name too short"),

  categoryId: z.string().min(1, "Please select category"),

  purchasePrice: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive(),

  totalStock: z.coerce.number().int().nonnegative(),
});
