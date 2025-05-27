import { useEffect, DependencyList } from 'react';
import { useIsFirstRender } from './useIsFirstRender';

/**
 * useEffect that skips the first render
 * @param effect - effect function
 * @param deps - dependencies
 */
export function useUpdateEffect(effect: () => void | (() => void), deps?: DependencyList): void {
  const isFirst = useIsFirstRender();

  useEffect(() => {
    if (!isFirst) {
      return effect();
    }
  }, deps);
}
