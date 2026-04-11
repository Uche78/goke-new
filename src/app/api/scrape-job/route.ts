import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scrapeJobUrl } from "@/lib/scraper/scrape-job-url";
import { z } from "zod";

const bodySchema = z.object({
  url: z.url("Please enter a valid URL"),
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
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const text = await scrapeJobUrl(parsed.data.url);
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to scrape URL";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
