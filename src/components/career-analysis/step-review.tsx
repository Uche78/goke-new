"use client";

import { useEffect, useState } from "react";
import { FileText, MapPin, TrendingUp, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { AnalysisFormData } from "./analysis-wizard";

const STAGE_LABELS: Record<string, string> = {
  early: "Early Stage",
  mid: "Mid Stage",
  late: "Late Stage",
};

const PROGRESS_STAGES = [
  { label: "Reading your resume", duration: 6000 },
  { label: "Mapping your career stage and goals", duration: 8000 },
  { label: "Researching the job market in your region", duration: 10000 },
  { label: "Identifying your strongest career paths", duration: 12000 },
  { label: "Calculating match scores and salary ranges", duration: 10000 },
  { label: "Putting it all together", duration: 999999 }, // holds until stream finishes
];

const WHILE_YOU_WAIT = [
  "What's one career achievement you're most proud of? Reflecting on it now will help you articulate your value to employers.",
  "Think about the role you'd take if you knew you couldn't fail. That instinct often points to your strongest path.",
  "What skill have colleagues complimented you on most? That's often an underestimated strength worth building on.",
  "Picture yourself 3 years from now. What does a great day at work look like? That vision shapes what path fits you best.",
  "What problem do you find yourself solving naturally, even when no one asks? That's a signal about where you add real value.",
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

    let elapsed = 0;
    const totalDuration = PROGRESS_STAGES.slice(0, -1).reduce((s, p) => s + p.duration, 0);

    const timers: ReturnType<typeof setTimeout>[] = [];

    PROGRESS_STAGES.forEach((stage, i) => {
      const delay = PROGRESS_STAGES.slice(0, i).reduce((s, p) => s + p.duration, 0);
      const t = setTimeout(() => {
        setStageIndex(i);
        setProgress(Math.min(90, Math.round((elapsed / totalDuration) * 90)));
        elapsed += stage.duration;
      }, delay);
      timers.push(t);
    });

    // Smooth progress tick every 800ms
    const ticker = setInterval(() => {
      setProgress((prev) => {
        const target = Math.min(90, prev + 1);
        return target;
      });
    }, 800);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(ticker);
    };
  }, [active]);

  return { stageIndex, progress };
}

interface Props {
  data: AnalysisFormData;
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
        <CardTitle>Review Your Information</CardTitle>
        <CardDescription>
          Confirm the details below before we run your career analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="rounded-xl border border-border divide-y divide-border">
          <div className="flex items-center gap-3 p-4">
            <FileText size={18} className="text-accent shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Resume</p>
              <p className="text-sm font-medium">{data.resumeFileName ?? "Uploaded"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <TrendingUp size={18} className="text-accent shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Career Stage</p>
              <p className="text-sm font-medium">
                {STAGE_LABELS[data.stage ?? ""] ?? data.stage}
              </p>
              <p className="text-xs text-muted-foreground">{data.subStage}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <MapPin size={18} className="text-accent shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{data.country}</p>
            </div>
          </div>
        </div>

        {/* Progress panel — shown while submitting */}
        {submitting && (
          <div className="space-y-5 rounded-xl border border-border bg-muted/30 p-5">
            {/* Stage progress */}
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

            {/* Completed stages */}
            <ul className="space-y-1.5">
              {PROGRESS_STAGES.slice(0, stageIndex).map((stage, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                  {stage.label}
                </li>
              ))}
              {/* Current stage */}
              <li className="flex items-center gap-2 text-xs text-foreground font-medium">
                <Loader2 size={13} className="text-accent animate-spin shrink-0" />
                {PROGRESS_STAGES[stageIndex].label}
              </li>
            </ul>

            {/* Divider */}
            <Separator />

            {/* While you wait tip */}
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                While you wait
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                &ldquo;{WHILE_YOU_WAIT[tipIndex]}&rdquo;
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              This usually takes 30–90 seconds. Please don&apos;t close this page.
            </p>
          </div>
        )}

        <Separator />

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack} disabled={submitting}>
            Back
          </Button>
          <Button className="flex-1" onClick={onSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitting ? "Analyzing..." : "Submit Analysis"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
