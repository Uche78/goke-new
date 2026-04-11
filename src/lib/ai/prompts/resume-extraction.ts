import "server-only";

export function buildResumeExtractionPrompt(resumeText: string): string {
  return `You are an AI assistant specializing in analyzing a document and extracting specific information into predefined categories. Your goal is to carefully read through the provided text and identify relevant information for each category, maintaining the original wording as much as possible.

You are tasked with analyzing the text of a document and extracting specific information into predefined categories. Your goal is to extract information for the following categories:
- Professional Summary
- Experience
- Professional Experience
- Core competencies
- Skills
- Education
- Certificates
- Software

For each category, follow these steps:
1. Carefully read through the document text.
2. Identify any information that corresponds to the given category.
3. Extract the relevant information, maintaining the original wording as much as possible.
4. If you find multiple items for a category, list them as separate entries.
If you cannot find information for a particular category, leave it as an empty list.

When extracting information:
- For Experience and Professional Experience, include job titles, company names, dates, and brief descriptions of responsibilities or achievements.
- For Core competencies and Skills, list individual skills or areas of expertise.
- For Education, include degree names, institutions, and graduation dates if available.
- For Certificates, list any professional certifications or licenses mentioned.
- For Software, include names of software applications or programming languages.

Return ONLY valid JSON with no markdown fences or extra text:
{
  "professional_summary": "string or empty string",
  "experience": ["string"],
  "professional_experience": ["string"],
  "core_competencies": ["string"],
  "skills": ["string"],
  "education": ["string"],
  "certificates": ["string"],
  "software": ["string"]
}

Document text:
${resumeText}`;
}
