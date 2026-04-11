-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name           TEXT,
  last_name            TEXT,
  phone                TEXT,
  profile_email        TEXT,
  bio                  TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile row when a user signs up (works for email & LinkedIn OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  full_name TEXT;
  first TEXT;
  last TEXT;
  space_pos INT;
BEGIN
  full_name := NEW.raw_user_meta_data->>'full_name';
  IF full_name IS NOT NULL AND full_name != '' THEN
    space_pos := position(' ' in full_name);
    IF space_pos > 0 THEN
      first := substring(full_name FROM 1 FOR space_pos - 1);
      last  := substring(full_name FROM space_pos + 1);
    ELSE
      first := full_name;
      last  := NULL;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, profile_email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    first,
    last
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ─────────────────────────────────────────────
-- RESUMES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resumes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url     TEXT NOT NULL,
  file_name    TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own resumes" ON public.resumes FOR ALL USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- CAREER ANALYSES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.career_analyses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage         TEXT NOT NULL,
  sub_stage     TEXT,
  country       TEXT NOT NULL,
  resume_text   TEXT,
  analysis_json JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.career_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own analyses" ON public.career_analyses FOR ALL USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- CAREER PLANS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.career_plans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID NOT NULL REFERENCES public.career_analyses(id) ON DELETE CASCADE,
  path_index  INTEGER NOT NULL CHECK (path_index BETWEEN 0 AND 2),
  timeframe   TEXT NOT NULL CHECK (timeframe IN ('1mo', '3mo', '6mo')),
  plan_json   JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (analysis_id, path_index, timeframe)
);

ALTER TABLE public.career_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own plans" ON public.career_plans FOR ALL USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- RESUME OPTIMIZATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resume_optimizations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title        TEXT NOT NULL,
  job_description  TEXT NOT NULL,
  result_json      JSONB NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.resume_optimizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own optimizations" ON public.resume_optimizations FOR ALL USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- INTERVIEW PREPS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.interview_preps (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_description  TEXT NOT NULL,
  questions_json   JSONB NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.interview_preps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own preps" ON public.interview_preps FOR ALL USING (auth.uid() = user_id);
