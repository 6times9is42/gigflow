import { cn } from '@/lib/utils';
import type { Lead } from '@/types/api';

type StatusVariant = Lead['status'];
type GenericVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: StatusVariant | GenericVariant;
  className?: string;
}

const variantClasses: Record<StatusVariant | GenericVariant, string> = {
  // Lead status
  New: 'bg-blue-500/[0.12] text-blue-400 border-blue-500/25 dark:bg-blue-500/[0.12] dark:text-blue-400 dark:border-blue-500/25 bg-blue-50 text-blue-600 border-blue-200',
  Contacted: 'bg-amber-500/[0.12] text-amber-500 border-amber-500/25 dark:bg-amber-500/[0.12] dark:text-amber-400 dark:border-amber-500/25 bg-amber-50 text-amber-600 border-amber-200',
  Qualified: 'bg-emerald-500/[0.12] text-emerald-400 border-emerald-500/25 dark:bg-emerald-500/[0.12] dark:text-emerald-400 dark:border-emerald-500/25 bg-emerald-50 text-emerald-600 border-emerald-200',
  Lost: 'bg-red-500/[0.12] text-red-400 border-red-500/25 dark:bg-red-500/[0.12] dark:text-red-400 dark:border-red-500/25 bg-red-50 text-red-600 border-red-200',
  // Generic
  default: 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-obsidian-700 dark:text-obsidian-200 dark:border-obsidian-600',
  success: 'bg-emerald-500/[0.12] text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/[0.12] text-amber-400 border-amber-500/25',
  error: 'bg-red-500/[0.12] text-red-400 border-red-500/25',
  info: 'bg-blue-500/[0.12] text-blue-400 border-blue-500/25',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5',
        'text-xs font-medium font-mono-data tracking-wide',
        'border rounded-md',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// Convenience dot indicator
export function StatusDot({ status }: { status: StatusVariant }): React.JSX.Element {
  const dotClasses: Record<StatusVariant, string> = {
    New: 'bg-blue-400',
    Contacted: 'bg-amber-400',
    Qualified: 'bg-emerald-400',
    Lost: 'bg-red-400',
  };
  return (
    <span className={cn('inline-block w-1.5 h-1.5 rounded-full', dotClasses[status])} />
  );
}
