import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text || text.length > 10000) {
            return NextResponse.json(
                { error: 'テキストが長すぎます、または指定されていません' },
                { status: 400 }
            );
        }

        // シンプルなレシピ解析ロジック
        const lines = text.split('\n').filter((line: string) => line.trim());
        const result: any = {
            title: "",
            servings: "",
            category: "",
            ingredients: [],
            steps: [],
            tags: [],
        };

        let ingredientSection = false;
        let stepSection = false;

        const ingredientKeywords = ['材料', '材料', 'Ingredient', '食材', '用意するもの', '必要なもの'];
        const stepKeywords = ['手順', '作り方', '作り方', 'Step', '方法', '作る', '工程', '作りかた'];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.length === 0) continue;

            // タイトル判定
            if (!result.title && line.length > 2 && line.length < 100) {
                const isSectionHeader = ingredientKeywords.some(kw => line.includes(kw)) ||
                                    stepKeywords.some(kw => line.includes(kw));
                const hasJapanese = /[ぁ-んァ-ヶ一-龠]/.test(line);

                if (!isSectionHeader && hasJapanese) {
                    result.title = line;
                    continue;
                }
            }

            // セクション判定
            if (ingredientKeywords.some(kw => line.includes(kw))) {
                ingredientSection = true;
                stepSection = false;
                continue;
            }
            if (stepKeywords.some(kw => line.includes(kw))) {
                stepSection = true;
                ingredientSection = false;
                continue;
            }

            // 材料解析
            if (ingredientSection && !stepSection && line.length > 0 && line.length < 200) {
                result.ingredients.push({ name: line, amount: "" });
            }

            // 手順解析
            if (stepSection && line.length > 2 && line.length < 500) {
                result.steps.push(line);
            }
        }

        // カテゴリ推定
        if (result.title) {
            const title = result.title.toLowerCase();
            if (title.includes('肉') || title.includes('鶏') || title.includes('豚') || title.includes('牛')) {
                result.category = '肉料理';
            } else if (title.includes('魚') || title.includes('鯖') || title.includes('鮭')) {
                result.category = '魚料理';
            } else if (title.includes('野菜') || title.includes('サラダ')) {
                result.category = '野菜';
            } else if (title.includes('麺') || title.includes('パスタ') || title.includes('うどん')) {
                result.category = '麺類';
            } else if (title.includes('ご飯') || title.includes('カレーライス')) {
                result.category = 'ご飯';
            } else if (title.includes('スイーツ') || title.includes('ケーキ')) {
                result.category = 'スイーツ';
            } else if (title.includes('煮物') || title.includes('汁物')) {
                result.category = '煮物';
            }
        }

        if (result.category) {
            result.tags = [result.category];
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('レシピ解析エラー:', error);
        return NextResponse.json(
            { error: '解析に失敗しました' },
            { status: 500 }
        );
    }
}
