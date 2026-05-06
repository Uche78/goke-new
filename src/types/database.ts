// This file is a placeholder. Replace it by running:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
//
// Until then, Supabase clients use untyped mode (queries still work at runtime).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Stub types for manual use in hooks/components
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  profile_email: string | null;
  bio: string | null;
  onboarding_completed: boolean;
  plan: "free" | "pro";
  free_career_analysis_used: boolean;
  free_1mo_plan_used: boolean;
  free_interview_prep_used: boolean;
  free_resume_optimization_used: boolean;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCredits {
  user_id: string;
  balance: number;
  credits_reset_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "purchase" | "monthly_reset" | "usage" | "free_tier";
  tool: string | null;
  reference_id: string | null;
  stripe_session_id: string | null;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  storage_path: string;
  uploaded_at: string;
}

export interface CareerAnalysis {
  id: string;
  user_id: string;
  stage: string;
  sub_stage: string | null;
  country: string;
  resume_text: string | null;
  analysis_json: Json;
  created_at: string;
}

export interface CareerPlan {
  id: string;
  user_id: string;
  analysis_id: string;
  path_index: number;
  timeframe: string;
  plan_json: Json;
  completed_tasks: string[] | null;
  created_at: string;
}

export interface ResumeOptimization {
  id: string;
  user_id: string;
  job_title: string;
  job_description: string;
  result_json: Json;
  created_at: string;
}

export interface InterviewPrep {
  id: string;
  user_id: string;
  job_title: string | null;
  company: string | null;
  job_description: string;
  questions_json: Json;
  created_at: string;
}

// Keep Database export for backward compatibility — will be replaced by generated types
export type Database = Record<string, unknown>;
