import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({
  children,
  className,
  noPadding = false,
}: CardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'bg-white dark:bg-obsidian-800',
        'border border-stone-200 dark:border-obsidian-600',
        'rounded-2xl shadow-sm dark:shadow-obsidian',
        !noPadding && 'p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
