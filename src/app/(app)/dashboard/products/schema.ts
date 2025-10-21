import z from "zod";

// Zod Schema
export const productSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .optional()
    .refine((val) => !val || !/\s/.test(val), "Slug must not contain spaces"),
  featured: z.boolean().optional(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce.number().optional(),
  sku: z.string().min(1, "SKU is required"),
  productImages: z
    .array(
      z.object({
        url: z.string().min(1, "Image URL is required"),
        alt: z.string().optional(),
      })
    )
    .optional(),
  stockQuantity: z.coerce
    .number()
    .min(0, "Stock quantity must be 0 or more")
    .optional(),
  inStock: z.boolean().optional(),
  active: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  collections: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  colors: z
    .array(
      z.object({
        name: z.string().min(1, "Color name is required"),
        hexColor: z.string().min(1, "Color hex is required"),
      })
    )
    .optional(),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
      })
    )
    .optional(),
  features: z
    .array(
      z.object({
        description: z.string().min(1, "Feature description is required"),
      })
    )
    .optional(),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Specification key is required"),
        value: z.string().min(1, "Specification value is required"),
      })
    )
    .optional(),
  metaTitle: z.string().optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description should not exceed 160 characters")
    .optional(),
  about: z.string().min(1, "About is required").optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
