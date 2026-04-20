import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { Card, CardImage, CardHeader, CardTitle, CardExcerpt, CardMeta } from '../../components/ui/card';
import { CategoryChip, Chip } from '../../components/ui/chip';
import Link from 'next/link';
import { getPostsByTag, getAllTagNames } from '@/lib/posts';
import { notFound } from 'next/navigation';

/* Tag Detail Page - Articles filtered by tag */

export async function generateStaticParams() {
  const tags = getAllTagNames();
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  const articles = getPostsByTag(tag);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            <Link
              href="/library"
              className="inline-flex items-center text-sm text-secondary hover:text-primary transition-colors mb-4"
            >
              ← 全タグを見る
            </Link>
            <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-2">
              Tag
            </span>
            <h1 className="font-display font-bold text-headline-lg text-primary mb-4">
              {tag}
            </h1>
            <p className="text-secondary">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
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

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.map((t) => (
                        <Link key={t} href={`/library/${encodeURIComponent(t)}`}>
                          <Chip clickable={true}>{t}</Chip>
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
