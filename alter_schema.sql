-- Add AI analysis columns to the cases table
ALTER TABLE public.cases
ADD COLUMN target_users text,
ADD COLUMN user_needs text,
ADD COLUMN ux_strategy text,
ADD COLUMN information_architecture text,
ADD COLUMN ui_tone text,
ADD COLUMN main_cta text,
ADD COLUMN conversion_points text,
ADD COLUMN trust_elements text,
ADD COLUMN friction_points text,
ADD COLUMN reusable_patterns text,
ADD COLUMN ai_analysis_json jsonb,
ADD COLUMN analyzed_at timestamptz;
