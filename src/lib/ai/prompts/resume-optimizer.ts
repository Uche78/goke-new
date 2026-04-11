import "server-only";

interface ResumeOptimizerInput {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
}

export function buildResumeOptimizerPrompt(input: ResumeOptimizerInput): string {
  return `You are an expert resume writer and career coach. Optimize the provided resume for the target job.

Target Job Title: ${input.jobTitle}
Job Description:
${input.jobDescription}

Current Resume:
${input.resumeText}

Analyze the resume against the job description and provide specific optimization recommendations.

Return ONLY valid JSON with no markdown fences:
{
  "score_before": 65,
  "score_after": 88,
  "summary": "Overall assessment of the resume match and key improvements made",
  "optimized_sections": [
    {
      "section": "Professional Summary / Work Experience / Skills / etc.",
      "original": "The original text from the resume",
      "optimized": "The improved version tailored to the job description",
      "reason": "Why this change improves the match"
    }
  ],
  "keywords_added": ["keyword1", "keyword2"],
  "recommendations": [
    "Additional recommendation 1",
    "Additional recommendation 2"
  ]
}

Rules:
- score_before and score_after must be numbers between 0 and 100
- score_after must always be higher than score_before
- Provide at least 3 optimized_sections
- Focus on ATS keywords from the job description
- Recommendations should be specific and actionable
- Preserve the candidate's authentic experience — don't fabricate achievements`;
}
