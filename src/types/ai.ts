export interface CareerPath {
  name: string;
  match_percent: number;
  salary_range: string;
  growth_type: "horizontal" | "vertical";
  reasoning: string;
}

export interface CareerAnalysisResult {
  intro: string;
  career_summary: string;
  analysis: string;
  geo_considerations: string;
  paths: CareerPath[];
  conclusion: string;
}

export interface ResumeExtractionResult {
  professional_summary: string;
  experience: string[];
  professional_experience: string[];
  core_competencies: string[];
  skills: string[];
  education: string[];
  certificates: string[];
  software: string[];
}

export interface CareerPlanResult {
  overview: string;
  milestones: Array<{
    label: string;
    title: string;
    actions: Array<{
      task: string;
      type: "quick_win" | "key_milestone" | "ongoing";
    }>;
  }>;
  resources: string[];
  success_metrics: string[];
}

export interface ResumeOptimizationResult {
  score_before: number;
  score_after: number;
  summary: string;
  optimized_sections: Array<{
    section: string;
    original: string;
    optimized: string;
    reason: string;
  }>;
  keywords_added: string[];
  recommendations: string[];
}

export interface InterviewQuestion {
  question: string;
  real_question: string;
  tips: string;
}

export interface InterviewQuestionsResult {
  behavioral: InterviewQuestion[];
  situational: InterviewQuestion[];
  general_traditional: InterviewQuestion[];
  competency: InterviewQuestion[];
  career_goal_motivational: InterviewQuestion[];
  brain_teasers_case_studies: InterviewQuestion[];
  uncomfortable_difficult: InterviewQuestion[];
}
