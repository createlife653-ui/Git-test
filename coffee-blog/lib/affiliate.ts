/**
 * Amazonアフィリエイト設定
 *
 * AmazonアソシエイトのトラッキングIDを設定します
 *申請はこちら: https://affiliate.amazon.co.jp/
 */

export const AMAZON_ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'your-tag-22';

/**
 * Amazon商品ページのURLを生成
 */
export function buildAmazonUrl(asin: string, tag?: string): string {
  const associateTag = tag || AMAZON_ASSOCIATE_TAG;
  return `https://www.amazon.co.jp/dp/${asin}?tag=${associateTag}`;
}

/**
 * アフィリエイト商品情報の型
 */
export interface AffiliateProduct {
  /** 商品名 */
  title: string;
  /** Amazon商品ID (ASIN) */
  asin: string;
  /** 商品画像URL */
  image: string;
  /** 商品説明 */
  description: string;
  /** カテゴリ（オプション） */
  category?: string;
}
