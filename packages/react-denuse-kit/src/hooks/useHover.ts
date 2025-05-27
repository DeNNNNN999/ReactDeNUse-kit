import { useState, useCallback, useEffect, useRef, MutableRefObject } from 'react';

/**
 * Tracks hover state of an element
 * @returns [ref, isHovering]
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
  MutableRefObject<T | null>,
  boolean
] {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const ref = useRef<T | null>(null);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseEnter, handleMouseLeave]);

  return [ref, isHovering];
}
