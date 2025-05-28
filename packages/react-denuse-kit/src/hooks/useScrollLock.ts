import { useCallback, useEffect, useRef } from 'react';

interface ScrollLockOptions {
  autoLock?: boolean;
  lockTarget?: HTMLElement | (() => HTMLElement | null);
  preserveScrollBarGap?: boolean;
}

interface ScrollLockReturn {
  lock: () => void;
  unlock: () => void;
  toggle: () => void;
  isLocked: boolean;
}

const IS_SERVER = typeof window === 'undefined';

export function useScrollLock(options: ScrollLockOptions = {}): ScrollLockReturn {
  const {
    autoLock = false,
    lockTarget,
    preserveScrollBarGap = true,
  } = options;

  const scrollBarWidth = useRef<number>(0);
  const targetElement = useRef<HTMLElement | null>(null);
  const originalStyles = useRef<{
    overflow?: string;
    paddingRight?: string;
  }>({});
  const isLockedRef = useRef(false);

  const getScrollBarWidth = useCallback(() => {
    if (IS_SERVER) return 0;
    
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
  }, []);

  const getTargetElement = useCallback((): HTMLElement => {
    if (lockTarget) {
      if (typeof lockTarget === 'function') {
        return lockTarget() || document.body;
      }
      return lockTarget;
    }
    return document.body;
  }, [lockTarget]);

  const lock = useCallback(() => {
    if (IS_SERVER || isLockedRef.current) return;

    const target = getTargetElement();
    targetElement.current = target;

    const hasScrollbar = target === document.body 
      ? window.innerWidth > document.documentElement.clientWidth
      : target.scrollHeight > target.clientHeight;

    originalStyles.current = {
      overflow: target.style.overflow,
      paddingRight: target.style.paddingRight,
    };

    target.style.overflow = 'hidden';

    if (preserveScrollBarGap && hasScrollbar) {
      if (scrollBarWidth.current === 0) {
        scrollBarWidth.current = getScrollBarWidth();
      }

      const currentPaddingRight = parseInt(
        window.getComputedStyle(target).paddingRight || '0',
        10
      );

      target.style.paddingRight = `${currentPaddingRight + scrollBarWidth.current}px`;
    }

    isLockedRef.current = true;

    if (target === document.body) {
      document.documentElement.style.overflow = 'hidden';
    }
  }, [getTargetElement, preserveScrollBarGap, getScrollBarWidth]);

  const unlock = useCallback(() => {
    if (IS_SERVER || !isLockedRef.current || !targetElement.current) return;

    const target = targetElement.current;

    if (originalStyles.current.overflow !== undefined) {
      target.style.overflow = originalStyles.current.overflow;
    }

    if (originalStyles.current.paddingRight !== undefined) {
      target.style.paddingRight = originalStyles.current.paddingRight;
    }

    if (target === document.body) {
      document.documentElement.style.overflow = '';
    }

    isLockedRef.current = false;
    originalStyles.current = {};
  }, []);

  const toggle = useCallback(() => {
    if (isLockedRef.current) {
      unlock();
    } else {
      lock();
    }
  }, [lock, unlock]);

  useEffect(() => {
    if (autoLock) {
      lock();
    }

    return () => {
      unlock();
    };
  }, [autoLock]);

  return {
    lock,
    unlock,
    toggle,
    isLocked: isLockedRef.current,
  };
}