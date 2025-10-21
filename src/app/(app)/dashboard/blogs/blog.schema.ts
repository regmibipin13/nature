import z from "zod";

export const blogSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  excerpt: z
    .string()
    .max(300, "Excerpt must be less than 300 characters")
    .optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).optional(),
  featuredImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  status: z.enum(["draft", "published"]),
  metaTitle: z
    .string()
    .max(60, "Meta title must be less than 60 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description must be less than 160 characters")
    .optional(),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    )
    .optional(),
  visibility: z.enum(["public", "private"]),
});

export type BlogFormValues = z.infer<typeof blogSchema>;

export type BlogType = z.infer<typeof blogSchema> & {
  id: string;
  createdAt: string;
};
