'use client';

import { useRouter } from 'next/navigation';
import { Chip } from './ui/chip';

interface TagChipProps {
  tag: string;
}

export function TagChip({ tag }: TagChipProps) {
  const router = useRouter();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/library/${encodeURIComponent(tag)}`);
      }}
      className="cursor-pointer"
    >
      <Chip clickable={true}>{tag}</Chip>
    </button>
  );
}
