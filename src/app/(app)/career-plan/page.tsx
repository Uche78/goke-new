import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CareerPlanView } from "@/components/career-plan/career-plan-view";

export const metadata: Metadata = { title: "Career Plan" };

interface Props {
  searchParams: Promise<{ analysisId?: string; pathIndex?: string }>;
}

export default async function CareerPlanPage({ searchParams }: Props) {
  const { analysisId, pathIndex } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Load all analyses for the selector
  const { data: allAnalyses } = user
    ? await supabase
        .from("career_analyses")
        .select("id, stage, country, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  // Default to most recent if none specified
  const resolvedAnalysisId =
    analysisId ?? allAnalyses?.[0]?.id ?? null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Career Plan</h1>
        <p className="text-muted-foreground mt-1">
          Choose a career path and timeframe to generate your personalized action plan.
        </p>
      </div>
      <CareerPlanView
        analysisId={resolvedAnalysisId}
        allAnalyses={allAnalyses ?? []}
        defaultPathIndex={pathIndex ? parseInt(pathIndex, 10) : 0}
      />
    </div>
  );
}
