import { useEffect, useRef } from 'react';
import { Search, Plus, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { STATUS_VALUES, SOURCE_VALUES } from '@/schemas/leads.schema';

interface LeadFilters {
  search: string;
  status: string;
  source: string;
  sort: 'latest' | 'oldest';
}

interface LeadFiltersProps {
  filters: LeadFilters;
  onFilterChange: (key: string, value: string) => void;
  onAdd: () => void;
  onExport: () => void;
  isExporting: boolean;
  canExport?: boolean;
}

export function LeadFilters({
  filters,
  onFilterChange,
  onAdd,
  onExport,
  isExporting,
  canExport = true,
}: LeadFiltersProps): React.JSX.Element {
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left: Search + Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center flex-1 min-w-0">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-obsidian-400 pointer-events-none"
          />
          <input
            ref={searchRef}
            type="text"
            placeholder='Search leads… (/)'
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className={cn(
              'w-full h-9 rounded-lg text-sm font-display',
              'bg-white dark:bg-obsidian-800',
              'border border-stone-200 dark:border-obsidian-600',
              'text-stone-900 dark:text-obsidian-100',
              'placeholder:text-stone-400 dark:placeholder:text-obsidian-500',
              'pl-9 pr-3',
              'transition-all duration-150',
              'focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
              'hover:border-stone-300 dark:hover:border-obsidian-500',
            )}
          />
        </div>

        {/* Status filter */}
        <FilterSelect
          value={filters.status}
          onChange={(v) => onFilterChange('status', v)}
          placeholder="All Statuses"
          options={STATUS_VALUES.map((s) => ({ value: s, label: s }))}
        />

        {/* Source filter */}
        <FilterSelect
          value={filters.source}
          onChange={(v) => onFilterChange('source', v)}
          placeholder="All Sources"
          options={SOURCE_VALUES.map((s) => ({ value: s, label: s }))}
        />

        {/* Sort */}
        <FilterSelect
          value={filters.sort}
          onChange={(v) => onFilterChange('sort', v)}
          placeholder=""
          options={[
            { value: 'latest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
          ]}
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {canExport && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </Button>
        )}
        <Button variant="primary" size="sm" onClick={onAdd}>
          <Plus size={14} />
          Add Lead
        </Button>
      </div>
    </div>
  );
}

/* ── Internal FilterSelect ─────────────────────────────────────── */
interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: FilterSelectProps): React.JSX.Element {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-9 rounded-lg text-sm font-display appearance-none',
          'bg-white dark:bg-obsidian-800',
          'border border-stone-200 dark:border-obsidian-600',
          'text-stone-900 dark:text-obsidian-100',
          'pl-3 pr-8',
          'transition-all duration-150',
          'focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
          'hover:border-stone-300 dark:hover:border-obsidian-500',
          'cursor-pointer',
        )}
      >
        {placeholder && (
          <option value="" className="dark:bg-obsidian-800 bg-white">
            {placeholder}
          </option>
        )}
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
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-obsidian-400 pointer-events-none"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
