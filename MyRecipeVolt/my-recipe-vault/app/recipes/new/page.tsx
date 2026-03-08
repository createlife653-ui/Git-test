// フロントエンド: 画像アップロード → OCR → サーバーサイドAPI → 結果表示
// より柔軟で高度なレシピ解析が可能

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function NewRecipePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [ocrText, setOcrText] = useState<string>("");
    const [parsedRecipe, setParsedRecipe] = useState<any>(null);
    const [form, setForm] = useState({
        title: "",
        image_url: "",
        servings: "",
        category: "",
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

    // 画像圧縮
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 1920;
                    const maxHeight = 1920;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.92));
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // 画像選択ハンドラー
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError("画像ファイルのみ選択してください");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("画像サイズが大きいです（10MB以下推奨）。処理に時間がかかる可能性があります。");
        } else {
            setError("");
        }

        setImageFile(file);

        try {
            const compressed = await compressImage(file);
            setImagePreview(compressed);
            setProgress(0);
            setOcrText("");
            setParsedRecipe(null);
        } catch (err) {
            setError("画像の処理に失敗しました");
            console.error(err);
        }
    };

    // Google Cloud Vision APIでOCR
    const analyzeImage = async () => {
        if (!imagePreview) {
            setError("画像を選択してください");
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY;
        if (!apiKey || apiKey === "your_google_cloud_api_key_here") {
            setError("Google Cloud APIキーが設定されていません。.env.localファイルに設定してください。");
            return;
        }

        setAnalyzing(true);
        setError("");
        setProgress(0);

        try {
            setProgress(25);
            await new Promise(resolve => setTimeout(resolve, 500));

            const base64Data = imagePreview.split(',')[1];

            const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requests: [
                        {
                            image: { content: base64Data },
                            features: [{ type: 'TEXT_DETECTION' }],
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Google Vision APIエラー');
            }

            setProgress(50);
            await new Promise(resolve => setTimeout(resolve, 500));

            const data = await response.json();
            const textAnnotations = data.responses[0]?.textAnnotations;

            if (!textAnnotations || textAnnotations.length === 0) {
                throw new Error("画像からテキストを検出できませんでした");
            }

            const fullText = textAnnotations[0].description;
            setOcrText(fullText);

            console.log('🔍 OCR検出結果:', fullText.substring(0, 500) + '...');
            console.log('📝 全テキスト長さ:', fullText.length, '文字');

            setProgress(75);

            // サーバーサイドAPIを呼び出し
            const parseResponse = await fetch('/api/parse-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: fullText }),
            });

            if (!parseResponse.ok) {
                throw new Error('レシピ解析に失敗しました');
            }

            const recipeData = await parseResponse.json();

            console.log('📋 解析結果:', recipeData);
            console.log('✅ 抽出件数:', {
                タイトル: recipeData.title ? '1' : '0',
                材料: recipeData.ingredients?.length || 0,
                手順: recipeData.steps?.length || 0,
                カテゴリ: recipeData.category ? '1' : '0'
            });

            setParsedRecipe(recipeData);

            // フォームにデータを入力
            if (recipeData.title) setForm(prev => ({ ...prev, title: recipeData.title }));
            if (recipeData.servings) setForm(prev => ({ ...prev, servings: recipeData.servings }));
            if (recipeData.category) setForm(prev => ({ ...prev, category: recipeData.category }));
            if (recipeData.tags) setTags(recipeData.tags);

            if (recipeData.ingredients && recipeData.ingredients.length > 0) {
                const newIngredients = recipeData.ingredients.map((ing: any) => ({
                    name: ing.name,
                    amount: ing.amount
                }));
                while (newIngredients.length < 3) {
                    newIngredients.push({ name: "", amount: "" });
                }
                setIngredients(newIngredients);
            }

            if (recipeData.steps && recipeData.steps.length > 0) {
                const newSteps = recipeData.steps.map((step: string, idx: number) => ({
                    step_number: idx + 1,
                    instruction: step
                }));
                setSteps(newSteps);
            }

            setProgress(100);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "解析に失敗しました";
            setError(errorMessage);
            console.error(err);
        } finally {
            setAnalyzing(false);
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
                    category: form.category || null,
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
                <h1 className="page-title">📸 レシピスクリーンショットで入力</h1>
                <p className="page-subtitle">Google Cloud Vision APIが画像からレシピを自動抽出します</p>
            </div>

            {error && (
                <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#fca5a5" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* 画像アップロード */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16 }}>画像アップロード</h3>

                {!imagePreview ? (
                    <div
                        style={{
                            border: "2px dashed var(--border)",
                            borderRadius: 12,
                            padding: 40,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.3s",
                        }}
                        onClick={() => document.getElementById('image-input')?.click()}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--accent-orange)";
                            e.currentTarget.style.background = "rgba(249, 115, 22, 0.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <div style={{ fontSize: "3rem", marginBottom: 12 }}>📸</div>
                        <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 8 }}>
                            レシピのスクリーンショットをドラッグ&ドロップ
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            またはクリックして選択（10MB以下推奨）
                        </p>
                        <input
                            id="image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            style={{ display: "none" }}
                        />
                    </div>
                ) : (
                    <div>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                width: "100%",
                                borderRadius: 12,
                                marginBottom: 16,
                                maxHeight: 300,
                                objectFit: "contain",
                                background: "var(--bg-secondary)"
                            }}
                        />
                        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                            <button
                                onClick={analyzeImage}
                                disabled={analyzing}
                                className="btn-primary"
                                style={{ flex: 1, justifyContent: "center" }}
                            >
                                {analyzing ? (
                                    <span>
                                        <span className="spinner" style={{ width: 16, height: 16, marginRight: 8, borderWidth: 2 }}></span>
                                        解析中... ({progress}%)
                                    </span>
                                ) : (
                                    "🔍 Google OCRで解析"
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview("");
                                    setOcrText("");
                                    setParsedRecipe(null);
                                    setProgress(0);
                                }}
                                className="btn-secondary"
                                style={{ justifyContent: "center" }}
                            >
                                ✕ キャンセル
                            </button>
                        </div>

                        {analyzing && (
                            <div style={{
                                width: "100%",
                                height: 6,
                                background: "var(--bg-secondary)",
                                borderRadius: 3,
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    width: `${progress}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, var(--accent-orange), var(--accent-amber))",
                                    transition: "width 0.3s ease"
                                }} />
                            </div>
                        )}

                        {/* OCR結果と解析結果の表示 */}
                        {ocrText && (
                            <div style={{ marginTop: 16, padding: 16, background: "var(--bg-secondary)", borderRadius: 8 }}>
                                <h4 style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 8 }}>🔍 OCR検出結果</h4>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxHeight: 100, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                                    {ocrText.substring(0, 500)}{ocrText.length > 500 ? '...' : ''}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 基本情報 */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16 }}>基本情報</h3>
                <div style={{ display: "grid", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>タイトル *</label>
                        <input type="text" className="input-field" placeholder="例: 鶏肉の照り焼き" value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>カテゴリ（任意）</label>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.label}
                                    type="button"
                                    onClick={() => setForm({ ...form, category: cat.label })}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "8px 12px",
                                        borderRadius: 20,
                                        border: form.category === cat.label
                                            ? "2px solid var(--accent-primary)"
                                            : "1px solid var(--border-color)",
                                        background: form.category === cat.label
                                            ? "rgba(var(--accent-primary-rgb), 0.1)"
                                            : "var(--card-bg)",
                                        color: form.category === cat.label
                                            ? "var(--accent-primary)"
                                            : "var(--text-primary)",
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (form.category !== cat.label) {
                                            e.currentTarget.style.borderColor = "var(--accent-primary)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (form.category !== cat.label) {
                                            e.currentTarget.style.borderColor = "var(--border-color)";
                                        }
                                    }}
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                        {form.category && (
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, category: "" })}
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
