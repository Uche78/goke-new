import "server-only";

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // Use process.cwd() to avoid webpack trying to resolve ESM externals
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `file://${process.cwd()}/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs`;

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
    disableFontFace: true,
  });

  const pdf = await loadingTask.promise;
  const textPages: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    textPages.push(pageText);
  }

  return textPages.join("\n").replace(/\s+/g, " ").trim();
}
