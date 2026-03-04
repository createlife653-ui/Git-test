import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface ScrapedRecipe {
    title: string;
    image_url: string;
    servings: string;
    ingredients: { name: string; amount: string }[];
    steps: { step_number: number; instruction: string }[];
    source_url: string;
}

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URLが指定されていません" }, { status: 400 });
        }

        // HTMLを取得
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "ja,en;q=0.9",
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: `ページを取得できませんでした (${response.status})` }, { status: 400 });
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const recipe: ScrapedRecipe = {
            title: "",
            image_url: "",
            servings: "",
            ingredients: [],
            steps: [],
            source_url: url,
        };

        // === JSON-LD (Schema.org Recipe) を優先解析 ===
        let jsonLd: Record<string, unknown> | null = null;
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const parsed = JSON.parse($(el).html() || "");
                const items = Array.isArray(parsed) ? parsed : [parsed];
                for (const item of items) {
                    if (item["@type"] === "Recipe" || (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))) {
                        jsonLd = item;
                        break;
                    }
                    // @graph の中を探す
                    if (item["@graph"]) {
                        const g = item["@graph"].find((g: Record<string, string>) => g["@type"] === "Recipe");
                        if (g) { jsonLd = g; break; }
                    }
                }
            } catch { }
        });

        if (jsonLd) {
            // タイトル
            recipe.title = (jsonLd["name"] as string) || "";

            // 画像
            const img = jsonLd["image"];
            if (typeof img === "string") recipe.image_url = img;
            else if (Array.isArray(img)) recipe.image_url = img[0];
            else if (img && typeof img === "object") recipe.image_url = (img as Record<string, string>)["url"] || "";

            // 人数
            recipe.servings = String(jsonLd["recipeYield"] || "");

            // 材料
            const rawIngredients = jsonLd["recipeIngredient"];
            if (Array.isArray(rawIngredients)) {
                recipe.ingredients = rawIngredients.map((ing: string) => {
                    // 「大さじ2 醤油」のような形式を分割
                    const match = ing.match(/^([\d./]+\s*[^\s]{1,5})\s+(.+)$/);
                    if (match) return { amount: match[1].trim(), name: match[2].trim() };
                    return { amount: "", name: ing };
                });
            }

            // 手順
            const rawInstructions = jsonLd["recipeInstructions"];
            if (Array.isArray(rawInstructions)) {
                rawInstructions.forEach((step: unknown, i: number) => {
                    if (typeof step === "string") {
                        recipe.steps.push({ step_number: i + 1, instruction: step });
                    } else if (step && typeof step === "object") {
                        const s = step as Record<string, string>;
                        recipe.steps.push({ step_number: i + 1, instruction: s["text"] || s["name"] || "" });
                    }
                });
            }
        }

        // === フォールバック: OGP / メタタグから取得 ===
        if (!recipe.title) {
            recipe.title =
                $('meta[property="og:title"]').attr("content") ||
                $("title").text() ||
                "タイトル不明";
        }
        if (!recipe.image_url) {
            recipe.image_url = $('meta[property="og:image"]').attr("content") || "";
        }

        // === クックパッド専用パーサー ===
        if (url.includes("cookpad.com") && recipe.ingredients.length === 0) {
            $(".ingredient-list-item, .ingredient_name").each((_, el) => {
                const name = $(el).find(".ingredient_name, .name").text().trim();
                const amount = $(el).find(".ingredient_quantity, .quantity").text().trim();
                if (name) recipe.ingredients.push({ name, amount });
            });
        }

        if (!recipe.title) recipe.title = "タイトルが取得できませんでした";

        return NextResponse.json({ recipe });
    } catch (error) {
        console.error("Scrape error:", error);
        return NextResponse.json(
            { error: "ページの解析に失敗しました。URLを確認するか、手動入力をお試しください。" },
            { status: 500 }
        );
    }
}
