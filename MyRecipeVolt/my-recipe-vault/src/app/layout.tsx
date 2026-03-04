import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Recipe Vault - マイ・レシピ・ヴォルト",
  description: "制限なし、広告なし。自分好みに育てる一生モノのレシピ管理ツール。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <nav className="nav">
          <Link href="/" className="nav-logo">
            🍳 My Recipe Vault
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">
              🏠 ホーム
            </Link>
            <Link href="/import" className="nav-link">
              🔗 URLインポート
            </Link>
            <Link href="/recipes/new" className="nav-link">
              ✏️ 手動入力
            </Link>
            <Link href="/favorites" className="nav-link">
              ❤️ お気に入り
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
