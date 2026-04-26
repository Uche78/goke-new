"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormattedText } from "@/components/shared/formatted-text";
import { createClient } from "@/lib/supabase/client";
import type { CareerAnalysisResult } from "@/types/ai";

const PENDING_KEY = "goke_pending_analysis";

interface PendingAnalysis {
  resumeText: string;
  stage: string;
  subStage: string;
  country: string;
  analysisJson: Record<string, unknown>;
}

const schema = z
  .object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  result: CareerAnalysisResult;
  pendingData: PendingAnalysis;
}

function getTeaserAnalysis(analysis: string): { visible: string; locked: string } {
  const lines = analysis.split("\n").filter(Boolean);
  const bullets = lines.filter((l) => /^[-•*]/.test(l.trimStart()));
  const visibleBullets = bullets.slice(0, 2);
  const lockedBullets = bullets.slice(2);
  return {
    visible: visibleBullets.join("\n"),
    locked: lockedBullets.join("\n"),
  };
}

export function PreviewTeaser({ result, pendingData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { visible: visibleAnalysis, locked: lockedAnalysis } = getTeaserAnalysis(result.analysis ?? "");

  const savePendingToStorage = (data: PendingAnalysis) => {
    localStorage.setItem(PENDING_KEY, JSON.stringify(data));
  };

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    savePendingToStorage(pendingData);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // If session exists, user is immediately logged in — save and redirect
      if (data.session) {
        const res = await fetch("/api/career-analysis/save-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pendingData),
        });
        const payload = await res.json();
        localStorage.removeItem(PENDING_KEY);

        if (res.ok && payload.analysisId) {
          router.push(`/career-analysis/results/${payload.analysisId}`);
          return;
        }
        router.push("/dashboard");
        return;
      }

      // Email confirmation required
      setEmailSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Check your email</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We sent a confirmation link to your email. Click it to confirm your account — your full analysis will be waiting for you.
        </p>
        <p className="text-xs text-muted-foreground">Your analysis is saved and will be available once you confirm.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
          <CheckCircle2 size={13} />
          Analysis complete — 3 career paths identified
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your career analysis is ready</h2>
        <p className="text-muted-foreground text-sm">Create a free account to unlock your full results.</p>
      </div>

      {/* Visible: intro */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Introduction</p>
        <FormattedText text={result.intro ?? ""} />
      </div>

      {/* Visible: first 2 analysis bullets */}
      {visibleAnalysis && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Career Analysis (preview)</p>
          <FormattedText text={visibleAnalysis} />
        </div>
      )}

      {/* Locked sections */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Blurred content */}
        <div className="blur-sm pointer-events-none select-none space-y-4 p-5 bg-card border border-border rounded-xl">
          {lockedAnalysis && <FormattedText text={lockedAnalysis} />}
          <div className="space-y-2 mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Job Market in {pendingData.country}</p>
            <FormattedText text={result.geo_considerations ?? "Detailed market insights for your region..."} />
          </div>
          <div className="space-y-3 mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Recommended Career Paths</p>
            {(result.paths ?? []).map((path, i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">{path.name}</p>
                  <span className="text-xs font-bold text-accent">{path.match_percent}% match</span>
                </div>
                <p className="text-xs text-muted-foreground">{path.salary_range}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px]">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <Lock size={20} className="text-accent" />
          </div>
          <p className="text-sm font-semibold text-foreground">Full analysis locked</p>
          <p className="text-xs text-muted-foreground mt-1">Create a free account to see everything</p>
        </div>
      </div>

      {/* Signup form */}
      <div className="p-6 rounded-xl border-2 border-accent/30 bg-card space-y-5">
        <div>
          <h3 className="text-base font-bold text-foreground">Create your free account</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Unlock your full analysis — no credit card required.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="At least 8 characters" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Unlock My Full Analysis
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-accent font-medium hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
