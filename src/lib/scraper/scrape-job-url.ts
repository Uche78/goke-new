import "server-only";

export async function scrapeJobUrl(url: string): Promise<string> {
  // Validate URL is http/https only (prevent SSRF)
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Invalid URL protocol");
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Goke-Bot/1.0; +https://goke.io)",
    },
    signal: AbortSignal.timeout(10000), // 10s timeout
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();

  // Dynamically import cheerio (server-only)
  const { load } = await import("cheerio");
  const $ = load(html);

  // Remove script, style, nav, footer elements
  $("script, style, nav, footer, header, aside, iframe").remove();

  // Try common job description selectors first
  const selectors = [
    '[class*="job-description"]',
    '[class*="jobDescription"]',
    '[class*="description"]',
    '[id*="job-description"]',
    '[id*="jobDescription"]',
    "article",
    "main",
  ];

  for (const selector of selectors) {
    const el = $(selector).first();
    if (el.length && el.text().trim().length > 200) {
      return el.text().replace(/\s+/g, " ").trim();
    }
  }

  // Fallback: get all body text
  return $("body").text().replace(/\s+/g, " ").trim().slice(0, 8000);
}
