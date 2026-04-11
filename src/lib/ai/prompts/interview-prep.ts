import "server-only";

interface InterviewPrepInput {
  jobDescription: string;
  resumeText: string;
}

export function buildInterviewPrepPrompt(input: InterviewPrepInput): string {
  return `You are an expert career coach specializing in interview preparation. Generate comprehensive interview questions based on the candidate's background and the target role.

Job Description:
${input.jobDescription}

Candidate Resume:
${input.resumeText}

Generate targeted interview questions across all 7 categories. For each question, provide:
- "question": the interview question itself
- "real_question": the underlying intent — what the interviewer is really trying to find out (1–2 sentences)
- "tips": concrete advice on how to answer effectively (2–4 sentences; mention frameworks like STAR where relevant)

Return ONLY valid JSON with no markdown fences:
{
  "behavioral": [
    {
      "question": "Tell me about a time when you had to...",
      "real_question": "They want to know if you...",
      "tips": "Use the STAR format. Focus on..."
    }
  ],
  "situational": [ /* 5 objects */ ],
  "general_traditional": [ /* 5 objects */ ],
  "competency": [ /* 5 objects */ ],
  "career_goal_motivational": [ /* 5 objects */ ],
  "brain_teasers_case_studies": [ /* 3 objects */ ],
  "uncomfortable_difficult": [ /* 4 objects */ ]
}

Rules:
- Every question must be specific to this job and the candidate's background — no generic filler
- Behavioral questions must follow the 'Tell me about a time...' or 'Give me an example of...' format
- Situational questions must be hypothetical scenarios realistic for this role
- Uncomfortable questions should be professionally framed
- real_question must be insightful — reveal the true evaluation criteria, not just restate the question
- tips must be actionable — specific techniques, not vague advice
- Total: 5 + 5 + 5 + 5 + 5 + 3 + 4 = 32 questions`;
}
