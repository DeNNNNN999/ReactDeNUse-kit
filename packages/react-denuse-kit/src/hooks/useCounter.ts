import { useState, useCallback } from 'react';
import type { UseCounterReturn } from '../types';

/**
 * Counter with increment, decrement, reset, and set functions
 * @param initialValue - initial counter value
 * @returns { count, increment, decrement, reset, set }
 */
export function useCounter(initialValue: number = 0): UseCounterReturn {
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback(() => setCount(x => x + 1), []);
  const decrement = useCallback(() => setCount(x => x - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const set = useCallback((value: number) => setCount(value), []);

  return { count, increment, decrement, reset, set };
}
