"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { OptimizerFormData } from "./optimizer-wizard";

const schema = z.object({ jobTitle: z.string().min(2, "Job title is required") });
type FormData = z.infer<typeof schema>;

interface Props {
  defaultValue?: string;
  onNext: (data: Partial<OptimizerFormData>) => void;
}

export function StepJobTitle({ defaultValue, onNext }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { jobTitle: defaultValue ?? "" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Target Job Title</CardTitle>
        <CardDescription>What role are you applying for?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" placeholder="e.g. Senior Software Engineer" {...register("jobTitle")} />
            {errors.jobTitle && (
              <p className="text-xs text-destructive">{errors.jobTitle.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </CardContent>
    </Card>
  );
}
