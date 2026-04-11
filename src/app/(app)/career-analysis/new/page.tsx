import type { Metadata } from "next";
import { AnalysisWizard } from "@/components/career-analysis/analysis-wizard";

export const metadata: Metadata = { title: "New Career Analysis" };

export default function NewCareerAnalysisPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Career Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Get a personalized AI-powered career analysis based on your background
          and goals in Canada.
        </p>
      </div>
      <AnalysisWizard />
    </div>
  );
}
