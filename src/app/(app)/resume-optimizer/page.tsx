import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = { title: "Resume Optimizer" };

export default async function ResumeOptimizerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: optimizations } = user
    ? await supabase
        .from("resume_optimizations")
        .select("id, job_title, created_at, result_json")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resume Optimizer</h1>
          <p className="text-muted-foreground mt-1">
            Tailor your resume to any job description and boost your chances of
            getting an interview.
          </p>
        </div>
        <ButtonLink href="/resume-optimizer/new" size="sm">
          New Optimization
        </ButtonLink>
      </div>

      {!optimizations || optimizations.length === 0 ? (
        <div className="text-center py-16 space-y-4 border border-dashed border-border rounded-xl">
          <FileText size={40} className="mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground">No optimizations yet.</p>
          <ButtonLink href="/resume-optimizer/new">Optimize Your Resume</ButtonLink>
        </div>
      ) : (
        <div className="space-y-3">
          {optimizations.map((opt) => {
            const result = opt.result_json as {
              score_before?: number;
              score_after?: number;
            };
            const improvement =
              result.score_after && result.score_before
                ? result.score_after - result.score_before
                : null;

            return (
              <Link
                key={opt.id}
                href={`/resume-optimizer/results/${opt.id}`}
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow hover:border-accent/40">
                  <CardContent className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                        <FileText size={18} className="text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{opt.job_title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(opt.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {improvement !== null && (
                        <Badge
                          variant="secondary"
                          className="text-xs gap-1 text-green-600 bg-green-50"
                        >
                          +{improvement} pts
                        </Badge>
                      )}
                      {result.score_after && (
                        <span className="text-sm font-semibold text-accent">
                          {result.score_after}/100
                        </span>
                      )}
                      <ArrowRight size={16} className="text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
