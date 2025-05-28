import { useCallback, useEffect, useRef, useState } from 'react';

interface PollingOptions<T> {
  interval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryOnError?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  enabled?: boolean;
  immediate?: boolean;
  stopOnError?: boolean;
  stopCondition?: (data: T) => boolean;
  cache?: boolean;
  cacheTime?: number;
  headers?: HeadersInit;
  method?: string;
  body?: any;
  signal?: AbortSignal;
}

interface PollingReturn<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  start: () => void;
  stop: () => void;
  isPolling: boolean;
  lastUpdate: Date | null;
  pollCount: number;
  retry: () => void;
}

export function usePolling<T = any>(
  url: string | (() => string | Promise<string>),
  options: PollingOptions<T> = {}
): PollingReturn<T> {
  const {
    interval = 5000,
    onSuccess,
    onError,
    retryOnError = true,
    maxRetries = 3,
    retryDelay = 1000,
    enabled = true,
    immediate = true,
    stopOnError = false,
    stopCondition,
    cache = false,
    cacheTime = 60000,
    headers,
    method = 'GET',
    body,
    signal,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [pollCount, setPollCount] = useState(0);

  const pollingTimer = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);
  const cacheRef = useRef<{ data: T; timestamp: number } | null>(null);
  const abortController = useRef<AbortController>();
  const unmountedRef = useRef(false);

  const getUrl = useCallback(async () => {
    const urlValue = typeof url === 'function' ? await url() : url;
    return urlValue;
  }, [url]);

  const fetchData = useCallback(async () => {
    if (unmountedRef.current) return;

    if (cache && cacheRef.current) {
      const now = Date.now();
      if (now - cacheRef.current.timestamp < cacheTime) {
        setData(cacheRef.current.data);
        setLastUpdate(new Date(cacheRef.current.timestamp));
        return cacheRef.current.data;
      }
    }

    setLoading(true);
    setError(null);

    try {
      abortController.current = new AbortController();
      const fetchSignal = signal || abortController.current.signal;

      const fetchUrl = await getUrl();
      const response = await fetch(fetchUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: fetchSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (unmountedRef.current) return;

      setData(responseData);
      setLastUpdate(new Date());
      setPollCount((prev) => prev + 1);
      retryCount.current = 0;

      if (cache) {
        cacheRef.current = {
          data: responseData,
          timestamp: Date.now(),
        };
      }

      if (onSuccess) {
        onSuccess(responseData);
      }

      if (stopCondition && stopCondition(responseData)) {
        stop();
      }

      return responseData;
    } catch (err) {
      if (unmountedRef.current) return;
      
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      if (error.name !== 'AbortError') {
        setError(error);
        
        if (onError) {
          onError(error);
        }

        if (stopOnError) {
          stop();
        } else if (retryOnError && retryCount.current < maxRetries) {
          retryCount.current++;
          setTimeout(() => {
            if (!unmountedRef.current) {
              fetchData();
            }
          }, retryDelay * retryCount.current);
        }
      }
    } finally {
      if (!unmountedRef.current) {
        setLoading(false);
      }
    }
  }, [
    getUrl,
    method,
    headers,
    body,
    signal,
    cache,
    cacheTime,
    onSuccess,
    onError,
    stopCondition,
    stopOnError,
    retryOnError,
    maxRetries,
    retryDelay,
  ]);

  const start = useCallback(() => {
    if (unmountedRef.current || isPolling) return;

    setIsPolling(true);
    setPollCount(0);
    retryCount.current = 0;

    const poll = async () => {
      await fetchData();
      
      if (!unmountedRef.current && isPolling) {
        pollingTimer.current = setTimeout(poll, interval);
      }
    };

    if (immediate) {
      poll();
    } else {
      pollingTimer.current = setTimeout(poll, interval);
    }
  }, [fetchData, interval, immediate, isPolling]);

  const stop = useCallback(() => {
    setIsPolling(false);
    
    if (pollingTimer.current) {
      clearTimeout(pollingTimer.current);
    }
    
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const retry = useCallback(() => {
    retryCount.current = 0;
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    unmountedRef.current = false;

    if (enabled) {
      start();
    }

    return () => {
      unmountedRef.current = true;
      stop();
    };
  }, [enabled]);

  return {
    data,
    error,
    loading,
    start,
    stop,
    isPolling,
    lastUpdate,
    pollCount,
    retry,
  };
}