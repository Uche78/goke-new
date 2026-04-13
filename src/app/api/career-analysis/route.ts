import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { anthropic, AI_MODEL, MAX_TOKENS } from "@/lib/ai/client";
import { buildCareerAnalysisPrompt } from "@/lib/ai/prompts/career-analysis";
import { extractTextFromPDF, extractTextFromDocx } from "@/lib/pdf/parse-resume";
import { z } from "zod";

const bodySchema = z.object({
  resumeStoragePath: z.string().optional(),
  resumeText: z.string().optional(),
  stage: z.enum(["early", "mid", "late"]),
  subStage: z.string(),
  country: z.string(),
});

export const maxDuration = 120;

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

    const { resumeStoragePath, stage, subStage, country } = parsed.data;
    let { resumeText } = parsed.data;

    // If a storage path was provided, download and extract the file
    if (resumeStoragePath && !resumeText) {
      const { data: fileData, error } = await supabase.storage
        .from("resumes")
        .download(resumeStoragePath);

      if (error || !fileData) {
        console.error("Resume download error:", error);
        return NextResponse.json(
          { error: "Could not access resume file" },
          { status: 400 }
        );
      }

      const buffer = await fileData.arrayBuffer();
      resumeText = resumeStoragePath.endsWith(".docx")
        ? await extractTextFromDocx(buffer)
        : await extractTextFromPDF(buffer);
    }

    if (!resumeText) {
      return NextResponse.json(
        { error: "No resume text available" },
        { status: 400 }
      );
    }

    // Check for duplicate: same stage + sub_stage + country
    const { data: existing } = await supabase
      .from("career_analyses")
      .select("id")
      .eq("user_id", user.id)
      .eq("stage", stage)
      .eq("sub_stage", subStage)
      .eq("country", country)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "duplicate", existingId: existing.id },
        { status: 409 }
      );
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Pass resume text directly — skips a redundant extraction API call
    const resumeData = resumeText.slice(0, 3000);

    // Get profile for first name
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .single();

    // Step 2: Generate career analysis (non-streaming — results page is server-rendered anyway)
    const analysisResponse = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.4,
      messages: [
        {
          role: "user",
          content: buildCareerAnalysisPrompt({
            firstName: profile?.first_name ?? "there",
            stage,
            subStage,
            country,
            resumeData,
          }),
        },
      ],
    });

    const fullText =
      analysisResponse.content[0].type === "text"
        ? analysisResponse.content[0].text
        : "";

    // Parse analysis JSON from AI response
    let analysisJson = {};
    // Try direct parse first (AI should return pure JSON)
    try {
      analysisJson = JSON.parse(fullText.replace(/\u0000/g, ""));
    } catch {
      // Fallback: extract JSON object from response (handles markdown fences)
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisJson = JSON.parse(
            jsonMatch[0].replace(/\\u0000/g, "").replace(/\u0000/g, "")
          );
        } catch {
          console.error("Failed to parse analysis JSON, storing raw text");
        }
      }
    }

    // Save to database
    const { data: analysis, error: dbErr } = await adminSupabase
      .from("career_analyses")
      .insert({
        user_id: user.id,
        stage,
        sub_stage: subStage,
        country,
        resume_text: resumeText.replace(/\u0000/g, "").slice(0, 10000),
        analysis_json: analysisJson,
      })
      .select("id")
      .single();

    if (dbErr || !analysis) {
      console.error("career_analyses insert error:", dbErr);
      return NextResponse.json(
        { error: "Failed to save analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysisId: analysis.id });
  } catch (e) {
    console.error("career-analysis POST error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}
