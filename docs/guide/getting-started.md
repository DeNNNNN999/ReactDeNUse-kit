# Getting Started

## Overview

ReactDeNUse Kit is a professional collection of React hooks designed for enterprise applications. Built with TypeScript and modern React patterns, it provides battle-tested solutions for common and complex use cases.

## Quick Start

### Installation

::: code-group
```bash [npm]
npm install react-denuse-kit
```

```bash [yarn]
yarn add react-denuse-kit
```

```bash [pnpm]
pnpm add react-denuse-kit
```
:::

### Basic Usage

```tsx
import { useVirtualList, useWebSocket, useStateWithHistory } from 'react-denuse-kit'

function MyComponent() {
  // Virtual scrolling for large lists
  const { virtualItems, containerProps, wrapperProps } = useVirtualList(
    items,
    containerHeight,
    { itemHeight: 50 }
  )

  // WebSocket with auto-reconnect
  const { sendMessage, lastMessage } = useWebSocket('wss://api.example.com', {
    reconnect: true,
    reconnectAttempts: 5
  })

  // State with undo/redo
  const { value, setValue, undo, redo, canUndo, canRedo } = useStateWithHistory(
    initialValue
  )

  return (
    // Your component JSX
  )
}
```

## Key Features

### 🚀 Performance Hooks
- **useVirtualList** - Efficiently render large lists with virtualization
- **useDeepMemo** - Memoization with deep equality checks

### 📊 State Management
- **useStateWithHistory** - State with full history tracking
- **useUndo** - Simple undo/redo functionality
- **useReducerWithMiddleware** - Redux-like middleware for useReducer

### 🌐 Network & Async
- **useWebSocket** - WebSocket connections with auto-reconnect
- **useSSE** - Server-Sent Events support
- **usePolling** - Interval-based data fetching with smart caching

### 🎨 DOM & UI
- **useMeasure** - Track element dimensions with ResizeObserver
- **useScrollLock** - Prevent body scroll (modals, drawers)
- **useIntersectionObserver** - Detect element visibility

### 🛠️ Utilities
- **useDebounce** - Debounce values and callbacks
- **useThrottle** - Throttle values and callbacks
- **useLocalStorage** - Sync state with localStorage

## Requirements

- React 16.8.0 or higher
- TypeScript 4.5 or higher (optional but recommended)

## Next Steps

- Learn about [TypeScript integration](/guide/typescript)
- Explore [all available hooks](/hooks/overview)
- Check out [real-world examples](/examples/)