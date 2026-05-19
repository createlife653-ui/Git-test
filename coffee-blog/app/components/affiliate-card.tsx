import Image from 'next/image';
import Link from 'next/link';
import type { AffiliateProduct } from '@/lib/affiliate';
import { buildAmazonUrl } from '@/lib/affiliate';

interface AffiliateCardProps {
  product: AffiliateProduct;
}

/**
 * Amazonアフィリエイト商品カード
 */
export function AffiliateCard({ product }: AffiliateCardProps) {
  const amazonUrl = buildAmazonUrl(product.asin);

  return (
    <Link
      href={amazonUrl}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className="group block bg-surface-lowest rounded-lg p-4 hover:shadow-ambient transition-shadow border border-outline-variant/20"
    >
      <div className="flex gap-4">
        {/* 商品画像 */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-white">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 商品情報 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-primary text-sm leading-tight mb-1 line-clamp-2">
            {product.title}
          </h4>
          <p className="text-xs text-secondary line-clamp-2 mb-2">
            {product.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-label uppercase tracking-widest text-primary/60">
              Amazonで見る
            </span>
            <svg
              className="w-3 h-3 text-primary/60 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface AffiliateSectionProps {
  products: AffiliateProduct[];
}

/**
 * アフィリエイト商品セクション
 */
export function AffiliateSection({ products }: AffiliateSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="section-divider bg-surface-low/50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display font-semibold text-headline-md text-primary mb-6">
          この記事で紹介した商品
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product, index) => (
            <AffiliateCard key={`${product.asin}-${index}`} product={product} />
          ))}
        </div>
        <p className="text-xs text-secondary mt-4 text-center">
          ※Amazonのアソシエイトとして、適格販売により収入を得ています。
        </p>
      </div>
    </section>
  );
}
