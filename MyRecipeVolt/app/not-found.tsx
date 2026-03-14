import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-container" style={{ textAlign: "center", padding: "80px 20px" }}>
      <div className="empty-state">
        <div className="empty-state-icon">🍽️</div>
        <p className="empty-state-title">ページが見つかりません</p>
        <p style={{ color: "var(--text-muted)", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link href="/" className="btn-primary">
          トップに戻る
        </Link>
      </div>
    </main>
  );
}
