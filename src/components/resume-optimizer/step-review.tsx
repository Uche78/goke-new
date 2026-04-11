"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { OptimizerFormData } from "./optimizer-wizard";

const PROGRESS_STAGES = [
  { label: "Reading your resume", duration: 5000 },
  { label: "Analysing the job requirements", duration: 7000 },
  { label: "Identifying keyword gaps and missing skills", duration: 9000 },
  { label: "Scoring your current resume against the role", duration: 8000 },
  { label: "Rewriting sections for maximum impact", duration: 10000 },
  { label: "Finalising your optimised resume", duration: 999999 },
];

const WHILE_YOU_WAIT = [
  "Think about the strongest result you achieved in your last role. Numbers make that story 3x more powerful to a hiring manager.",
  "Hiring managers spend an average of 7 seconds on a first resume scan. Your top third is everything — lead with impact.",
  "Tailoring your resume to each role isn't optional anymore — ATS filters eliminate up to 75% of applications before a human sees them.",
  "The best resumes answer one question: 'What will this person do for us?' Every bullet should point to that answer.",
  "Soft skills on a resume are invisible without proof. Replace 'great communicator' with a specific example of communication that drove results.",
];

function useProgressSimulation(active: boolean) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setStageIndex(0);
      setProgress(0);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    PROGRESS_STAGES.forEach((_, i) => {
      const delay = PROGRESS_STAGES.slice(0, i).reduce((s, p) => s + p.duration, 0);
      if (delay >= 999999) return;
      const t = setTimeout(() => setStageIndex(i), delay);
      timers.push(t);
    });

    const ticker = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 1 : prev));
    }, 800);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(ticker);
    };
  }, [active]);

  return { stageIndex, progress };
}

interface Props {
  data: OptimizerFormData;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

export function StepReview({ data, onSubmit, onBack, submitting }: Props) {
  const { stageIndex, progress } = useProgressSimulation(submitting);
  const [tipIndex] = useState(() => Math.floor(Math.random() * WHILE_YOU_WAIT.length));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>Confirm your details before we optimize your resume.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="rounded-xl border border-border divide-y divide-border text-sm">
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Job Title</p>
            <p className="font-medium">{data.jobTitle}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Resume</p>
            <p className="font-medium">{data.resumeFileName ?? "Uploaded"}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Job Description</p>
            <p className="text-muted-foreground line-clamp-3">{data.jobDescription}</p>
          </div>
        </div>

        {/* Progress panel */}
        {submitting && (
          <div className="space-y-5 rounded-xl border border-border bg-muted/30 p-5">
            {/* Stage + bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground text-sm">
                  {PROGRESS_STAGES[stageIndex].label}
                  <span className="animate-pulse">...</span>
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Completed stages checklist */}
            <ul className="space-y-1.5">
              {PROGRESS_STAGES.slice(0, stageIndex).map((stage, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                  {stage.label}
                </li>
              ))}
              <li className="flex items-center gap-2 text-xs text-foreground font-medium">
                <Loader2 size={13} className="text-accent animate-spin shrink-0" />
                {PROGRESS_STAGES[stageIndex].label}
              </li>
            </ul>

            <Separator />

            {/* While you wait */}
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                While you wait
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                &ldquo;{WHILE_YOU_WAIT[tipIndex]}&rdquo;
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              This usually takes 30–60 seconds. Please don&apos;t close this page.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack} disabled={submitting}>
            Back
          </Button>
          <Button className="flex-1" onClick={onSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitting ? "Optimizing..." : "Optimize Resume"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
