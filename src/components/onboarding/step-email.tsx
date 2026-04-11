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
  profileEmail: z.email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  defaultValue?: string;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

export function StepEmail({ defaultValue, onNext, onBack }: Props) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { profileEmail: defaultValue ?? "" },
  });

  useEffect(() => {
    if (defaultValue) return;
    const prefill = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setValue("profileEmail", user.email);
    };
    prefill();
  }, [defaultValue, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Email</CardTitle>
        <CardDescription>
          This is your profile email for communications. It can differ from your login email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profileEmail">Email Address</Label>
            <Input id="profileEmail" type="email" placeholder="you@example.com" {...register("profileEmail")} />
            {errors.profileEmail && (
              <p className="text-xs text-destructive">{errors.profileEmail.message}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onBack}>Back</Button>
            <Button type="submit" className="flex-1">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
