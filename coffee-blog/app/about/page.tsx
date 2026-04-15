import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { Button } from '../components/ui/button';
import Link from 'next/link';

/* About Page - Personal Profile */

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-divider bg-surface-low">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
              About
            </span>
            <h1 className="font-display font-bold text-display text-primary leading-tight mb-6">
              はじめまして
            </h1>
            <p className="text-body-lg text-secondary leading-relaxed">
              コーヒーとの付き合いは1年半になります。これまでの記録も含め、ブログに残していこうと思います。未熟な点も多いですが、どうぞよろしくお願いします。
            </p>
            <p className="text-xs text-secondary/50 mt-4 font-label">
              2026/04/15
            </p>
          </div>
        </section>

        {/* Profile Section */}
        <section className="section-divider">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Avatar */}
              <div className="md:col-span-1">
                <div className="aspect-square rounded-2xl bg-surface-low overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop"
                    alt="Coffee workspace"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Text */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="font-display font-semibold text-headline-md text-primary mb-1">
                    春珈珈菜太
                  </h2>
                  <p className="text-sm text-secondary/70 mb-4">
                    はるかかなた
                  </p>
                  <p className="text-secondary">
                    愛知県在住。健康のためにコーヒーを始めましたがここまでの付き合いになるとは思わなかったです。
                  </p>
                </div>

                <div>
                  <h3 className="font-label text-xs uppercase tracking-widest text-primary/70 mb-3">
                    好きな淹れ方
                  </h3>
                  <p className="text-body text-secondary leading-relaxed">
                    基本はハンドドリップ。お湯の温度は81度前後で、ゆっくりと丁寧に淹れるのが好きです。
                    朝の時間は、丁寧にドリップする時間が一日の始まりの儀式になっています。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-divider">
          <div className="max-w-2xl mx-auto px-6 py-12 text-center">
            <Button asChild>
              <Link href="/">ホームへ戻る</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
