import z from "zod";

export const collectionSchema = z.object({
  id: z.string().optional(), // ✅ optional ID
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  slug: z
    .string()
    .optional()
    .refine((val) => !val || !/\s/.test(val), "Slug must not contain spaces"),
  description: z
    .string()
    .max(500, { message: "Description must be under 500 characters." })
    .optional(),
  active: z.boolean().default(false),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  metaTitle: z
    .string()
    .max(60, { message: "Meta title must be under 60 characters." })
    .optional()
    .nullable(),
  metaDescription: z
    .string()
    .max(160, { message: "Meta description must be under 160 characters." })
    .optional()
    .nullable(),

  featured: z.boolean().default(false),
});

export type CollectionFormValues = z.infer<typeof collectionSchema>;
