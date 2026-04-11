"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CountrySelect } from "@/components/shared/country-select";
import type { AnalysisFormData } from "./analysis-wizard";

interface Props {
  defaultValue?: string;
  onNext: (data: Partial<AnalysisFormData>) => void;
  onBack: () => void;
}

export function StepLocation({ defaultValue, onNext, onBack }: Props) {
  const [country, setCountry] = useState(defaultValue ?? "");

  const handleContinue = () => {
    if (!country) { toast.error("Please select your country."); return; }
    onNext({ country });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Location</CardTitle>
        <CardDescription>
          We use your location to tailor salary ranges and job market insights to your country.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Select Your Country</p>
          <CountrySelect
            value={country}
            onChange={setCountry}
            placeholder="Select your country..."
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack}>Back</Button>
          <Button className="flex-1" onClick={handleContinue} disabled={!country}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
