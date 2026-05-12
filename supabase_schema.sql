-- ==========================================
-- UI/UX Gallery Site: Supabase Schema Setup
-- ==========================================

-- 1. Create Tables

-- 1.1 cases table
CREATE TABLE IF NOT EXISTS public.cases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  service_name text NOT NULL,
  url text,
  category text,
  summary text,
  ux_notes text,
  good_points text,
  improvement_points text,
  ui_patterns text,
  thumbnail_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.2 tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);

-- 1.3 case_tags table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.case_tags (
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (case_id, tag_id)
);

-- 2. Setup Row Level Security (RLS)
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_tags ENABLE ROW LEVEL SECURITY;

-- 2.1 Policies for cases
-- Public can read all cases
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.cases FOR SELECT 
USING (true);

-- Authenticated users can insert/update/delete cases
CREATE POLICY "Users can insert cases" 
ON public.cases FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update cases" 
ON public.cases FOR UPDATE 
TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete cases" 
ON public.cases FOR DELETE 
TO authenticated 
USING (true);

-- 2.2 Policies for tags
CREATE POLICY "Public tags are viewable by everyone." 
ON public.tags FOR SELECT 
USING (true);

CREATE POLICY "Users can insert tags" 
ON public.tags FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update tags" 
ON public.tags FOR UPDATE 
TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete tags" 
ON public.tags FOR DELETE 
TO authenticated 
USING (true);

-- 2.3 Policies for case_tags
CREATE POLICY "Public case_tags are viewable by everyone." 
ON public.case_tags FOR SELECT 
USING (true);

CREATE POLICY "Users can insert case_tags" 
ON public.case_tags FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update case_tags" 
ON public.case_tags FOR UPDATE 
TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete case_tags" 
ON public.case_tags FOR DELETE 
TO authenticated 
USING (true);

-- 3. Create Storage Bucket for thumbnails
-- NOTE: Please ensure the 'storage' schema and related functions exist in your Supabase project.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- 3.1 Storage Policies
CREATE POLICY "Thumbnails are publicly accessible." 
ON storage.objects FOR SELECT 
USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails." 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can update thumbnails." 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can delete thumbnails." 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'thumbnails');

-- 4. Setup Updated_at trigger for cases
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cases_modtime
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
