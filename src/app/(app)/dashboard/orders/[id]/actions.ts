"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: string,
  deliveryStatus: string
) {
  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        deliveryStatus: deliveryStatus as any,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function updateOrderShipping(
  orderId: string,
  carrier: string | null,
  trackingNumber: string | null,
  trackingUrl: string | null
) {
  try {
    const data: any = {
      updatedAt: new Date(),
    };

    if (carrier !== null) data["carrier"] = carrier;
    if (trackingNumber !== null) data["trackingNumber"] = trackingNumber;
    if (trackingUrl !== null) data["trackingUrl"] = trackingUrl;

    // If carrier and tracking number are provided, auto-set deliveryStatus to SHIPPED
    if (carrier && trackingNumber) {
      data["deliveryStatus"] = "SHIPPED" as any;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data,
    });

    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating order shipping:", error);
    return { success: false, error: "Failed to update order shipping" };
  }
}
