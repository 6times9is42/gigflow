import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types/api';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps): React.JSX.Element {
  const { page, limit, total, totalPages, hasNext, hasPrev } = pagination;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Build page numbers to display (show max 7, with ellipsis)
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
      {/* Count info */}
      <p className="text-xs text-stone-400 dark:text-obsidian-500 font-mono-data">
        {total === 0 ? (
          'No results'
        ) : (
          <>
            Showing{' '}
            <span className="text-stone-600 dark:text-obsidian-300 font-semibold">{startItem}</span>
            {' – '}
            <span className="text-stone-600 dark:text-obsidian-300 font-semibold">{endItem}</span>
            {' of '}
            <span className="text-stone-600 dark:text-obsidian-300 font-semibold">{total}</span>
            {' leads'}
          </>
        )}
      </p>

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous */}
          <PageButton
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrev}
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </PageButton>

          {/* Page numbers */}
          {pageNumbers.map((item, i) =>
            item === '...' ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 h-8 flex items-center justify-center text-xs text-stone-400 dark:text-obsidian-500 font-mono-data"
              >
                …
              </span>
            ) : (
              <PageButton
                key={item}
                onClick={() => onPageChange(item as number)}
                active={item === page}
                aria-label={`Page ${item as number}`}
              >
                {item as number}
              </PageButton>
            ),
          )}

          {/* Next */}
          <PageButton
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext}
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </PageButton>
        </div>
      )}
    </div>
  );
}

/* ── Internal helpers ──────────────────────────────────────────── */
interface PageButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  'aria-label': string;
}

function PageButton({
  onClick,
  disabled = false,
  active = false,
  children,
  'aria-label': ariaLabel,
}: PageButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'min-w-8 h-8 px-2 flex items-center justify-center rounded-lg',
        'text-xs font-medium font-mono-data',
        'transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
        'disabled:pointer-events-none disabled:opacity-40',
        active
          ? 'bg-amber-500 text-obsidian-900 font-semibold shadow-sm'
          : 'text-stone-600 dark:text-obsidian-300 hover:bg-stone-100 dark:hover:bg-obsidian-700 hover:text-stone-900 dark:hover:text-obsidian-100',
      )}
    >
      {children}
    </button>
  );
}

function buildPageNumbers(current: number, total: number): Array<number | '...'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | '...'> = [];

  if (current <= 4) {
    // Near start
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  } else if (current >= total - 3) {
    // Near end
    pages.push(1);
    pages.push('...');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    // Middle
    pages.push(1);
    pages.push('...');
    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);
    pages.push('...');
    pages.push(total);
  }

  return pages;
}
