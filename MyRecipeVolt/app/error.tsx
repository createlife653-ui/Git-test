"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-container" style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{
        maxWidth: 500,
        margin: "0 auto",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: 40,
      }}>
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>
          エラーが発生しました
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 }}>
          申し訳ありませんが、問題が発生しました。もう一度お試しください。
        </p>
        <button
          onClick={reset}
          className="btn-primary"
          style={{ marginBottom: 16 }}
        >
          もう一度試す
        </button>
        <div>
          <a
            href="/"
            className="btn-ghost"
            style={{ display: "inline-block" }}
          >
            トップに戻る
          </a>
        </div>
      </div>
    </main>
  );
}
