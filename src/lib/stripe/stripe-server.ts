import Stripe from "stripe";

export const stripeServer = new Stripe(process.env.STRIPE_SECRET_KEY!);
