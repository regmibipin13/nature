import z from "zod";

// Validation schema
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID required"),
  quantity: z.coerce.number().min(1),
  unitPrice: z.coerce.number().min(0),
});

export const orderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  customerAddressLine1: z.string().optional(),
  customerAddressLine2: z.string().optional(),
  customerCity: z.string().optional(),
  customerState: z.string().optional(),
  customerPostalCode: z.string().optional(),
  customerCountry: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  landmark: z.string().optional(),
  orderType: z.string().optional(),
  preferredDeliveryTime: z.string().optional(),
  status: z.string().default("PENDING"),
  items: z.array(orderItemSchema).min(1, "At least one item required"),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
