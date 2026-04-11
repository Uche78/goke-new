import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuestionsAccordion } from "@/components/interview-prep/questions-accordion";
import { ButtonLink } from "@/components/ui/button-link";
import type { InterviewQuestionsResult } from "@/types/ai";

export const metadata: Metadata = { title: "Interview Questions" };

interface Props { params: Promise<{ id: string }> }

export default async function InterviewPrepResultsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data } = await supabase
    .from("interview_preps")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!data) notFound();

  const questions = data.questions_json as InterviewQuestionsResult;

  const label = data.job_title && data.company
    ? `${data.job_title} — ${data.company}`
    : (() => { const l = data.job_description.split("\n")[0].trim(); return l.length > 80 ? l.slice(0, 80) + "…" : l; })();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <ButtonLink href="/interview-prep" variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          ← All Preps
        </ButtonLink>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Interview Questions</h1>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
          <ButtonLink href="/interview-prep/new" variant="outline" size="sm" className="shrink-0">
            New Prep
          </ButtonLink>
        </div>
      </div>
      <p className="text-muted-foreground">
        {Object.values(questions).flat().length} questions generated across 7 categories.
        Expand each section to practice.
      </p>
      <QuestionsAccordion questions={questions} />
    </div>
  );
}
