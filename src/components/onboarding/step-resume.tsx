"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResumeUploadDropzone } from "@/components/shared/resume-upload-dropzone";
import type { OnboardingData } from "./onboarding-wizard";

interface Props {
  onFinish: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  submitting: boolean;
}

export function StepResume({ onFinish, onBack, submitting }: Props) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      setResumeFile(file);
      toast.success(`${file.name} selected.`);
    } finally {
      setUploading(false);
    }
  };

  const handleFinish = () => {
    onFinish({ resumeFile: resumeFile ?? undefined });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Resume <span className="text-sm font-normal text-muted-foreground">(optional)</span></CardTitle>
        <CardDescription>
          Adding your resume now enables AI-powered career analysis and bio generation.
          You can always add it later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResumeUploadDropzone
          existingFileName={resumeFile?.name}
          onUpload={handleUpload}
          uploading={uploading}
        />

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onBack} disabled={submitting}>
            Back
          </Button>
          <Button className="flex-1" onClick={handleFinish} disabled={submitting || uploading}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {resumeFile ? "Save & Continue" : "Skip & Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
