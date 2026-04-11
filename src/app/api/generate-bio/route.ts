import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, AI_MODEL } from "@/lib/ai/client";
import { buildBioGeneratorPrompt } from "@/lib/ai/prompts/bio-generator";
import { extractTextFromPDF } from "@/lib/pdf/parse-resume";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resumeStoragePath } = await request.json();

  // Download resume from storage and extract text
  if (!resumeStoragePath) {
    return NextResponse.json({ error: "Resume storage path required" }, { status: 400 });
  }

  const { data: fileData, error: downloadError } = await supabase.storage
    .from("resumes")
    .download(resumeStoragePath);

  if (downloadError || !fileData) {
    return NextResponse.json({ error: "Could not access resume file" }, { status: 400 });
  }

  const buffer = await fileData.arrayBuffer();
  const resumeText = await extractTextFromPDF(buffer);

  if (!resumeText || resumeText.length < 50) {
    return NextResponse.json({ error: "Could not extract text from resume" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: buildBioGeneratorPrompt(
          profile?.first_name ?? "the professional",
          resumeText.slice(0, 4000)
        ),
      },
    ],
  });

  const bio =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  // Save bio to profile
  await supabase
    .from("profiles")
    .update({ bio })
    .eq("id", user.id);

  return NextResponse.json({ bio });
}
