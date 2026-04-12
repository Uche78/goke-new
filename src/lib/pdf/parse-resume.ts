import "server-only";

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const result = await pdfParse(Buffer.from(buffer));
  return result.text.replace(/\s+/g, " ").trim();
}

export async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
  return result.value.replace(/\s+/g, " ").trim();
}
