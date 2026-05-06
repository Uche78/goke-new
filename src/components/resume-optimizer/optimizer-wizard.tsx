"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { StepJobTitle } from "./step-job-title";
import { StepResume } from "./step-resume";
import { StepJobDescription } from "./step-job-description";
import { StepReview } from "./step-review";
import { useStreaming } from "@/hooks/use-streaming";
import { InsufficientCreditsModal } from "@/components/app/insufficient-credits-modal";

export interface OptimizerFormData {
  jobTitle?: string;
  resumeText?: string;
  resumeStoragePath?: string;
  resumeFileName?: string;
  jobDescription?: string;
}

const STEPS = ["Job Title", "Resume", "Job Description", "Review & Submit"];

export function OptimizerWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OptimizerFormData>({});
  const { isStreaming, error, stream } = useStreaming();
  const [creditError, setCreditError] = useState<{ required: number; balance: number } | null>(null);
  const [isCreditError, setIsCreditError] = useState(false);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleNext = (update: Partial<OptimizerFormData>) => {
    setData((prev) => ({ ...prev, ...update }));
    setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    setIsCreditError(false);
    let fullText = "";
    try {
      fullText = await stream("/api/resume-optimize", {
      jobTitle: data.jobTitle,
      jobDescription: data.jobDescription,
      resumeText: data.resumeText ?? undefined,
      resumeStoragePath: !data.resumeText ? (data.resumeStoragePath ?? undefined) : undefined,
      });
    } catch (err) {
      type StreamError = Error & { status?: number; payload?: Record<string, unknown> };
      const e = err as StreamError;
      if (e.status === 402) {
        setIsCreditError(true);
        setCreditError({ required: (e.payload?.required as number) ?? 2, balance: (e.payload?.balance as number) ?? 0 });
      }
      return;
    }

    const idMatch = fullText.match(/__RECORD_ID__(\{[^}]+\})/);
    if (idMatch) {
      try {
        const { id } = JSON.parse(idMatch[1]);
        if (id) {
          router.push(`/resume-optimizer/results/${id}`);
          return;
        }
      } catch { /* ignore */ }
    }
    if (!error) toast.error("Optimization completed but could not load results.");
  };

  useEffect(() => {
    if (error && !isCreditError) toast.error(error);
  }, [error, isCreditError]);

  return (
    <>
    <InsufficientCreditsModal
      open={!!creditError}
      onClose={() => setCreditError(null)}
      tool="resume_optimization"
      balance={creditError?.balance ?? 0}
    />
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {step === 0 && <StepJobTitle defaultValue={data.jobTitle} onNext={handleNext} />}
      {step === 1 && (
        <StepResume
          defaultValues={{ resumeText: data.resumeText, resumeFileName: data.resumeFileName, resumeStoragePath: data.resumeStoragePath }}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <StepJobDescription
          defaultValue={data.jobDescription}
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
    </>
  );
}
