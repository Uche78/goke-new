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

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleNext = (update: Partial<OptimizerFormData>) => {
    setData((prev) => ({ ...prev, ...update }));
    setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    const fullText = await stream("/api/resume-optimize", {
      jobTitle: data.jobTitle,
      jobDescription: data.jobDescription,
      resumeText: data.resumeText ?? undefined,
      resumeStoragePath: !data.resumeText ? (data.resumeStoragePath ?? undefined) : undefined,
    });

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
    if (error) toast.error(error);
  }, [error]);

  return (
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
  );
}
