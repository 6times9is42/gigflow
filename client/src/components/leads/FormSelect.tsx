import { cn } from '@/lib/utils';

interface FormSelectProps {
  label: string;
  id: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function FormSelect({
  label,
  id,
  error,
  options,
  value,
  onChange,
  disabled,
  icon,
}: FormSelectProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-wide uppercase text-stone-500 dark:text-obsidian-300"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-obsidian-400 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full h-9 rounded-lg text-sm font-display appearance-none',
            'bg-white dark:bg-obsidian-800',
            'border border-stone-200 dark:border-obsidian-600',
            'text-stone-900 dark:text-obsidian-100',
            icon ? 'pl-9' : 'pl-3',
            'pr-9',
            'transition-all duration-150',
            'focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
            'hover:border-stone-300 dark:hover:border-obsidian-500',
            'disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
            error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-obsidian-800 bg-white">
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-obsidian-400 pointer-events-none"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {error && (
        <p className="text-xs text-red-400 font-display animate-fade-in">{error}</p>
      )}
    </div>
  );
}
