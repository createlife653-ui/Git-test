export default function Loading() {
  return (
    <main className="page-container" style={{ textAlign: "center", padding: "80px 20px" }}>
      <div className="spinner" style={{ margin: "0 auto 20px", width: 48, height: 48 }}></div>
      <p style={{ color: "var(--text-muted)" }}>読み込み中...</p>
    </main>
  );
}
