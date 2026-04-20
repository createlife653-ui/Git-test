# タグライブラリ機能実装プラン

## Context
トップページの「知識ライブラリ」ボタン（`/library`）がリンク切れの状態。既存の9種類のタグ（Fishing, Morning Coffee, Coffee Journey, Roast, Flavor, Bean, Brewing, Extraction, Tips）を活用し、タグベースの記事探索機能を実装する。

## 実装内容

### 1. データ層の拡張 (`lib/posts.ts`)

**追加する関数:**

```typescript
// 全タグ一覧と記事数を取得
export function getAllTags(): Array<{ name: string; count: number }> {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // 記事数順
}

// 特定タグの記事を取得
export function getPostsByTag(tag: string): PostMetadata[] {
  const posts = getAllPosts();
  return posts.filter(post => post.tags.includes(tag));
}

// 全タグ名リスト（generateStaticParams用）
export function getAllTagNames(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}
```

### 2. ライブラリトップページ (`app/library/page.tsx`)

**構成:**
- ヘッダーセクション: 「知識ライブラリ」タイトルと説明
- タググリッド: 各タグをカード形式で表示（記事数付き）
- タグカードをクリックで `/library/[tag]` へ遷移

**デザイン:**
- `/blog` ページと同様のレイアウト構造
- タグカードにはタグ名と記事数（「Roast (2)」など）を表示
- ホバーエフェクトでクリック可能であることを示す

### 3. タグ詳細ページ (`app/library/[tag]/page.tsx`)

**動的ルートページ:**
- URL例: `/library/roast`, `/library/brewing`
- ヘッダー: 選択されたタグ名
- 記事一覧: そのタグを持つ記事をCardコンポーネントで表示
- 「全タグを見る」リンクで `/library` へ戻る

**generateStaticParams:**
```typescript
export async function generateStaticParams() {
  const tags = getAllTagNames();
  return tags.map(tag => ({ tag: encodeURIComponent(tag) }));
}
```

### 4. 既存ページのタグをクリッカブルに変更

**対象ファイル:**
- `app/page.tsx` (top)
- `app/blog/page.tsx` (blog list)
- `app/blog/[id]/page.tsx` (article detail)

**変更内容:**
```typescript
// 変更前
<Chip key={tag} clickable={false}>{tag}</Chip>

// 変更後
<Link href={`/library/${encodeURIComponent(tag)}`}>
  <Chip clickable={true}>{tag}</Chip>
</Link>
```

## 修正ファイル一覧

| ファイル | 操作 |
|---------|------|
| `lib/posts.ts` | 関数追加 (getAllTags, getPostsByTag, getAllTagNames) |
| `app/library/page.tsx` | 新規作成 |
| `app/library/[tag]/page.tsx` | 新規作成 |
| `app/page.tsx` | タグをクリッカブルに変更 |
| `app/blog/page.tsx` | タグをクリッカブルに変更 |
| `app/blog/[id]/page.tsx` | タグをクリッカブルに変更 |

## 実装順序

1. **lib/posts.ts に関数追加** - データ層の拡張
2. **app/library/page.tsx 作成** - タグ一覧ページ
3. **app/library/[tag]/page.tsx 作成** - タグ詳細ページ
4. **既存ページのタグをリンクに変更** - UI改善

## 検証方法

1. `npm run dev` で開発サーバー起動
2. `/library` にアクセスし、タグ一覧が表示されることを確認
3. タグカードをクリックし、`/library/[tag]` で該当記事のみ表示されることを確認
4. 記事詳細ページやブログ一覧ページのタグをクリックし、ライブラリページへ遷移することを確認
5. URLに `/library/存在しないタグ` を入力し、空状態が適切に表示されることを確認
