import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY to environment variables." }, { status: 500 });
    }

    let user = await db.user.findUnique({ where: { email } });

    // If no user exists, create a dummy one for the demo
    if (!user) {
      user = await db.user.create({ data: { email, name: email.split("@")[0] } });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Origenix PRO",
              description: "AI lead qualification and automated campaigns.",
            },
            unit_amount: 4900, // $49.00
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: user.email,
      success_url: `${process.env.APP_BASE_URL || "http://localhost:3000"}/settings/billing?success=true`,
      cancel_url: `${process.env.APP_BASE_URL || "http://localhost:3000"}/settings/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
