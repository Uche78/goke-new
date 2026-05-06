import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { CREDIT_PACK_PRICE_CENTS, CREDIT_PACK_CREDITS } from "@/lib/credits";

export async function POST() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: CREDIT_PACK_PRICE_CENTS,
            product_data: {
              name: `${CREDIT_PACK_CREDITS} Goke Credits`,
              description: "Spend on Career Analysis, Career Plans, Resume Optimization, and Interview Prep.",
            },
          },
          quantity: 1,
        },
      ],
      metadata: { user_id: user.id, type: "credit_pack", credits: String(CREDIT_PACK_CREDITS) },
      customer_email: user.email,
      success_url: `${origin}/dashboard?credits=purchased`,
      cancel_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("stripe/create-checkout error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
