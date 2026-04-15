import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Link from 'next/link';

/* About Page - The Editorial Muse Design System */

const features = [
  {
    title: 'Coffee Tasting Logs',
    description: '日々のコーヒーの味わいを記録し、フレーバープロファイルを蓄積。自分だけのテイスティングノートを作成できます。',
    icon: '📝',
  },
  {
    title: 'Knowledge Frameworks',
    description: '抽出理論、焙煎科学、産地の特徴など、コーヒーの知識を体系的に整理。理解を深めるためのフレームワークを提供します。',
    icon: '🧠',
  },
  {
    title: 'Learning Resources',
    description: '初心者から上級者まで、レベルに合わせた学習リソース。コーヒーの旅をサポートするコンテンツを揃えています。',
    icon: '📚',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-divider bg-surface-low">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-3xl">
              <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
                About
              </span>
              <h1 className="font-display font-bold text-display text-primary leading-tight mb-6">
                Coffee Knowledgeとは
              </h1>
              <p className="text-body-lg text-secondary">
                日常のコーヒーを知識資産に。
                <br />
                スペシャルティコーヒーの世界を探求するブログです。
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="section-divider">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-surface-lowest rounded-xl p-8 md:p-12">
              <h2 className="font-display font-semibold text-headline-lg text-primary mb-6">
                ミッション
              </h2>
              <p className="text-body-lg text-on-surface/80 leading-relaxed mb-4">
                コーヒーは単なる飲み物ではありません。農作物としての物語、焙煎という科学、抽出という技術、そして味わいという芸術が交差する、驚くほど深い世界です。
              </p>
              <p className="text-body-lg text-on-surface/80 leading-relaxed">
                このブログでは、そんなコーヒーの魅力を多くの人と共有したい。日常の一杯から始まる探求の旅を、知識という形で記録し、発信していきます。
              </p>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="section-divider bg-surface-low">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-2">
                What We Offer
              </span>
              <h2 className="font-display font-semibold text-headline-lg text-primary">
                サービス
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <p className="text-secondary text-sm">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Author */}
        <section className="section-divider">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary text-4xl">
                  CK
                </div>
              </div>

              {/* Bio */}
              <div>
                <h2 className="font-display font-semibold text-headline-lg text-primary mb-4">
                  About the Author
                </h2>
                <p className="text-secondary leading-relaxed mb-4">
                  コーヒー愛好家。日常的にハンドドリップを楽しんでいる中で、得た知識や経験を記録し始める。
                  スペシャルティコーヒーの魅力を伝えることで、より多くの人々にコーヒーの深さを知ってもらいたいと願っています。
                </p>
                <div className="flex gap-4">
                  <Button variant="secondary" size="sm">
                    X (Twitter)
                  </Button>
                  <Button variant="secondary" size="sm">
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-divider">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display font-semibold text-headline-lg text-primary mb-4">
              コーヒーの旅を始めよう
            </h2>
            <p className="text-secondary mb-8">
              最新の記事やコーヒーの知識をお届けします
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/blog">記事を読む</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/library">知識ライブラリ</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
