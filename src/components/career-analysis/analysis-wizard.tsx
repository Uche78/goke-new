"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ButtonLink } from "@/components/ui/button-link";
import { StepResume } from "./step-resume";
import { StepCareerStage } from "./step-career-stage";
import { StepLocation } from "./step-location";
import { StepReview } from "./step-review";
import { useStreaming } from "@/hooks/use-streaming";

export interface AnalysisFormData {
  resumeText?: string;
  resumeFileName?: string;
  resumeStoragePath?: string;
  stage?: "early" | "mid" | "late";
  subStage?: string;
  country?: string;
}

const STEPS = ["Resume", "Career Stage", "Location", "Review & Submit"];

export function AnalysisWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AnalysisFormData>({});
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const { isStreaming, stream } = useStreaming();

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleNext = (update: Partial<AnalysisFormData>) => {
    setDuplicateId(null);
    setData((prev) => ({ ...prev, ...update }));
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setDuplicateId(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = async () => {
    setDuplicateId(null);
    let fullText: string;
    try {
      fullText = await stream("/api/career-analysis", {
        resumeText: data.resumeText,
        resumeStoragePath: data.resumeStoragePath,
        stage: data.stage,
        subStage: data.subStage,
        country: data.country,
      });
    } catch (err) {
      const payload = (err as { payload?: { error?: string; existingId?: string } }).payload;
      if (payload?.error === "duplicate" && payload.existingId) {
        setDuplicateId(payload.existingId);
        return;
      }
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      return;
    }

    // Extract the analysis ID from the stream sentinel
    const idMatch = fullText.match(/__ANALYSIS_ID__(\{[\s\S]*?\})\s*$/);
    if (idMatch) {
      try {
        const payload = JSON.parse(idMatch[1]);
        if (payload.analysisId) {
          router.push(`/career-analysis/results/${payload.analysisId}`);
          return;
        }
        if (payload.dbError) {
          toast.error(`DB error: ${payload.dbError}`);
          return;
        }
      } catch { /* ignore */ }
    }

    toast.error("Analysis completed but could not load results. Check your history.");
  };

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

      {/* Duplicate inline warning */}
      {duplicateId && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900">
          <TriangleAlert size={16} className="shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-semibold">Analysis already exists</p>
            <p>
              You&apos;ve already completed an analysis for this career stage and country.
              Each combination can only be analysed once.
            </p>
            <ButtonLink
              href={`/career-analysis/results/${duplicateId}`}
              variant="outline"
              size="sm"
              className="mt-2 border-amber-400 text-amber-900 hover:bg-amber-100"
            >
              View existing analysis →
            </ButtonLink>
          </div>
        </div>
      )}

      {step === 0 && (
        <StepResume
          existingData={{ resumeText: data.resumeText, resumeFileName: data.resumeFileName, resumeStoragePath: data.resumeStoragePath }}
          onNext={handleNext}
        />
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
          submitting={isStreaming}
        />
      )}
    </div>
  );
}
