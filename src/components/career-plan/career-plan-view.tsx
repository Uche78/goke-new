"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2, ChevronDown, Zap, Star, RefreshCw,
  CheckCircle2, Square, CheckSquare, UserCircle, Lock, ChevronsUpDown, ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import type { CareerAnalysisResult, CareerPlanResult } from "@/types/ai";
import { ButtonLink } from "@/components/ui/button-link";
import { InsufficientCreditsModal } from "@/components/app/insufficient-credits-modal";
import type { CreditTool } from "@/lib/credits";
import { formatDistanceToNow } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalysisSummary {
  id: string;
  stage: string;
  country: string;
  created_at: string;
}

interface StoredPlan {
  id: string | null;
  data: CareerPlanResult;
  completedTasks: string[]; // ["milestoneIdx-actionIdx", ...]
}

interface Props {
  analysisId: string | null;
  allAnalyses: AnalysisSummary[];
  defaultPathIndex?: number;
  firstName: string | null;
  plan: "free" | "pro";
}

const TIMEFRAMES: Array<{ value: "1mo" | "3mo" | "6mo"; label: string }> = [
  { value: "1mo", label: "1 Month" },
  { value: "3mo", label: "3 Months" },
  { value: "6mo", label: "6 Months" },
];

// ─── Progress stages per timeframe ───────────────────────────────────────────

const PLAN_STAGES: Record<"1mo" | "3mo" | "6mo", Array<{ label: string; duration: number }>> = {
  "1mo": [
    { label: "Reviewing your career path and goals", duration: 7000 },
    { label: "Mapping quick wins for immediate impact", duration: 9000 },
    { label: "Sequencing your week-by-week actions", duration: 10000 },
    { label: "Identifying fast-track milestones", duration: 8000 },
    { label: "Finalising your 30-day sprint plan", duration: 999999 },
  ],
  "3mo": [
    { label: "Reviewing your career path and goals", duration: 7000 },
    { label: "Mapping skill development phases", duration: 10000 },
    { label: "Sequencing key momentum checkpoints", duration: 10000 },
    { label: "Building your resource roadmap", duration: 8000 },
    { label: "Finalising your 90-day roadmap", duration: 999999 },
  ],
  "6mo": [
    { label: "Reviewing your career path and goals", duration: 7000 },
    { label: "Projecting your long-term trajectory", duration: 10000 },
    { label: "Mapping strategic milestones", duration: 11000 },
    { label: "Building a resource and learning roadmap", duration: 9000 },
    { label: "Finalising your 6-month strategy", duration: 999999 },
  ],
};

const WHILE_YOU_WAIT = [
  "What's one skill you've always wanted to develop? Your plans will show you the right time to pursue it.",
  "Think about the mentor or leader who's influenced you most. What did they do that you want to replicate?",
  "What would you want your manager to say about you in your next performance review? Work backwards from that.",
  "Which part of your current role energises you the most? The best career paths build on those moments.",
  "If you could add one line to your resume in 6 months, what would it be? That's your north star.",
];

// ─── Progress hook ────────────────────────────────────────────────────────────

function usePlanProgress(active: boolean, timeframe: "1mo" | "3mo" | "6mo") {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setStageIndex(0);
      setProgress(0);
      return;
    }

    const stages = PLAN_STAGES[timeframe];
    const timers: ReturnType<typeof setTimeout>[] = [];

    stages.forEach((_, i) => {
      const delay = stages.slice(0, i).reduce((s, p) => s + p.duration, 0);
      if (delay >= 999999) return;
      const t = setTimeout(() => setStageIndex(i), delay);
      timers.push(t);
    });

    const ticker = setInterval(() => {
      setProgress((prev) => (prev < 88 ? prev + 1 : prev));
    }, 600);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(ticker);
    };
  }, [active, timeframe]);

  return { stageIndex, progress };
}

// ─── Per-plan progress card ───────────────────────────────────────────────────

function PlanProgressCard({ timeframe, label }: { timeframe: "1mo" | "3mo" | "6mo"; label: string }) {
  const stages = PLAN_STAGES[timeframe];
  const { stageIndex, progress } = usePlanProgress(true, timeframe);

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-5">
      <div className="flex items-center gap-2">
        <Loader2 size={15} className="text-accent animate-spin shrink-0" />
        <p className="text-sm font-semibold">Building your {label} plan...</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground/80">
            {stages[stageIndex].label}
            <span className="animate-pulse">...</span>
          </span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      {stageIndex > 0 && (
        <ul className="space-y-1">
          {stages.slice(0, stageIndex).map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 size={12} className="text-green-500 shrink-0" />
              {s.label}
            </li>
          ))}
          <li className="flex items-center gap-2 text-xs font-medium text-foreground">
            <Loader2 size={12} className="text-accent animate-spin shrink-0" />
            {stages[stageIndex].label}
          </li>
        </ul>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countCompletableTasks(plan: CareerPlanResult): number {
  return plan.milestones?.reduce((total, milestone) => {
    return total + milestone.actions.filter(
      (a) => a.type === "quick_win" || a.type === "key_milestone"
    ).length;
  }, 0) ?? 0;
}

// ─── Analysis switcher ────────────────────────────────────────────────────────

function AnalysisSwitcher({
  analyses,
  activeId,
  onSwitch,
}: {
  analyses: AnalysisSummary[];
  activeId: string;
  onSwitch: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = analyses.find((a) => a.id === activeId);

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-muted-foreground shrink-0">Plans for</span>
        <span className="text-sm font-medium truncate capitalize">
          {active?.stage} Stage · {active?.country}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          {active ? formatDistanceToNow(new Date(active.created_at), { addSuffix: true }) : ""}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href={`/career-analysis/results/${activeId}`}
          className="flex items-center gap-1 text-xs text-accent hover:underline underline-offset-2"
        >
          View analysis
          <ExternalLink size={11} />
        </a>

        {analyses.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-medium hover:border-accent/50 transition-colors"
            >
              Switch
              <ChevronsUpDown size={12} className="text-muted-foreground" />
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 z-20 w-64 rounded-xl border border-border bg-background shadow-lg overflow-hidden">
                  {analyses.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { onSwitch(a.id); setOpen(false); }}
                      className={`w-full flex items-start justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50 ${
                        a.id === activeId ? "bg-accent/5" : ""
                      }`}
                    >
                      <div>
                        <p className={`font-medium capitalize ${a.id === activeId ? "text-accent" : "text-foreground"}`}>
                          {a.stage} Stage · {a.country}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {a.id === activeId && (
                        <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CareerPlanView({ analysisId, allAnalyses, defaultPathIndex = 0, firstName, plan }: Props) {
  const router = useRouter();
  const [activeAnalysisId, setActiveAnalysisId] = useState(analysisId);
  const [analysis, setAnalysis] = useState<CareerAnalysisResult | null>(null);
  const [selectedPath, setSelectedPath] = useState(defaultPathIndex);
  const [plans, setPlans] = useState<Record<string, StoredPlan>>({});
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());
  const [generatingAll, setGeneratingAll] = useState(false);
  const [tipIndex] = useState(() => Math.floor(Math.random() * WHILE_YOU_WAIT.length));
  const [resolvedName, setResolvedName] = useState<string | null>(firstName);
  const [showNamePrompt, setShowNamePrompt] = useState(!firstName);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [creditError, setCreditError] = useState<{ tool: CreditTool; balance: number } | null>(null);

  const anyLoading = loadingKeys.size > 0 || generatingAll;

  useEffect(() => {
    if (!activeAnalysisId) return;
    setAnalysis(null);
    setPlans({});
    setSelectedPath(0);
    setLoadingKeys(new Set());

    const load = async () => {
      const supabase = createClient();

      const { data: analysisData } = await supabase
        .from("career_analyses")
        .select("analysis_json")
        .eq("id", activeAnalysisId)
        .single();
      if (analysisData) setAnalysis(analysisData.analysis_json as CareerAnalysisResult);

      const { data: savedPlans } = await supabase
        .from("career_plans")
        .select("id, path_index, timeframe, plan_json, completed_tasks")
        .eq("analysis_id", activeAnalysisId);

      if (savedPlans && savedPlans.length > 0) {
        const planMap: Record<string, StoredPlan> = {};
        for (const p of savedPlans) {
          planMap[`${p.path_index}-${p.timeframe}`] = {
            id: p.id,
            data: p.plan_json as CareerPlanResult,
            completedTasks: (p.completed_tasks as string[]) ?? [],
          };
        }
        setPlans(planMap);
      }
    };
    load();
  }, [activeAnalysisId]);

  const handleSwitchAnalysis = (id: string) => {
    setActiveAnalysisId(id);
    router.replace(`/career-plan?analysisId=${id}`);
  };

  const fetchPlan = async (timeframe: "1mo" | "3mo" | "6mo", pathIndex: number) => {
    const key = `${pathIndex}-${timeframe}`;
    setLoadingKeys((prev) => new Set(prev).add(key));
    try {
      const res = await fetch("/api/career-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: activeAnalysisId, pathIndex, timeframe }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setCreditError({ tool: `career_plan_${timeframe}` as CreditTool, balance: data.balance ?? 0 });
        return;
      }
      if (!res.ok) throw new Error(data.error);
      if (!data.plan?.milestones?.length) throw new Error("Empty response");
      setPlans((prev) => ({
        ...prev,
        [key]: {
          id: data.id ?? null,
          data: data.plan as CareerPlanResult,
          completedTasks: data.completedTasks ?? [],
        },
      }));
    } catch (err) {
      toast.error(`Failed to generate ${timeframe} plan: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoadingKeys((prev) => { const s = new Set(prev); s.delete(key); return s; });
    }
  };

  const handleGenerateAll = async () => {
    setGeneratingAll(true);
    const allowedTimeframes = plan === "free" ? ["1mo"] : TIMEFRAMES.map(({ value }) => value);
    const missing = allowedTimeframes.filter((tf) => !plans[`${selectedPath}-${tf}`]);
    await Promise.allSettled(missing.map((tf) => fetchPlan(tf as "1mo" | "3mo" | "6mo", selectedPath)));
    setGeneratingAll(false);
  };

  const handleToggleTask = useCallback(async (planKey: string, taskKey: string) => {
    const stored = plans[planKey];
    if (!stored) return;

    const isChecked = stored.completedTasks.includes(taskKey);
    const newCompleted = isChecked
      ? stored.completedTasks.filter((k) => k !== taskKey)
      : [...stored.completedTasks, taskKey];

    // Optimistic update — always runs immediately regardless of id
    setPlans((prev) => ({
      ...prev,
      [planKey]: { ...prev[planKey], completedTasks: newCompleted },
    }));

    // Persist to Supabase only if we have a plan id
    if (!stored.id) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("career_plans")
      .update({ completed_tasks: newCompleted })
      .eq("id", stored.id);

    if (error) {
      // Rollback on failure
      setPlans((prev) => ({
        ...prev,
        [planKey]: { ...prev[planKey], completedTasks: stored.completedTasks },
      }));
      toast.error("Could not save progress. Please try again.");
    }
  }, [plans]);

  const getPlan = (timeframe: "1mo" | "3mo" | "6mo") => fetchPlan(timeframe, selectedPath);

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) { setShowNamePrompt(false); return; }
    setSavingName(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ first_name: trimmed })
      .eq("id", (await supabase.auth.getUser()).data.user!.id);
    if (error) toast.error("Could not save your name. You can update it in Profile.");
    else {
      setResolvedName(trimmed);
      toast.success(`Welcome, ${trimmed}!`);
    }
    setShowNamePrompt(false);
    setSavingName(false);
  };

  if (!activeAnalysisId) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">You need to complete a Career Analysis first.</p>
        <ButtonLink href="/career-analysis">Start Career Analysis</ButtonLink>
      </div>
    );
  }

  const activeAnalysis = allAnalyses.find((a) => a.id === activeAnalysisId);

  return (
    <>
    <InsufficientCreditsModal
      open={!!creditError}
      onClose={() => setCreditError(null)}
      tool={creditError?.tool ?? "career_plan_1mo"}
      balance={creditError?.balance ?? 0}
    />
    <div className="space-y-6">

      {/* Analysis switcher */}
      {activeAnalysis && (
        <AnalysisSwitcher
          analyses={allAnalyses}
          activeId={activeAnalysisId!}
          onSwitch={handleSwitchAnalysis}
        />
      )}

      {/* Loading analysis */}
      {!analysis ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Path selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Select a Career Path</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.paths?.map((path, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedPath(i); setLoadingKeys(new Set()); }}
                  className={`text-left p-4 rounded-xl border-2 transition-colors flex flex-col gap-2 ${
                    selectedPath === i ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm leading-snug">{path.name}</p>
                    <span className="text-xs font-semibold text-accent shrink-0">{path.match_percent}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{path.salary_range}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full w-fit border ${
                    path.growth_type === "vertical"
                      ? "text-accent bg-accent/10 border-accent/20"
                      : "text-muted-foreground bg-muted border-border"
                  }`}>
                    {path.growth_type === "vertical" ? "Vertical growth" : "Horizontal growth"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Name prompt — shown once if first_name is missing */}
          {showNamePrompt && (
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <UserCircle size={18} className="text-accent shrink-0" />
                <p className="text-sm font-semibold">Personalise your plan</p>
              </div>
              <p className="text-sm text-muted-foreground">
                What should we call you? We&apos;ll use your name to tailor the plan language.
              </p>
              <div className="flex gap-2">
                <Input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your first name"
                  className="max-w-xs"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                />
                <Button onClick={handleSaveName} disabled={savingName} size="sm">
                  {savingName ? <Loader2 size={14} className="animate-spin" /> : "Save"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowNamePrompt(false)} className="text-muted-foreground">
                  Skip
                </Button>
              </div>
            </div>
          )}

          {/* Generate button */}
          {TIMEFRAMES.every(({ value }) => !plans[`${selectedPath}-${value}`]) && !anyLoading && (
            <div className="text-center py-4 space-y-1.5">
              {plan === "free" ? (
                <>
                  <Button size="lg" onClick={handleGenerateAll}>
                    Generate {resolvedName ? `${resolvedName}'s` : ""} 1-Month Plan
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Upgrade to Pro to unlock 3-month and 6-month plans
                  </p>
                </>
              ) : (
                <>
                  <Button size="lg" onClick={handleGenerateAll}>
                    Generate {resolvedName ? `${resolvedName}'s` : "All"} Plans (1, 3 &amp; 6 Month)
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    All three plans generate in parallel — usually takes 60–90 seconds
                  </p>
                </>
              )}
            </div>
          )}

          {/* Timeframe tabs */}
          <Tabs defaultValue="1mo">
            <TabsList className="w-full">
              {TIMEFRAMES.map(({ value, label }) => {
                const key = `${selectedPath}-${value}`;
                const isLoading = loadingKeys.has(key);
                const stored = plans[key];
                const completable = stored ? countCompletableTasks(stored.data) : 0;
                const completed = stored ? stored.completedTasks.length : 0;

                return (
                  <TabsTrigger key={value} value={value} className="flex-1 gap-1.5">
                    {label}
                    {isLoading && <Loader2 size={11} className="animate-spin" />}
                    {stored && !isLoading && completable > 0 && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        completed === completable
                          ? "bg-green-500 text-white"
                          : "bg-accent/15 text-accent"
                      }`}>
                        {completed}/{completable}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {TIMEFRAMES.map(({ value, label }) => {
              const key = `${selectedPath}-${value}`;
              const stored = plans[key];
              const isLoading = loadingKeys.has(key);
              return (
                <TabsContent key={value} value={value} className="mt-4">
                  {isLoading ? (
                    <PlanProgressCard timeframe={value} label={label} />
                  ) : stored ? (
                    <PlanContent
                      plan={stored.data}
                      completedTasks={stored.completedTasks}
                      onToggle={(taskKey) => handleToggleTask(key, taskKey)}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-12">
                      {!anyLoading && (() => {
                        const isLocked = plan === "free" && (value === "3mo" || value === "6mo");
                        if (isLocked) {
                          return (
                            <div className="w-full max-w-sm rounded-xl border border-border bg-muted/30 p-6 text-center space-y-3">
                              <Lock size={22} className="mx-auto text-muted-foreground" />
                              <p className="font-medium text-sm">{label} Plan — Pro only</p>
                              <p className="text-xs text-muted-foreground">
                                Upgrade to Pro to generate 3-month and 6-month career plans.
                              </p>
                              <ButtonLink href="/pricing" className="w-full justify-center">
                                Upgrade to Pro
                              </ButtonLink>
                            </div>
                          );
                        }
                        return (
                          <>
                            <p className="text-sm text-muted-foreground">This plan could not be generated.</p>
                            <Button variant="outline" onClick={() => getPlan(value)}>
                              Retry {label} Plan
                            </Button>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Global "while you wait" */}
          {anyLoading && (
            <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-3">
              <Separator />
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">While you wait</p>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{WHILE_YOU_WAIT[tipIndex]}&rdquo;
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Plans are generating in parallel — please don&apos;t close this page.
              </p>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
}

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  quick_win:     { label: "Quick Win",     icon: Zap,       className: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  key_milestone: { label: "Key Milestone", icon: Star,      className: "text-accent bg-accent/10 border-accent/20" },
  ongoing:       { label: "Ongoing",       icon: RefreshCw, className: "text-blue-600 bg-blue-50 border-blue-200" },
};

// ─── Plan content ─────────────────────────────────────────────────────────────

interface PlanContentProps {
  plan: CareerPlanResult;
  completedTasks: string[];
  onToggle: (taskKey: string) => void;
}

function PlanContent({ plan, completedTasks, onToggle }: PlanContentProps) {
  return (
    <div className="space-y-6">
      {plan.overview && (
        <div className="p-4 rounded-xl bg-muted/40 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">{plan.overview}</p>
        </div>
      )}

      {plan.milestones?.map((milestone, mi) => (
        <Card key={mi}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                {milestone.label ?? `Milestone ${mi + 1}`}
              </span>
              <CardTitle className="text-base">{milestone.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {milestone.actions.map((action, ai) => {
                const typeKey = (action.type ?? "ongoing") as keyof typeof TYPE_CONFIG;
                const config = TYPE_CONFIG[typeKey] ?? TYPE_CONFIG.ongoing;
                const Icon = config.icon;
                const isCompletable = true;
                const taskKey = `${mi}-${ai}`;
                const isCompleted = completedTasks.includes(taskKey);

                return (
                  <li key={ai} className="flex items-start gap-3">
                    {isCompletable ? (
                      <button
                        onClick={() => onToggle(taskKey)}
                        className="mt-0.5 shrink-0 text-muted-foreground hover:text-accent transition-colors"
                        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                      >
                        {isCompleted
                          ? <CheckSquare size={16} className="text-accent" />
                          : <Square size={16} />
                        }
                      </button>
                    ) : (
                      <RefreshCw size={14} className="text-muted-foreground/40 mt-1 shrink-0" />
                    )}

                    <div className="flex-1 flex items-start justify-between gap-2 min-w-0">
                      <span className={`text-sm leading-relaxed transition-all ${
                        isCompleted
                          ? "line-through text-muted-foreground/50"
                          : "text-foreground"
                      }`}>
                        {action.task}
                      </span>
                      <span className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${
                        isCompleted ? "opacity-40" : ""
                      } ${config.className}`}>
                        <Icon size={9} />
                        {config.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ))}

      {plan.resources && plan.resources.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Recommended Resources</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.resources.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {plan.success_metrics && plan.success_metrics.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Success Metrics</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.success_metrics.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
