"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { PreAuthStepResume } from "./pre-auth-step-resume";
import { StepCareerStage } from "./step-career-stage";
import { StepLocation } from "./step-location";
import { StepReview } from "./step-review";
import { PreviewTeaser } from "./preview-teaser";
import type { AnalysisFormData } from "./analysis-wizard";
import type { CareerAnalysisResult } from "@/types/ai";

const STEPS = ["Resume", "Career Stage", "Location", "Review & Submit"];

export function PreAuthWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AnalysisFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CareerAnalysisResult | null>(null);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleNext = (update: Partial<AnalysisFormData>) => {
    setData((prev) => ({ ...prev, ...update }));
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/career-analysis-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: data.resumeText,
          stage: data.stage,
          subStage: data.subStage,
          country: data.country,
        }),
      });

      const payload = await res.json();

      if (!res.ok) {
        toast.error(payload?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(payload.analysisJson as CareerAnalysisResult);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show teaser once analysis is ready
  if (result) {
    return (
      <PreviewTeaser
        result={result}
        pendingData={{
          resumeText: data.resumeText ?? "",
          stage: data.stage ?? "mid",
          subStage: data.subStage ?? "",
          country: data.country ?? "",
          analysisJson: result as unknown as Record<string, unknown>,
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {step === 0 && (
        <PreAuthStepResume onNext={handleNext} />
      )}
      {step === 1 && (
        <StepCareerStage
          defaultValues={{ stage: data.stage, subStage: data.subStage }}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <StepLocation
          defaultValue={data.country}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <StepReview
          data={data}
          onSubmit={handleSubmit}
          onBack={handleBack}
          submitting={isSubmitting}
        />
      )}
    </div>
  );
}
