import prisma from "@/lib/db";
import { stripeServer } from "@/lib/stripe/stripe-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { items, customerDetails } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: items.map((item: any) => item.id),
        },
        active: true,
      },
      select: {
        id: true,
        stripePriceId: true,
      },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Some products are no longer available" },
        { status: 400 }
      );
    }

    // Prepare customer data for Stripe
    const customerData: any = {};

    if (customerDetails?.email) {
      customerData.customer_email = customerDetails.email;
    }

    // Create Stripe session with enhanced configuration
    const session = await stripeServer.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => {
        const product = products.find((p) => p.id === item.id);
        if (!product || !product.stripePriceId) {
          throw new Error(`Product ${item.id} missing Stripe price ID`);
        }
        return {
          price: product.stripePriceId,
          quantity: item.quantity,
        };
      }),
      mode: "payment",

      // Customer information
      ...customerData,

      // Collect customer information
      customer_creation: "always",

      // Phone number collection
      phone_number_collection: {
        enabled: true,
      },

      // Billing address collection
      billing_address_collection: "required",

      // Custom fields for additional delivery information
      custom_fields: [
        {
          key: "delivery_instructions",
          label: {
            type: "custom",
            custom: "Delivery Instructions",
          },
          type: "text",
          optional: true,
        },
      ],

      // Metadata to store additional customer information
      metadata: {
        ...(customerDetails?.name && { customer_name: customerDetails.name }),
        ...(customerDetails?.phone && {
          customer_phone: customerDetails.phone,
        }),
        ...(customerDetails?.deliveryAddress && {
          delivery_address: customerDetails.deliveryAddress,
        }),
        ...(customerDetails?.landmark && {
          landmark: customerDetails.landmark,
        }),
        order_type: "online_purchase",
        created_at: new Date().toISOString(),
      },

      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,

      // Automatic tax calculation (optional)
      automatic_tax: {
        enabled: false, // Set to true if you want automatic tax calculation
      },

      // Allow promotion codes (optional)
      allow_promotion_codes: true,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
