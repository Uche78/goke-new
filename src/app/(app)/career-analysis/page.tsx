import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = { title: "Career Analysis" };

const STAGE_LABELS: Record<string, string> = {
  early: "Early Stage",
  mid: "Mid Stage",
  late: "Late Stage",
};

export default async function CareerAnalysisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: analyses } = user
    ? await supabase
        .from("career_analyses")
        .select("id, stage, sub_stage, country, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Career Analysis</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered analysis of your career background and opportunities in Canada.
          </p>
        </div>
        <ButtonLink href="/career-analysis/new" size="sm">
          New Analysis
        </ButtonLink>
      </div>

      {!analyses || analyses.length === 0 ? (
        <div className="text-center py-16 space-y-4 border border-dashed border-border rounded-xl">
          <BarChart2 size={40} className="mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground">No analyses yet.</p>
          <ButtonLink href="/career-analysis/new">Start Career Analysis</ButtonLink>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis, index) => (
            <Link
              key={analysis.id}
              href={`/career-analysis/results/${analysis.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow hover:border-accent/40">
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                      <BarChart2 size={18} className="text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">
                          {STAGE_LABELS[analysis.stage] ?? analysis.stage}
                        </p>
                        {analysis.sub_stage && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {analysis.sub_stage}
                          </Badge>
                        )}
                        {index === 0 && (
                          <Badge className="text-xs bg-accent text-white">Latest</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {analysis.country} ·{" "}
                        {formatDistanceToNow(new Date(analysis.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
