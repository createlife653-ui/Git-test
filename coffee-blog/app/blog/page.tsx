import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { Card, CardImage, CardHeader, CardTitle, CardExcerpt, CardMeta } from '../components/ui/card';
import { CategoryChip, Chip } from '../components/ui/chip';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

/* Blog Listing Page - Markdownベースの実装 */

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const articles = getAllPosts();

  // カテゴリーの抽出と記事数の計算
  const categoryCounts: Record<string, number> = { All: articles.length };
  articles.forEach((article) => {
    categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
  });

  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category))).sort()];

  // フィルタリング
  const filteredArticles =
    selectedCategory && selectedCategory !== 'All'
      ? articles.filter((a) => a.category === decodeURIComponent(selectedCategory))
      : articles;

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
              {selectedCategory && selectedCategory !== 'All'
                ? `${decodeURIComponent(selectedCategory)}の記事`
                : 'すべてのコーヒー知識'}
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive =
                  (category === 'All' && !selectedCategory) ||
                  (selectedCategory === category);

                return (
                  <Link
                    key={category}
                    href={category === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(category)}`}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-surface-low text-secondary hover:bg-surface-lowest'
                    }`}
                  >
                    {category}
                    <span className="ml-2 text-xs opacity-70">
                      ({categoryCounts[category] || 0})
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-secondary">
                  {selectedCategory ? `「${decodeURIComponent(selectedCategory)}」の記事がありません。` : '記事がまだありません。'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredArticles.map((article) => (
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

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.map((tag) => (
                          <Link key={tag} href={`/library/${encodeURIComponent(tag)}`}>
                            <Chip clickable={true}>{tag}</Chip>
                          </Link>
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
