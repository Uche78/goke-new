import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedText } from "@/components/shared/formatted-text";
import type { CareerPath } from "@/types/ai";

interface Props {
  path: CareerPath;
  pathIndex: number;
  analysisId: string;
}

export function CareerPathCard({ path, pathIndex, analysisId }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{path.name}</h3>
            <p className="text-sm text-muted-foreground">{path.salary_range}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Match percentage */}
            <div className="flex items-center gap-1.5">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18" cy="18" r="15.9"
                    fill="none" strokeWidth="3"
                    className="stroke-muted"
                  />
                  <circle
                    cx="18" cy="18" r="15.9"
                    fill="none" strokeWidth="3"
                    strokeDasharray={`${path.match_percent} ${100 - path.match_percent}`}
                    strokeLinecap="round"
                    className="stroke-accent"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
                  {path.match_percent}%
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="capitalize gap-1 text-xs">
              {path.growth_type === "vertical" ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {path.growth_type} growth
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormattedText text={path.reasoning} className="text-sm" />
        <Link
          href={`/career-plan?analysisId=${analysisId}&pathIndex=${pathIndex}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          Build a plan for this path <ArrowRight size={14} />
        </Link>
      </CardContent>
    </Card>
  );
}
