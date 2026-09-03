# Coffee Blog

`coffee-blog` は、コーヒーを学ぶための Next.js 製ブログです。

このブログの目的は、SEO、収益化、記事数、SNS拡散ではありません。
`coffee-asset` に残した観察や仮説を、他人に教えるつもりで説明し直し、自分の理解を確かめるために使います。

## Role

- `coffee-asset`: 学習の作業場。観察、原理、仮説、比較、次の実験を残す。
- `coffee-blog`: 学習の発表練習。自分の言葉で説明できるか確認する。

## Writing Policy

- 1記事で1つの理解を扱う。
- 体験していないことを、分かったふりで断言しない。
- AIに丸投げせず、自分の観察・疑問・言葉を中心にする。
- 記事末尾に「今回理解したこと」と「まだ分からないこと」を残す。
- アフィリエイト、SEO最適化、拡散キャンペーンは一旦停止する。

## Getting Started

開発サーバーを起動します。

```bash
cd coffee-blog
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## Main Paths

- `content/posts/`: 学習記事の Markdown。
- `app/`: Next.js App Router の画面。
- `app/components/`: UI コンポーネント。
- `lib/posts.ts`: Markdown 記事の読み込み。
- `public/images/`: 図解や記事画像。
- `_paused/`: 現在の学習目的から外れるが、履歴として残すもの。

## Learning Flow

1. `coffee-asset/02_case_studies/` に体験を記録する。
2. `coffee-asset/00_principles/` とつなげて、理解を確認する。
3. 繰り返し見える傾向を `coffee-asset/03_patterns/` にまとめる。
4. 説明できそうなテーマだけ `content/posts/` に記事化する。
5. 記事を書いた後、分からなかった点を `coffee-asset` に戻す。

## Commands

```bash
npm run dev
npm run lint
```

## Production Links

- 本番サイト: https://coffee-blog-eta.vercel.app/

本番運用は残しますが、現在の優先順位は学習と理解の定着です。
