import type { Metadata } from "next";
import { PrepWizard } from "@/components/interview-prep/prep-wizard";

export const metadata: Metadata = { title: "New Interview Prep" };

export default function NewInterviewPrepPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Interview Prep</h1>
        <p className="text-muted-foreground mt-1">
          Get AI-generated interview questions tailored to your resume and target
          role — across all 7 question categories.
        </p>
      </div>
      <PrepWizard />
    </div>
  );
}
