import z from "zod";

export const FAQSchema = z.object({
  headline: z.string(),
  imageUrl: z.string(),
  accordionItems: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
});

export type FAQFormData = z.infer<typeof FAQSchema>;
