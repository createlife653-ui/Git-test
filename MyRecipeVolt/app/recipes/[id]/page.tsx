"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Recipe {
    id: string;
    title: string;
    image_url: string | null;
    source_url: string | null;
    servings: string | null;
    servings_count: number | null;
    category: string | null;
    note: string | null;
    is_favorite: boolean;
    created_at: string;
}

interface Ingredient {
    id: string;
    name: string;
    amount: string | null;
    order_index: number;
}

interface Step {
    id: string;
    step_number: number;
    instruction: string;
}

interface Tag {
    id: string;
    name: string;
}

export default function RecipeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);
    const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
    const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
    const [note, setNote] = useState("");
    const [noteSaving, setNoteSaving] = useState(false);
    const [noteSaved, setNoteSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentServings, setCurrentServings] = useState<number>(2);

    useEffect(() => {
        if (id) fetchAll();
    }, [id]);

    const fetchAll = async () => {
        const [recipeRes, ingRes, stepRes, tagRes] = await Promise.all([
            supabase.from("recipes").select("*").eq("id", id).single(),
            supabase.from("ingredients").select("*").eq("recipe_id", id).order("order_index"),
            supabase.from("steps").select("*").eq("recipe_id", id).order("step_number"),
            supabase.from("recipe_tags")
              .select("tags(id,name)")
              .eq("recipe_id", id),
        ]);

        if (recipeRes.data) {
            setRecipe(recipeRes.data);
            setNote(recipeRes.data.note || "");
            // 人数設定（基準人数がある場合はそれを使用、ない場合はデフォルト2）
            setCurrentServings(recipeRes.data.servings_count || 2);
        }
        if (ingRes.data) setIngredients(ingRes.data);
        if (stepRes.data) setSteps(stepRes.data);
        if (tagRes.data) {
            const flattenedTags = tagRes.data.map((item: { tags: Tag[] }) => item.tags).flat();
            setTags(flattenedTags.filter(Boolean));
        }
        setLoading(false);
    };

    // 材料の分量を計算する関数
    const calculateAmount = (originalAmount: string | null, ratio: number): string => {
        if (!originalAmount || !recipe?.servings_count) return originalAmount || "";

        let result = originalAmount;

        // 数値+単位パターン（最初に処理）
        result = result.replace(/(\d+(?:\.\d+)?)\s*([大中小]さじ|カップ|本|枚|個|切れ|片|束|わ|グラム|g|cc|ml|リットル|L)/gi,
            (match, numStr, unit) => {
                const num = parseFloat(numStr);
                if (isNaN(num)) return match;
                const calculated = Math.round(num * ratio * 100) / 100;
                return `${calculated}${unit}`;
            }
        );

        // 丸括弧内の数値
        result = result.replace(/\((\d+(?:\.\d+)?)\)/g,
            (match, numStr) => {
                const num = parseFloat(numStr);
                if (isNaN(num)) return match;
                const calculated = Math.round(num * ratio * 100) / 100;
                return `(${calculated})`;
            }
        );

        // 単純な数値（最後に処理、他のパターンにマッチしなかった場合のみ）
        result = result.replace(/^(\d+(?:\.\d+)?)$/,
            (match, numStr) => {
                const num = parseFloat(numStr);
                if (isNaN(num)) return match;
                const calculated = Math.round(num * ratio * 100) / 100;
                return `${calculated}`;
            }
        );

        return result;
    };

    // 現在の人数に応じた比率を計算
    const getServingsRatio = () => {
        if (!recipe?.servings_count) return 1;
        return currentServings / recipe.servings_count;
    };

    const toggleFavorite = async () => {
        if (!recipe) return;
        const newVal = !recipe.is_favorite;
        await supabase.from("recipes").update({ is_favorite: newVal }).eq("id", id);
        setRecipe({ ...recipe, is_favorite: newVal });
    };

    const saveNote = async () => {
        setNoteSaving(true);
        await supabase.from("recipes").update({ note }).eq("id", id);
        setNoteSaving(false);
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2000);
    };

    const deleteRecipe = async () => {
        if (!confirm("このレシピを削除しますか？")) return;
        await supabase.from("recipes").delete().eq("id", id);
        router.push("/");
    };

    const toggleIngredient = (ingId: string) => {
        setCheckedIngredients((prev) => {
            const next = new Set(prev);
            if (next.has(ingId)) next.delete(ingId);
            else next.add(ingId);
            return next;
        });
    };

    if (loading) {
        return (
            <main className="page-container">
                <div style={{ textAlign: "center", padding: 80 }}>
                    <div className="spinner" style={{ margin: "0 auto 16px", width: 48, height: 48 }}></div>
                    <p style={{ color: "var(--text-muted)" }}>読み込み中...</p>
                </div>
            </main>
        );
    }

    if (!recipe) {
        return (
            <main className="page-container">
                <div className="empty-state">
                    <div className="empty-state-icon">🍽️</div>
                    <p className="empty-state-title">レシピが見つかりません</p>
                    <Link href="/" className="btn-primary" style={{ marginTop: 16 }}>ホームへ戻る</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="page-container" style={{ maxWidth: 800 }}>
            {/* 戻るボタン */}
            <Link href="/" className="btn-ghost" style={{ marginBottom: 20, display: "inline-flex" }}>
                ← 一覧に戻る
            </Link>

            {/* ヘッダー画像 */}
            {recipe.image_url ? (
                <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 20, marginBottom: 24, border: "1px solid var(--border)" }}
                />
            ) : (
                <div
                    style={{
                        width: "100%", height: 240, borderRadius: 20, marginBottom: 24,
                        background: "linear-gradient(135deg, #1e1e28, #2d1a0a)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "5rem", border: "1px solid var(--border)"
                    }}
                >
                    🍳
                </div>
            )}

            {/* タイトル行 */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>{recipe.title}</h1>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        {recipe.category && (
                            <span className="tag-chip" style={{ backgroundColor: "var(--accent-primary)", color: "#fff" }}>
                                {recipe.category}
                            </span>
                        )}
                        {recipe.servings && (
                            <span className="tag-chip">👥 {recipe.servings}</span>
                        )}
                        {tags.map((tag) => (
                            <span key={tag.id} className="tag-chip">{tag.name}</span>
                        ))}
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {new Date(recipe.created_at).toLocaleDateString("ja-JP")}
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        className={`favorite-btn ${recipe.is_favorite ? "active" : ""}`}
                        onClick={toggleFavorite}
                        title={recipe.is_favorite ? "お気に入り解除" : "お気に入りに追加"}
                    >
                        {recipe.is_favorite ? "❤️" : "🤍"}
                    </button>
                    {recipe.source_url && (
                        <a href={recipe.source_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" title="元のページを開く">
                            🔗
                        </a>
                    )}
                    <button onClick={deleteRecipe} className="btn-ghost" title="削除" style={{ color: "var(--accent-red)" }}>
                        🗑️
                    </button>
                </div>
            </div>

            <div className="section-divider" />

            {/* 人数調整UI */}
            {recipe.servings_count && (
                <div className="glass-card" style={{ padding: "16px 20px", marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600 }}>👤 作りたい人数</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <button
                                    onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
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
                                <span style={{
                                    fontSize: "1.1rem", fontWeight: 600,
                                    minWidth: 40, textAlign: "center",
                                    color: "var(--text-primary)"
                                }}>
                                    {currentServings}
                                </span>
                                <button
                                    onClick={() => setCurrentServings(Math.min(100, currentServings + 1))}
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
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                （元のレシピ: {recipe.servings_count}人分）
                            </span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--accent-primary)", fontWeight: 500 }}>
                            材料の分量が自動的に調整されます
                        </div>
                    </div>
                </div>
            )}

            {/* 材料 */}
            {ingredients.length > 0 && (
                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        🛒 材料
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 400 }}>
                            （チェックで打ち消し）
                        </span>
                    </h2>
                    <div className="glass-card" style={{ padding: "8px 20px" }}>
                        {ingredients.map((ing) => {
                            const ratio = getServingsRatio();
                            const calculatedAmount = calculateAmount(ing.amount, ratio);
                            return (
                                <label
                                    key={ing.id}
                                    className={`checkbox-item ${checkedIngredients.has(ing.id) ? "checked" : ""}`}
                                    style={{ cursor: "pointer" }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checkedIngredients.has(ing.id)}
                                        onChange={() => toggleIngredient(ing.id)}
                                    />
                                    <span style={{ color: "var(--text-secondary)", minWidth: 80, fontSize: "0.9rem" }}>
                                        {calculatedAmount || ""}
                                    </span>
                                    <span style={{ fontWeight: 500 }}>{ing.name}</span>
                                </label>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* 作り方 */}
            {steps.length > 0 && (
                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>📖 作り方</h2>
                    <div className="glass-card" style={{ padding: "8px 20px" }}>
                        {steps.map((step) => (
                            <div key={step.id} className="step-item">
                                <div className="step-number">{step.step_number}</div>
                                <p style={{ flex: 1, lineHeight: 1.7, paddingTop: 6 }}>{step.instruction}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* メモ */}
            <section style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    📝 自分メモ
                </h2>
                <div className="glass-card" style={{ padding: 20 }}>
                    <textarea
                        className="input-field"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        placeholder="「次は醤油を少なめに」「子供向けには辛さ控えめ」など、改善点や覚え書きを自由に記録..."
                        style={{ marginBottom: 12, background: "transparent", border: "1px solid var(--border)" }}
                    />
                    <button
                        onClick={saveNote}
                        disabled={noteSaving}
                        className="btn-secondary"
                        style={{ fontSize: "0.9rem" }}
                    >
                        {noteSaved ? "✅ 保存しました！" : noteSaving ? "保存中..." : "💾 メモを保存"}
                    </button>
                </div>
            </section>

            {/* 設定へのリンク */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
                <Link href="/settings" className="btn-ghost" style={{ fontSize: "0.9rem" }}>
                    ⚙️ デフォルト設定を変更
                </Link>
            </div>
        </main>
    );
}
