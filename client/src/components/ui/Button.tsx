import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-amber-500 text-obsidian-900 font-semibold hover:bg-amber-400 active:bg-amber-600 shadow-sm hover:shadow-amber-glow',
  secondary:
    'bg-stone-100 text-stone-800 border border-stone-300 hover:bg-stone-200 dark:bg-obsidian-700 dark:text-obsidian-100 dark:border-obsidian-600 dark:hover:bg-obsidian-600 dark:hover:border-obsidian-500',
  danger:
    'bg-red-50 text-red-600 border border-red-300 hover:bg-red-100 dark:bg-red-500/[0.1] dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/20 dark:hover:border-red-500/50',
  ghost:
    'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-obsidian-300 dark:hover:bg-obsidian-700/50 dark:hover:text-obsidian-100',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-6 text-base gap-2.5 rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-display font-medium',
        'transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-40',
        'select-none cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
