# useWebSocket

A powerful WebSocket hook with automatic reconnection, heartbeat support, and message history.

## Features

- 🔄 Automatic reconnection with exponential backoff
- 💓 Built-in heartbeat/ping-pong support
- 📨 Message history tracking
- 🎯 Message filtering
- 🔌 Manual connection control
- 📦 JSON message support
- 🛡️ TypeScript ready

## Basic Usage

```tsx
import { useWebSocket } from 'react-denuse-kit'

function ChatComponent() {
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    messageHistory
  } = useWebSocket('wss://chat.example.com')

  // Send text message
  const handleSendText = () => {
    sendMessage('Hello, world!')
  }

  // Send JSON message
  const handleSendJson = () => {
    sendJsonMessage({
      type: 'chat',
      message: 'Hello',
      timestamp: Date.now()
    })
  }

  return (
    <div>
      <div>Connection: {readyState === 1 ? 'Open' : 'Closed'}</div>
      <div>Last message: {lastMessage?.data}</div>
      
      <button onClick={handleSendText}>Send Text</button>
      <button onClick={handleSendJson}>Send JSON</button>
      
      <div>
        {messageHistory.map((msg, i) => (
          <div key={i}>{msg.data}</div>
        ))}
      </div>
    </div>
  )
}
```

## API

### Parameters

```ts
useWebSocket<T = any>(
  url: string | (() => string),
  options?: WebSocketOptions
): WebSocketReturn<T>
```

#### url
- **Type:** `string | (() => string)`
- **Required:** Yes
- **Description:** WebSocket URL or function returning URL

#### options

<div class="api-table">

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `reconnect` | `boolean` | `true` | Enable automatic reconnection |
| `reconnectAttempts` | `number` | `5` | Maximum reconnection attempts |
| `reconnectInterval` | `number` | `1000` | Base reconnection interval (ms) |
| `manual` | `boolean` | `false` | Manual connection control |
| `onOpen` | `(event) => void` | - | Connection opened handler |
| `onClose` | `(event) => void` | - | Connection closed handler |
| `onMessage` | `(event) => void` | - | Message received handler |
| `onError` | `(event) => void` | - | Error handler |
| `onReconnectStop` | `() => void` | - | Called when reconnection stops |
| `shouldReconnect` | `(event) => boolean` | - | Custom reconnection logic |
| `protocols` | `string \| string[]` | - | WebSocket sub-protocols |
| `retryOnError` | `boolean` | `false` | Retry on connection error |
| `filter` | `(message) => boolean` | - | Message filter function |
| `heartbeat` | `HeartbeatOptions` | - | Heartbeat configuration |

</div>

### Returns

<div class="api-table">

| Property | Type | Description |
|----------|------|-------------|
| `sendMessage` | `(message) => void` | Send text/binary message |
| `sendJsonMessage` | `(message: T) => void` | Send JSON message |
| `lastMessage` | `MessageEvent \| null` | Last received message |
| `lastJsonMessage` | `T \| null` | Last parsed JSON message |
| `readyState` | `0 \| 1 \| 2 \| 3` | WebSocket ready state |
| `connect` | `() => void` | Manually connect |
| `disconnect` | `(code?, reason?) => void` | Manually disconnect |
| `messageHistory` | `MessageEvent[]` | All received messages |
| `reconnectCount` | `number` | Current reconnection attempt |

</div>

## Advanced Examples

### With Heartbeat

```tsx
function HeartbeatExample() {
  const { sendMessage, readyState } = useWebSocket('wss://api.example.com', {
    heartbeat: {
      message: 'ping',
      interval: 30000, // 30 seconds
      pongTimeout: 10000, // 10 seconds
      responseMessage: 'pong'
    }
  })

  return <div>Connection alive: {readyState === 1 ? 'Yes' : 'No'}</div>
}
```

### Manual Connection Control

```tsx
function ManualConnectionExample() {
  const {
    connect,
    disconnect,
    readyState,
    sendJsonMessage
  } = useWebSocket('wss://api.example.com', {
    manual: true,
    reconnect: false
  })

  return (
    <div>
      {readyState === 1 ? (
        <>
          <button onClick={() => disconnect()}>Disconnect</button>
          <button onClick={() => sendJsonMessage({ type: 'ping' })}>
            Send Ping
          </button>
        </>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </div>
  )
}
```

### Message Filtering

```tsx
function FilteredMessagesExample() {
  const {
    lastJsonMessage,
    sendJsonMessage
  } = useWebSocket<ChatMessage>('wss://chat.example.com', {
    filter: (message) => {
      try {
        const data = JSON.parse(message.data)
        return data.type === 'chat' // Only accept chat messages
      } catch {
        return false
      }
    }
  })

  return (
    <div>
      {lastJsonMessage && (
        <div>
          {lastJsonMessage.user}: {lastJsonMessage.message}
        </div>
      )}
    </div>
  )
}
```

### Custom Reconnection Logic

```tsx
function SmartReconnectExample() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const { readyState } = useWebSocket('wss://api.example.com', {
    shouldReconnect: (closeEvent) => {
      // Only reconnect if online and not a normal closure
      return isOnline && closeEvent.code !== 1000
    },
    reconnectInterval: 2000,
    reconnectAttempts: 10
  })

  return <div>Status: {isOnline ? 'Online' : 'Offline'}</div>
}
```

### Real-time Chat Application

```tsx
interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: number
  type: 'chat' | 'system' | 'typing'
}

function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState
  } = useWebSocket<ChatMessage>('wss://chat.example.com', {
    onOpen: () => {
      console.log('Connected to chat')
    },
    onMessage: (event) => {
      try {
        const message: ChatMessage = JSON.parse(event.data)
        
        switch (message.type) {
          case 'chat':
            setMessages(prev => [...prev, message])
            break
          case 'typing':
            setTypingUsers(prev => {
              if (!prev.includes(message.user)) {
                return [...prev, message.user]
              }
              return prev
            })
            // Remove after 3 seconds
            setTimeout(() => {
              setTypingUsers(prev => prev.filter(u => u !== message.user))
            }, 3000)
            break
        }
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    },
    reconnect: true,
    heartbeat: {
      message: JSON.stringify({ type: 'ping' }),
      interval: 30000
    }
  })

  const sendMessage = (text: string) => {
    sendJsonMessage({
      id: crypto.randomUUID(),
      user: 'current-user',
      message: text,
      timestamp: Date.now(),
      type: 'chat'
    })
  }

  const sendTypingIndicator = () => {
    sendJsonMessage({
      id: crypto.randomUUID(),
      user: 'current-user',
      message: '',
      timestamp: Date.now(),
      type: 'typing'
    })
  }

  return (
    <div>
      <div>Status: {readyState === 1 ? '🟢 Connected' : '🔴 Disconnected'}</div>
      
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      
      {typingUsers.length > 0 && (
        <div>{typingUsers.join(', ')} typing...</div>
      )}
      
      <input
        onChange={sendTypingIndicator}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.currentTarget.value)
            e.currentTarget.value = ''
          }
        }}
      />
    </div>
  )
}
```

## Ready State Values

<div class="api-table">

| Value | State | Description |
|-------|-------|-------------|
| `0` | CONNECTING | Connection is being established |
| `1` | OPEN | Connection is open and ready |
| `2` | CLOSING | Connection is closing |
| `3` | CLOSED | Connection is closed |

</div>

## Best Practices

### 1. Handle Connection States
Always check `readyState` before sending messages:
```tsx
if (readyState === WebSocket.OPEN) {
  sendMessage('Hello')
}
```

### 2. Use TypeScript for Type Safety
```tsx
interface ServerMessage {
  type: 'chat' | 'notification'
  payload: unknown
}

const { lastJsonMessage } = useWebSocket<ServerMessage>(url)

// TypeScript knows the shape of lastJsonMessage
if (lastJsonMessage?.type === 'chat') {
  // Handle chat message
}
```

### 3. Clean Up Message History
For long-running connections, consider limiting history:
```tsx
const { messageHistory } = useWebSocket(url)

// Keep only last 100 messages
const recentMessages = messageHistory.slice(-100)
```

### 4. Error Handling
```tsx
const { readyState } = useWebSocket(url, {
  onError: (event) => {
    console.error('WebSocket error:', event)
    // Show user-friendly error message
  },
  onReconnectStop: () => {
    console.warn('Failed to reconnect after maximum attempts')
    // Show reconnection failed UI
  }
})
```

## Common Issues

### CORS Issues
WebSocket connections are subject to CORS. Ensure your server sends proper headers:
```
Access-Control-Allow-Origin: *
```

### SSL/TLS in Production
Always use `wss://` in production:
```tsx
const url = process.env.NODE_ENV === 'production' 
  ? 'wss://api.example.com' 
  : 'ws://localhost:8080'
```

### Message Size Limits
Be aware of message size limits (typically 64KB-1MB):
```tsx
const sendLargeData = (data: any) => {
  const json = JSON.stringify(data)
  if (json.length > 65536) {
    console.warn('Message may be too large')
  }
  sendMessage(json)
}
```