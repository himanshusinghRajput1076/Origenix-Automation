import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  const session = event.data.object;

  try {
    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const userId = session.metadata?.userId;
      
      if (userId) {
        await db.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            tier: "PRO",
          },
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = await stripe.subscriptions.retrieve(event.data.object.id);
      
      await db.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          tier: "FREE",
          stripeSubscriptionId: null,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
