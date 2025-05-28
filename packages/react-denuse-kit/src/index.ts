// ReactDeNUse-KIT - Professional React Hooks Library
// Created by Senior Full-Stack JS/TS Developer with 15 years of experience

// Performance Hooks
export { useVirtualList } from './hooks/useVirtualList';
export { useDeepMemo, useDeepCompareMemoize } from './hooks/useDeepMemo';

// State Management Hooks
export { useStateWithHistory } from './hooks/useStateWithHistory';
export { useUndo } from './hooks/useUndo';
export { useReducerWithMiddleware, loggerMiddleware, thunkMiddleware, devtoolsMiddleware, createAsyncMiddleware } from './hooks/useReducerWithMiddleware';

// Network & Async Hooks
export { useWebSocket } from './hooks/useWebSocket';
export { useSSE } from './hooks/useSSE';
export { usePolling } from './hooks/usePolling';
export { useAsync } from './hooks/useAsync';
export { useFetch } from './hooks/useFetch';

// DOM & UI Hooks
export { useMeasure } from './hooks/useMeasure';
export { useScrollLock } from './hooks/useScrollLock';
export { useClickAway } from './hooks/useClickAway';
export { useOnClickOutside } from './hooks/useOnClickOutside';
export { useHover } from './hooks/useHover';
export { useIntersectionObserver } from './hooks/useIntersectionObserver';
export { useWindowSize } from './hooks/useWindowSize';
export { useMediaQuery } from './hooks/useMediaQuery';
export { useEventListener } from './hooks/useEventListener';

// Utility Hooks
export { useDebounce } from './hooks/useDebounce';
export { useThrottle } from './hooks/useThrottle';
export { useToggle } from './hooks/useToggle';
export { useCounter } from './hooks/useCounter';
export { useTimeout } from './hooks/useTimeout';
export { useInterval } from './hooks/useInterval';
export { useLocalStorage } from './hooks/useLocalStorage';
export { usePrevious } from './hooks/usePrevious';
export { useKeyPress } from './hooks/useKeyPress';
export { useUpdateEffect } from './hooks/useUpdateEffect';
export { useIsFirstRender } from './hooks/useIsFirstRender';

// Export types
export type {
  StorageValue,
  StorageSetValue,
  AsyncState,
  FetchOptions,
  IntersectionObserverOptions,
  UseCounterReturn,
  UseFetchReturn,
  UseAsyncReturn,
} from './types';
