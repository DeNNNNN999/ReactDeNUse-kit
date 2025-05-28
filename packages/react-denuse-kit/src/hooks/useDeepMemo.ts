import { useRef, useMemo } from 'react';

type DependencyList = ReadonlyArray<unknown>;

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }
  
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  
  if (a.constructor !== b.constructor) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    
    return true;
  }
  
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    
    for (const [key, value] of a) {
      if (!b.has(key) || !deepEqual(value, b.get(key))) {
        return false;
      }
    }
    
    return true;
  }
  
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    
    const aArray = Array.from(a);
    const bArray = Array.from(b);
    
    return aArray.every(item => bArray.some(bItem => deepEqual(item, bItem)));
  }
  
  const keys = Object.keys(a as object);
  
  if (keys.length !== Object.keys(b as object).length) {
    return false;
  }
  
  for (const key of keys) {
    if (!deepEqual((a as any)[key], (b as any)[key])) {
      return false;
    }
  }
  
  return true;
}

export function useDeepMemo<T>(
  factory: () => T,
  deps: DependencyList
): T {
  const ref = useRef<{ deps: DependencyList; value: T }>();
  
  const value = useMemo(() => {
    if (!ref.current || !deepEqual(deps, ref.current.deps)) {
      ref.current = {
        deps,
        value: factory(),
      };
    }
    
    return ref.current.value;
  }, [factory, ...deps]);
  
  return value;
}

export function useDeepCompareMemoize<T>(value: T): T {
  const ref = useRef<T>(value);
  
  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }
  
  return ref.current;
}