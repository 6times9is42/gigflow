import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in',
        className,
      )}
    >
      {icon && (
        <div className="mb-5 p-4 rounded-2xl bg-stone-100 dark:bg-obsidian-750 text-stone-400 dark:text-obsidian-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold font-display text-stone-800 dark:text-obsidian-200 mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-stone-500 dark:text-obsidian-400 max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
