import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import prisma from "@/lib/db";
import { stripeServer } from "@/lib/stripe/stripe-server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SuccessButtons from "./client";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}
export const metadata = {
  title: "Order Success - Nature and Nurtures",
  description: "Thank you for your purchase! Your order has been confirmed.",
  keywords: ["order", "success", "checkout", "payment", "shop"],
  openGraph: {
    title: "Order Success - Nature and Nurtures",
    description: "Thank you for your purchase! Your order has been confirmed.",
    type: "website",
  },
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent sessionId={params.session_id} />
    </Suspense>
  );
}

async function SuccessContent({ sessionId }: { sessionId?: string }) {
  if (!sessionId) {
    redirect("/cart");
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripeServer.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    // Check if order already exists
    let order: any = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
      include: { items: true },
    });

    if (!order) {
      const customer = session.customer_details;

      // Extract custom fields
      const deliveryInstructions =
        session.custom_fields?.find(
          (f: any) => f.key === "delivery_instructions"
        )?.text?.value || null;

      const landmark =
        session.custom_fields?.find((f: any) => f.key === "landmark")?.text
          ?.value || null;

      const preferredDeliveryTime =
        session.custom_fields?.find(
          (f: any) => f.key === "preferred_delivery_time"
        )?.dropdown?.value || null;

      // Create order
      order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentIntent:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id || null,
          status: session.status || "unknown",
          currency: session.currency || "usd",
          amountSubtotal: session.amount_subtotal || 0,
          amountTotal: session.amount_total || 0,
          customerName: customer?.name || "",
          customerEmail: customer?.email || "",
          customerPhone: customer?.phone || null,
          customerAddressLine1: customer?.address?.line1 || null,
          customerAddressLine2: customer?.address?.line2 || null,
          customerCity: customer?.address?.city || null,
          customerState: customer?.address?.state || null,
          customerPostalCode: customer?.address?.postal_code || null,
          customerCountry: customer?.address?.country || null,
          deliveryInstructions,
          landmark,
          preferredDeliveryTime,
          orderType: session.metadata?.order_type || null,
          items: {
            create:
              session.line_items?.data.map((item: any) => ({
                // productId: item.price?.product || null,
                product: {
                  connect: {
                    stripeProductId: item.price?.product as string,
                  },
                },
                productName: item.description || "Unknown",
                quantity: item.quantity || 1,
                unitPrice: item.price?.unit_amount || 0,
                totalPrice:
                  (item.price?.unit_amount || 0) * (item.quantity || 1),
              })) || [],
          },
        },
        include: { items: true },
      });
    } else {
      console.log("Order already exists for session:", session.id);
    }

    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
            {order.items.map((item: any) => (
              <div key={item.id} className="text-left mb-1">
                <p className="font-semibold text-gray-800">
                  {item.productName}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} | Price: $
                  {(item.unitPrice / 100).toFixed(2)}
                </p>
              </div>
            ))}
            <div>
              <p className="font-semibold text-gray-900">
                We will email you a receipt shortly. Your order is now freshly
                being prepared. We will take care of it and ship it to you as
                soon as possible.
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-6">Order #{order.id}</p>
            <SuccessButtons orderId={order.id} />
          </div>
        </div>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t process your order. Please contact support.
          </p>
          <SuccessButtons errorState />
        </div>
      </div>
    );
  }
}
