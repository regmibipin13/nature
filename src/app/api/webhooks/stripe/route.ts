import prisma from "@/lib/db";
import { stripeServer } from "@/lib/stripe/stripe-server";
import { NextRequest, NextResponse } from "next/server";

// Stripe webhook handler
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  try {
    if (webhookSecret) {
      event = stripeServer.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // If no webhook secret configured, try to parse JSON (dangerous in prod)
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const type = event.type;

  try {
    if (
      type === "checkout.session.completed" ||
      type === "payment_intent.succeeded"
    ) {
      const session =
        type === "checkout.session.completed" ? event.data.object : null;

      // For payment_intent.succeeded we might need to fetch the session by payment_intent id
      let checkoutSession: any = session;
      if (type === "payment_intent.succeeded") {
        const paymentIntent: any = event.data.object;
        // Try to find a session with this payment_intent
        const sessions = await stripeServer.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });
        checkoutSession = sessions.data[0] || null;
      }

      if (checkoutSession) {
        // Create or update order
        const existing = await prisma.order.findUnique({
          where: { stripeSessionId: checkoutSession.id },
        });

        if (!existing) {
          // Expand line items and customer
          const s = await stripeServer.checkout.sessions.retrieve(
            checkoutSession.id,
            { expand: ["line_items", "customer"] }
          );

          const customer: any = s.customer_details || {};

          const deliveryInstructions =
            s.custom_fields?.find((f: any) => f.key === "delivery_instructions")
              ?.text?.value || null;

          const order = await prisma.order.create({
            data: {
              stripeSessionId: s.id,
              stripePaymentIntent:
                typeof s.payment_intent === "string"
                  ? s.payment_intent
                  : s.payment_intent?.id || null,
              status: "Paid",
              currency: s.currency || "usd",
              amountSubtotal: s.amount_subtotal || 0,
              amountTotal: s.amount_total || 0,
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
              items: {
                create:
                  s.line_items?.data.map((item: any) => ({
                    product: {
                      connect: { stripeProductId: item.price?.product },
                    },
                    productName: item.description || "Unknown",
                    quantity: item.quantity || 1,
                    unitPrice: item.price?.unit_amount || 0,
                    totalPrice:
                      (item.price?.unit_amount || 0) * (item.quantity || 1),
                  })) || [],
              },
            },
          });

          console.log("Order created from webhook:", order.id);
        } else {
          // Update status to Paid (but allow manual override later)
          await prisma.order.update({
            where: { id: existing.id },
            data: { status: "Paid" },
          });
          console.log("Order updated to Paid from webhook:", existing.id);
        }
      } else {
        console.warn(
          "No checkout session found for payment_intent.succeeded event"
        );
      }
    } else if (type === "payment_intent.payment_failed") {
      const pi: any = event.data.object;

      // find order by payment intent
      const order = await prisma.order.findFirst({
        where: { stripePaymentIntent: pi.id },
      });
      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "Payment Failed" },
        });
        console.log("Order marked Payment Failed:", order.id);
      } else {
        console.warn("No order found for failed payment intent:", pi.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error handling webhook event:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
