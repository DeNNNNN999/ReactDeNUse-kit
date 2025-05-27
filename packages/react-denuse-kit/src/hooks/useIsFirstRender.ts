import { useRef } from 'react';

/**
 * Detects if it's the first render
 * @returns boolean indicating if it's the first render
 */
export function useIsFirstRender(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return isFirst.current;
}
