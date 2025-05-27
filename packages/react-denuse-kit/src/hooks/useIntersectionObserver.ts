import { useState, useEffect, RefObject } from 'react';
import type { IntersectionObserverOptions } from '../types';

/**
 * Observes element intersection with viewport
 * @param ref - element ref
 * @param options - IntersectionObserver options
 * @returns IntersectionObserverEntry | undefined
 */
export function useIntersectionObserver(
  ref: RefObject<Element>,
  options?: IntersectionObserverOptions
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      options
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options?.threshold, options?.root, options?.rootMargin]);

  return entry;
}
