import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface VirtualListOptions<T> {
  itemHeight: number | ((index: number, item: T) => number);
  overscan?: number;
  estimatedItemHeight?: number;
  getItemKey?: (index: number, item: T) => string | number;
  onScroll?: (scrollTop: number) => void;
  scrollThreshold?: number;
  onEndReached?: () => void;
}

interface VirtualListReturn<T> {
  virtualItems: VirtualItem<T>[];
  totalHeight: number;
  scrollToIndex: (index: number, options?: ScrollToOptions) => void;
  containerProps: {
    onScroll: (e: React.UIEvent<HTMLElement>) => void;
    style: React.CSSProperties;
  };
  wrapperProps: {
    style: React.CSSProperties;
  };
  isScrolling: boolean;
}

interface VirtualItem<T> {
  index: number;
  item: T;
  key: string | number;
  style: React.CSSProperties;
  isVisible: boolean;
}

interface ScrollToOptions {
  behavior?: 'auto' | 'smooth';
  align?: 'start' | 'center' | 'end';
}

export function useVirtualList<T>(
  items: T[],
  containerHeight: number,
  options: VirtualListOptions<T>
): VirtualListReturn<T> {
  const {
    itemHeight,
    overscan = 3,
    estimatedItemHeight = 50,
    getItemKey,
    onScroll,
    scrollThreshold = 0.9,
    onEndReached,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLElement>();
  const heightCacheRef = useRef(new Map<number, number>());
  const lastEndReachedRef = useRef(false);

  const getItemHeight = useCallback(
    (index: number): number => {
      if (typeof itemHeight === 'function') {
        const cached = heightCacheRef.current.get(index);
        if (cached !== undefined) return cached;
        
        const height = itemHeight(index, items[index]);
        heightCacheRef.current.set(index, height);
        return height;
      }
      return itemHeight;
    },
    [itemHeight, items]
  );

  const { startIndex, endIndex, virtualItems, totalHeight } = useMemo(() => {
    let accumulatedHeight = 0;
    let startIdx = 0;
    let endIdx = items.length - 1;

    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i);
      
      if (accumulatedHeight + height < scrollTop - overscan * estimatedItemHeight) {
        startIdx = i + 1;
        accumulatedHeight += height;
      } else {
        break;
      }
    }

    accumulatedHeight = 0;
    for (let i = startIdx; i < items.length; i++) {
      if (accumulatedHeight > containerHeight + overscan * estimatedItemHeight) {
        endIdx = i - 1;
        break;
      }
      accumulatedHeight += getItemHeight(i);
    }

    let totalH = 0;
    for (let i = 0; i < items.length; i++) {
      totalH += getItemHeight(i);
    }

    const vItems: VirtualItem<T>[] = [];
    let itemTop = 0;

    for (let i = 0; i < startIdx; i++) {
      itemTop += getItemHeight(i);
    }

    for (let i = startIdx; i <= endIdx && i < items.length; i++) {
      const height = getItemHeight(i);
      const isVisible = itemTop + height > scrollTop && itemTop < scrollTop + containerHeight;
      
      vItems.push({
        index: i,
        item: items[i],
        key: getItemKey ? getItemKey(i, items[i]) : i,
        style: {
          position: 'absolute',
          top: `${itemTop}px`,
          left: 0,
          width: '100%',
          height: `${height}px`,
        },
        isVisible,
      });
      
      itemTop += height;
    }

    return {
      startIndex: startIdx,
      endIndex: endIdx,
      virtualItems: vItems,
      totalHeight: totalH,
    };
  }, [scrollTop, containerHeight, items, getItemHeight, overscan, estimatedItemHeight, getItemKey]);

  useEffect(() => {
    const scrollProgress = scrollTop / (totalHeight - containerHeight);
    
    if (scrollProgress >= scrollThreshold && !lastEndReachedRef.current && onEndReached) {
      lastEndReachedRef.current = true;
      onEndReached();
    } else if (scrollProgress < scrollThreshold) {
      lastEndReachedRef.current = false;
    }
  }, [scrollTop, totalHeight, containerHeight, scrollThreshold, onEndReached]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const target = e.currentTarget;
      containerRef.current = target;
      
      const newScrollTop = target.scrollTop;
      setScrollTop(newScrollTop);
      setIsScrolling(true);
      
      if (onScroll) {
        onScroll(newScrollTop);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    },
    [onScroll]
  );

  const scrollToIndex = useCallback(
    (index: number, options: ScrollToOptions = {}) => {
      const { behavior = 'auto', align = 'start' } = options;
      
      if (!containerRef.current || index < 0 || index >= items.length) return;

      let targetTop = 0;
      for (let i = 0; i < index; i++) {
        targetTop += getItemHeight(i);
      }

      const itemH = getItemHeight(index);
      
      switch (align) {
        case 'center':
          targetTop = targetTop - containerHeight / 2 + itemH / 2;
          break;
        case 'end':
          targetTop = targetTop - containerHeight + itemH;
          break;
      }

      targetTop = Math.max(0, Math.min(targetTop, totalHeight - containerHeight));
      
      containerRef.current.scrollTo({
        top: targetTop,
        behavior,
      });
    },
    [items.length, getItemHeight, containerHeight, totalHeight]
  );

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
    containerProps: {
      onScroll: handleScroll,
      style: {
        overflow: 'auto',
        position: 'relative' as const,
        height: `${containerHeight}px`,
      },
    },
    wrapperProps: {
      style: {
        position: 'relative' as const,
        height: `${totalHeight}px`,
        width: '100%',
      },
    },
    isScrolling,
  };
}