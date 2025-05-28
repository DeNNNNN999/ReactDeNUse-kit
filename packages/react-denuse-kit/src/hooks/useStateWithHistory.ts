import { useCallback, useRef, useState } from 'react';

interface StateWithHistoryOptions {
  maxHistorySize?: number;
  includePresent?: boolean;
}

interface StateWithHistoryReturn<T> {
  value: T;
  setValue: (newValue: T | ((prev: T) => T)) => void;
  history: T[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  goTo: (index: number) => void;
  clear: () => void;
  reset: (newValue?: T) => void;
}

export function useStateWithHistory<T>(
  initialValue: T,
  options: StateWithHistoryOptions = {}
): StateWithHistoryReturn<T> {
  const { maxHistorySize = 50, includePresent = true } = options;
  
  const [value, setValueInternal] = useState<T>(initialValue);
  const historyRef = useRef<T[]>([initialValue]);
  const historyIndexRef = useRef(0);
  const [, forceUpdate] = useState({});

  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    const resolvedValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(value) 
      : newValue;
    
    if (Object.is(resolvedValue, value)) return;
    
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(resolvedValue);
    
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    } else {
      historyIndexRef.current++;
    }
    
    historyRef.current = newHistory;
    setValueInternal(resolvedValue);
    forceUpdate({});
  }, [value, maxHistorySize]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const newValue = historyRef.current[historyIndexRef.current];
      setValueInternal(newValue);
      forceUpdate({});
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const newValue = historyRef.current[historyIndexRef.current];
      setValueInternal(newValue);
      forceUpdate({});
    }
  }, []);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < historyRef.current.length) {
      historyIndexRef.current = index;
      const newValue = historyRef.current[index];
      setValueInternal(newValue);
      forceUpdate({});
    }
  }, []);

  const clear = useCallback(() => {
    historyRef.current = [value];
    historyIndexRef.current = 0;
    forceUpdate({});
  }, [value]);

  const reset = useCallback((newValue?: T) => {
    const resetValue = newValue !== undefined ? newValue : initialValue;
    historyRef.current = [resetValue];
    historyIndexRef.current = 0;
    setValueInternal(resetValue);
    forceUpdate({});
  }, [initialValue]);

  const history = includePresent 
    ? historyRef.current 
    : historyRef.current.slice(0, -1);

  return {
    value,
    setValue,
    history,
    historyIndex: historyIndexRef.current,
    canUndo: historyIndexRef.current > 0,
    canRedo: historyIndexRef.current < historyRef.current.length - 1,
    undo,
    redo,
    goTo,
    clear,
    reset,
  };
}