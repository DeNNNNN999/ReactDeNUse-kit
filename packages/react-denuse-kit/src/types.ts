import { Dispatch, SetStateAction } from 'react';

export type StorageValue<T> = T | null;
export type StorageSetValue<T> = Dispatch<SetStateAction<StorageValue<T>>>;

export interface AsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export interface FetchOptions extends RequestInit {
  immediate?: boolean;
}

export interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
}

export interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseAsyncReturn<T> {
  execute: () => Promise<void>;
  loading: boolean;
  error: Error | null;
  data: T | null;
}
