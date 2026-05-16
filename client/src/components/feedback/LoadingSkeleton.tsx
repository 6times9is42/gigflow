import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  rows?: number;
  variant?: 'table' | 'card' | 'detail';
}

function SkeletonBox({ className }: { className?: string }): React.JSX.Element {
  return (
    <div className={cn('skeleton rounded', className)} />
  );
}

function TableRow(): React.JSX.Element {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-stone-100 dark:border-obsidian-700 last:border-b-0">
      {/* Name */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <SkeletonBox className="h-3.5 w-36 max-w-full" />
        <SkeletonBox className="h-3 w-24 max-w-full" />
      </div>
      {/* Email */}
      <SkeletonBox className="h-3.5 w-44 hidden md:block" />
      {/* Status */}
      <SkeletonBox className="h-5 w-20 rounded-md hidden sm:block" />
      {/* Source */}
      <SkeletonBox className="h-5 w-20 rounded-md hidden lg:block" />
      {/* Date */}
      <SkeletonBox className="h-3.5 w-24 hidden lg:block" />
      {/* Actions */}
      <div className="flex gap-2 ml-auto">
        <SkeletonBox className="h-7 w-7 rounded-lg" />
        <SkeletonBox className="h-7 w-7 rounded-lg" />
      </div>
    </div>
  );
}

function CardSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white dark:bg-obsidian-800 border border-stone-200 dark:border-obsidian-600 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-3 w-44" />
        </div>
        <SkeletonBox className="h-6 w-20 rounded-md" />
      </div>
      <SkeletonBox className="h-3 w-28" />
    </div>
  );
}

function DetailSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <SkeletonBox className="h-12 w-12 rounded-xl" />
        <div className="flex flex-col gap-2">
          <SkeletonBox className="h-5 w-48" />
          <SkeletonBox className="h-3.5 w-36" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array<null>(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <SkeletonBox className="h-3 w-16" />
            <SkeletonBox className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingSkeleton({
  rows = 5,
  variant = 'table',
}: LoadingSkeletonProps): React.JSX.Element {
  if (variant === 'detail') return <DetailSkeleton />;

  if (variant === 'card') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array<null>(rows)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone-100 dark:divide-obsidian-700" role="status" aria-label="Loading">
      {[...Array<null>(rows)].map((_, i) => (
        <TableRow key={i} />
      ))}
    </div>
  );
}
