# All Hooks

ReactDeNUse Kit provides 30+ production-ready hooks organized by category.

## 🚀 Performance Hooks

### [useVirtualList](/hooks/useVirtualList)
Efficiently render large lists with virtualization. Perfect for tables, feeds, and infinite scroll.
```tsx
const { virtualItems, containerProps } = useVirtualList(items, height, options)
```

### [useDeepMemo](/hooks/useDeepMemo)
Memoization with deep equality checks for complex objects.
```tsx
const memoizedValue = useDeepMemo(() => expensiveComputation(data), [data])
```

## 📊 State Management

### [useStateWithHistory](/hooks/useStateWithHistory)
State management with complete history tracking and time-travel debugging.
```tsx
const { value, setValue, undo, redo } = useStateWithHistory(initialValue)
```

### [useUndo](/hooks/useUndo)
Simplified undo/redo functionality for any state.
```tsx
const { value, setValue, undo, redo, canUndo, canRedo } = useUndo(initialValue)
```

### [useReducerWithMiddleware](/hooks/useReducerWithMiddleware)
Enhanced useReducer with middleware support (logging, async actions, devtools).
```tsx
const [state, dispatch] = useReducerWithMiddleware(reducer, initialState, [middleware])
```

## 🌐 Network & Async

### [useWebSocket](/hooks/useWebSocket)
WebSocket connections with auto-reconnect, heartbeat, and typed messages.
```tsx
const { sendMessage, lastMessage, readyState } = useWebSocket(url, options)
```

### [useSSE](/hooks/useSSE)
Server-Sent Events with automatic reconnection and event handling.
```tsx
const { data, error, readyState } = useSSE(url, { events: ['update'] })
```

### [usePolling](/hooks/usePolling)
Smart polling with caching, error handling, and conditional fetching.
```tsx
const { data, loading, start, stop } = usePolling(url, { interval: 5000 })
```

### [useAsync](/hooks/useAsync)
Execute async functions with loading states and error handling.
```tsx
const { execute, data, loading, error } = useAsync(asyncFunction)
```

### [useFetch](/hooks/useFetch)
Data fetching with caching, retries, and request cancellation.
```tsx
const { data, loading, error, refetch } = useFetch(url, options)
```

## 🎨 DOM & UI

### [useMeasure](/hooks/useMeasure)
Track element dimensions with ResizeObserver.
```tsx
const [ref, dimensions] = useMeasure({ debounce: 100 })
```

### [useScrollLock](/hooks/useScrollLock)
Prevent body scroll for modals and overlays.
```tsx
const { lock, unlock, isLocked } = useScrollLock()
```

### [useClickAway](/hooks/useClickAway)
Detect clicks outside of an element.
```tsx
useClickAway(ref, () => setOpen(false))
```

### [useHover](/hooks/useHover)
Track mouse hover state with enter/leave delays.
```tsx
const [ref, isHovered] = useHover({ enterDelay: 200 })
```

### [useIntersectionObserver](/hooks/useIntersectionObserver)
Observe element visibility and intersection.
```tsx
const [ref, entry] = useIntersectionObserver({ threshold: 0.5 })
```

### [useWindowSize](/hooks/useWindowSize)
Track window dimensions with debouncing.
```tsx
const { width, height } = useWindowSize()
```

### [useMediaQuery](/hooks/useMediaQuery)
Responsive design with CSS media queries.
```tsx
const isMobile = useMediaQuery('(max-width: 768px)')
```

### [useEventListener](/hooks/useEventListener)
Safely add and remove event listeners.
```tsx
useEventListener('scroll', handleScroll, { target: window })
```

## 🛠️ Utilities

### [useDebounce](/hooks/useDebounce)
Debounce values and callbacks.
```tsx
const debouncedValue = useDebounce(value, 500)
```

### [useThrottle](/hooks/useThrottle)
Throttle values and callbacks.
```tsx
const throttledValue = useThrottle(value, 1000)
```

### [useToggle](/hooks/useToggle)
Boolean state toggling.
```tsx
const [isOpen, toggle, setIsOpen] = useToggle(false)
```

### [useCounter](/hooks/useCounter)
Numeric counter with increment/decrement.
```tsx
const { count, increment, decrement, reset } = useCounter(0)
```

### [useTimeout](/hooks/useTimeout)
Declarative setTimeout management.
```tsx
useTimeout(() => showNotification(), 3000)
```

### [useInterval](/hooks/useInterval)
Declarative setInterval management.
```tsx
useInterval(() => fetchData(), 5000)
```

### [useLocalStorage](/hooks/useLocalStorage)
Sync state with localStorage.
```tsx
const [theme, setTheme] = useLocalStorage('theme', 'dark')
```

### [usePrevious](/hooks/usePrevious)
Track previous value of a variable.
```tsx
const prevCount = usePrevious(count)
```

### [useKeyPress](/hooks/useKeyPress)
Detect specific key presses.
```tsx
const enterPressed = useKeyPress('Enter')
```

### [useUpdateEffect](/hooks/useUpdateEffect)
useEffect that skips initial render.
```tsx
useUpdateEffect(() => {
  console.log('Value changed:', value)
}, [value])
```

### [useIsFirstRender](/hooks/useIsFirstRender)
Check if component is in its first render.
```tsx
const isFirstRender = useIsFirstRender()
```

## Hook Categories at a Glance

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 2rem;">

<div style="padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
<h3 style="margin-top: 0;">🚀 Performance</h3>

- Virtual scrolling
- Deep memoization
- Render optimization
</div>

<div style="padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
<h3 style="margin-top: 0;">📊 State Management</h3>

- History tracking
- Undo/redo
- Middleware patterns
</div>

<div style="padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
<h3 style="margin-top: 0;">🌐 Network</h3>

- WebSocket
- SSE
- Polling
- Data fetching
</div>

<div style="padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
<h3 style="margin-top: 0;">🎨 DOM & UI</h3>

- Element measurement
- Scroll control
- Event handling
- Responsive design
</div>

<div style="padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
<h3 style="margin-top: 0;">🛠️ Utilities</h3>

- Debounce/throttle
- Timers
- Storage
- Keyboard
</div>

</div>