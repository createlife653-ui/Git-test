"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Recipe {
  id: string;
  title: string;
  image_url: string | null;
  source_url: string | null;
  category: string | null;
  is_favorite: boolean;
  created_at: string;
}

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

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (query?: string, category?: string | null) => {
    setSearchLoading(true);
    try {
      let req = supabase
        .from("recipes")
        .select("id, title, image_url, source_url, category, is_favorite, created_at")
        .order("created_at", { ascending: false });

      if (category) {
        req = req.eq("category", category);
      }

      if (query && query.trim()) {
        // タイトル検索
        req = req.ilike("title", `%${query}%`);
      }

      const { data, error } = await req;
      if (error) throw error;
      setRecipes(data || []);
    } catch (err) {
      console.error("レシピ取得エラー:", err);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    const timer = setTimeout(() => fetchRecipes(val, selectedCategory), 400);
    return () => clearTimeout(timer);
  };

  const handleCategoryClick = (categoryLabel: string) => {
    const newCategory = selectedCategory === categoryLabel ? null : categoryLabel;
    setSelectedCategory(newCategory);
    fetchRecipes(search, newCategory);
  };

  const toggleFavorite = async (id: string, current: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await supabase.from("recipes").update({ is_favorite: !current }).eq("id", id);
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, is_favorite: !current } : r));
  };

  return (
    <main className="page-container">
      {/* ヘッダー */}
      <div className="page-header">
        <h1 className="page-title">📚 マイ・レシピ・ヴォルト</h1>
        <p className="page-subtitle">制限なし・広告なし。あなただけのレシピ帳</p>
      </div>

      {/* 検索バー */}
      <div className="search-bar" style={{ marginBottom: 32, maxWidth: "100%" }}>
        <span className="search-bar-icon">🔍</span>
        <input
          id="search-input"
          type="text"
          className="input-field"
          placeholder="料理名・材料名で検索..."
          value={search}
          onChange={handleSearch}
          style={{ paddingLeft: 48 }}
        />
      </div>

      {/* カテゴリアイコン */}
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, marginBottom: 40 }}>
        <button
          key="all"
          className="category-pill"
          onClick={() => handleCategoryClick("")}
          style={{
            ...(selectedCategory === "" || selectedCategory === null
              ? { backgroundColor: "var(--accent-primary)", color: "#fff" }
              : {})
          }}
        >
          <span className="category-pill-icon">📂</span>
          <span className="category-pill-label">すべて</span>
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            className="category-pill"
            onClick={() => handleCategoryClick(cat.label)}
            style={{
              ...(selectedCategory === cat.label
                ? { backgroundColor: "var(--accent-primary)", color: "#fff" }
                : {})
            }}
          >
            <span className="category-pill-icon">{cat.icon}</span>
            <span className="category-pill-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* クイックアクション */}
      <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
        <Link href="/import" className="btn-primary">
          🔗 URLからインポート
        </Link>
        <Link href="/recipes/new" className="btn-secondary">
          ✏️ 手動で入力
        </Link>
      </div>

      {/* レシピ一覧 */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 500 }}>
          {search ? `「${search}」の検索結果` : "最近のレシピ"}
          {!loading && <span style={{ marginLeft: 8, color: "var(--text-muted)" }}>({recipes.length}件)</span>}
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 80 }}>
          <div className="spinner" style={{ margin: "0 auto 16px", width: 48, height: 48 }}></div>
          <p style={{ color: "var(--text-muted)" }}>読み込み中...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <p className="empty-state-title">
            {search ? "該当するレシピが見つかりません" : "まだレシピがありません"}
          </p>
          <p style={{ fontSize: "0.9rem", marginTop: 8, marginBottom: 24 }}>
            {search ? "別のキーワードで試してみてください" : "URLインポートまたは手動入力でレシピを追加しましょう！"}
          </p>
          {!search && (
            <Link href="/import" className="btn-primary">
              🔗 最初のレシピを追加する
            </Link>
          )}
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
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {new Date(recipe.created_at).toLocaleDateString("ja-JP")}
                    </span>
                    {recipe.source_url && (
                      <span className="tag-chip">🔗 外部</span>
                    )}
                    <button
                      className={`favorite-btn ${recipe.is_favorite ? "active" : ""}`}
                      onClick={(e) => toggleFavorite(recipe.id, recipe.is_favorite, e)}
                      style={{ marginLeft: "auto", flexShrink: 0 }}
                      title={recipe.is_favorite ? "お気に入り解除" : "お気に入りに追加"}
                    >
                      {recipe.is_favorite ? "❤️" : "🤍"}
                    </button>
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
