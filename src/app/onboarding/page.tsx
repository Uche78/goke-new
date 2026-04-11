import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
  title: "Welcome to Goke",
  description: "Complete your profile to get started",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to Goke</h1>
          <p className="text-muted-foreground">
            Let&apos;s set up your profile so we can personalize your experience.
          </p>
        </div>
        <OnboardingWizard />
      </div>
    </div>
  );
}
