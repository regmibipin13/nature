import z from "zod";

export const socialMediaSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  url: z.string(),
});

export const footerSchema = z.object({
  socialLinks: z.array(socialMediaSchema),
});

export type FooterFormData = z.infer<typeof footerSchema>;
