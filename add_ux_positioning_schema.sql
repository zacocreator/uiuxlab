-- casesテーブルにUXポジショニング用のカラムを追加
ALTER TABLE cases ADD COLUMN IF NOT EXISTS ux_positioning JSONB;

-- 既存のレコードに空の初期値をセット（必要に応じて）
COMMENT ON COLUMN cases.ux_positioning IS 'UXポジショニング分析結果（スコアとコメントの配列）';
