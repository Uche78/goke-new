import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { InterviewQuestionsResult } from "@/types/ai";

export const metadata: Metadata = { title: "Interview Prep" };

export default async function InterviewPrepPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: preps } = user
    ? await supabase
        .from("interview_preps")
        .select("id, job_title, company, job_description, questions_json, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Interview Prep</h1>
          <p className="text-muted-foreground mt-1">
            AI-generated interview questions tailored to your resume and target role.
          </p>
        </div>
        <ButtonLink href="/interview-prep/new" size="sm">
          New Prep
        </ButtonLink>
      </div>

      {!preps || preps.length === 0 ? (
        <div className="text-center py-16 space-y-4 border border-dashed border-border rounded-xl">
          <MessageSquare size={40} className="mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground">No interview preps yet.</p>
          <ButtonLink href="/interview-prep/new">Start Interview Prep</ButtonLink>
        </div>
      ) : (
        <div className="space-y-3">
          {preps.map((prep, index) => {
            const questions = prep.questions_json as InterviewQuestionsResult;
            const totalQuestions = Object.values(questions).flat().length;
            const label = prep.job_title && prep.company
              ? `${prep.job_title} — ${prep.company}`
              : (() => { const l = prep.job_description.split("\n")[0].trim(); return l.length > 60 ? l.slice(0, 60) + "…" : l; })();

            return (
              <Link key={prep.id} href={`/interview-prep/results/${prep.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow hover:border-accent/40">
                  <CardContent className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                        <MessageSquare size={18} className="text-accent" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm truncate">{label}</p>
                          {index === 0 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent text-white shrink-0">
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {totalQuestions} questions ·{" "}
                          {formatDistanceToNow(new Date(prep.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground shrink-0" />
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
