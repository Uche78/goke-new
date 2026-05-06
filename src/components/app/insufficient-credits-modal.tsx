"use client";

import { useState } from "react";
import { Loader2, Zap, Crown } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { CREDIT_COSTS, type CreditTool } from "@/lib/credits";

const TOOL_LABELS: Record<CreditTool, string> = {
  career_analysis: "Career Analysis",
  career_plan_1mo: "1-Month Career Plan",
  career_plan_3mo: "3-Month Career Plan",
  career_plan_6mo: "6-Month Career Plan",
  interview_prep: "Interview Prep",
  resume_optimization: "Resume Optimization",
};

interface Props {
  open: boolean;
  onClose: () => void;
  tool: CreditTool;
  balance: number;
}

export function InsufficientCreditsModal({ open, onClose, tool, balance }: Props) {
  const [buying, setBuying] = useState(false);

  const required = CREDIT_COSTS[tool];
  const shortfall = required - balance;

  const handleBuyCredits = async () => {
    setBuying(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setBuying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()} disablePointerDismissal>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap size={18} className="text-accent" />
            Not enough credits
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{TOOL_LABELS[tool]}</span> costs{" "}
            <span className="font-semibold">{required} credits</span>. You have{" "}
            <span className="font-semibold">{balance}</span> — you need{" "}
            <span className="font-semibold text-destructive">{shortfall} more</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {/* Credit pack */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm">Credit Pack</p>
                <p className="text-xs text-muted-foreground mt-0.5">10 credits · one-time payment</p>
              </div>
              <span className="text-lg font-bold">$10</span>
            </div>
            <Button className="w-full" onClick={handleBuyCredits} disabled={buying}>
              {buying ? <Loader2 size={14} className="animate-spin mr-2" /> : <Zap size={14} className="mr-2" />}
              {buying ? "Redirecting…" : "Buy 10 Credits — $10"}
            </Button>
          </div>

          {/* Pro upgrade */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  <Crown size={13} className="text-accent" /> Pro Plan
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">50 credits/month · resets monthly</p>
              </div>
              <span className="text-lg font-bold">$29<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
            </div>
            <ButtonLink href="/pricing" variant="outline" className="w-full justify-center border-accent text-accent hover:bg-accent hover:text-white">
              Upgrade to Pro
            </ButtonLink>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
