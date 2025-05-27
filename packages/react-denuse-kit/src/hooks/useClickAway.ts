import { useEffect, useRef, MutableRefObject } from 'react';

/**
 * Alternative implementation of click outside detection
 * @param onClickAway - callback when clicked away
 * @returns ref to attach to element
 */
export function useClickAway<T extends HTMLElement = HTMLElement>(
  onClickAway: (event: MouseEvent | TouchEvent) => void
): MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway(event);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [onClickAway]);

  return ref;
}
