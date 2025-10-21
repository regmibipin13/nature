import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { OrderDetailsPublicClient } from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ order_id: string }>;
}): Promise<Metadata> {
  const { order_id } = await params;

  return {
    title: `Order Details - ${order_id}`,
    description: `View detailed information for order ${order_id}`,
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ order_id: string }>;
}) {
  const { order_id } = await params;

  const orderDetail = await prisma.order.findUnique({
    where: {
      id: order_id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              images: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!orderDetail) {
    throw new Error("Order not found");
  }

  return (
    <div>
      <Header />
      <OrderDetailsPublicClient data={orderDetail} />
      <Footer />
    </div>
  );
}
