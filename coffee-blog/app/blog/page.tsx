import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { Card, CardImage, CardHeader, CardTitle, CardExcerpt, CardMeta } from '../components/ui/card';
import { CategoryChip, Chip } from '../components/ui/chip';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

/* Blog Listing Page - Markdownベースの実装 */

export default async function BlogPage() {
  const articles = getAllPosts();

  // カテゴリーの抽出
  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-2">
              Blog
            </span>
            <h1 className="font-display font-bold text-headline-lg text-primary mb-4">
              記事一覧
            </h1>
            <p className="text-secondary">
              すべてのコーヒー知識
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={category === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(category)}`}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-surface-low text-secondary hover:bg-surface-lowest transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            {articles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-secondary">記事がまだありません。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
                  <Card
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="flex flex-col"
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
                          <Chip key={tag} clickable={false}>{tag}</Chip>
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
