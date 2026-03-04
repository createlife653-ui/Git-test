"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function NewRecipePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        image_url: "",
        servings: "",
        note: "",
    });
    const [ingredients, setIngredients] = useState([
        { name: "", amount: "" },
        { name: "", amount: "" },
        { name: "", amount: "" },
    ]);
    const [steps, setSteps] = useState([
        { step_number: 1, instruction: "" },
        { step_number: 2, instruction: "" },
        { step_number: 3, instruction: "" },
    ]);
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const addIngredient = () => setIngredients([...ingredients, { name: "", amount: "" }]);
    const addStep = () => setSteps([...steps, { step_number: steps.length + 1, instruction: "" }]);

    const removeIngredient = (idx: number) => setIngredients(ingredients.filter((_, i) => i !== idx));
    const removeStep = (idx: number) =>
        setSteps(steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step_number: i + 1 })));

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) {
            setTags([...tags, t]);
            setTagInput("");
        }
    };

    const handleSave = async () => {
        if (!form.title.trim()) {
            setError("タイトルは必須です");
            return;
        }
        setSaving(true);
        setError("");

        try {
            const { data: savedRecipe, error: recipeErr } = await supabase
                .from("recipes")
                .insert({
                    title: form.title,
                    image_url: form.image_url || null,
                    servings: form.servings || null,
                    note: form.note || null,
                })
                .select()
                .single();
            if (recipeErr) throw recipeErr;
            const recipeId = savedRecipe.id;

            const validIngredients = ingredients.filter((i) => i.name.trim());
            if (validIngredients.length > 0) {
                await supabase.from("ingredients").insert(
                    validIngredients.map((ing, i) => ({ recipe_id: recipeId, name: ing.name, amount: ing.amount, order_index: i }))
                );
            }

            const validSteps = steps.filter((s) => s.instruction.trim());
            if (validSteps.length > 0) {
                await supabase.from("steps").insert(
                    validSteps.map((s) => ({ recipe_id: recipeId, step_number: s.step_number, instruction: s.instruction }))
                );
            }

            // タグ
            for (const tagName of tags) {
                let { data: tag } = await supabase.from("tags").select("id").eq("name", tagName).single();
                if (!tag) {
                    const { data: newTag } = await supabase.from("tags").insert({ name: tagName }).select().single();
                    tag = newTag;
                }
                if (tag) {
                    await supabase.from("recipe_tags").insert({ recipe_id: recipeId, tag_id: tag.id });
                }
            }

            router.push(`/recipes/${recipeId}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "保存に失敗しました");
            setSaving(false);
        }
    };

    return (
        <main className="page-container" style={{ maxWidth: 800 }}>
            <Link href="/" className="btn-ghost" style={{ marginBottom: 20, display: "inline-flex" }}>
                ← ホームへ
            </Link>

            <div className="page-header">
                <h1 className="page-title">✏️ レシピを手動入力</h1>
                <p className="page-subtitle">オリジナルレシピや SNS で見つけたレシピを記録する</p>
            </div>

            {error && (
                <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#fca5a5" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* 基本情報 */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16 }}>基本情報</h3>
                <div style={{ display: "grid", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>タイトル *</label>
                        <input type="text" className="input-field" placeholder="例: 鶏肉の照り焼き" value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>画像URL</label>
                            <input type="url" className="input-field" placeholder="https://..." value={form.image_url}
                                onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>分量・人数</label>
                            <input type="text" className="input-field" placeholder="例: 2人前" value={form.servings}
                                onChange={(e) => setForm({ ...form, servings: e.target.value })} />
                        </div>
                    </div>
                </div>
            </div>

            {/* タグ */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>タグ</h3>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    {tags.map((t) => (
                        <span key={t} className="tag-chip">
                            {t}
                            <button className="tag-chip-remove" onClick={() => setTags(tags.filter((x) => x !== t))}>✕</button>
                        </span>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" className="input-field" placeholder="「主菜」「時短」「節約」など" value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        style={{ flex: 1 }} />
                    <button onClick={addTag} className="btn-secondary" style={{ flexShrink: 0 }}>追加</button>
                </div>
            </div>

            {/* 材料 */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>材料</h3>
                    <button className="btn-ghost" onClick={addIngredient} style={{ fontSize: "0.85rem" }}>＋ 追加</button>
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 32px", gap: 8, paddingBottom: 4 }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>量</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>材料名</span>
                        <span />
                    </div>
                    {ingredients.map((ing, idx) => (
                        <div key={idx} style={{ display: "grid", gridTemplateColumns: "140px 1fr 32px", gap: 8 }}>
                            <input type="text" className="input-field" value={ing.amount}
                                onChange={(e) => { const u = [...ingredients]; u[idx].amount = e.target.value; setIngredients(u); }}
                                placeholder="大さじ2" style={{ padding: "10px 12px", fontSize: "0.88rem" }} />
                            <input type="text" className="input-field" value={ing.name}
                                onChange={(e) => { const u = [...ingredients]; u[idx].name = e.target.value; setIngredients(u); }}
                                placeholder="醤油" style={{ padding: "10px 12px", fontSize: "0.88rem" }} />
                            <button onClick={() => removeIngredient(idx)}
                                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem" }}>✕</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 手順 */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>作り方</h3>
                    <button className="btn-ghost" onClick={addStep} style={{ fontSize: "0.85rem" }}>＋ 追加</button>
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                    {steps.map((step, idx) => (
                        <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div className="step-number" style={{ marginTop: 10, flexShrink: 0 }}>{step.step_number}</div>
                            <textarea className="input-field" value={step.instruction}
                                onChange={(e) => { const u = [...steps]; u[idx].instruction = e.target.value; setSteps(u); }}
                                placeholder={`手順 ${step.step_number} の説明`} rows={2}
                                style={{ minHeight: "auto", resize: "vertical", fontSize: "0.9rem" }} />
                            <button onClick={() => removeStep(idx)}
                                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem", marginTop: 14 }}>✕</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* メモ */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>メモ（任意）</h3>
                <textarea className="input-field" value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="覚え書きやアレンジのヒントなど..." rows={3} />
            </div>

            {/* 保存ボタン */}
            <div style={{ textAlign: "center" }}>
                <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: "16px 48px", fontSize: "1rem" }}>
                    {saving ? "保存中..." : "💾 レシピを保存する"}
                </button>
            </div>
        </main>
    );
}
