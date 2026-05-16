import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  error,
  onRetry,
  className,
}: ErrorStateProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in',
        className,
      )}
    >
      <div className="mb-5 p-4 rounded-2xl bg-red-500/10 text-red-400">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-base font-semibold font-display text-stone-800 dark:text-obsidian-200 mb-1.5">
        Something went wrong
      </h3>
      <p className="text-sm text-stone-500 dark:text-obsidian-400 max-w-xs leading-relaxed mb-5">
        {error}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw size={13} />
          Try again
        </Button>
      )}
    </div>
  );
}
