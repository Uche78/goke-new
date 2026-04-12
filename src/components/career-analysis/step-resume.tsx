"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResumeUploadDropzone } from "@/components/shared/resume-upload-dropzone";
import { useResume } from "@/hooks/use-resume";
import type { AnalysisFormData } from "./analysis-wizard";

interface Props {
  existingData: Pick<AnalysisFormData, "resumeText" | "resumeFileName" | "resumeStoragePath">;
  onNext: (data: Partial<AnalysisFormData>) => void;
}

export function StepResume({ existingData, onNext }: Props) {
  const { resume, loading, uploadResume } = useResume();
  const [uploading, setUploading] = useState(false);
  const [selectedResume, setSelectedResume] = useState<{
    fileName: string;
    storagePath?: string;
    resumeText?: string;
  } | null>(null);

  useEffect(() => {
    if (resume && !selectedResume) {
      setSelectedResume({
        fileName: resume.file_name,
        storagePath: resume.storage_path,
      });
    }
  }, [resume, selectedResume]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadResume(file);
      setSelectedResume({
        fileName: file.name,
        resumeText: result?.extractedText,
      });
      toast.success("Resume uploaded successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedResume) {
      toast.error("Please upload a resume to continue.");
      return;
    }
    onNext({
      resumeFileName: selectedResume.fileName,
      resumeText: selectedResume.resumeText ?? existingData.resumeText,
      resumeStoragePath: selectedResume.storagePath,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Resume</CardTitle>
        <CardDescription>
          Upload your most recent resume (PDF or DOCX). This is used to power your career analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <ResumeUploadDropzone
            existingFileName={selectedResume?.fileName ?? null}
            existingUploadedAt={resume?.uploaded_at ?? null}
            onUpload={handleUpload}
            uploading={uploading}
          />
        )}
        <Button
          className="w-full"
          onClick={handleContinue}
          disabled={!selectedResume || uploading}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
