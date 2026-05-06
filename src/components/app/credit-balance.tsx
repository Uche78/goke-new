"use client";

import { useEffect, useState } from "react";
import { Zap, Crown } from "lucide-react";
import { PRO_MONTHLY_CREDITS } from "@/lib/credits";

interface BalanceData {
  balance: number;
  plan: "free" | "pro";
}

export function CreditBalance() {
  const [data, setData] = useState<BalanceData | null>(null);

  useEffect(() => {
    fetch("/api/credits/balance")
      .then((r) => r.json())
      .then((d) => setData({ balance: d.balance ?? 0, plan: d.plan ?? "free" }))
      .catch(() => {});
  }, []);

  if (!data) return <div className="h-8" />;

  const isPro = data.plan === "pro";

  return (
    <div className="rounded-lg border border-border bg-background/60 px-3 py-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {isPro
            ? <Crown size={12} className="text-accent" />
            : <Zap size={12} className="text-accent" />
          }
          {isPro ? "Pro" : "Free"}
        </div>
        <span className="text-xs font-semibold tabular-nums">
          {data.balance}{isPro ? `/${PRO_MONTHLY_CREDITS}` : ""} credits
        </span>
      </div>

      {isPro && (
        <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${Math.min(100, (data.balance / PRO_MONTHLY_CREDITS) * 100)}%` }}
          />
        </div>
      )}

      {!isPro && (
        <a
          href="/pricing"
          className="block text-[10px] text-accent hover:underline underline-offset-2 font-medium"
        >
          Upgrade to Pro — $29/mo →
        </a>
      )}
    </div>
  );
}
