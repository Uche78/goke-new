"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResumeUploadDropzone } from "@/components/shared/resume-upload-dropzone";
import { useResume } from "@/hooks/use-resume";
import type { OptimizerFormData } from "./optimizer-wizard";

interface Props {
  defaultValues: Pick<OptimizerFormData, "resumeText" | "resumeFileName" | "resumeStoragePath">;
  onNext: (data: Partial<OptimizerFormData>) => void;
  onBack: () => void;
}

export function StepResume({ defaultValues, onNext, onBack }: Props) {
  const { resume, loading, uploadResume } = useResume();
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<{ fileName: string; text?: string; storagePath?: string } | null>(null);

  useEffect(() => {
    if (resume && !selected) {
      setSelected({ fileName: resume.file_name, storagePath: resume.storage_path });
    }
  }, [resume, selected]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadResume(file);
      setSelected({ fileName: file.name, text: result?.extractedText });
      toast.success("Resume uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    if (!selected) { toast.error("Please upload a resume."); return; }
    onNext({
      resumeFileName: selected.fileName,
      resumeText: selected.text ?? defaultValues.resumeText,
      resumeStoragePath: selected.storagePath ?? defaultValues.resumeStoragePath,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Resume</CardTitle>
        <CardDescription>Use your saved resume or upload a different one.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="h-16 flex items-center justify-center text-sm text-muted-foreground">Loading...</div>
        ) : (
          <ResumeUploadDropzone
            existingFileName={selected?.fileName ?? null}
            existingUploadedAt={resume?.uploaded_at ?? null}
            onUpload={handleUpload}
            uploading={uploading}
          />
        )}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack}>Back</Button>
          <Button className="flex-1" onClick={handleContinue} disabled={!selected || uploading}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
