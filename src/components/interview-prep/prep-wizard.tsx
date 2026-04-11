"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResumeUploadDropzone } from "@/components/shared/resume-upload-dropzone";
import { useResume } from "@/hooks/use-resume";

const STEPS = ["Resume", "Job Description", "Generate"];

export function PrepWizard() {
  const router = useRouter();
  const { resume, loading: resumeLoading, uploadResume } = useResume();
  const [step, setStep] = useState(0);
  const [resumeText, setResumeText] = useState<string | undefined>();
  const [resumeFileName, setResumeFileName] = useState<string | undefined>();
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadResume(file);
      setResumeText(result?.extractedText);
      setResumeFileName(file.name);
      toast.success("Resume uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const hasResume = !!(resumeFileName ?? resume?.file_name);
  const canProceedFromStep1 = jobTitle.trim().length > 0 && company.trim().length > 0 && jobDescription.length >= 50;

  const handleGenerate = async () => {
    if (!hasResume) {
      toast.error("Please upload your resume first.");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          company,
          jobDescription,
          resumeText: resumeText ?? undefined,
          resumeStoragePath: !resumeText ? (resume?.storage_path ?? undefined) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/interview-prep/results/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step 1: Resume */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
            <CardDescription>Use your saved resume or upload a different one.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeLoading ? (
              <div className="h-16 flex items-center justify-center text-sm text-muted-foreground">Loading...</div>
            ) : (
              <ResumeUploadDropzone
                existingFileName={resumeFileName ?? resume?.file_name ?? null}
                existingUploadedAt={resume?.uploaded_at ?? null}
                onUpload={handleUpload}
                uploading={uploading}
              />
            )}
            <Button
              className="w-full"
              onClick={() => setStep(1)}
              disabled={!hasResume || uploading}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Job Description */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Enter the role details and paste the full job description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title <span className="text-destructive">*</span></Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Senior Product Manager"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company / Organization <span className="text-destructive">*</span></Label>
                <Input
                  id="company"
                  placeholder="e.g. Shopify"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jd">Job Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="jd"
                rows={10}
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{jobDescription.length} characters</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
              <Button
                className="flex-1"
                onClick={() => setStep(2)}
                disabled={!canProceedFromStep1}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Generate */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Ready to Generate</CardTitle>
            <CardDescription>
              We&apos;ll create 32 targeted interview questions across 7 categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border divide-y divide-border text-sm">
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Resume</p>
                <p className="font-medium">{resumeFileName ?? resume?.file_name ?? "Saved resume"}</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <p className="font-medium">{jobTitle} — {company}</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Job Description</p>
                <p className="text-muted-foreground line-clamp-2">{jobDescription}</p>
              </div>
            </div>

            {generating && (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <Loader2 size={32} className="text-accent animate-spin" />
                <div>
                  <p className="font-medium">Generating questions...</p>
                  <p className="text-sm text-muted-foreground">This takes about 20 seconds.</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={generating}>Back</Button>
              <Button className="flex-1" onClick={handleGenerate} disabled={generating}>
                {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {generating ? "Generating..." : "Generate Questions"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
