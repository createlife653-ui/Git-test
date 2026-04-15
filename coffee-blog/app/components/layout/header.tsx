import Link from 'next/link';

/* Navigation with Glassmorphism - The Editorial Muse */

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-transparent">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display font-bold text-xl text-primary">
          Coffee Knowledge
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              href="/"
              className="text-sm font-medium text-on-surface/80 hover:text-primary transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-sm font-medium text-on-surface/80 hover:text-primary transition-colors"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/library"
              className="text-sm font-medium text-on-surface/80 hover:text-primary transition-colors"
            >
              Library
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-sm font-medium text-on-surface/80 hover:text-primary transition-colors"
            >
              About
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-primary"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
