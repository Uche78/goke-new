import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  TrendingUp, Map, FileText, MessageSquare,
  ArrowRight, CheckCircle2, Circle, ChevronRight,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { formatDistanceToNow } from "date-fns";
import type { CareerPlanResult, ResumeOptimizationResult, InterviewQuestionsResult } from "@/types/ai";

export const metadata: Metadata = { title: "Dashboard" };

const MOTIVATIONAL_TIPS = [
  "Candidates who tailor their resume to each role are 3x more likely to get an interview.",
  "The average job posting receives 250 applications. A targeted resume puts you in the top 10%.",
  "Hiring managers decide in 7 seconds. Your resume's top third is doing all the heavy lifting.",
  "Following up after an interview increases your hire rate by 22%. Most candidates never bother.",
  "LinkedIn profiles with a professional photo get 21x more views. First impressions are digital now.",
  "Networking accounts for up to 85% of jobs filled. Your next role may never be posted publicly.",
];

const STAGE_LABELS: Record<string, string> = {
  early: "Early Stage",
  mid: "Mid Stage",
  late: "Late Stage",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    profileRes,
    latestAnalysisRes,
    latestPlanRes,
    latestOptimizationRes,
    latestInterviewRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("career_analyses")
      .select("id, stage, country, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("career_plans")
      .select("id, timeframe, plan_json, completed_tasks, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("resume_optimizations")
      .select("id, job_title, result_json, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("interview_preps")
      .select("id, job_title, company, questions_json, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const firstName = profileRes.data?.first_name ?? "there";
  const latestAnalysis = latestAnalysisRes.data;
  const latestPlan = latestPlanRes.data;
  const latestOptimization = latestOptimizationRes.data;
  const latestInterview = latestInterviewRes.data;

  // ── Toolkit completion ──────────────────────────────────────────────────────
  const hasAnalysis = !!latestAnalysis;
  const hasPlan = !!latestPlan;
  const hasOptimization = !!latestOptimization;
  const hasInterview = !!latestInterview;
  const toolsUsed = [hasAnalysis, hasPlan, hasOptimization, hasInterview].filter(Boolean).length;

  // ── Next step ───────────────────────────────────────────────────────────────
  const nextStep = !hasAnalysis
    ? { label: "Start your Career Analysis", href: "/career-analysis/new", description: "Discover your best career paths tailored to your background and the Canadian job market." }
    : !hasPlan
    ? { label: "Build your Career Plan", href: "/career-plan", description: "Turn your career analysis into a concrete 1, 3 and 6 month action plan." }
    : !hasOptimization
    ? { label: "Optimize your Resume", href: "/resume-optimizer/new", description: "Tailor your resume to a specific role and boost your chances of passing ATS filters." }
    : !hasInterview
    ? { label: "Prep for your Interview", href: "/interview-prep/new", description: "Practice with AI-generated questions specific to your target role and background." }
    : { label: "Start a new Interview Prep", href: "/interview-prep/new", description: "Consistent interview practice is what separates good candidates from great ones." };

  // ── Career plan task progress ───────────────────────────────────────────────
  let planTasksDone = 0;
  let planTasksTotal = 0;
  if (latestPlan) {
    const planData = latestPlan.plan_json as CareerPlanResult;
    const completedTasks = (latestPlan.completed_tasks as string[]) ?? [];
    planTasksDone = completedTasks.length;
    planTasksTotal = planData.milestones?.reduce(
      (total, m) => total + m.actions.filter(
        (a) => a.type === "quick_win" || a.type === "key_milestone"
      ).length,
      0
    ) ?? 0;
  }

  // ── Resume score improvement ────────────────────────────────────────────────
  let scoreImprovement: number | null = null;
  if (latestOptimization) {
    const result = latestOptimization.result_json as ResumeOptimizationResult;
    if (result?.score_before != null && result?.score_after != null) {
      scoreImprovement = result.score_after - result.score_before;
    }
  }

  // ── Interview question count ────────────────────────────────────────────────
  let questionCount = 0;
  if (latestInterview?.questions_json) {
    const q = latestInterview.questions_json as InterviewQuestionsResult;
    questionCount = Object.values(q).flat().length;
  }

  // ── Recent activity ─────────────────────────────────────────────────────────
  type ActivityItem = {
    id: string;
    href: string;
    Icon: typeof TrendingUp;
    title: string;
    subtitle: string;
    created_at: string;
  };

  const activityItems: ActivityItem[] = (
    [
      latestAnalysis && {
        id: latestAnalysis.id,
        href: `/career-analysis/results/${latestAnalysis.id}`,
        Icon: TrendingUp,
        title: `${STAGE_LABELS[latestAnalysis.stage] ?? latestAnalysis.stage} Analysis`,
        subtitle: latestAnalysis.country,
        created_at: latestAnalysis.created_at,
      },
      latestPlan && {
        id: latestPlan.id,
        href: "/career-plan",
        Icon: Map,
        title: `${latestPlan.timeframe === "1mo" ? "1 Month" : latestPlan.timeframe === "3mo" ? "3 Month" : "6 Month"} Career Plan`,
        subtitle: planTasksTotal > 0
          ? `${planTasksDone} of ${planTasksTotal} tasks completed`
          : "View plan",
        created_at: latestPlan.created_at,
      },
      latestOptimization && {
        id: latestOptimization.id,
        href: `/resume-optimizer/results/${latestOptimization.id}`,
        Icon: FileText,
        title: `Resume — ${latestOptimization.job_title}`,
        subtitle: scoreImprovement !== null
          ? `↑ ${scoreImprovement} point${scoreImprovement !== 1 ? "s" : ""} improvement`
          : "View results",
        created_at: latestOptimization.created_at,
      },
      latestInterview && {
        id: latestInterview.id,
        href: `/interview-prep/results/${latestInterview.id}`,
        Icon: MessageSquare,
        title: latestInterview.job_title && latestInterview.company
          ? `${latestInterview.job_title} — ${latestInterview.company}`
          : "Interview Prep",
        subtitle: `${questionCount} questions generated`,
        created_at: latestInterview.created_at,
      },
    ] as (ActivityItem | false)[]
  )
    .filter((item): item is ActivityItem => !!item)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // ── Tip (rotates hourly — server-safe) ─────────────────────────────────────
  const tip = MOTIVATIONAL_TIPS[new Date().getHours() % MOTIVATIONAL_TIPS.length];

  // ── Toolkit items ───────────────────────────────────────────────────────────
  const TOOLKIT = [
    { label: "Career Analysis", Icon: TrendingUp, done: hasAnalysis, href: "/career-analysis" },
    { label: "Career Plan",     Icon: Map,        done: hasPlan,     href: "/career-plan" },
    { label: "Resume Optimizer",Icon: FileText,   done: hasOptimization, href: "/resume-optimizer" },
    { label: "Interview Prep",  Icon: MessageSquare, done: hasInterview, href: "/interview-prep" },
  ];

  // SVG ring: r=22, circumference = 2π×22 ≈ 138.2
  const CIRCUMFERENCE = 138.2;
  const ringProgress = (toolsUsed / 4) * CIRCUMFERENCE;

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* ── Greeting + progress ring ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {firstName}</h1>
          <p className="text-muted-foreground mt-1">
            {toolsUsed === 0
              ? "Let's get started on your career journey."
              : toolsUsed === 4
              ? "You've completed your full career toolkit. Keep the momentum going."
              : `You've used ${toolsUsed} of 4 tools — keep building.`}
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center gap-1">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28" cy="28" r="22"
                fill="none" strokeWidth="4"
                stroke="currentColor" className="text-border"
              />
              <circle
                cx="28" cy="28" r="22"
                fill="none" strokeWidth="4"
                stroke="currentColor" className="text-accent transition-all"
                strokeDasharray={`${ringProgress} ${CIRCUMFERENCE}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {toolsUsed}/4
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">Toolkit</span>
        </div>
      </div>

      {/* ── Recommended next step ── */}
      <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
            Recommended next step
          </p>
          <p className="font-semibold text-foreground">{nextStep.label}</p>
          <p className="text-sm text-muted-foreground">{nextStep.description}</p>
        </div>
        <ButtonLink href={nextStep.href} className="shrink-0 gap-1.5">
          Get started <ArrowRight size={14} />
        </ButtonLink>
      </div>

      {/* ── Toolkit tracker ── */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Your Career Toolkit
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TOOLKIT.map(({ label, Icon, done, href }) => (
            <Link
              key={label}
              href={href}
              className={`p-4 rounded-xl border transition-colors flex flex-col gap-2 ${
                done
                  ? "border-accent/30 bg-accent/5 hover:bg-accent/10"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon size={18} className={done ? "text-accent" : "text-muted-foreground"} />
                {done
                  ? <CheckCircle2 size={15} className="text-green-500" />
                  : <Circle size={15} className="text-muted-foreground/30" />
                }
              </div>
              <p className="text-xs font-medium leading-snug">{label}</p>
              <span className={`text-[10px] font-semibold ${done ? "text-green-600" : "text-muted-foreground"}`}>
                {done ? "Completed" : "Not started"}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent activity ── */}
      {activityItems.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Recent Activity
          </h2>
          <div className="space-y-2">
            {activityItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                    <item.Icon size={16} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.subtitle} · {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Motivational tip ── */}
      <div className="rounded-xl bg-muted/40 border border-border px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-accent mb-1">
          Did you know
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          &ldquo;{tip}&rdquo;
        </p>
      </div>

    </div>
  );
}
