import { useEffect, useRef, RefObject } from 'react';

/**
 * Adds event listener to element
 * @param eventName - event name
 * @param handler - event handler
 * @param element - target element (default: window)
 * @param options - event listener options
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: RefObject<HTMLElement> | null,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef<(event: WindowEventMap[K]) => void>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement: HTMLElement | Window = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    const eventListener = (event: Event) => savedHandler.current?.(event as WindowEventMap[K]);

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}
