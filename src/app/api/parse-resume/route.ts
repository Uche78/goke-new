import { NextResponse } from "next/server";
import { extractTextFromPDF, extractTextFromDocx } from "@/lib/pdf/parse-resume";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: "Only PDF or DOCX files are supported" }, { status: 400 });
    if (file.size > MAX_SIZE_BYTES)
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    let resumeText = "";

    try {
      resumeText = file.type === "application/pdf"
        ? await extractTextFromPDF(buffer)
        : await extractTextFromDocx(buffer);
    } catch {
      return NextResponse.json(
        { error: "Could not read file. Please ensure it is a valid PDF or DOCX." },
        { status: 400 }
      );
    }

    return NextResponse.json({ resumeText });
  } catch (e) {
    console.error("parse-resume error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
