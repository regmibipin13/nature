import z from "zod";

export const infoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  backgroundColor: z.string().default("#ffffff"),
  image1: z.string().min(1, "Image 1 is required"),
  image2: z.string().min(1, "Image 2 is required"),
  image3: z.string().optional(),
  image4: z.string().optional(),
});

export type InfoData = z.infer<typeof infoSchema>;
