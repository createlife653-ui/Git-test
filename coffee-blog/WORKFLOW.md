# 記事投稿ワークフロー

コーヒーブログに新しい記事を投稿するための手順です。

---

## 🚀 超シンプル版（AIアシスト付き）

**「本文だけ書く。あとはAIに任せる」**

### 手順

1. **本文だけ書く** — メモや箇条書きでOK
   ```
   今日はエチオピアのゲイシャを飲んだ。
   香りがすごい。淹れ方は...

   ## 淹れ方
   - 温度: 92度
   ```

2. **AIに依頼** — 以下の内容をコピペして依頼
   ```
   この内容でブログ記事を作って。
   フロントマターと画像URLはAIで考えて。
   ```

3. **完成したファイルを `content/posts/` に保存**

---

**👆 基本はこれだけでOK！ 詳しいルールは下記**

---

## 詳細ルール

## 1. 記事ファイルの作成

### 場所
`content/posts/` ディレクトリに `.md` ファイルを作成します。

### ファイル名のルール
- 英数字とハイフンのみ使用
- スペースは使わない
- 例: `my-new-article.md`

### フロントマター（必須）

記事の冒頭にYAML形式でメタデータを記述します：

```yaml
---
title: '記事タイトル'
slug: '記事のURLスラッグ'
category: 'カテゴリ名'
date: 'YYYY-MM-DD'
readTime: '5 min'
image: '画像URL'
tags: ['タグ1', 'タグ2']
excerpt: '記事の要約（2〜3行で）'
---
```

| 項目 | 説明 | 例 |
|------|------|------|
| `title` | 記事のタイトル | `'エチオピア・ゲイシャの味わい'` |
| `slug` | URLの一部（ファイル名と一致推奨） | `'ethiopia-geisha'` |
| `category` | カテゴリ | `'Tasting Notes'`, `'Brewing'` |
| `date` | 公開日 | `'2026-05-11'` |
| `readTime` | 読了時間 | `'5 min'`, `'3 min'` |
| `image` | サムネイル画像URL | `https://images.unsplash.com/...` |
| `tags` | タグの配列 | `['Floral', 'Ethiopia']` |
| `excerpt` | 記事の要約 | `'この記事では〜について解説します'` |

## 2. 画像の使い方

### 方法A: 外部URLを使う（簡単）
Unsplashなどの無料画像サービスを使用：

```
image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&h=600&fit=crop'
```

### 方法B: ローカル画像を使う
1. `public/images/` に画像ファイルを保存
2. フロントマターで以下のように参照：

```
image: '/images/my-coffee-photo.jpg'
```

### 記事内に画像を埋め込む
Markdown記法：

```markdown
![代替テキスト](/images/photo.jpg)

![外部画像](https://images.unsplash.com/...)
```

## 3. 記事本文の書き方

Markdown形式で記述します：

```markdown
## 見出し2

本文を書きます。

### 見出き3

- 箇条書き1
- 箇条書き2

| 項目 | 内容 |
|------|------|
| 産地 | エチオピア |
| 精製 | ナチュラル |

```

## 4. 記事の反映

### 開発環境の場合
1. ファイルを保存するだけで自動反映されます
2. ブラウザで `http://localhost:3000/blog/[slug]` にアクセス

### 本番環境の場合
```bash
# Vercelにデプロイ
vercel --prod
```

または、Gitにプッシュして自動デプロイ：
```bash
git add content/posts/new-article.md
git commit -m "新しい記事を追加"
git push
```

## 5. URLの仕組み

- ファイル名: `ethiopia-geisha.md`
- Slug: `ethiopia-geisha`
- 実際のURL: `https://coffee-blog-xxx.vercel.app/blog/ethiopia-geisha`

SlugがURLになるので、短く分かりやすいものにしましょう。

## 6. サンプル記事

`content/posts/fukusuke-sakura-blend.md` が参考になります。

## よくある質問

**Q: 記事が表示されない**
- ファイルが `content/posts/` にあるか確認
- フロントマターの構文が正しいか確認（特に `---` で囲まれているか）
- `.md` 拡張子がついているか確認

**Q: 画像が表示されない**
- 外部URLならブラウザで直接アクセスして確認
- ローカル画像なら `public/` ディレクトリ内にあるか確認
- パスが `/images/...` で始まっているか確認

**Q: タグページってどうやって作るの？**
- フロントマターに `tags` を追加するだけで自動生成されます
- URLは `/library/[タグ名]` になります
