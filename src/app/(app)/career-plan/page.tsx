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

  // Load all analyses + profile in parallel
  const [{ data: allAnalyses }, { data: profile }] = await Promise.all([
    user
      ? supabase
          .from("career_analyses")
          .select("id, stage, country, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    user
      ? supabase.from("profiles").select("first_name, plan").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
  ]);

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
        firstName={profile?.first_name ?? null}
        plan={(profile?.plan as "free" | "pro") ?? "free"}
      />
    </div>
  );
}
