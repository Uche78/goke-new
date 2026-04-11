import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, AI_MODEL, MAX_TOKENS } from "@/lib/ai/client";
import { buildResumeOptimizerPrompt } from "@/lib/ai/prompts/resume-optimizer";
import { extractTextFromPDF } from "@/lib/pdf/parse-resume";
import { z } from "zod";

const bodySchema = z.object({
  jobTitle: z.string().min(2),
  jobDescription: z.string().min(50),
  resumeText: z.string().optional(),
  resumeStoragePath: z.string().optional(),
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

  const { jobTitle, jobDescription, resumeStoragePath } = parsed.data;
  let { resumeText } = parsed.data;

  // Resolve storage path: use provided path or fall back to user's latest resume
  const resolvedStoragePath = resumeStoragePath ?? (await (async () => {
    const { data } = await supabase
      .from("resumes")
      .select("storage_path")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.storage_path ?? null;
  })());

  if (resolvedStoragePath && !resumeText) {
    const { data: fileData, error } = await supabase.storage
      .from("resumes")
      .download(resolvedStoragePath);
    if (error || !fileData) {
      return NextResponse.json({ error: "Could not access resume file" }, { status: 400 });
    }
    const buffer = await fileData.arrayBuffer();
    resumeText = await extractTextFromPDF(buffer);
  }

  if (!resumeText || resumeText.length < 50) {
    return NextResponse.json({ error: "No resume content available" }, { status: 400 });
  }

  const stream = anthropic.messages.stream({
    model: AI_MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: buildResumeOptimizerPrompt({ jobTitle, jobDescription, resumeText }),
      },
    ],
  });

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

      // Save to DB
      try {
        let resultJson = {};
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (jsonMatch) resultJson = JSON.parse(jsonMatch[0]);

        const { data: record } = await supabase
          .from("resume_optimizations")
          .insert({
            user_id: user.id,
            job_title: jobTitle,
            job_description: jobDescription,
            result_json: resultJson,
          })
          .select("id")
          .single();

        controller.enqueue(
          new TextEncoder().encode(
            `\n\n__RECORD_ID__${JSON.stringify({ id: record?.id })}`
          )
        );
      } catch {
        // Non-fatal
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
