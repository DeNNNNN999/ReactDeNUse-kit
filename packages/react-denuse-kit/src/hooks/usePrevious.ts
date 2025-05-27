import { useRef, useEffect } from 'react';

/**
 * Returns the previous value of a variable
 * @param value - current value
 * @returns previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
