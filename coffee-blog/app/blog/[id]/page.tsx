import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { Chip } from '../../components/ui/chip';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/* Blog Article Page - The Editorial Muse Design System */

// Sample article data - would be fetched from MDX in production
const articles: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  content: string;
}> = {
  '1': {
    title: 'エチオピア咖啡豆の特徴',
    excerpt: 'エチオピアはコーヒーの故郷とも言われる国です。ここでは、エチオピア産コーヒー豆の特徴や、代表的な産地、味わいの傾向について解説します。',
    category: 'Tasting Notes',
    date: '2024年3月15日',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&h=600&fit=crop',
    tags: ['Citrus', 'Floral', 'Ethiopia'],
    content: `
## コーヒーの故郷、エチオピア

エチオピアはコーヒー発祥の地として知られています。ここでは、エチオピア産コーヒー豆の特徴と、代表的な産地について解説します。

### 代表的な産地

エチオピアには数多くの産地がありますが、特に有名なのは以下の3つです：

- **イェルガチェフェ**: フローラルで繊細な酸味が特徴
- **シダモ**: フルーティーでボディのある味わい
- **ハラール**: スパイシーでワイルドな風味

### 味わいの特徴

エチオピアコーヒーの最大の特徴は、その鮮明な酸味と複雑なフレーバーです。

### テイスティングノート

典型的なエチオピアコーヒーのテイスティングプロファイル：
    `,
  },
};

const relatedArticles = [
  { id: 2, title: '淹れ方による味わいの変化', category: 'Brewing Guides' },
  { id: 3, title: '焙煎度によるフレーバーの変化', category: 'Roast Profiles' },
  { id: 5, title: 'サスター式 vs ケメックス式', category: 'Equipment' },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = articles[id];

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Image */}
        <section className="relative h-[60vh] min-h-[400px]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
        </section>

        {/* Article Header - Overlapping image */}
        <section className="relative -mt-32 z-10">
          <div className="max-w-4xl mx-auto px-6">
            <article className="bg-surface-lowest rounded-xl p-8 md:p-12 shadow-ambient">
              {/* Category */}
              <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
                {article.category}
              </span>

              {/* Title */}
              <h1 className="font-display font-bold text-headline-lg text-primary leading-tight mb-6">
                {article.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-8">
                <time>{article.date}</time>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>

              {/* Tasting Notes */}
              <div className="mb-8 pb-8 border-b border-outline-variant/15">
                <h3 className="font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
                  Tasting Notes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Chip key={tag} clickable={false}>{tag}</Chip>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-primary/90 font-medium leading-relaxed mb-8">
                  {article.excerpt}
                </p>
                <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-outline-variant/15">
                <h3 className="font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Chip key={tag} clickable>#{tag}</Chip>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Share Section */}
        <section className="section-divider">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs uppercase tracking-widest text-primary/70">
                Share this article
              </span>
              <div className="flex gap-4">
                <Button variant="secondary" size="sm">
                  X (Twitter)
                </Button>
                <Button variant="secondary" size="sm">
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="section-divider bg-surface-low">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-display font-semibold text-headline-lg text-primary mb-8">
              関連記事
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.id}`}
                  className="bg-surface-lowest rounded-lg p-6 hover:shadow-ambient transition-shadow"
                >
                  <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-2">
                    {related.category}
                  </span>
                  <h3 className="font-display font-semibold text-primary leading-tight">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back to Blog */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            <Button variant="secondary" asChild>
              <Link href="/blog">← 記事一覧に戻る</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Generate static params for static generation
export async function generateStaticParams() {
  return Object.keys(articles).map((id) => ({ id }));
}
