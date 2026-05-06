import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { anthropic, AI_MODEL } from "@/lib/ai/client";
import { checkAndDeductCredits, type CreditTool } from "@/lib/credits";
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
  try {
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

    // Map timeframe to credit tool key
    const toolKey = `career_plan_${timeframe}` as CreditTool;

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Credit check (after cache check — cached plans are free)
    const creditResult = await checkAndDeductCredits(user.id, toolKey, adminSupabase);
    if (!creditResult.ok) {
      return NextResponse.json(
        { error: "insufficient_credits", required: creditResult.required, balance: creditResult.balance },
        { status: 402 }
      );
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

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 4096,
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
      response.content[0].type === "text" ? response.content[0].text : "";

    if (!text) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }

    let planJson: Record<string, unknown> = {};
    try {
      planJson = JSON.parse(text.replace(/\u0000/g, ""));
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          planJson = JSON.parse(
            jsonMatch[0].replace(/\\u0000/g, "").replace(/\u0000/g, "")
          );
        } catch {
          console.error("Failed to parse career plan JSON. Raw:", text.slice(0, 300));
          return NextResponse.json({ error: "Could not parse plan response" }, { status: 500 });
        }
      } else {
        console.error("No JSON found in career plan response. Raw:", text.slice(0, 300));
        return NextResponse.json({ error: "Invalid plan response format" }, { status: 500 });
      }
    }

    const milestones = planJson.milestones as unknown[] | undefined;
    if (!milestones?.length) {
      console.error("Plan has no milestones. planJson:", JSON.stringify(planJson).slice(0, 300));
      return NextResponse.json({ error: "Plan generated but has no milestones" }, { status: 500 });
    }

    const { data: inserted, error: insertErr } = await adminSupabase
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

    if (insertErr) {
      console.error("career_plans insert error:", insertErr);
    }

    return NextResponse.json({
      id: inserted?.id ?? null,
      plan: planJson,
      completedTasks: [],
    });
  } catch (e) {
    console.error("career-plan POST error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}
