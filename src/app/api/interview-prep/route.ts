import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { anthropic, AI_MODEL, MAX_TOKENS } from "@/lib/ai/client";
import { checkAndDeductCredits } from "@/lib/credits";
import { buildInterviewPrepPrompt } from "@/lib/ai/prompts/interview-prep";
import { extractTextFromPDF } from "@/lib/pdf/parse-resume";
import { z } from "zod";

const bodySchema = z.object({
  jobTitle: z.string().min(1),
  company: z.string().min(1),
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

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const creditResult = await checkAndDeductCredits(user.id, "interview_prep", adminSupabase);
  if (!creditResult.ok) {
    return NextResponse.json(
      { error: "insufficient_credits", required: creditResult.required, balance: creditResult.balance },
      { status: 402 }
    );
  }

  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { jobTitle, company, jobDescription, resumeStoragePath } = parsed.data;
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

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 16000,
    messages: [
      {
        role: "user",
        content: buildInterviewPrepPrompt({ jobDescription, resumeText }),
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  let questionsJson = {};
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) questionsJson = JSON.parse(jsonMatch[0]);
  } catch {
    questionsJson = { error: "Could not parse questions" };
  }

  // Save to DB
  const { data: record } = await supabase
    .from("interview_preps")
    .insert({
      user_id: user.id,
      job_title: jobTitle,
      company,
      job_description: jobDescription,
      questions_json: questionsJson,
    })
    .select("id")
    .single();

  return NextResponse.json({ id: record?.id, questions: questionsJson });
}
