import { useState, useCallback, useEffect, useRef } from 'react';
import type { UseFetchReturn, AsyncState, FetchOptions } from '../types';

/**
 * Fetches data from URL
 * @param url - URL to fetch
 * @param options - fetch options
 * @returns { data, loading, error, refetch }
 */
export function useFetch<T = any>(
  url: string,
  options?: FetchOptions
): UseFetchReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: options?.immediate !== false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setState({ data: null, loading: false, error: error as Error });
      }
    }
  }, [url, options]);

  useEffect(() => {
    if (options?.immediate !== false) {
      fetchData();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData, options?.immediate]);

  return { ...state, refetch: fetchData };
}
