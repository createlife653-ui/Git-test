-- My Recipe Vault - Database Schema
-- Supabase SQL Editorで実行してください

-- レシピ本体
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source_url text,
  image_url text,
  servings text,
  note text,
  category text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 材料
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount text,
  order_index int DEFAULT 0
);

-- 手順
CREATE TABLE IF NOT EXISTS steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number int NOT NULL,
  instruction text NOT NULL
);

-- タグ
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

-- レシピ↔タグ 中間テーブル
CREATE TABLE IF NOT EXISTS recipe_tags (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);

-- Row Level Security (全ユーザーがアクセス可能 - 個人用途のため)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON recipes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON ingredients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON steps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON recipe_tags FOR ALL USING (true) WITH CHECK (true);

-- 既存のテーブルにcategoryカラムを追加（既に存在する場合のエラーを回避）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'category'
  ) THEN
    ALTER TABLE recipes ADD COLUMN category text;
  END IF;
END $$;

-- 既存のテーブルにservings_countカラムを追加（人数を数値として保存）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'servings_count'
  ) THEN
    ALTER TABLE recipes ADD COLUMN servings_count int;
  END IF;
END $$;

-- ユーザー設定テーブル
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  default_servings_count int DEFAULT 2,
  updated_at timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON user_settings FOR ALL USING (true) WITH CHECK (true);
