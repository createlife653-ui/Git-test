# アフィリエイト収益化の最低限の準備

## Context
Amazonアソシエイトは既に承認済みだが、トラッキングIDが設定されていない。ユーザーは「記事を増やすこと」を優先したいとのことなので、大規模な機能追加はせず、収益化に必要な最小限の準備だけを行う。

## 目標
1. AmazonトラッキングIDを設定して収益計測を開始する
2. Google Analyticsを導入してアクセス状況を把握できるようにする

## 実装計画

### 1. AmazonトラッキングIDの設定

**ファイル**: `coffee-blog/.env.local`

```diff
- AMAZON_ASSOCIATE_TAG=your-tag-22
+ AMAZON_ASSOCIATE_TAG=[coffeeblog04-22]
```

※ ユーザーに実際のIDを入力してもらう

---

### 2. Google Analytics 4（GA4）の導入

**アプローチ**: Next.js App Routerで推奨される `GoogleAnalytics` コンポーネントを使用

**手順**:
1. `package.json` に `@next/third-parties` を追加
2. ルートレイアウトにGAコンポーネントを追加
3. `.env.local` に測定IDを追加

**ファイル**: `coffee-blog/package.json`
```json
"dependencies": {
  "@next/third-partities": "^16.2.3",
  // ... 既存の依存関係
}
```

**ファイル**: `coffee-blog/app/layout.tsx`
```tsx
import { GoogleAnalytics } from '@next/third-partities/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  )
}
```

**ファイル**: `coffee-blog/.env.local`
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 実装しないこと（今後の検討）

| 項目 | 理由 |
|------|------|
| プライバシーポリシー | Amazon承認済みのため既に対応済みと推測 |
| 特定商取引法表記 | 同上 |
| 商品一覧ページ | 記事内のアフィリエイトカードで十分 |
| ソーシャル連携 | 記事増加を優先 |

---

## 検証手順

1. トラッキングID設定後、アフィリエイトリンクをクリックしてURLに`?tag=xxx`が含まれることを確認
2. GA4導入後、リアルタイムレポートで自分のアクセスが表示されることを確認

---

## 追加で必要な情報

- AmazonトラッキングID（ユーザー入力）
- Google Analytics 4 の測定ID（ユーザー取得）

---

## Google Analytics 4 の作成手順

1. [Google Analytics](https://marketingplatform.google.com/about/analytics/) にアクセス
2. 「測定を開始」をクリック
3. アカウント名を入力（例: Coffee Blog）→ 「次へ」
4. プロパティ名を入力（例: Coffee Blog サイト）→ 「次へ」
5. ビジネス情報を選択 → 「作成」
6. 利用規約に同意
7. 「プラットフォームを選択」→ 「ウェブ」を選択
8. ウェブサイトのURL: `https://coffee-blog-eta.vercel.app`
9. ストリーム名: `Coffee Blog`
10. 「ストリームを作成」をクリック
11. 表示される「測定ID」をコピー（形式: `G-XXXXXXXXXX`）

---

## 実装フロー

1. ユーザーがAmazonトラッキングIDを提供
2. ユーザーがGA4を作成して測定IDを取得
3. 上記2つのIDを `.env.local` に設定
4. GA4導入のための実装（npm install + コード追加）
