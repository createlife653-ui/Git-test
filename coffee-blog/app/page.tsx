import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { Card, CardImage, CardHeader, CardTitle, CardExcerpt, CardMeta } from './components/ui/card';
import { CategoryChip, Chip } from './components/ui/chip';
import { Button } from './components/ui/button';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { TagChip } from './components/tag-chip';

/* Homepage - The Editorial Muse Design System */
/* Asymmetric grid with breathing room */

export default async function HomePage() {
  const articles = getAllPosts();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section - Intentional Asymmetry */}
        <section className="section-divider bg-surface-low">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-3xl">
              {/* Category Label */}
              <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
                Coffee Knowledge Blog
              </span>

              {/* Hero Title - Display Typography */}
              <h1 className="font-display font-bold text-display text-primary leading-tight mb-6">
                日常のコーヒーを<br />
                <span className="text-primary/80">知識資産に</span>
              </h1>

              {/* Subtitle */}
              <p className="text-body-lg text-secondary mb-8 max-w-xl">
                コーヒーの知識を体系立てて記録・発信。
                スペシャルティコーヒーの世界を探求する。
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/blog">記事を読む</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/library">知識ライブラリ</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles - Asymmetric Grid */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-2">
                  Latest
                </span>
                <h2 className="font-display font-semibold text-headline-lg text-primary">
                  最新記事
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex text-sm text-secondary hover:text-primary transition-colors"
              >
                すべて見る →
              </Link>
            </div>

            {/* Article Grid - Asymmetric 3-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <Card
                  key={article.slug}
                  className={`flex flex-col ${index === 0 ? 'md:col-span-2' : ''}`}
                  as={Link}
                  href={`/blog/${article.slug}`}
                >
                  <CardImage src={article.image} alt={article.title} />
                  <CardHeader>
                    <CategoryChip>{article.category}</CategoryChip>
                  </CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardExcerpt>{article.excerpt}</CardExcerpt>

                  {/* Tasting Notes */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.map((tag) => (
                        <TagChip key={tag} tag={tag} />
                      ))}
                    </div>
                  )}

                  <CardMeta>
                    <time>{article.date}</time>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </CardMeta>
                </Card>
              ))}
            </div>

            {/* Mobile View All Link */}
            <div className="mt-8 text-center sm:hidden">
              <Button variant="secondary" asChild>
                <Link href="/blog">すべて見る</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="section-divider">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display font-semibold text-headline-lg text-primary mb-4">
              ニュースレター
            </h2>
            <p className="text-secondary mb-8">
              新着記事やコーヒーの知識をメールでお届けします。
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-6 py-3 bg-surface-lowest border-b-2 border-outline-variant focus:border-primary outline-none text-sm transition-colors"
                required
              />
              <Button type="submit">登録する</Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
