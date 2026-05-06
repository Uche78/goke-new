import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { CREDIT_PACK_CREDITS, PRO_MONTHLY_CREDITS } from "@/lib/credits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.user_id;
  const type = session.metadata?.type;

  if (!userId) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    if (type === "credit_pack") {
      const credits = parseInt(session.metadata?.credits ?? String(CREDIT_PACK_CREDITS), 10);

      // Upsert credits row, adding to existing balance
      const { data: existing } = await adminSupabase
        .from("user_credits")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();

      await adminSupabase.from("user_credits").upsert({
        user_id: userId,
        balance: (existing?.balance ?? 0) + credits,
        updated_at: new Date().toISOString(),
      });

      await adminSupabase.from("credit_transactions").insert({
        user_id: userId,
        amount: credits,
        type: "purchase",
        stripe_session_id: session.id,
      });
    }

    if (type === "pro_subscription") {
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1);
      nextReset.setDate(1);
      nextReset.setHours(0, 0, 0, 0);

      await Promise.all([
        adminSupabase.from("profiles").update({ plan: "pro" }).eq("id", userId),
        adminSupabase.from("user_credits").upsert({
          user_id: userId,
          balance: PRO_MONTHLY_CREDITS,
          credits_reset_at: nextReset.toISOString(),
          updated_at: new Date().toISOString(),
        }),
        adminSupabase.from("credit_transactions").insert({
          user_id: userId,
          amount: PRO_MONTHLY_CREDITS,
          type: "monthly_reset",
          stripe_session_id: session.id,
        }),
      ]);
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
