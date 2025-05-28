import { useCallback, useEffect, useRef, useState } from 'react';

interface SSEOptions {
  withCredentials?: boolean;
  events?: string[];
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  onOpen?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  manual?: boolean;
  eventSourceOptions?: EventSourceInit;
}

interface SSEReturn<T> {
  data: T | null;
  error: Event | null;
  readyState: number;
  connect: () => void;
  disconnect: () => void;
  eventHistory: Array<{ event: string; data: T; timestamp: number }>;
}

export function useSSE<T = any>(
  url: string | (() => string),
  options: SSEOptions = {}
): SSEReturn<T> {
  const {
    withCredentials = false,
    events = [],
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    onOpen,
    onError,
    onMessage,
    manual = false,
    eventSourceOptions,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const [readyState, setReadyState] = useState<number>(EventSource.CLOSED);
  const [eventHistory, setEventHistory] = useState<Array<{ event: string; data: T; timestamp: number }>>([]);

  const eventSource = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout>();
  const reconnectCount = useRef(0);
  const unmountedRef = useRef(false);

  const getUrl = useCallback(() => {
    return typeof url === 'function' ? url() : url;
  }, [url]);

  const connect = useCallback(() => {
    if (unmountedRef.current || eventSource.current) return;

    try {
      const sseUrl = getUrl();
      const options: EventSourceInit = {
        withCredentials,
        ...eventSourceOptions,
      };

      eventSource.current = new EventSource(sseUrl, options);
      setReadyState(eventSource.current.readyState);

      eventSource.current.onopen = () => {
        if (unmountedRef.current) return;
        
        setReadyState(EventSource.OPEN);
        setError(null);
        reconnectCount.current = 0;
        
        if (onOpen) {
          onOpen();
        }
      };

      eventSource.current.onerror = (event) => {
        if (unmountedRef.current) return;
        
        setError(event);
        setReadyState(eventSource.current!.readyState);
        
        if (onError) {
          onError(event);
        }

        if (eventSource.current?.readyState === EventSource.CLOSED) {
          eventSource.current = null;
          
          if (reconnect && reconnectCount.current < reconnectAttempts) {
            reconnectTimer.current = setTimeout(() => {
              reconnectCount.current++;
              connect();
            }, reconnectInterval * Math.pow(1.5, reconnectCount.current));
          }
        }
      };

      eventSource.current.onmessage = (event) => {
        if (unmountedRef.current) return;
        
        try {
          const parsedData = JSON.parse(event.data) as T;
          setData(parsedData);
          setEventHistory((prev) => [...prev, {
            event: 'message',
            data: parsedData,
            timestamp: Date.now(),
          }]);
        } catch {
          setData(event.data as T);
          setEventHistory((prev) => [...prev, {
            event: 'message',
            data: event.data as T,
            timestamp: Date.now(),
          }]);
        }
        
        if (onMessage) {
          onMessage(event);
        }
      };

      events.forEach((eventName) => {
        if (eventSource.current) {
          eventSource.current.addEventListener(eventName, (event: MessageEvent) => {
            if (unmountedRef.current) return;
            
            try {
              const parsedData = JSON.parse(event.data) as T;
              setData(parsedData);
              setEventHistory((prev) => [...prev, {
                event: eventName,
                data: parsedData,
                timestamp: Date.now(),
              }]);
            } catch {
              setData(event.data as T);
              setEventHistory((prev) => [...prev, {
                event: eventName,
                data: event.data as T,
                timestamp: Date.now(),
              }]);
            }
          });
        }
      });
    } catch (err) {
      setError(new Event('Failed to create EventSource'));
      if (onError) {
        onError(new Event('Failed to create EventSource'));
      }
    }
  }, [
    getUrl,
    withCredentials,
    eventSourceOptions,
    events,
    reconnect,
    reconnectAttempts,
    reconnectInterval,
    onOpen,
    onError,
    onMessage,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }

    if (eventSource.current) {
      eventSource.current.close();
      eventSource.current = null;
      setReadyState(EventSource.CLOSED);
    }
  }, []);

  useEffect(() => {
    unmountedRef.current = false;

    if (!manual) {
      connect();
    }

    return () => {
      unmountedRef.current = true;
      disconnect();
    };
  }, [url]);

  return {
    data,
    error,
    readyState,
    connect,
    disconnect,
    eventHistory,
  };
}