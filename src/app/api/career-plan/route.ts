import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, AI_MODEL } from "@/lib/ai/client";
import { buildCareerPlanPrompt } from "@/lib/ai/prompts/career-plan";
import { z } from "zod";
import type { CareerAnalysisResult } from "@/types/ai";

export const maxDuration = 120;

const bodySchema = z.object({
  analysisId: z.uuid(),
  pathIndex: z.number().min(0).max(2),
  timeframe: z.enum(["1mo", "3mo", "6mo"]),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { analysisId, pathIndex, timeframe } = parsed.data;

  // Check cache
  const { data: existing } = await supabase
    .from("career_plans")
    .select("id, plan_json, completed_tasks")
    .eq("analysis_id", analysisId)
    .eq("path_index", pathIndex)
    .eq("timeframe", timeframe)
    .single();

  if (existing) {
    return NextResponse.json({
      id: existing.id,
      plan: existing.plan_json,
      completedTasks: existing.completed_tasks ?? [],
    });
  }

  // Fetch the analysis
  const { data: analysis } = await supabase
    .from("career_analyses")
    .select("analysis_json, resume_text, country")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  const analysisData = analysis.analysis_json as CareerAnalysisResult;
  const path = analysisData.paths?.[pathIndex];

  if (!path) {
    return NextResponse.json({ error: "Career path not found" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

  const planMaxTokens = 4096;

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: planMaxTokens,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: buildCareerPlanPrompt({
          firstName: profile?.first_name ?? "there",
          pathName: path.name,
          pathReasoning: path.reasoning,
          timeframe,
          country: analysis.country,
          resumeSummary: (analysis.resume_text ?? "").slice(0, 2000),
        }),
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  let planJson = {};
  try {
    planJson = JSON.parse(text.replace(/\u0000/g, ""));
  } catch {
    // Fallback: extract JSON object (handles accidental markdown fences)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        planJson = JSON.parse(
          jsonMatch[0].replace(/\\u0000/g, "").replace(/\u0000/g, "")
        );
      } catch {
        console.error("Failed to parse career plan JSON. Raw response:", text.slice(0, 200));
      }
    }
  }

  // Only cache if we got real content
  const plan = planJson as { milestones?: unknown[] };
  let insertedId: string | null = null;
  if (plan.milestones && plan.milestones.length > 0) {
    const { data: inserted } = await supabase
      .from("career_plans")
      .insert({
        user_id: user.id,
        analysis_id: analysisId,
        path_index: pathIndex,
        timeframe,
        plan_json: planJson,
      })
      .select("id")
      .single();
    insertedId = inserted?.id ?? null;
  }

  return NextResponse.json({ id: insertedId, plan: planJson, completedTasks: [] });
}
