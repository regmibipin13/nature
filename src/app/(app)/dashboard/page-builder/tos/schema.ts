import z from "zod";

export const tosSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export type TOSFormData = z.infer<typeof tosSchema>;
