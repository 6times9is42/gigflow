import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      className,
      id,
      ...props
    },
    ref,
  ): React.JSX.Element => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium tracking-wide uppercase text-obsidian-300 dark:text-obsidian-300 text-stone-500"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 dark:text-obsidian-400 text-stone-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-9 rounded-lg text-sm font-display',
              'bg-obsidian-800 dark:bg-obsidian-800 bg-white',
              'border border-obsidian-600 dark:border-obsidian-600 border-stone-200',
              'text-obsidian-100 dark:text-obsidian-100 text-stone-900',
              'placeholder:text-obsidian-400 dark:placeholder:text-obsidian-400 placeholder:text-stone-400',
              'transition-all duration-150',
              'focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
              'hover:border-obsidian-500 dark:hover:border-obsidian-500 hover:border-stone-300',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 dark:text-obsidian-400 text-stone-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400 font-display animate-fade-in">{error}</p>
        )}
        {helper && !error && (
          <p className="text-xs text-obsidian-400 dark:text-obsidian-400 text-stone-400 font-display">
            {helper}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
