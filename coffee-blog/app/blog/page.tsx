'use client';

import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { Card, CardImage, CardHeader, CardTitle, CardExcerpt, CardMeta } from '../components/ui/card';
import { CategoryChip, Chip } from '../components/ui/chip';
import Link from 'next/link';

/* Blog Listing Page - The Editorial Muse Design System */

const categories = ['All', 'Tasting Notes', 'Brewing Guides', 'Roast Profiles', 'Principles', 'Equipment', 'Origins'];

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

export default function BlogPage() {
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
                <button
                  key={category}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    category === 'All'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-low text-secondary hover:bg-surface-lowest'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  href={`/blog/${article.id}`}
                  className="flex flex-col"
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

            {/* Load More */}
            <div className="mt-16 text-center">
              <button className="px-8 py-3 text-secondary font-medium hover:text-primary transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
