# デフォルト人数設定をレシピ詳細ページに適用する実装計画

## Context
設定画面で設定した「デフォルト人数」をレシピ詳細ページの初期表示人数として適用する。
現在はレシピ詳細ページで固定の2人前が表示されているが、ユーザーのデフォルト設定（例: 3人前）を反映させたい。
既存データはそのままで対応可能（インポートのやり直し不要）。

## 実装方針
レシピ詳細ページの初期表示人数を、以下の優先順位で決定する：
1. ユーザー設定のデフォルト人数
2. レシピの元の人数（servings_count）
3. デフォルト値（2）

## 修正対象ファイル
- `app/recipes/[id]/page.tsx`

## 実装手順

### 1. ユーザー設定用のState追加
**位置**: Line 51-52付近

```typescript
const [userSettings, setUserSettings] = useState<{ default_servings_count: number } | null>(null);
```

### 2. ユーザー設定を取得
**位置**: `fetchAll()` 関数内の `Promise.all`（Line 59-66）

既存のクエリにuser_settingsの取得を追加：

```typescript
const [recipeRes, ingRes, stepRes, tagRes, settingsRes] = await Promise.all([
    supabase.from("recipes").select("*").eq("id", id).single(),
    supabase.from("ingredients").select("*").eq("recipe_id", id).order("order_index"),
    supabase.from("steps").select("*").eq("recipe_id", id).order("step_number"),
    supabase.from("recipe_tags").select("tags(id,name)").eq("recipe_id", id),
    supabase.from("user_settings").select("*").limit(1).single(), // 追加
]);
```

設定データをStateに保存：

```typescript
if (settingsRes.data) {
    setUserSettings(settingsRes.data);
}
```

### 3. 初期表示人数を計算
**位置**: Line 71-72

```typescript
// 人数設定（ユーザーのデフォルト設定を優先、ない場合はレシピの元の人数、それもない場合は2）
const defaultCount = userSettings?.default_servings_count;
const initialServings = defaultCount || recipeRes.data.servings_count || 2;
setCurrentServings(initialServings);
```

## エッジケース対応

1. **ユーザー設定が存在しない場合**:
   - レシピの `servings_count` を使用
   - それもなければ2をデフォルト値として使用

2. **レシピにservings_countがない場合**:
   - ユーザーのデフォルト設定を使用
   - それもなければ2を使用

3. **どちらも存在しない場合**:
   - 2をデフォルト値として使用（現在の動作を維持）

## 検証方法

### テストシナリオ1: デフォルト設定がある場合
1. 設定画面でデフォルト人数を「3」に設定
2. 元の人数が2人のレシピを開く
3. **期待値**: 初期表示が「3人分」、材料が「1.5倍」で表示される

### テストシナリオ2: ユーザー設定がない場合
1. user_settings テーブルのデータを削除
2. 任意のレシピを開く
3. **期待値**: レシピの元の人数（servings_count）が表示される

### テストシナリオ3: 手動調整が機能すること
1. デフォルト設定が適用されたレシピで +/- ボタンをクリック
2. **期待値**: 手動調整が正常に動作し、材料の分量が再計算される

### テストシナリオ4: 既存レシピへの影響確認
1. 既存のレシピを複数開く
2. **期待値**: すべてのレシピでデフォルト設定が適用され、表示が正しい

## 動作確認後の期待される挙動

例：デフォルト人数 = 3、レシピの元の人数 = 2
- 初期表示人数: 3人分
- 材料の表示: "2カップ" × (3/2) = "3カップ"

例：デフォルト人数 = 1、レシピの元の人数 = 4
- 初期表示人数: 1人分
- 材料の表示: "200g" × (1/4) = "50g"
