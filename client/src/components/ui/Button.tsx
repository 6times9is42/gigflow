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
    'bg-obsidian-700 text-obsidian-100 border border-obsidian-600 hover:bg-obsidian-600 hover:border-obsidian-500 dark:bg-obsidian-700 dark:text-obsidian-100 dark:border-obsidian-600 dark:hover:bg-obsidian-600',
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50',
  ghost:
    'bg-transparent text-obsidian-300 hover:bg-obsidian-700/50 hover:text-obsidian-100 dark:text-obsidian-300 dark:hover:bg-obsidian-700/50',
};

// Light mode overrides for secondary/ghost
const variantClassesLight: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: '',
  secondary:
    'light:bg-stone-100 light:text-stone-800 light:border-stone-300 light:hover:bg-stone-200',
  danger: '',
  ghost: 'light:text-stone-600 light:hover:bg-stone-100 light:hover:text-stone-900',
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
        variantClassesLight[variant],
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
