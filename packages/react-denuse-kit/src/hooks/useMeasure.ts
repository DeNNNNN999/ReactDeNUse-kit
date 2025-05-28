import { useCallback, useEffect, useRef, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  x: number;
  y: number;
}

interface UseMeasureOptions {
  debounce?: number;
  scroll?: boolean;
  resize?: boolean;
  offsetSize?: boolean;
}

type UseMeasureReturn<T extends HTMLElement> = [
  (node: T | null) => void,
  Dimensions,
  T | null
];

const defaultDimensions: Dimensions = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
};

export function useMeasure<T extends HTMLElement = HTMLElement>(
  options: UseMeasureOptions = {}
): UseMeasureReturn<T> {
  const {
    debounce = 0,
    scroll = true,
    resize = true,
    offsetSize = false,
  } = options;

  const [dimensions, setDimensions] = useState<Dimensions>(defaultDimensions);
  const [node, setNode] = useState<T | null>(null);
  
  const observerRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const measure = useCallback(() => {
    if (!node) return;

    const rect = node.getBoundingClientRect();
    
    const newDimensions: Dimensions = {
      width: offsetSize ? node.offsetWidth : rect.width,
      height: offsetSize ? node.offsetHeight : rect.height,
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      x: rect.x,
      y: rect.y,
    };

    setDimensions(prevDimensions => {
      if (
        prevDimensions.width !== newDimensions.width ||
        prevDimensions.height !== newDimensions.height ||
        prevDimensions.top !== newDimensions.top ||
        prevDimensions.left !== newDimensions.left ||
        prevDimensions.bottom !== newDimensions.bottom ||
        prevDimensions.right !== newDimensions.right ||
        prevDimensions.x !== newDimensions.x ||
        prevDimensions.y !== newDimensions.y
      ) {
        return newDimensions;
      }
      return prevDimensions;
    });
  }, [node, offsetSize]);

  const measureWithDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (debounce > 0) {
      timeoutRef.current = setTimeout(() => {
        measure();
      }, debounce);
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        measure();
      });
    }
  }, [measure, debounce]);

  const ref = useCallback((newNode: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNode(newNode);

    if (!newNode) {
      setDimensions(defaultDimensions);
      return;
    }

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      observerRef.current = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          measureWithDebounce();
        }
      });
      observerRef.current.observe(newNode);
    }
  }, [measure, measureWithDebounce]);

  useEffect(() => {
    if (!node) return;

    const handleScroll = scroll ? measureWithDebounce : undefined;
    const handleResize = resize ? measureWithDebounce : undefined;

    if (handleScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      if (node.parentElement) {
        node.parentElement.addEventListener('scroll', handleScroll, { passive: true });
      }
    }

    if (handleResize) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (handleScroll) {
        window.removeEventListener('scroll', handleScroll);
        if (node.parentElement) {
          node.parentElement.removeEventListener('scroll', handleScroll);
        }
      }

      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [node, scroll, resize, measureWithDebounce]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [ref, dimensions, node];
}