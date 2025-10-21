import z from "zod";

export const privacySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export type PrivacyFormData = z.infer<typeof privacySchema>;
