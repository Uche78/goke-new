import "server-only";

interface CareerPlanInput {
  firstName: string;
  pathName: string;
  pathReasoning: string;
  timeframe: "1mo" | "3mo" | "6mo";
  country: string;
  resumeSummary: string;
}

const TIMEFRAME_CONFIG = {
  "1mo": { label: "1-month", milestones: 4, milestoneLabel: "Week 1, Week 2, Week 3, Week 4" },
  "3mo": { label: "3-month", milestones: 3, milestoneLabel: "Month 1, Month 2, Month 3" },
  "6mo": { label: "6-month", milestones: 3, milestoneLabel: "Months 1-2, Months 3-4, Months 5-6" },
};

export function buildCareerPlanPrompt(input: CareerPlanInput): string {
  const config = TIMEFRAME_CONFIG[input.timeframe];
  return `You are a career coach creating a ${config.label} action plan. Be specific, direct, and task-focused. Every action must be something the client can actually do and check off.

Client: ${input.firstName}
Target Career: ${input.pathName}
Why This Path: ${input.pathReasoning}
Country: ${input.country}
Background: ${input.resumeSummary}

Return ONLY valid JSON with no markdown fences:
{
  "overview": "2 sentences max. What ${input.firstName} will achieve by the end of this ${config.label} plan.",
  "milestones": [
    {
      "label": "Week 1 OR Month 1 (exact time label)",
      "title": "Short milestone theme title (e.g. Foundation & Research)",
      "actions": [
        {
          "task": "Start with a verb. Single concrete completable task. Be specific — name actual platforms, tools, or numbers where relevant. (e.g. 'Update LinkedIn headline to reflect ${input.pathName} target role')",
          "type": "quick_win | key_milestone | ongoing"
        }
      ]
    }
  ],
  "resources": ["Specific named resource — include course name, platform, certification body, or community. Must be relevant to ${input.country}."],
  "success_metrics": ["Measurable outcome (e.g. 'Applied to 10+ roles', 'Completed 2 informational interviews', 'LinkedIn profile views up 30%')"]
}

Rules:
- Provide exactly ${config.milestones} milestones: ${config.milestoneLabel}
- Each milestone: 5–7 actions max
- Every task MUST start with an action verb (Update, Apply, Reach out, Complete, Book, Research, Join, etc.)
- task type: "quick_win" = can be done in under 1 hour, "key_milestone" = major progress marker, "ongoing" = repeated activity
- resources: 4–6 items, specific named tools/courses/communities
- success_metrics: 3–5 measurable outcomes
- Do NOT use vague phrases like "explore opportunities" or "consider networking" — be specific`;
}
