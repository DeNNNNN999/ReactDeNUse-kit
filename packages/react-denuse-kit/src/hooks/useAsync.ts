import { useState, useCallback, useEffect } from 'react';
import type { UseAsyncReturn, AsyncState } from '../types';

/**
 * Handles async operations with loading, error, and data states
 * @param asyncFunction - async function to execute
 * @param immediate - execute immediately
 * @returns { execute, loading, error, data }
 */
export function useAsync<T = any>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    loading: immediate,
    error: null,
    data: null,
  });

  const execute = useCallback(async () => {
    setState({ loading: true, error: null, data: null });

    try {
      const data = await asyncFunction();
      setState({ loading: false, error: null, data });
    } catch (error) {
      setState({ loading: false, error: error as Error, data: null });
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, ...state };
}
