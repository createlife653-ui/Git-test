'use client';

import React from 'react';

/* Tasting Note Chip - The Editorial Muse design system */
/* Pill-shaped chip for flavor notes like "Citrus" or "Chocolate" */

interface ChipProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export function Chip({ children, className = '', clickable = false, onClick }: ChipProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-colors';
  const variantStyles = 'bg-secondary-container text-on-secondary-container';
  const hoverStyles = clickable ? 'hover:opacity-80 cursor-pointer' : '';

  // Only add onClick if it's provided
  const clickProps = clickable && onClick ? { onClick } : {};

  return (
    <span
      className={`${baseStyles} ${variantStyles} ${hoverStyles} ${className}`}
      {...clickProps}
    >
      {children}
    </span>
  );
}

/* Category Chip - for article categories */
interface CategoryChipProps {
  children: React.ReactNode;
  className?: string;
}

export function CategoryChip({ children, className = '' }: CategoryChipProps) {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-label tracking-widest uppercase text-primary/70 ${className}`}>
      {children}
    </span>
  );
}
