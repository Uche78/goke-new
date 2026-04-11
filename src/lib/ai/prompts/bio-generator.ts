import "server-only";

export function buildBioGeneratorPrompt(
  firstName: string,
  resumeText: string
): string {
  return `You are a professional writer specializing in creating compelling professional bios.

Based on the resume below, write a professional bio for ${firstName}. The bio should:
- Be written in third person
- Be 3-4 sentences (100-150 words)
- Highlight key experience, skills, and career focus
- Be appropriate for a professional profile page
- Feel authentic and personable, not robotic

Resume:
${resumeText}

Return ONLY the bio text — no JSON, no labels, no extra text.`;
}
