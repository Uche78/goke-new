"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FormData { phone: string }
interface Props {
  defaultValue?: string;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

export function StepPhone({ defaultValue, onNext, onBack }: Props) {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { phone: defaultValue ?? "" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phone Number <span className="text-sm font-normal text-muted-foreground">(optional)</span></CardTitle>
        <CardDescription>We may use this to reach you about your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onNext)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+1 (416) 555-0100" {...register("phone")} />
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
