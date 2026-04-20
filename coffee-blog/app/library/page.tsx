import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import Link from 'next/link';
import { getAllTags } from '@/lib/posts';

/* Library Page - Tag-based knowledge browser */

export default async function LibraryPage() {
  const tags = getAllTags();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-2">
              Library
            </span>
            <h1 className="font-display font-bold text-headline-lg text-primary mb-4">
              知識ライブラリ
            </h1>
            <p className="text-secondary">
              タグで探すコーヒーの知識
            </p>
          </div>
        </section>

        {/* Tags Grid */}
        <section className="section-divider">
          <div className="max-w-6xl mx-auto px-6">
            {tags.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-secondary">タグがまだありません。</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/library/${encodeURIComponent(tag.name)}`}
                    className="group flex flex-col items-center justify-center p-6 bg-surface-low rounded-xl hover:bg-surface-lowest transition-all duration-200 hover:shadow-md"
                  >
                    <span className="font-display font-semibold text-headline-sm text-primary group-hover:text-primary/80 transition-colors">
                      {tag.name}
                    </span>
                    <span className="text-sm text-secondary mt-2">
                      {tag.count} {tag.count === 1 ? 'article' : 'articles'}
                    </span>
                  </Link>
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
