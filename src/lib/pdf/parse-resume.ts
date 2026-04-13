import "server-only";

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  // Import the internal lib directly to avoid pdf-parse's index.js
  // loading a test PDF file on import (breaks in serverless environments)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse/lib/pdf-parse.js");
  const result = await pdfParse(Buffer.from(buffer));
  return result.text.replace(/\s+/g, " ").trim();
}

export async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
  return result.value.replace(/\s+/g, " ").trim();
}
