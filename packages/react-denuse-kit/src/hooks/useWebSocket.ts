import { useCallback, useEffect, useRef, useState } from 'react';

interface WebSocketOptions {
  reconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  manual?: boolean;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onReconnectStop?: () => void;
  shouldReconnect?: (event: CloseEvent) => boolean;
  protocols?: string | string[];
  retryOnError?: boolean;
  filter?: (message: MessageEvent) => boolean;
  heartbeat?: {
    message?: string | (() => string);
    interval?: number;
    pongTimeout?: number;
    responseMessage?: string;
  };
}

type ReadyState = 0 | 1 | 2 | 3;

interface WebSocketReturn<T> {
  sendMessage: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  sendJsonMessage: (message: T) => void;
  lastMessage: MessageEvent | null;
  lastJsonMessage: T | null;
  readyState: ReadyState;
  connect: () => void;
  disconnect: (code?: number, reason?: string) => void;
  messageHistory: MessageEvent[];
  reconnectCount: number;
}

export function useWebSocket<T = any>(
  url: string | (() => string),
  options: WebSocketOptions = {}
): WebSocketReturn<T> {
  const {
    reconnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 1000,
    manual = false,
    onOpen,
    onClose,
    onMessage,
    onError,
    onReconnectStop,
    shouldReconnect,
    protocols,
    retryOnError = false,
    filter,
    heartbeat,
  } = options;

  const [readyState, setReadyState] = useState<ReadyState>(3);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [lastJsonMessage, setLastJsonMessage] = useState<T | null>(null);
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);
  const [reconnectCount, setReconnectCount] = useState(0);

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout>();
  const heartbeatTimer = useRef<NodeJS.Timeout>();
  const pongTimer = useRef<NodeJS.Timeout>();
  const reconnectCountRef = useRef(0);
  const unmountedRef = useRef(false);

  const getUrl = useCallback(() => {
    return typeof url === 'function' ? url() : url;
  }, [url]);

  const startHeartbeat = useCallback(() => {
    if (!heartbeat || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const { message = 'ping', interval = 30000, pongTimeout = 10000 } = heartbeat;

    const sendPing = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const pingMessage = typeof message === 'function' ? message() : message;
        ws.current.send(pingMessage);

        if (pongTimer.current) {
          clearTimeout(pongTimer.current);
        }

        pongTimer.current = setTimeout(() => {
          if (ws.current) {
            ws.current.close();
          }
        }, pongTimeout);
      }
    };

    sendPing();
    heartbeatTimer.current = setInterval(sendPing, interval);
  }, [heartbeat]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
    }
    if (pongTimer.current) {
      clearTimeout(pongTimer.current);
    }
  }, []);

  const connect = useCallback(() => {
    if (unmountedRef.current) return;

    try {
      const wsUrl = getUrl();
      ws.current = protocols ? new WebSocket(wsUrl, protocols) : new WebSocket(wsUrl);

      ws.current.onopen = (event) => {
        if (unmountedRef.current) return;
        
        setReadyState(ws.current!.readyState);
        reconnectCountRef.current = 0;
        setReconnectCount(0);
        
        if (onOpen) {
          onOpen(event);
        }

        startHeartbeat();
      };

      ws.current.onclose = (event) => {
        if (unmountedRef.current) return;
        
        setReadyState(ws.current!.readyState);
        stopHeartbeat();
        
        if (onClose) {
          onClose(event);
        }

        if (reconnect && reconnectCountRef.current < reconnectAttempts) {
          const shouldReconnectNow = shouldReconnect ? shouldReconnect(event) : true;
          
          if (shouldReconnectNow) {
            reconnectTimer.current = setTimeout(() => {
              reconnectCountRef.current++;
              setReconnectCount(reconnectCountRef.current);
              connect();
            }, reconnectInterval * Math.pow(2, reconnectCountRef.current));
          }
        } else if (reconnectCountRef.current >= reconnectAttempts && onReconnectStop) {
          onReconnectStop();
        }
      };

      ws.current.onerror = (event) => {
        if (unmountedRef.current) return;
        
        if (onError) {
          onError(event);
        }

        if (retryOnError && reconnectCountRef.current < reconnectAttempts) {
          reconnectTimer.current = setTimeout(() => {
            reconnectCountRef.current++;
            setReconnectCount(reconnectCountRef.current);
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onmessage = (event) => {
        if (unmountedRef.current) return;

        if (heartbeat?.responseMessage && event.data === heartbeat.responseMessage) {
          if (pongTimer.current) {
            clearTimeout(pongTimer.current);
          }
          return;
        }

        if (filter && !filter(event)) {
          return;
        }

        setLastMessage(event);
        setMessageHistory((prev) => [...prev, event]);

        try {
          const jsonData = JSON.parse(event.data);
          setLastJsonMessage(jsonData);
        } catch {
          // Not JSON data
        }

        if (onMessage) {
          onMessage(event);
        }
      };

      setReadyState(ws.current.readyState);
    } catch (error) {
      if (onError) {
        onError(new Event('WebSocket connection error'));
      }
    }
  }, [
    getUrl,
    protocols,
    reconnect,
    reconnectAttempts,
    reconnectInterval,
    onOpen,
    onClose,
    onError,
    onMessage,
    onReconnectStop,
    shouldReconnect,
    retryOnError,
    filter,
    startHeartbeat,
    stopHeartbeat,
    heartbeat,
  ]);

  const disconnect = useCallback((code = 1000, reason = 'Client disconnect') => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }

    stopHeartbeat();

    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      ws.current.close(code, reason);
    }
  }, [stopHeartbeat]);

  const sendMessage = useCallback((message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.warn('WebSocket is not open. Unable to send message.');
    }
  }, []);

  const sendJsonMessage = useCallback((message: T) => {
    sendMessage(JSON.stringify(message));
  }, [sendMessage]);

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

  useEffect(() => {
    if (ws.current) {
      setReadyState(ws.current.readyState);
    }
  });

  return {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    connect,
    disconnect,
    messageHistory,
    reconnectCount,
  };
}