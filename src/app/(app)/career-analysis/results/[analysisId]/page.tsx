import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CareerPathCard } from "@/components/career-analysis/career-path-card";
import { FormattedText } from "@/components/shared/formatted-text";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import type { CareerAnalysisResult } from "@/types/ai";

const STAGE_LABELS: Record<string, string> = {
  early: "Early Stage",
  mid: "Mid Stage",
  late: "Late Stage",
};

export const metadata: Metadata = { title: "Career Analysis Results" };

interface Props {
  params: Promise<{ analysisId: string }>;
}

export default async function AnalysisResultsPage({ params }: Props) {
  const { analysisId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: analysis } = await supabase
    .from("career_analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (!analysis) notFound();

  const result = analysis.analysis_json as CareerAnalysisResult;

  const { count: planCount } = await supabase
    .from("career_plans")
    .select("id", { count: "exact", head: true })
    .eq("analysis_id", analysisId)
    .eq("user_id", user.id);

  const hasPlan = (planCount ?? 0) > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <ButtonLink href="/career-analysis" variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          ← All Analyses
        </ButtonLink>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Career Analysis</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {STAGE_LABELS[analysis.stage] ?? analysis.stage}
              </span>
              {analysis.sub_stage && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {analysis.sub_stage}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">· {analysis.country}</span>
            </div>
          </div>
          <ButtonLink href="/career-analysis/new" variant="outline" size="sm">
            New Analysis
          </ButtonLink>
        </div>
      </div>

      {/* Introduction */}
      <section className="p-6 rounded-xl border border-border bg-card space-y-3">
        <h2 className="text-lg font-semibold">Introduction</h2>
        <FormattedText text={result.intro ?? ""} />
      </section>

      {/* Analysis */}
      <section className="p-6 rounded-xl border border-border bg-card space-y-3">
        <h2 className="text-lg font-semibold">Career Analysis</h2>
        <FormattedText text={result.analysis ?? ""} />
      </section>

      {/* Geo considerations */}
      {result.geo_considerations && (
        <section className="p-6 rounded-xl border border-border bg-card space-y-3">
          <h2 className="text-lg font-semibold">
            Job Market in {analysis.country}
          </h2>
          <FormattedText text={result.geo_considerations ?? ""} />
        </section>
      )}

      {/* Career paths */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recommended Career Paths</h2>
        {result.paths?.map((path, i) => (
          <CareerPathCard
            key={i}
            path={path}
            pathIndex={i}
            analysisId={analysisId}
          />
        ))}
      </section>

      {/* Conclusion */}
      {result.conclusion && (
        <section className="p-6 rounded-xl border border-border bg-card space-y-3">
          <h2 className="text-lg font-semibold">Next Steps</h2>
          <FormattedText text={result.conclusion ?? ""} />
        </section>
      )}

      {/* CTA to Career Plan */}
      <div className="text-center py-4">
        <ButtonLink href="/career-plan" size="lg">
          {hasPlan ? "View Career Plan" : "Build Your Career Plan"}
        </ButtonLink>
      </div>
    </div>
  );
}
