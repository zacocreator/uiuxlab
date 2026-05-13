-- patternsテーブルに視覚化データ用カラムを追加
ALTER TABLE public.patterns 
ADD COLUMN IF NOT EXISTS visualization_data JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.patterns.visualization_data IS 'パターンの構造視覚化データ（セクション構成、レイアウト、Reactコード例など）';
