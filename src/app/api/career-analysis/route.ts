import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, AI_MODEL, MAX_TOKENS } from "@/lib/ai/client";
import { buildResumeExtractionPrompt } from "@/lib/ai/prompts/resume-extraction";
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

  const { resumeStoragePath, stage, subStage, country } = parsed.data;
  let { resumeText } = parsed.data;

  // If a storage path was provided, download and extract the PDF
  if (resumeStoragePath && !resumeText) {
    const { data: fileData, error } = await supabase.storage
      .from("resumes")
      .download(resumeStoragePath);

    if (error || !fileData) {
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

  // Step 1: Extract structured data from resume
  const extractionResponse = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: buildResumeExtractionPrompt(resumeText),
      },
    ],
  });

  const extractionText =
    extractionResponse.content[0].type === "text"
      ? extractionResponse.content[0].text
      : "";

  let resumeData = extractionText;
  try {
    // Validate it's valid JSON
    JSON.parse(extractionText);
  } catch {
    resumeData = resumeText.slice(0, 3000); // Fallback to raw text
  }

  // Get profile for first name
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

  // Step 2: Run career analysis (streaming response)
  const stream = anthropic.messages.stream({
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

  // Collect the full response to save to DB after streaming
  let fullText = "";

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          const text = chunk.delta.text;
          fullText += text;
          controller.enqueue(new TextEncoder().encode(text));
        }
      }

      // Save to database after stream completes
      try {
        let analysisJson = {};
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            // Strip null bytes — PostgreSQL JSONB rejects \u0000
            const sanitized = jsonMatch[0]
              .replace(/\\u0000/g, "")
              .replace(/\u0000/g, "");
            analysisJson = JSON.parse(sanitized);
          } catch { /* keep {} */ }
        }

        const { data: analysis, error: dbErr } = await supabase
          .from("career_analyses")
          .insert({
            user_id: user.id,
            stage,
            sub_stage: subStage,
            country,
            resume_text: resumeText?.replace(/\u0000/g, "").slice(0, 10000),
            analysis_json: analysisJson,
          })
          .select("id")
          .single();

        if (dbErr) {
          console.error("career_analyses insert error:", dbErr);
        }

        // Send the analysis ID as a final event so the client can redirect
        const idPayload = JSON.stringify({
          analysisId: analysis?.id ?? null,
          dbError: dbErr?.message ?? null,
        });
        controller.enqueue(
          new TextEncoder().encode(`\n\n__ANALYSIS_ID__${idPayload}`)
        );
      } catch (e) {
        console.error("Post-stream save error:", e);
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
