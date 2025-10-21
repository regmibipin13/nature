import z from "zod";

export const herobuilderSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  buttonText: z.string().min(1),
  mediaType: z.enum(["image", "video"]),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  backgroundColor: z.string().min(1),
});

export type HeroData = z.infer<typeof herobuilderSchema>;
