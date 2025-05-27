import { useEffect, useRef } from 'react';

/**
 * Sets a timeout
 * @param callback - function to call
 * @param delay - delay in milliseconds (null to cancel)
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => savedCallback.current?.(), delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
}
