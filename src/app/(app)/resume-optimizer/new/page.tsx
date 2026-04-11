import type { Metadata } from "next";
import { OptimizerWizard } from "@/components/resume-optimizer/optimizer-wizard";

export const metadata: Metadata = { title: "New Resume Optimization" };

export default function NewResumeOptimizerPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Resume Optimizer</h1>
        <p className="text-muted-foreground mt-1">
          Tailor your resume to any job description and boost your chances of
          getting an interview.
        </p>
      </div>
      <OptimizerWizard />
    </div>
  );
}
