// ─── Constants ────────────────────────────────────────────────────────────────

export const CREDIT_COSTS = {
  career_analysis: 2,
  career_plan_1mo: 1,
  career_plan_3mo: 2,
  career_plan_6mo: 2,
  interview_prep: 3,
  resume_optimization: 2,
} as const;

export type CreditTool = keyof typeof CREDIT_COSTS;

export const PRO_MONTHLY_CREDITS = 50;
export const CREDIT_PACK_CREDITS = 10;
export const CREDIT_PACK_PRICE_CENTS = 1000; // $10

// Tools that have a one-time free tier usage (free plan only)
const FREE_TIER_FLAGS: Partial<Record<CreditTool, string>> = {
  career_analysis: "free_career_analysis_used",
  career_plan_1mo: "free_1mo_plan_used",
  interview_prep: "free_interview_prep_used",
  resume_optimization: "free_resume_optimization_used",
  // career_plan_3mo and career_plan_6mo have no free tier
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreditCheckResult =
  | { ok: true; usedFreeTier: boolean }
  | { ok: false; reason: "insufficient_credits"; required: number; balance: number };

// ─── Core helper ──────────────────────────────────────────────────────────────

export async function checkAndDeductCredits(
  userId: string,
  tool: CreditTool,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminSupabase: any
): Promise<CreditCheckResult> {
  const cost = CREDIT_COSTS[tool];

  // Fetch profile + credits in parallel
  const [{ data: profile }, { data: credits }] = await Promise.all([
    adminSupabase
      .from("profiles")
      .select("plan, free_career_analysis_used, free_1mo_plan_used, free_interview_prep_used, free_resume_optimization_used")
      .eq("id", userId)
      .single(),
    adminSupabase
      .from("user_credits")
      .select("balance, credits_reset_at")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const isPro = profile?.plan === "pro";

  // Ensure user_credits row exists (lazy init)
  if (!credits) {
    await adminSupabase.from("user_credits").upsert({
      user_id: userId,
      balance: 0,
      updated_at: new Date().toISOString(),
    });
  }

  // Pro monthly reset — lazy, triggers on first request after billing cycle rolls over
  let balance = credits?.balance ?? 0;
  if (isPro) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const resetAt = credits?.credits_reset_at ? new Date(credits.credits_reset_at) : null;

    if (!resetAt || resetAt < startOfMonth) {
      const nextReset = new Date(startOfMonth);
      nextReset.setMonth(nextReset.getMonth() + 1);

      await Promise.all([
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
        }),
      ]);
      balance = PRO_MONTHLY_CREDITS;
    }
  }

  // Check free tier (free plan users only)
  const freeTierFlag = FREE_TIER_FLAGS[tool];
  if (!isPro && freeTierFlag) {
    const flagValue = (profile as Record<string, unknown> | null)?.[freeTierFlag] as boolean | undefined;
    if (!flagValue) {
      await Promise.all([
        adminSupabase.from("profiles").update({ [freeTierFlag]: true }).eq("id", userId),
        adminSupabase.from("credit_transactions").insert({
          user_id: userId,
          amount: 0,
          type: "free_tier",
          tool,
        }),
      ]);
      return { ok: true, usedFreeTier: true };
    }
  }

  // Insufficient credits
  if (balance < cost) {
    return { ok: false, reason: "insufficient_credits", required: cost, balance };
  }

  // Atomically deduct via RPC (prevents double-spend)
  const { error } = await adminSupabase.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: cost,
  });

  if (error) {
    // RPC raised exception — race condition, recheck balance
    return { ok: false, reason: "insufficient_credits", required: cost, balance };
  }

  await adminSupabase.from("credit_transactions").insert({
    user_id: userId,
    amount: -cost,
    type: "usage",
    tool,
  });

  return { ok: true, usedFreeTier: false };
}
