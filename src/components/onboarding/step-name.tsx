"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  defaultValues?: { firstName?: string; lastName?: string };
  onNext: (data: FormData) => void;
}

export function StepName({ defaultValues, onNext }: Props) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Try to pre-fill from LinkedIn metadata
  useEffect(() => {
    const prefill = async () => {
      if (defaultValues?.firstName) return;
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const fullName = user?.user_metadata?.full_name as string | undefined;
      if (fullName) {
        const parts = fullName.split(" ");
        setValue("firstName", parts[0] ?? "");
        setValue("lastName", parts.slice(1).join(" ") ?? "");
      }
    };
    prefill();
  }, [defaultValues?.firstName, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>What&apos;s your name?</CardTitle>
        <CardDescription>This will appear on your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Jane" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </CardContent>
    </Card>
  );
}
