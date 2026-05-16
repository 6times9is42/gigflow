import { useState, useEffect, useCallback, useRef } from 'react';
import { getLeadsApi } from '@/api/leads.api';
import { extractApiError } from '@/api/client';
import type { Lead, PaginationMeta } from '@/types/api';
import type { LeadsQuery } from '@/api/leads.api';

export interface UseLeadsResult {
  data: Lead[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLeads(params: LeadsQuery): UseLeadsResult {
  const [data, setData] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Stable string representation to avoid object identity issues in deps
  const paramsKey = JSON.stringify(params);

  const fetch = useCallback((): void => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    const parsedParams = JSON.parse(paramsKey) as LeadsQuery;

    getLeadsApi(parsedParams)
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result.data);
          setPagination(result.pagination);
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(extractApiError(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
    return (): void => {
      abortRef.current?.abort();
    };
  }, [fetch]);

  return { data, pagination, isLoading, error, refetch: fetch };
}
