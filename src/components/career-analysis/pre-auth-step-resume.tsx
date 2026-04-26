"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResumeUploadDropzone } from "@/components/shared/resume-upload-dropzone";

interface Props {
  onNext: (data: { resumeText: string; resumeFileName: string }) => void;
}

export function PreAuthStepResume({ onNext }: Props) {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setResumeText(data.resumeText);
      setFileName(file.name);
      toast.success(`${file.name} uploaded.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    if (!resumeText) { toast.error("Please upload your resume to continue."); return; }
    onNext({ resumeText, resumeFileName: fileName });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Resume</CardTitle>
        <CardDescription>
          Upload your most recent resume (PDF or DOCX). We use this to power your career analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResumeUploadDropzone
          existingFileName={fileName || null}
          onUpload={handleUpload}
          uploading={uploading}
        />
        <Button className="w-full" onClick={handleContinue} disabled={!resumeText || uploading}>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
