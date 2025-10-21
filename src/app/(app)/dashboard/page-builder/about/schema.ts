import z from "zod";

export const aboutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  pageTitle: z.string().optional(),
  pageDescription: z.string().optional(),
});

export type AboutFormData = z.infer<typeof aboutSchema>;
