"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { icon: "🥩", label: "肉料理" },
  { icon: "🐟", label: "魚料理" },
  { icon: "🥦", label: "野菜" },
  { icon: "🍜", label: "麺類" },
  { icon: "🍚", label: "ご飯" },
  { icon: "🥗", label: "サラダ" },
  { icon: "🍲", label: "煮物" },
  { icon: "🍰", label: "スイーツ" },
];

interface ParsedRecipe {
    title: string;
    image_url: string;
    servings: string;
    servings_count: number | null;
    category: string;
    ingredients: { name: string; amount: string }[];
    steps: { step_number: number; instruction: string }[];
    source_url: string;
}

// 人数解析関数
const parseServingsCount = (servingsText: string | undefined): { count: number | null; originalText: string } => {
    if (!servingsText) {
        return { count: null, originalText: "" };
    }

    // パターンマッチングで数値を抽出
    const patterns = [
        /(\d+)\s*人分/,           // "2人分", " 2 人分 "
        /(\d+)\s*人前/,           // "2人前"
        /(\d+)\s* servings?/i,    // "2 servings", "2 serving"
        /(\d+)\s*portions?/i,     // "2 portions"
        /(\d+)\s*人/,             // "2人"
    ];

    for (const pattern of patterns) {
        const match = servingsText.match(pattern);
        if (match) {
            const count = parseInt(match[1], 10);
            if (count > 0 && count <= 100) { // 妥当な範囲内かチェック
                return { count, originalText: servingsText };
            }
        }
    }

    return { count: null, originalText: servingsText };
};

export default function ImportPage() {
    const router = useRouter();
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);

    const [isBlocked, setIsBlocked] = useState(false);

    const handleScrape = async () => {
        if (!url.trim()) return;
        setLoading(true);
        setError("");
        setRecipe(null);
        setIsBlocked(false);

        try {
            const res = await fetch("/api/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "解析に失敗しました");
            }

            // Server returned 200 but with an error message (e.g. blocked by site)
            if (data.error) {
                setError(data.error);
                setIsBlocked(!!data.blocked);
                return;
            }

            // 人数解析
            const parsedServings = parseServingsCount(data.recipe.servings);
            setRecipe({
                ...data.recipe,
                servings_count: parsedServings.count,
            });
        } catch (err: unknown) {
            if (err instanceof TypeError && err.message === "Failed to fetch") {
                setError("サーバーへの接続に失敗しました。開発サーバーが起動しているか確認してください。");
            } else {
                setError(err instanceof Error ? err.message : "解析に失敗しました");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!recipe) return;
        setSaving(true);

        try {
            console.log("🔵 保存開始:", recipe);

            // 1. レシピ本体を保存
            const { data: savedRecipe, error: recipeErr } = await supabase
                .from("recipes")
                .insert({
                    title: recipe.title,
                    source_url: recipe.source_url,
                    image_url: recipe.image_url || null,
                    servings: recipe.servings || null,
                    servings_count: recipe.servings_count || null,
                    category: recipe.category || null,
                })
                .select()
                .single();

            if (recipeErr) {
                console.error("❌ レシピ保存エラー:", recipeErr);
                throw recipeErr;
            }
            const recipeId = savedRecipe.id;
            console.log("✅ レシピ保存成功:", recipeId);

            // 2. 材料を保存
            if (recipe.ingredients.length > 0) {
                console.log("🔵 材料保存開始:", recipe.ingredients.length, "件");
                const { error: ingErr } = await supabase.from("ingredients").insert(
                    recipe.ingredients.map((ing, i) => ({
                        recipe_id: recipeId,
                        name: ing.name,
                        amount: ing.amount,
                        order_index: i,
                    }))
                );
                if (ingErr) {
                    console.error("❌ 材料保存エラー:", ingErr);
                    throw ingErr;
                }
                console.log("✅ 材料保存成功");
            }

            // 3. 手順を保存
            if (recipe.steps.length > 0) {
                console.log("🔵 手順保存開始:", recipe.steps.length, "件");
                const { error: stepErr } = await supabase.from("steps").insert(
                    recipe.steps.map((s) => ({
                        recipe_id: recipeId,
                        step_number: s.step_number,
                        instruction: s.instruction,
                    }))
                );
                if (stepErr) {
                    console.error("❌ 手順保存エラー:", stepErr);
                    throw stepErr;
                }
                console.log("✅ 手順保存成功");
            }

            console.log("🎉 すべて保存完了、遷移します");
            router.push(`/recipes/${recipeId}`);
        } catch (err: unknown) {
            console.error("💥 保存失敗:", err);
            setError(err instanceof Error ? err.message : "保存に失敗しました");
            setSaving(false);
        }
    };

    const updateIngredient = (idx: number, field: "name" | "amount", value: string) => {
        if (!recipe) return;
        const updated = [...recipe.ingredients];
        updated[idx] = { ...updated[idx], [field]: value };
        setRecipe({ ...recipe, ingredients: updated });
    };

    const updateStep = (idx: number, value: string) => {
        if (!recipe) return;
        const updated = [...recipe.steps];
        updated[idx] = { ...updated[idx], instruction: value };
        setRecipe({ ...recipe, steps: updated });
    };

    const addIngredient = () => {
        if (!recipe) return;
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { name: "", amount: "" }] });
    };

    const addStep = () => {
        if (!recipe) return;
        const next = recipe.steps.length + 1;
        setRecipe({ ...recipe, steps: [...recipe.steps, { step_number: next, instruction: "" }] });
    };

    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">🔗 URLからインポート</h1>
                <p className="page-subtitle">
                    レシピサイトのURLを貼り付けると、情報を自動で取得します
                </p>
            </div>

            {/* URL入力エリア */}
            <div
                className="glass-card"
                style={{ padding: "28px", marginBottom: 32 }}
            >
                <label style={{ display: "block", marginBottom: 10, fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    レシピページのURL
                </label>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <input
                        id="recipe-url-input"
                        type="url"
                        className="input-field"
                        placeholder="https://cookpad.com/recipe/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                        style={{ flex: 1, minWidth: 240 }}
                    />
                    <button
                        id="analyze-btn"
                        onClick={handleScrape}
                        disabled={loading || !url.trim()}
                        className="btn-primary"
                        style={{ flexShrink: 0 }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner" style={{ width: 16, height: 16 }}></span>
                                解析中...
                            </>
                        ) : (
                            "🔍 解析する"
                        )}
                    </button>
                </div>

                {error && (
                    <div
                        style={{
                            marginTop: 16,
                            padding: "14px 18px",
                            background: isBlocked
                                ? "rgba(251, 146, 60, 0.1)"
                                : "rgba(239, 68, 68, 0.1)",
                            border: `1px solid ${isBlocked ? "rgba(251, 146, 60, 0.4)" : "rgba(239, 68, 68, 0.3)"}`,
                            borderRadius: 10,
                            color: isBlocked ? "#fdba74" : "#fca5a5",
                            fontSize: "0.9rem",
                        }}
                    >
                        <div style={{ marginBottom: isBlocked ? 10 : 0 }}>
                            {isBlocked ? "🚫" : "⚠️"} {error}
                        </div>
                        {isBlocked && (
                            <a
                                href="/recipes/new"
                                style={{
                                    display: "inline-block",
                                    marginTop: 4,
                                    padding: "8px 16px",
                                    background: "rgba(251, 146, 60, 0.2)",
                                    border: "1px solid rgba(251, 146, 60, 0.5)",
                                    borderRadius: 8,
                                    color: "#fdba74",
                                    fontSize: "0.85rem",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                }}
                            >
                                ✏️ 手動入力ページへ
                            </a>
                        )}
                    </div>
                )}

                <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        💡 対応サイト例: クックパッド、クラシル、デリッシュキッチン、NHKきょうの料理など<br />
                        ・サイトによっては情報が取得できない場合があります（手動で補完できます）<br />
                        ・SNS（Instagram等）は対応していません
                    </p>
                </div>
            </div>

            {/* プレビューエリア */}
            {recipe && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>📋 解析結果 — 内容を確認・修正してください</h2>
                        <button
                            id="save-recipe-btn"
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary"
                        >
                            {saving ? (
                                <><span className="spinner" style={{ width: 16, height: 16 }}></span>保存中...</>
                            ) : (
                                "💾 保存する"
                            )}
                        </button>
                    </div>

                    {/* 基本情報 */}
                    <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16 }}>基本情報</h3>

                        <div style={{ display: "grid", gap: 16 }}>
                            {/* タイトル */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>タイトル *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={recipe.title}
                                    onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                                />
                            </div>

                            {/* カテゴリ */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>カテゴリ（任意）</label>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.label}
                                            type="button"
                                            onClick={() => setRecipe({ ...recipe, category: cat.label })}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 6,
                                                padding: "8px 12px",
                                                borderRadius: 20,
                                                border: recipe.category === cat.label
                                                    ? "2px solid var(--accent-primary)"
                                                    : "1px solid var(--border-color)",
                                                background: recipe.category === cat.label
                                                    ? "rgba(var(--accent-primary-rgb), 0.1)"
                                                    : "var(--card-bg)",
                                                color: recipe.category === cat.label
                                                    ? "var(--accent-primary)"
                                                    : "var(--text-primary)",
                                                fontSize: "0.85rem",
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (recipe.category !== cat.label) {
                                                    e.currentTarget.style.borderColor = "var(--accent-primary)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (recipe.category !== cat.label) {
                                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                                }
                                            }}
                                        >
                                            <span>{cat.icon}</span>
                                            <span>{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {recipe.category && (
                                    <button
                                        type="button"
                                        onClick={() => setRecipe({ ...recipe, category: "" })}
                                        style={{
                                            marginTop: 8,
                                            padding: "4px 8px",
                                            fontSize: "0.75rem",
                                            background: "none",
                                            border: "1px solid var(--border-color)",
                                            borderRadius: 4,
                                            color: "var(--text-muted)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        カテゴリを解除
                                    </button>
                                )}
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {/* 画像URL */}
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>画像URL</label>
                                    <input
                                        type="url"
                                        className="input-field"
                                        value={recipe.image_url}
                                        onChange={(e) => setRecipe({ ...recipe, image_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                {/* 分量テキスト */}
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>分量テキスト</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={recipe.servings}
                                        onChange={(e) => setRecipe({ ...recipe, servings: e.target.value })}
                                        placeholder="例: 2人前"
                                    />
                                </div>
                            </div>

                            {/* 人数（数値） */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>人数（何人分のレシピか）</label>
                                {recipe.servings && recipe.servings_count !== null ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newCount = Math.max(1, (recipe.servings_count || 1) - 1);
                                                    setRecipe({
                                                        ...recipe,
                                                        servings_count: newCount,
                                                        servings: `${newCount}人分`,
                                                    });
                                                }}
                                                style={{
                                                    width: 32, height: 32,
                                                    border: "1px solid var(--border)",
                                                    background: "var(--card-bg)",
                                                    borderRadius: 6,
                                                    cursor: "pointer",
                                                    fontSize: "1.2rem",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={recipe.servings_count}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value, 10);
                                                    setRecipe({
                                                        ...recipe,
                                                        servings_count: val > 0 ? val : 1,
                                                        servings: `${val > 0 ? val : 1}人分`,
                                                    });
                                                }}
                                                style={{
                                                    width: 80, padding: "8px",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: 6,
                                                    background: "var(--card-bg)",
                                                    color: "var(--text-primary)",
                                                    fontSize: "1rem",
                                                    textAlign: "center",
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newCount = Math.min(100, (recipe.servings_count || 1) + 1);
                                                    setRecipe({
                                                        ...recipe,
                                                        servings_count: newCount,
                                                        servings: `${newCount}人分`,
                                                    });
                                                }}
                                                style={{
                                                    width: 32, height: 32,
                                                    border: "1px solid var(--border)",
                                                    background: "var(--card-bg)",
                                                    borderRadius: 6,
                                                    cursor: "pointer",
                                                    fontSize: "1.2rem",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}
                                            >
                                                ＋
                                            </button>
                                            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>人分</span>
                                        </div>
                                        <span style={{ fontSize: "0.8rem", color: "var(--accent-primary)", fontWeight: 500 }}>
                                            ✓ 解析に成功しました
                                        </span>
                                    </div>
                                ) : recipe.servings ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                placeholder="1"
                                                value={recipe.servings_count || ""}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value, 10);
                                                    setRecipe({
                                                        ...recipe,
                                                        servings_count: val > 0 ? val : 1,
                                                        servings: val > 0 ? `${val}人分` : recipe.servings,
                                                    });
                                                }}
                                                style={{
                                                    width: 80, padding: "8px",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: 6,
                                                    background: "var(--card-bg)",
                                                    color: "var(--text-primary)",
                                                    fontSize: "1rem",
                                                    textAlign: "center",
                                                }}
                                            />
                                            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>人分</span>
                                        </div>
                                        <span style={{ fontSize: "0.8rem", color: "var(--accent-orange)", fontWeight: 500 }}>
                                            ⚠️ 人数の解析に失敗しました。手動で入力してください
                                        </span>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                placeholder="2"
                                                value={recipe.servings_count || ""}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value, 10);
                                                    setRecipe({
                                                        ...recipe,
                                                        servings_count: val > 0 ? val : 2,
                                                        servings: val > 0 ? `${val}人分` : "",
                                                    });
                                                }}
                                                style={{
                                                    width: 80, padding: "8px",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: 6,
                                                    background: "var(--card-bg)",
                                                    color: "var(--text-primary)",
                                                    fontSize: "1rem",
                                                    textAlign: "center",
                                                }}
                                            />
                                            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>人分</span>
                                        </div>
                                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                            ※ 入力すると材料の分量を調整できるようになります
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 画像プレビュー */}
                            {recipe.image_url && (
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>画像プレビュー</label>
                                    <img
                                        src={recipe.image_url}
                                        alt="プレビュー"
                                        style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)" }}
                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 材料 */}
                    <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                                材料 ({recipe.ingredients.length}種)
                            </h3>
                            <button className="btn-ghost" onClick={addIngredient} style={{ fontSize: "0.85rem" }}>
                                ＋ 追加
                            </button>
                        </div>

                        {recipe.ingredients.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>材料が取得できませんでした。手動で追加してください。</p>
                        ) : (
                            <div style={{ display: "grid", gap: 8 }}>
                                {recipe.ingredients.map((ing, idx) => (
                                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8 }}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={ing.amount}
                                            onChange={(e) => updateIngredient(idx, "amount", e.target.value)}
                                            placeholder="量（大さじ2 等）"
                                            style={{ padding: "10px 12px", fontSize: "0.88rem" }}
                                        />
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={ing.name}
                                            onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                                            placeholder="材料名"
                                            style={{ padding: "10px 12px", fontSize: "0.88rem" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 手順 */}
                    <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                                作り方 ({recipe.steps.length}ステップ)
                            </h3>
                            <button className="btn-ghost" onClick={addStep} style={{ fontSize: "0.85rem" }}>
                                ＋ 追加
                            </button>
                        </div>

                        {recipe.steps.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>手順が取得できませんでした。手動で追加してください。</p>
                        ) : (
                            <div style={{ display: "grid", gap: 12 }}>
                                {recipe.steps.map((step, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                        <div className="step-number" style={{ marginTop: 10 }}>{step.step_number}</div>
                                        <textarea
                                            className="input-field"
                                            value={step.instruction}
                                            onChange={(e) => updateStep(idx, e.target.value)}
                                            rows={2}
                                            style={{ minHeight: "auto", resize: "vertical", fontSize: "0.9rem" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 下部保存ボタン */}
                    <div style={{ textAlign: "center" }}>
                        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: "16px 48px", fontSize: "1rem" }}>
                            {saving ? "保存中..." : "💾 このレシピを保存する"}
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
