import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface LeadFilterState {
  search: string;
  status: string;
  source: string;
  sort: 'latest' | 'oldest';
  page: number;
}

export interface UseFiltersReturn extends LeadFilterState {
  setFilter: (key: string, value: string) => void;
  setPage: (page: number) => void;
}

/**
 * Reads and writes lead filter state from/to URL search params so that
 * page refresh preserves the view and links are shareable.
 */
export function useFilters(): UseFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const source = searchParams.get('source') ?? '';
  const rawSort = searchParams.get('sort') ?? 'latest';
  const sort: 'latest' | 'oldest' = rawSort === 'oldest' ? 'oldest' : 'latest';
  const rawPage = parseInt(searchParams.get('page') ?? '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const setFilter = useCallback(
    (key: string, value: string): void => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        // Reset to page 1 whenever a filter changes
        next.delete('page');
        return next;
      });
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (newPage: number): void => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (newPage === 1) {
          next.delete('page');
        } else {
          next.set('page', String(newPage));
        }
        return next;
      });
    },
    [setSearchParams],
  );

  return { search, status, source, sort, page, setFilter, setPage };
}
