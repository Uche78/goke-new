"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeUploadDropzone } from "@/components/shared/resume-upload-dropzone";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Resume } from "@/types/database";

const schema = z.object({
  profile_email: z.email("Please enter a valid email"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  profile: Profile | null;
  resume: Resume | null;
}

export function ProfileForm({ profile, resume: initialResume }: Props) {
  const [saving, setSaving] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentResume, setCurrentResume] = useState(initialResume);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      profile_email: profile?.profile_email ?? "",
      phone: profile?.phone ?? "",
      bio: profile?.bio ?? "",
    },
  });

  const bio = watch("bio");

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        profile_email: data.profile_email,
        phone: data.phone || null,
        bio: data.bio || null,
      })
      .eq("id", profile!.id);

    if (error) toast.error("Failed to save changes.");
    else toast.success("Profile updated.");
    setSaving(false);
  };

  const handleGenerateBio = async () => {
    if (!currentResume) {
      toast.error("Please upload a resume first to generate a bio.");
      return;
    }
    setGeneratingBio(true);
    try {
      const res = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeStoragePath: currentResume.storage_path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setValue("bio", data.bio);
      toast.success("Bio generated from your resume.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bio generation failed");
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-resume", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCurrentResume(data.resume);
      toast.success("Resume updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name — read only */}
      <Card>
        <CardHeader><CardTitle className="text-base">Name</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={profile?.first_name ?? ""} disabled className="bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={profile?.last_name ?? ""} disabled className="bg-muted/30" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Name cannot be changed. Contact support if needed.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile_email">Contact Email</Label>
            <Input id="profile_email" type="email" {...register("profile_email")} />
            {errors.profile_email && (
              <p className="text-xs text-destructive">{errors.profile_email.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Used for communications. Separate from your login email.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="phone" type="tel" placeholder="+1 (416) 555-0100" {...register("phone")} />
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Bio</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateBio}
              disabled={generatingBio || !currentResume}
              className="gap-1 text-xs"
            >
              {generatingBio
                ? <Loader2 size={12} className="animate-spin" />
                : <Sparkles size={12} />
              }
              {generatingBio ? "Generating..." : "Generate from Resume"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            placeholder="Write a short professional bio or generate one from your resume..."
            {...register("bio")}
          />
          <p className="text-xs text-muted-foreground mt-1">{(bio ?? "").length} characters</p>
        </CardContent>
      </Card>

      {/* Resume */}
      <Card>
        <CardHeader><CardTitle className="text-base">Resume</CardTitle></CardHeader>
        <CardContent>
          <ResumeUploadDropzone
            existingFileName={currentResume?.file_name ?? null}
            existingUploadedAt={currentResume?.uploaded_at ?? null}
            onUpload={handleUpload}
            uploading={uploading}
          />
        </CardContent>
      </Card>

      <Separator />

      <Button type="submit" className="w-full" disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
