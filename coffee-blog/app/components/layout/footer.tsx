import Link from 'next/link';

/* Footer - The Editorial Muse */

export function Footer() {
  return (
    <footer className="bg-surface-low border-t border-transparent mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display font-bold text-lg text-primary mb-4">
              Coffee Knowledge
            </h3>
            <p className="text-sm text-secondary leading-relaxed">
              日常のコーヒーを知識資産に。
              <br />
              スペシャルティコーヒーの世界を探求する。
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-secondary hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-sm text-secondary hover:text-primary transition-colors">
                  Library
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-secondary hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-secondary mb-4">
              新着記事をお届けします
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 bg-surface-lowest border-b-2 border-outline-variant focus:border-primary outline-none text-sm transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-4 py-2 signature-gradient text-on-primary text-sm font-medium rounded-lg hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-outline-variant/15 text-center text-sm text-secondary">
          <p>&copy; {new Date().getFullYear()} Coffee Knowledge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
