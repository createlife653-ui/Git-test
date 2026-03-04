import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface ScrapedRecipe {
    title: string;
    image_url: string;
    servings: string;
    category: string;
    ingredients: { name: string; amount: string }[];
    steps: { step_number: number; instruction: string }[];
    source_url: string;
}

// Multiple User-Agent strings to rotate through
const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
];

function randomUA() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url || typeof url !== "string") {
            return NextResponse.json({ error: "URLが指定されていません" }, { status: 400 });
        }

        // Validate URL format
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                throw new Error("invalid protocol");
            }
        } catch {
            return NextResponse.json({ error: "URLの形式が正しくありません" }, { status: 400 });
        }

        // HTMLを取得
        let html = "";
        let fetchStatus = 0;

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const response = await fetch(parsedUrl.toString(), {
                headers: {
                    "User-Agent": randomUA(),
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Language": "ja,en-US;q=0.8,en;q=0.6",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "none",
                    "Upgrade-Insecure-Requests": "1",
                },
                redirect: "follow",
                signal: controller.signal,
            });
            clearTimeout(timeout);

            fetchStatus = response.status;

            if (!response.ok) {
                // Cookpad and some sites return 403 for bots
                if (response.status === 403 || response.status === 429) {
                    return NextResponse.json(
                        {
                            error: `このサイトはボット検知のためURLからの自動取得をブロックしています（HTTPステータス: ${response.status}）。手動入力をお試しください。`,
                            blocked: true,
                        },
                        { status: 200 } // Return 200 so the client shows a useful message
                    );
                }
                return NextResponse.json(
                    { error: `ページを取得できませんでした（ステータス: ${response.status}）。URLが正しいか確認してください。` },
                    { status: 400 }
                );
            }

            html = await response.text();
        } catch (fetchErr: unknown) {
            const isTimeout =
                fetchErr instanceof Error &&
                (fetchErr.name === "AbortError" || fetchErr.message.includes("abort"));

            if (isTimeout) {
                return NextResponse.json(
                    { error: "リクエストがタイムアウトしました（15秒）。サイトが応答していないか、接続をブロックしています。手動入力をお試しください。" },
                    { status: 200 }
                );
            }

            console.error("Fetch error:", fetchErr);
            return NextResponse.json(
                {
                    error: "ページへの接続に失敗しました。インターネット接続を確認するか、手動入力をお試しください。",
                    detail: fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
                },
                { status: 200 }
            );
        }

        const $ = cheerio.load(html);

        const recipe: ScrapedRecipe = {
            title: "",
            image_url: "",
            servings: "",
            category: "",
            ingredients: [],
            steps: [],
            source_url: url,
        };

        // === JSON-LD (Schema.org Recipe) を優先解析 ===
        let jsonLd: Record<string, unknown> | null = null;
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const raw = $(el).html() || "";
                if (!raw.trim()) return;
                const parsed = JSON.parse(raw);
                const items = Array.isArray(parsed) ? parsed : [parsed];
                for (const item of items) {
                    if (
                        item["@type"] === "Recipe" ||
                        (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))
                    ) {
                        jsonLd = item;
                        break;
                    }
                    // @graph の中を探す
                    if (item["@graph"] && Array.isArray(item["@graph"])) {
                        const g = item["@graph"].find(
                            (g: Record<string, string>) => g["@type"] === "Recipe"
                        );
                        if (g) {
                            jsonLd = g;
                            break;
                        }
                    }
                }
            } catch {
                // JSON parse errors are expected for some ld+json blocks — ignore
            }
        });

        if (jsonLd) {
            // タイトル
            recipe.title = (jsonLd["name"] as string) || "";

            // 画像
            const img = jsonLd["image"];
            if (typeof img === "string") recipe.image_url = img;
            else if (Array.isArray(img) && (img as unknown[]).length > 0) recipe.image_url = String((img as unknown[])[0]);
            else if (img && typeof img === "object")
                recipe.image_url = (img as Record<string, string>)["url"] || "";

            // 人数
            const yieldRaw = jsonLd["recipeYield"];
            recipe.servings = Array.isArray(yieldRaw)
                ? yieldRaw[0]
                : String(yieldRaw || "");

            // 材料
            const rawIngredients = jsonLd["recipeIngredient"];
            if (Array.isArray(rawIngredients)) {
                recipe.ingredients = rawIngredients.map((ing: string) => {
                    if (typeof ing !== "string") return { amount: "", name: String(ing) };
                    // 「大さじ2 醤油」のような形式を分割
                    const match = ing.match(/^([\d./]+\s*[^\s]{1,6})\s+(.+)$/);
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
                        const text = s["text"] || s["name"] || "";
                        if (text) recipe.steps.push({ step_number: i + 1, instruction: text });
                    }
                });
            }
        }

        // === フォールバック: OGP / メタタグから取得 ===
        if (!recipe.title) {
            recipe.title =
                $('meta[property="og:title"]').attr("content") ||
                $("h1").first().text().trim() ||
                $("title").text().trim() ||
                "タイトル不明";
        }
        if (!recipe.image_url) {
            recipe.image_url =
                $('meta[property="og:image"]').attr("content") ||
                $('meta[name="twitter:image"]').attr("content") ||
                "";
        }

        // === クックパッド専用パーサー ===
        if (url.includes("cookpad.com") && recipe.ingredients.length === 0) {
            // Try multiple selector patterns for Cookpad's changing HTML
            const ingredientSelectors = [
                ".ingredient-list-item",
                "[data-ingredient-id]",
                ".ingredient_name",
                ".ingredient",
            ];
            for (const sel of ingredientSelectors) {
                $(sel).each((_, el) => {
                    const name =
                        $(el).find(".ingredient_name, .name, [class*='name']").text().trim() ||
                        $(el).text().trim();
                    const amount =
                        $(el).find(".ingredient_quantity, .quantity, [class*='quantity']").text().trim();
                    if (name) recipe.ingredients.push({ name, amount });
                });
                if (recipe.ingredients.length > 0) break;
            }
        }

        // === デリッシュキッチン専用パーサー ===
        if (url.includes("delishkitchen.tv") && recipe.ingredients.length === 0) {
            $(".ingredient-item, .ingredients-list li").each((_, el) => {
                const name = $(el).find(".ingredient-name, .name").text().trim() || $(el).text().trim();
                const amount = $(el).find(".ingredient-serving, .amount").text().trim();
                if (name) recipe.ingredients.push({ name, amount });
            });
        }

        // === NHK きょうの料理専用パーサー ===
        if (url.includes("nhk.or.jp") && recipe.ingredients.length === 0) {
            $(".recipe-material li, .ing-list li").each((_, el) => {
                const text = $(el).text().trim();
                if (text) recipe.ingredients.push({ name: text, amount: "" });
            });
        }

        // === 白ごはん.com (sirogohan.com) 専用パーサー ===
        if (url.includes("sirogohan.com") && recipe.ingredients.length === 0) {
            // 材料はリスト形式で記述されている
            $("li").each((_, el) => {
                const $el = $(el);
                // 親要素が材料セクションにあるか確認（見出し「材料」を含む）
                const text = $el.text().trim();
                if (!text) return;

                // 材料セクションの見出しを探す
                const $heading = $el.prevUntil("h2").last().prev("h2, h3");
                const headingText = $heading.text();

                // 「材料」を含む見出しの下にある場合のみ処理
                if (headingText && headingText.includes("材料")) {
                    // 「大根…600ｇ」のような形式を分割
                    let name = text;
                    let amount = "";

                    // 「…」「：」「 」で分割
                    const splitPatterns = [/\s*…\s*/, /\s*：\s*/, /\s{2,}/];
                    for (const pattern of splitPatterns) {
                        const parts = text.split(pattern);
                        if (parts.length >= 2) {
                            name = parts[0].trim();
                            amount = parts[1].trim();
                            break;
                        }
                    }

                    if (name && !name.startsWith("※")) {
                        recipe.ingredients.push({ name, amount });
                    }
                }
            });

            // 手順は段落形式
            let stepNum = 1;
            $("p").each((_, el) => {
                const $el = $(el);
                const text = $el.text().trim();
                if (!text) return;

                // 親要素が手順セクションにあるか確認
                const $heading = $el.prevUntil("h2, h3").last().prev("h2, h3");
                const headingText = $heading.text();

                // 「作り方」「レシピ」を含む見出しの下にある場合のみ処理
                if (headingText && (headingText.includes("作り方") || headingText.includes("レシピ"))) {
                    // 数字で始まる手順を抽出
                    if (/^[0-9０-９]/.test(text)) {
                        // 先頭の数字を削除
                        const instruction = text.replace(/^[0-9０-９]+\s*[.．、]?\s*/, "").trim();
                        if (instruction && instruction.length > 10) {
                            recipe.steps.push({ step_number: stepNum++, instruction });
                        }
                    }
                }
            });
        }

        // === キッコーマン (kikkoman.co.jp) 専用パーサー ===
        if (url.includes("kikkoman.co.jp") && recipe.ingredients.length === 0) {
            // 材料はul/li構造
            $("ul").each((_, el) => {
                const $ul = $(el);
                // 前の見出しを確認
                const $prev = $ul.prev("h2, h3, h4").first();
                if ($prev.length && $prev.text().includes("材料")) {
                    $ul.find("> li").each((_, li) => {
                        const $li = $(li);
                        const text = $li.text().trim();
                        if (!text || text.startsWith("（")) return;

                        // ネストされた構造に対応
                        let name = text;
                        let amount = "";

                        const nestedAmount = $li.find("> div, > span").first().text().trim();
                        const parentText = $li.contents().filter(function() {
                            return this.nodeType === 3; // テキストノードのみ
                        }).text().trim();

                        if (nestedAmount && parentText) {
                            name = parentText;
                            amount = nestedAmount;
                        } else if (text.includes("  ")) {
                            const parts = text.split(/\s{2,}/);
                            if (parts.length >= 2) {
                                name = parts[0].trim();
                                amount = parts.slice(1).join(" ").trim();
                            }
                        }

                        if (name) {
                            recipe.ingredients.push({ name, amount });
                        }
                    });
                }
            });

            // 手順はol/li構造
            $("ol").each((_, el) => {
                const $ol = $(el);
                // 前の見出しを確認
                const $prev = $ol.prev("h2, h3, h4").first();
                if ($prev.length && ($prev.text().includes("つくり方") || $prev.text().includes("作り方"))) {
                    $ol.find("> li").each((i, li) => {
                        const text = $(li).text().trim();
                        if (text) {
                            recipe.steps.push({ step_number: i + 1, instruction: text });
                        }
                    });
                }
            });
        }

        if (!recipe.title || recipe.title === "タイトル不明") {
            recipe.title = "タイトルが取得できませんでした";
        }

        // Trim long titles
        if (recipe.title.length > 200) {
            recipe.title = recipe.title.slice(0, 200);
        }

        console.log(
            `[scrape] ${parsedUrl.hostname} -> HTTP ${fetchStatus}, title="${recipe.title}", ings=${recipe.ingredients.length}, steps=${recipe.steps.length}`
        );

        return NextResponse.json({ recipe });
    } catch (error) {
        console.error("Scrape unexpected error:", error);
        return NextResponse.json(
            {
                error: "予期しないエラーが発生しました。URLを確認するか、手動入力をお試しください。",
                detail: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
