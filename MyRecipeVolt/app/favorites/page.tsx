"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Recipe {
    id: string;
    title: string;
    image_url: string | null;
    created_at: string;
}

export default function FavoritesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const { data, error } = await supabase
                    .from("recipes")
                    .select("id, title, image_url, created_at")
                    .eq("is_favorite", true)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setRecipes(data || []);
                setLoading(false);
            } catch (error) {
                console.error("お気に入り取得エラー:", error);
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">❤️ お気に入りレシピ</h1>
                <p className="page-subtitle">ハートをつけたレシピをここで確認できます</p>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: 80 }}>
                    <div className="spinner" style={{ margin: "0 auto 16px", width: 48, height: 48 }}></div>
                </div>
            ) : recipes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🤍</div>
                    <p className="empty-state-title">お気に入りがまだありません</p>
                    <p style={{ fontSize: "0.9rem", marginTop: 8, marginBottom: 24 }}>レシピ詳細画面のハートボタンで追加できます</p>
                    <Link href="/" className="btn-primary">レシピ一覧へ</Link>
                </div>
            ) : (
                <div className="recipes-grid">
                    {recipes.map((recipe) => (
                        <Link key={recipe.id} href={`/recipes/${recipe.id}`} style={{ textDecoration: "none" }}>
                            <div className="recipe-card">
                                {recipe.image_url ? (
                                    <img src={recipe.image_url} alt={recipe.title} className="recipe-card-image" />
                                ) : (
                                    <div className="recipe-card-image-placeholder">🍳</div>
                                )}
                                <div className="recipe-card-body">
                                    <p className="recipe-card-title">{recipe.title}</p>
                                    <div className="recipe-card-meta">
                                        <span className="tag-chip">❤️ お気に入り</span>
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "auto" }}>
                                            {new Date(recipe.created_at).toLocaleDateString("ja-JP")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
