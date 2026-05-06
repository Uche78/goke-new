import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [{ data: profile }, { data: credits }] = await Promise.all([
      supabase
        .from("profiles")
        .select("plan, free_career_analysis_used, free_1mo_plan_used, free_interview_prep_used, free_resume_optimization_used")
        .eq("id", user.id)
        .single(),
      supabase
        .from("user_credits")
        .select("balance, credits_reset_at")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    return NextResponse.json({
      balance: credits?.balance ?? 0,
      plan: profile?.plan ?? "free",
      resetAt: credits?.credits_reset_at ?? null,
      freeTierUsed: {
        career_analysis: profile?.free_career_analysis_used ?? false,
        plan_1mo: profile?.free_1mo_plan_used ?? false,
        interview_prep: profile?.free_interview_prep_used ?? false,
        resume_optimization: profile?.free_resume_optimization_used ?? false,
      },
    });
  } catch (e) {
    console.error("credits/balance error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
