"use client";

import Link from "next/link";
import { useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body suppressHydrationWarning>
        <nav className="nav">
          <Link href="/" className="nav-logo">
            🍳 My Recipe Vault
          </Link>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="メニュー"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <Link href="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              🏠 ホーム
            </Link>
            <Link href="/import" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              🔗 URLインポート
            </Link>
            <Link href="/recipes/new" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              ✏️ 手動入力
            </Link>
            <Link href="/favorites" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              ❤️ お気に入り
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
