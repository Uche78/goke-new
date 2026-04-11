"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { StepName } from "./step-name";
import { StepPhone } from "./step-phone";
import { StepEmail } from "./step-email";
import { StepResume } from "./step-resume";
import { createClient } from "@/lib/supabase/client";

export interface OnboardingData {
  firstName: string;
  lastName: string;
  phone: string;
  profileEmail: string;
  resumeFile?: File;
}

const STEPS = ["Name", "Phone", "Email", "Resume"];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [submitting, setSubmitting] = useState(false);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleNext = (update: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...update }));
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleFinish = async (update: Partial<OnboardingData>) => {
    const finalData = { ...data, ...update };
    setSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update profile
      const { error } = await supabase.from("profiles").update({
        first_name: finalData.firstName,
        last_name: finalData.lastName,
        phone: finalData.phone || null,
        profile_email: finalData.profileEmail,
        onboarding_completed: true,
      }).eq("id", user.id);

      if (error) throw error;

      // Upload resume if provided
      if (finalData.resumeFile) {
        const formData = new FormData();
        formData.append("file", finalData.resumeFile);
        await fetch("/api/upload-resume", { method: "POST", body: formData });
      }

      toast.success("Profile created! Welcome to Goke.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
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

      {/* Steps */}
      {step === 0 && (
        <StepName
          defaultValues={{ firstName: data.firstName, lastName: data.lastName }}
          onNext={handleNext}
        />
      )}
      {step === 1 && (
        <StepPhone
          defaultValue={data.phone}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <StepEmail
          defaultValue={data.profileEmail}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <StepResume
          onFinish={handleFinish}
          onBack={handleBack}
          submitting={submitting}
        />
      )}
    </div>
  );
}
