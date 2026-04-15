'use client';

import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { Card, CardImage, CardHeader, CardTitle, CardExcerpt, CardMeta } from './components/ui/card';
import { CategoryChip, Chip } from './components/ui/chip';
import { Button } from './components/ui/button';
import Link from 'next/link';

/* Homepage - The Editorial Muse Design System */
/* Asymmetric grid with breathing room */

// Sample article data
const articles = [
  {
    id: 1,
    title: 'エチオピア咖啡豆の特徴',
    excerpt: 'エチオピアはコーヒーの故郷とも言われる国です。ここでは、エチオピア産コーヒー豆の特徴や、代表的な産地、味わいの傾向について解説します。',
    category: 'Tasting Notes',
    date: '2024年3月15日',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
    tags: ['Citrus', 'Floral', 'Ethiopia'],
  },
  {
    id: 2,
    title: '淹れ方による味わいの変化',
    excerpt: '同じコーヒー豆でも、抽出方法によって味わいが大きく変わります。ハンドドリップ、フレンチプレス、エアロプレスなど、様々な抽出方法を比較してみましょう。',
    category: 'Brewing Guides',
    date: '2024年3月12日',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    tags: ['Extraction', 'Brewing'],
  },
  {
    id: 3,
    title: '焙煎度によるフレーバーの変化',
    excerpt: 'ライトローストからダークローストまで、焙煎度によってコーヒーのフレーバーは劇的に変化します。それぞれの焙煎度の特徴と、おすすめの飲み方を紹介します。',
    category: 'Roast Profiles',
    date: '2024年3月10日',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
    tags: ['Roast', 'Flavor', 'Chemistry'],
  },
  {
    id: 4,
    title: '水がコーヒーの味わいに与える影響',
    excerpt: 'コーヒーの99%は水です。使用する水の質によって、コーヒーの味わいは大きく変わります。軟水と硬水の違い、ミネラルバランスの影響について解説します。',
    category: 'Principles',
    date: '2024年3月8日',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
    tags: ['Water', 'Chemistry', 'Extraction'],
  },
  {
    id: 5,
    title: 'サスター式 vs ケメックス式',
    excerpt: '代表的なハンドドリップ器具であるサスターとケメックス。それぞれの特徴と、生み出されるカップの違いを比較検証します。',
    category: 'Equipment',
    date: '2024年3月5日',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&h=600&fit=crop',
    tags: ['Equipment', 'Pour Over'],
  },
  {
    id: 6,
    title: 'コーヒーの産地ガイド：ケニア',
    excerpt: 'アフリカのコーヒー生産国であるケニア。鮮明な酸味とフルーツのようなフレーバーが特徴のケニアコーヒーについて解説します。',
    category: 'Origins',
    date: '2024年3月1日',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&h=600&fit=crop',
    tags: ['Kenya', 'Fruity', 'Bright'],
  },
];

// Popular tags
const popularTags = [
  'Citrus', 'Chocolate', 'Floral', 'Nutty', 'Caramel',
  'Ethiopia', 'Kenya', 'Colombia', 'Pour Over', 'Espresso'
];

export default function HomePage() {
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
                  key={article.id}
                  className={`flex flex-col ${index === 0 ? 'md:col-span-2' : ''}`}
                  as={Link}
                  href={`/blog/${article.id}`}
                >
                  <CardImage src={article.image} alt={article.title} />
                  <CardHeader>
                    <CategoryChip>{article.category}</CategoryChip>
                  </CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardExcerpt>{article.excerpt}</CardExcerpt>

                  {/* Tasting Notes */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {article.tags.map((tag) => (
                      <Chip key={tag} clickable={false}>{tag}</Chip>
                    ))}
                  </div>

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

        {/* Tag Cloud Section */}
        <section className="section-divider bg-surface-low">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-2">
                Explore by Flavor
              </span>
              <h2 className="font-display font-semibold text-headline-lg text-primary mb-8">
                フレーバーから探す
              </h2>

              <div className="flex flex-wrap justify-center gap-3">
                {popularTags.map((tag) => (
                  <Chip key={tag} clickable onClick={() => {/* TODO: Filter by tag */}}>
                    #{tag}
                  </Chip>
                ))}
              </div>
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
