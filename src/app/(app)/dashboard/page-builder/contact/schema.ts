import z from "zod";

export const contactSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  recipientEmail: z.string().email(),
  contactInfo: z.array(
    z.object({
      type: z.enum(["address", "phone", "email"]),
      value: z.string().min(1),
    })
  ),
  formFields: z.array(
    z.object({
      label: z.string().min(1),
      type: z.enum(["text", "email", "tel", "textarea"]),
    })
  ),
});

export type ContactPageForm = z.infer<typeof contactSchema>;
