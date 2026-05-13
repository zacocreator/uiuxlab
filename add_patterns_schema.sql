-- patternsテーブルの作成
CREATE TABLE IF NOT EXISTS public.patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    purpose TEXT,
    user_problem TEXT,
    ux_effect TEXT,
    implementation_notes TEXT,
    best_for TEXT,
    risks TEXT,
    cognitive_load TEXT,
    emotional_effect TEXT,
    mobile_compatibility TEXT,
    accessibility_notes TEXT,
    ux_positioning JSONB DEFAULT '[]'::jsonb,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- case_patterns中間テーブルの作成
CREATE TABLE IF NOT EXISTS public.case_patterns (
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    pattern_id UUID REFERENCES public.patterns(id) ON DELETE CASCADE,
    PRIMARY KEY (case_id, pattern_id)
);

-- RLS ポリシー (必要に応じて)
-- ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.case_patterns ENABLE ROW LEVEL SECURITY;
