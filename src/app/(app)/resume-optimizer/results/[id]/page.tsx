import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle, ArrowUp, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { DownloadResumeButton } from "@/components/resume-optimizer/download-resume-button";
import type { ResumeOptimizationResult } from "@/types/ai";

export const metadata: Metadata = { title: "Resume Optimization Results" };

interface Props { params: Promise<{ id: string }> }

export default async function ResumeOptimizerResultsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data } = await supabase
    .from("resume_optimizations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!data) notFound();

  const result = data.result_json as ResumeOptimizationResult;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <ButtonLink href="/resume-optimizer" variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          ← All Optimizations
        </ButtonLink>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">Optimization Results</h1>
          <div className="flex items-center gap-2">
            <DownloadResumeButton optimizationId={id} />
            <ButtonLink href="/resume-optimizer/new" variant="outline" size="sm">New Optimization</ButtonLink>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Before", score: result.score_before, muted: true },
          { label: "After", score: result.score_after, muted: false },
        ].map(({ label, score, muted }) => (
          <Card key={label} className={muted ? "" : "border-accent"}>
            <CardContent className="pt-6 text-center">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className={`text-4xl font-bold ${muted ? "text-muted-foreground" : "text-accent"}`}>
                {score}
                <span className="text-base font-normal">/100</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {result.summary && (
        <Card>
          <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">{result.summary}</p></CardContent>
        </Card>
      )}

      {/* Optimized sections */}
      {result.optimized_sections?.map((section, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowUp size={16} className="text-accent" />
              <CardTitle className="text-base">{section.section}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Before</p>
                <p className="text-sm text-muted-foreground bg-muted/40 p-3 rounded-lg">{section.original}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-accent uppercase">After</p>
                <p className="text-sm bg-accent/5 border border-accent/20 p-3 rounded-lg">{section.optimized}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">{section.reason}</p>
          </CardContent>
        </Card>
      ))}

      {/* Keywords */}
      {result.keywords_added && result.keywords_added.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Keywords Added</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.keywords_added.map((kw) => (
                <Badge key={kw} variant="secondary" className="gap-1">
                  <CheckCircle size={10} className="text-accent" /> {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900">
        <TriangleAlert size={16} className="shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">Review before sending.</span> AI-generated suggestions can contain errors, outdated phrasing, or details that don&apos;t fully reflect your experience. Always review and personalize the downloaded resume before submitting it to employers.
        </p>
      </div>

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Additional Recommendations</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />{r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
