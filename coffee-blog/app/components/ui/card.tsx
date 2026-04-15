import React from 'react';
import Link from 'next/link';

/* Article Card following The Editorial Muse design system */
/* No divider lines - use background color shifts */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'article' | 'div' | React.FC<any>;
  href?: string;
}

export function Card({ children, className = '', as: Component = 'article', href }: CardProps) {
  const cardContent = (
    <div className={`bg-surface-lowest rounded-lg p-8 ${className}`}>
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return <Component>{cardContent}</Component>;
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CardImage({ src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`overflow-hidden rounded-md -mx-8 -mt-8 mb-6 first:rounded-t-lg ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <header className={`mb-4 ${className}`}>{children}</header>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-title-lg font-display font-semibold text-primary leading-tight ${className}`}>
      {children}
    </h3>
  );
}

interface CardExcerptProps {
  children: React.ReactNode;
  className?: string;
}

export function CardExcerpt({ children, className = '' }: CardExcerptProps) {
  return (
    <p className={`text-body-lg text-on-surface/80 mt-3 line-clamp-3 ${className}`}>
      {children}
    </p>
  );
}

interface CardMetaProps {
  children: React.ReactNode;
  className?: string;
}

export function CardMeta({ children, className = '' }: CardMetaProps) {
  return (
    <div className={`flex items-center gap-4 mt-4 text-sm text-secondary ${className}`}>
      {children}
    </div>
  );
}
