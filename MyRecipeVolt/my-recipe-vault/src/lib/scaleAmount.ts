/**
 * 材料の量を人数スケールに応じて変換する
 * 例: "大さじ2", scale=2 → "大さじ4"
 *     "1/2カップ", scale=2 → "1カップ"
 *     "適量", scale=2 → "適量"（数字なし → そのまま）
 */
export function scaleAmount(amount: string, scale: number): string {
    if (!amount.trim() || scale === 1) return amount;

    // 数字（整数・小数・分数）を検出して掛け算
    return amount.replace(/(\d+)\/(\d+)|(\d+\.?\d*)/g, (match, num, den, whole) => {
        if (num !== undefined && den !== undefined) {
            // 分数: 例 "1/2" → 0.5 * scale
            const result = (parseInt(num) / parseInt(den)) * scale;
            return formatNumber(result);
        } else {
            // 整数 or 小数
            const result = parseFloat(whole) * scale;
            return formatNumber(result);
        }
    });
}

/** 数値を見やすい文字列に変換（整数は整数表示、小数は四捨五入） */
function formatNumber(n: number): string {
    if (n === Math.floor(n)) return n.toString();

    // よく使う分数に変換
    const fractions: [number, string][] = [
        [1 / 2, "1/2"],
        [1 / 3, "1/3"],
        [2 / 3, "2/3"],
        [1 / 4, "1/4"],
        [3 / 4, "3/4"],
        [1 / 6, "1/6"],
        [1 / 8, "1/8"],
    ];
    for (const [val, label] of fractions) {
        if (Math.abs(n - val) < 0.02) return label;
    }
    // 小数点1桁に丸める
    return (Math.round(n * 10) / 10).toString();
}
