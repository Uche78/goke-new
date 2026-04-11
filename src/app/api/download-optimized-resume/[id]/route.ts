import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, AI_MODEL } from "@/lib/ai/client";
import { extractTextFromPDF } from "@/lib/pdf/parse-resume";
import type { ResumeOptimizationResult } from "@/types/ai";

export const maxDuration = 120;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch the optimization record
  const { data: optimization } = await supabase
    .from("resume_optimizations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!optimization) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Fetch the user's resume from storage
  const { data: resume } = await supabase
    .from("resumes")
    .select("storage_path, file_name")
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let originalResumeText = "";
  if (resume?.storage_path) {
    const { data: fileData } = await supabase.storage
      .from("resumes")
      .download(resume.storage_path);
    if (fileData) {
      const buffer = await fileData.arrayBuffer();
      originalResumeText = await extractTextFromPDF(buffer);
    }
  }

  const result = optimization.result_json as ResumeOptimizationResult;

  // Build a summary of all optimized sections for the prompt
  const optimizationSummary = result.optimized_sections
    .map((s) => `**${s.section}**\nOptimized version:\n${s.optimized}`)
    .join("\n\n");

  const keywordsAdded = result.keywords_added?.join(", ") ?? "";

  const prompt = `You are a professional resume writer. Your task is to produce a complete, polished, ready-to-use resume in plain text format.

Original Resume:
${originalResumeText.slice(0, 4000)}

Optimized Sections (apply these improvements):
${optimizationSummary}

Keywords to include: ${keywordsAdded}

Job Title targeted: ${optimization.job_title}

Instructions:
- Produce the FULL resume (not just the changed sections)
- Apply all the optimized sections above, replacing the originals
- Keep all sections not mentioned in the optimizations exactly as they are
- Format as clean plain text with clear section headers in ALL CAPS
- Use bullet points starting with "• " for experience and skill items
- Do NOT include any commentary, explanations, or metadata — just the resume itself
- Do NOT use markdown formatting (no **, ##, etc.)`;

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const resumeText =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  const fileName = resume?.file_name
    ? `optimized_${resume.file_name.replace(".pdf", "")}.txt`
    : "optimized_resume.txt";

  return new Response(resumeText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
