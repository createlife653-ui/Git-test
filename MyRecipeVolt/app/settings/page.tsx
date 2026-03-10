"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface UserSettings {
    id: string;
    default_servings_count: number;
    updated_at: string;
}

export default function SettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [defaultServings, setDefaultServings] = useState(2);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from("user_settings")
            .select("*")
            .limit(1)
            .single();

        if (data) {
            setSettings(data);
            setDefaultServings(data.default_servings_count);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);

        try {
            if (settings) {
                // 既存の設定を更新
                await supabase
                    .from("user_settings")
                    .update({ default_servings_count: defaultServings })
                    .eq("id", settings.id);
            } else {
                // 新規作成
                await supabase
                    .from("user_settings")
                    .insert({ default_servings_count: defaultServings });
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("設定の保存に失敗しました:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="page-container" style={{ maxWidth: 600 }}>
            <div className="page-header">
                <h1 className="page-title">⚙️ 設定</h1>
                <p className="page-subtitle">
                    アプリの設定を変更できます
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <div className="spinner" style={{ margin: "0 auto 16px", width: 32, height: 32 }}></div>
                    <p style={{ color: "var(--text-muted)" }}>読み込み中...</p>
                </div>
            ) : (
                <>
                    <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16 }}>デフォルト設定</h2>

                        {/* デフォルト人数 */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 12 }}>
                                デフォルトの人数
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button
                                    onClick={() => setDefaultServings(Math.max(1, defaultServings - 1))}
                                    style={{
                                        width: 40, height: 40,
                                        border: "1px solid var(--border)",
                                        background: "var(--card-bg)",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        fontSize: "1.4rem",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={defaultServings}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        setDefaultServings(val > 0 ? val : 1);
                                    }}
                                    style={{
                                        width: 80, padding: "10px",
                                        border: "1px solid var(--border)",
                                        borderRadius: 8,
                                        background: "var(--card-bg)",
                                        color: "var(--text-primary)",
                                        fontSize: "1.1rem",
                                        textAlign: "center",
                                        fontWeight: 600,
                                    }}
                                />
                                <button
                                    onClick={() => setDefaultServings(Math.min(100, defaultServings + 1))}
                                    style={{
                                        width: 40, height: 40,
                                        border: "1px solid var(--border)",
                                        background: "var(--card-bg)",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        fontSize: "1.4rem",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}
                                >
                                    ＋
                                </button>
                                <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>人分</span>
                            </div>
                            <p style={{ marginTop: 8, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                新しいレシピを表示する際の初期人数として使用されます
                            </p>
                        </div>

                        <div className="section-divider" style={{ marginBottom: 16 }} />

                        {/* 保存ボタン */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary"
                            style={{ width: "100%", justifyContent: "center" }}
                        >
                            {saved ? "✅ 保存しました！" : saving ? "保存中..." : "💾 設定を保存"}
                        </button>
                    </div>

                    {/* ナビゲーション */}
                    <div style={{ textAlign: "center" }}>
                        <Link href="/" className="btn-ghost" style={{ marginBottom: 16 }}>
                            ← トップに戻る
                        </Link>
                    </div>
                </>
            )}
        </main>
    );
}
