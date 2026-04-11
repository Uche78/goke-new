"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, HelpCircle } from "lucide-react";
import type { InterviewQuestionsResult, InterviewQuestion } from "@/types/ai";

const CATEGORIES: Array<{
  key: keyof InterviewQuestionsResult;
  label: string;
  description: string;
}> = [
  {
    key: "behavioral",
    label: "Behavioral",
    description: "Past behavior predicts future performance",
  },
  {
    key: "situational",
    label: "Situational",
    description: "Hypothetical scenarios to test judgment",
  },
  {
    key: "general_traditional",
    label: "General / Traditional",
    description: "Standard background and motivation questions",
  },
  {
    key: "competency",
    label: "Competency",
    description: "Specific skills required for the role",
  },
  {
    key: "career_goal_motivational",
    label: "Career Goal & Motivational",
    description: "Ambition, alignment, and long-term goals",
  },
  {
    key: "brain_teasers_case_studies",
    label: "Brain Teasers / Case Studies",
    description: "Logic and problem-solving under pressure",
  },
  {
    key: "uncomfortable_difficult",
    label: "Uncomfortable / Difficult",
    description: "Honest and professional handling of tough topics",
  },
];

function QuestionCard({ item, index }: { item: InterviewQuestion | string; index: number }) {
  // Support legacy string format (old preps before migration)
  if (typeof item === "string") {
    return (
      <li className="flex gap-3">
        <span className="text-accent font-semibold text-sm shrink-0 w-6">{index + 1}.</span>
        <p className="text-sm text-foreground leading-relaxed">{item}</p>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-border overflow-hidden">
      {/* Question */}
      <div className="px-4 py-3 flex gap-3">
        <span className="text-accent font-semibold text-sm shrink-0 w-6 pt-0.5">{index + 1}.</span>
        <p className="text-sm font-medium leading-relaxed">{item.question}</p>
      </div>

      {/* What they're really asking */}
      {item.real_question && (
        <div className="px-4 py-3 border-t border-border bg-muted/40 flex gap-3">
          <HelpCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
              What they&apos;re really asking
            </p>
            <p className="text-xs text-foreground/80 leading-relaxed">{item.real_question}</p>
          </div>
        </div>
      )}

      {/* How to answer */}
      {item.tips && (
        <div className="px-4 py-3 border-t border-border bg-accent/5 flex gap-3">
          <Lightbulb size={15} className="text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-semibold text-accent uppercase tracking-wide mb-1">
              How to answer
            </p>
            <p className="text-xs text-foreground/80 leading-relaxed">{item.tips}</p>
          </div>
        </div>
      )}
    </li>
  );
}

export function QuestionsAccordion({
  questions,
}: {
  questions: InterviewQuestionsResult;
}) {
  return (
    <Accordion className="space-y-2">
      {CATEGORIES.map(({ key, label, description }) => {
        const qs = questions[key] ?? [];
        if (qs.length === 0) return null;
        return (
          <AccordionItem
            key={key}
            value={key}
            className="border border-border rounded-xl px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {qs.length}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-normal">
                    {description}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="space-y-3 pt-2 pb-4">
                {qs.map((item, i) => (
                  <QuestionCard key={i} item={item} index={i} />
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
