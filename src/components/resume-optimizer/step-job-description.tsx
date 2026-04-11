"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OptimizerFormData } from "./optimizer-wizard";

const pasteSchema = z.object({
  jobDescription: z.string().min(50, "Please enter the full job description (min 50 characters)"),
});
const urlSchema = z.object({
  url: z.url("Please enter a valid URL"),
});

interface Props {
  defaultValue?: string;
  onNext: (data: Partial<OptimizerFormData>) => void;
  onBack: () => void;
}

export function StepJobDescription({ defaultValue, onNext, onBack }: Props) {
  const [scraping, setScraping] = useState(false);
  const [scrapedText, setScrapedText] = useState("");

  const pasteForm = useForm<z.infer<typeof pasteSchema>>({
    resolver: zodResolver(pasteSchema),
    defaultValues: { jobDescription: defaultValue ?? "" },
  });

  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
  });

  const handlePasteSubmit = (data: z.infer<typeof pasteSchema>) => {
    onNext({ jobDescription: data.jobDescription });
  };

  const handleUrlScrape = async (data: z.infer<typeof urlSchema>) => {
    setScraping(true);
    try {
      const res = await fetch("/api/scrape-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setScrapedText(result.text);
      toast.success("Job description extracted. Review it below.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not scrape URL");
    } finally {
      setScraping(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
        <CardDescription>
          Paste the job description or provide the job posting URL.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paste">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="paste" className="flex-1">Paste Text</TabsTrigger>
            <TabsTrigger value="url" className="flex-1">Job URL</TabsTrigger>
          </TabsList>

          <TabsContent value="paste">
            <form onSubmit={pasteForm.handleSubmit(handlePasteSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jd">Job Description</Label>
                <Textarea
                  id="jd"
                  rows={10}
                  placeholder="Paste the full job description here..."
                  {...pasteForm.register("jobDescription")}
                />
                {pasteForm.formState.errors.jobDescription && (
                  <p className="text-xs text-destructive">
                    {pasteForm.formState.errors.jobDescription.message}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onBack}>Back</Button>
                <Button type="submit" className="flex-1">Continue</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="url">
            <div className="space-y-4">
              <form onSubmit={urlForm.handleSubmit(handleUrlScrape)} className="space-y-2">
                <Label htmlFor="url">Job Posting URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://ca.linkedin.com/jobs/..."
                    {...urlForm.register("url")}
                  />
                  <Button type="submit" disabled={scraping} className="shrink-0">
                    {scraping ? <Loader2 size={16} className="animate-spin" /> : <Link size={16} />}
                    {scraping ? "Fetching..." : "Fetch"}
                  </Button>
                </div>
                {urlForm.formState.errors.url && (
                  <p className="text-xs text-destructive">{urlForm.formState.errors.url.message}</p>
                )}
              </form>

              {scrapedText && (
                <div className="space-y-2">
                  <Label>Extracted Job Description (review before continuing)</Label>
                  <Textarea
                    rows={8}
                    value={scrapedText}
                    onChange={(e) => setScrapedText(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onBack}>Back</Button>
                    <Button
                      className="flex-1"
                      onClick={() => onNext({ jobDescription: scrapedText })}
                      disabled={!scrapedText.trim()}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {!scrapedText && (
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={onBack}>Back</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
