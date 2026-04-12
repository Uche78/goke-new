"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ResumeUploadDropzoneProps {
  existingFileName?: string | null;
  existingUploadedAt?: string | null;
  onUpload: (file: File) => Promise<void>;
  uploading?: boolean;
  className?: string;
}

export function ResumeUploadDropzone({
  existingFileName,
  existingUploadedAt,
  onUpload,
  uploading = false,
  className,
}: ResumeUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const ACCEPTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only PDF or DOCX files are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB.");
      return;
    }
    await onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Existing resume */}
      {existingFileName && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/40">
          <FileText size={18} className="text-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{existingFileName}</p>
            {existingUploadedAt && (
              <p className="text-xs text-muted-foreground">
                Uploaded{" "}
                {formatDistanceToNow(new Date(existingUploadedAt), {
                  addSuffix: true,
                })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Dropzone */}
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
          dragging
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/50 hover:bg-muted/30"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        {uploading ? (
          <>
            <Loader2 size={32} className="text-accent animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            <Upload size={32} className="text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">
              {existingFileName ? "Upload a different resume" : "Upload your resume"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF or DOCX, max 5MB. Drag & drop or click to browse.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
