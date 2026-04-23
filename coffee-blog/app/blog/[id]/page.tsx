import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { Chip } from '../../components/ui/chip';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPostSlugs, getAllPosts } from '@/lib/posts';

/* Blog Article Page - Markdownベースの実装 */

const mdxComponents = {
  // 必要に応じてカスタムコンポーネントを追加
  h1: (props: any) => <h1 className="font-display font-bold text-3xl text-primary mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="font-display font-semibold text-2xl text-primary mt-6 mb-3" {...props} />,
  h3: (props: any) => <h3 className="font-display font-semibold text-xl text-primary mt-5 mb-2" {...props} />,
  p: (props: any) => <p className="text-primary/90 leading-relaxed mb-4" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="text-primary/90" {...props} />,
  strong: (props: any) => <strong className="font-bold text-primary" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto mb-6 rounded-lg overflow-hidden shadow-sm">
      <table className="min-w-full border-collapse bg-surface-lowest" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-surface-low" {...props} />,
  th: (props: any) => (
    <th className="border-b-2 border-outline-variant px-5 py-3 text-left font-semibold text-primary text-sm tracking-wide" {...props} />
  ),
  tbody: (props: any) => <tbody className="divide-y divide-outline-variant/20" {...props} />,
  tr: (props: any) => (
    <tr className="even:bg-surface-low/30 hover:bg-primary/5 transition-colors" {...props} />
  ),
  td: (props: any) => (
    <td className="px-5 py-3 text-primary/90 text-sm" {...props} />
  ),
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const post = getPostBySlug(id);

  if (!post) {
    notFound();
  }

  // 関連記事を取得（現在の記事を除く）
  const allPosts = getAllPosts();
  const relatedArticles = allPosts
    .filter((p) => p.slug !== id)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Image */}
        <section className="relative h-[60vh] min-h-[400px]">
          <img
            src={post.image}
            alt={post.title}
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
                {post.category}
              </span>

              {/* Title */}
              <h1 className="font-display font-bold text-headline-lg text-primary leading-tight mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-8">
                <time>{post.date}</time>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              {/* Tasting Notes / Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-8 pb-8 border-b border-outline-variant/15">
                  <h3 className="font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
                    タグ
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link key={tag} href={`/library/${encodeURIComponent(tag)}`}>
                        <Chip clickable={true}>{tag}</Chip>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Excerpt */}
              <p className="text-xl text-primary/90 font-medium leading-relaxed mb-8">
                {post.excerpt}
              </p>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <MDXRemote source={post.content} components={mdxComponents} />
              </div>
            </article>
          </div>
        </section>

        {/* Share Section */}
        <section className="section-divider">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs uppercase tracking-widest text-primary/70">
                この記事をシェア
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
        {relatedArticles.length > 0 && (
          <section className="section-divider bg-surface-low">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-display font-semibold text-headline-lg text-primary mb-8">
                関連記事
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
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
        )}

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
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

const baseUrl = 'https://coffee-blog-eta.vercel.app';

// メタデータ生成
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const post = getPostBySlug(id);

  if (!post) {
    return {
      title: '記事が見つかりません - Coffee Knowledge',
    };
  }

  const url = `${baseUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} - Coffee Knowledge`,
    description: post.excerpt,
    keywords: [...post.tags, 'コーヒー', 'スペシャルティコーヒー', '珈琲'],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}
