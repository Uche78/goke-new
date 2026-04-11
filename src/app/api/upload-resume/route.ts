import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractTextFromPDF } from "@/lib/pdf/parse-resume";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["application/pdf"];

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PDF files are supported" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File size must be under 5MB" },
      { status: 400 }
    );
  }

  const buffer = await file.arrayBuffer();
  // pdfjs detaches the ArrayBuffer after reading — keep a separate copy for storage
  const storageBuffer = buffer.slice(0);

  // Extract text
  let extractedText = "";
  try {
    extractedText = await extractTextFromPDF(buffer);
  } catch {
    return NextResponse.json(
      { error: "Could not read PDF. Please ensure it is a valid PDF file." },
      { status: 400 }
    );
  }

  // Upload to Supabase Storage
  const storagePath = `${user.id}/${crypto.randomUUID()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(storagePath, storageBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json(
      { error: "Failed to store file", detail: uploadError.message },
      { status: 500 }
    );
  }

  // Get signed URL (1 hour)
  const { data: signedData } = await supabase.storage
    .from("resumes")
    .createSignedUrl(storagePath, 3600);

  // Delete old resume(s) for this user to avoid accumulation
  const { data: oldResumes } = await supabase
    .from("resumes")
    .select("id, storage_path")
    .eq("user_id", user.id)
    .order("uploaded_at", { ascending: true });

  if (oldResumes && oldResumes.length > 0) {
    const oldPaths = oldResumes.map((r) => r.storage_path);
    await supabase.storage.from("resumes").remove(oldPaths);
    await supabase.from("resumes").delete().eq("user_id", user.id);
  }

  // Insert new resume record
  const { data: resume, error: dbError } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      file_url: signedData?.signedUrl ?? "",
      file_name: file.name,
      storage_path: storagePath,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({
    resume,
    extractedText,
  });
}
