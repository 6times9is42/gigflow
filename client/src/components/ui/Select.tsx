import { type SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helper, options, placeholder, className, id, ...props },
    ref,
  ): React.JSX.Element => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium tracking-wide uppercase text-obsidian-300 dark:text-obsidian-300 text-stone-500"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-9 rounded-lg text-sm font-display appearance-none',
              'bg-obsidian-800 dark:bg-obsidian-800 bg-white',
              'border border-obsidian-600 dark:border-obsidian-600 border-stone-200',
              'text-obsidian-100 dark:text-obsidian-100 text-stone-900',
              'pl-3 pr-9',
              'transition-all duration-150',
              'focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
              'hover:border-obsidian-500 dark:hover:border-obsidian-500 hover:border-stone-300',
              'disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
              error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" className="dark:bg-obsidian-800 bg-white">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="dark:bg-obsidian-800 bg-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 dark:text-obsidian-400 text-stone-400 pointer-events-none"
          />
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

Select.displayName = 'Select';
