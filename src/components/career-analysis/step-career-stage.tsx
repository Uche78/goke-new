"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AnalysisFormData } from "./analysis-wizard";

const STAGES = [
  {
    value: "early" as const,
    label: "Early Stage",
    description: "Just starting your career or have a few years of experience",
  },
  {
    value: "mid" as const,
    label: "Mid Stage",
    description: "Established in your career with significant experience",
  },
  {
    value: "late" as const,
    label: "Late Stage",
    description: "Senior level with extensive experience and expertise",
  },
];

const SUB_STAGES: Record<string, Array<{ value: string; label: string }>> = {
  early: [
    { value: "exploring", label: "I am just starting out and exploring my options" },
    { value: "growing", label: "I am looking to grow" },
    { value: "reentering", label: "I am re-entering the workforce after a break or transition" },
  ],
  mid: [
    { value: "advancing", label: "I am seeking advancement in my current field" },
    { value: "transitioning", label: "I am looking to transition to a new role" },
    { value: "leadership", label: "I am interested in leadership opportunities" },
  ],
  late: [
    { value: "executive", label: "I am pursuing executive positions" },
    { value: "consulting", label: "I am looking to transition into consulting" },
    { value: "mentoring", label: "I am interested in mentoring and advisory roles" },
  ],
};

interface Props {
  defaultValues?: { stage?: "early" | "mid" | "late"; subStage?: string };
  onNext: (data: Partial<AnalysisFormData>) => void;
  onBack: () => void;
}

export function StepCareerStage({ defaultValues, onNext, onBack }: Props) {
  const [stage, setStage] = useState<"early" | "mid" | "late" | null>(
    defaultValues?.stage ?? null
  );
  const [subStage, setSubStage] = useState<string | null>(
    defaultValues?.subStage ?? null
  );

  const handleContinue = () => {
    if (!stage) { toast.error("Please select your career stage."); return; }
    if (!subStage) { toast.error("Please select what best describes your journey."); return; }
    onNext({ stage, subStage });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Career Stage</CardTitle>
        <CardDescription>
          Tell us where you are in your career journey so we can tailor your analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stage selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Select your career stage</p>
          <div className="grid gap-3">
            {STAGES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => { setStage(s.value); setSubStage(null); }}
                className={cn(
                  "text-left p-4 rounded-xl border-2 transition-colors",
                  stage === s.value
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/40"
                )}
              >
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-stage selection */}
        {stage && (
          <div className="space-y-2">
            <p className="text-sm font-medium">What best describes your current journey?</p>
            <div className="grid gap-2">
              {SUB_STAGES[stage].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSubStage(s.value)}
                  className={cn(
                    "text-left p-3 rounded-lg border-2 text-sm transition-colors",
                    subStage === s.value
                      ? "border-accent bg-accent/5 font-medium"
                      : "border-border hover:border-accent/40"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack}>Back</Button>
          <Button className="flex-1" onClick={handleContinue}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
