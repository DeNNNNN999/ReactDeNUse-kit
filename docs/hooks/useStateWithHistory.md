# useStateWithHistory

Track state changes with a complete history, enabling undo/redo functionality and time-travel debugging.

## Features

- ↩️ Full undo/redo support
- 📝 Complete state history tracking
- 🎯 Jump to any point in history
- 🔢 Configurable history size limit
- 🚀 Optimized performance
- 💾 History persistence ready

## Basic Usage

```tsx
import { useStateWithHistory } from 'react-denuse-kit'

function TextEditor() {
  const {
    value,
    setValue,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    historyIndex
  } = useStateWithHistory('')

  return (
    <div>
      <div>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
        <span>History: {historyIndex + 1} / {history.length}</span>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
    </div>
  )
}
```

## API

### Parameters

```ts
useStateWithHistory<T>(
  initialValue: T,
  options?: StateWithHistoryOptions
): StateWithHistoryReturn<T>
```

#### initialValue
- **Type:** `T`
- **Required:** Yes
- **Description:** Initial state value

#### options

<div class="api-table">

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxHistorySize` | `number` | `50` | Maximum number of history entries |
| `includePresent` | `boolean` | `true` | Include current value in history array |

</div>

### Returns

<div class="api-table">

| Property | Type | Description |
|----------|------|-------------|
| `value` | `T` | Current state value |
| `setValue` | `(value: T \| (prev: T) => T) => void` | Update state (adds to history) |
| `history` | `T[]` | Array of all historical values |
| `historyIndex` | `number` | Current position in history |
| `canUndo` | `boolean` | Whether undo is available |
| `canRedo` | `boolean` | Whether redo is available |
| `undo` | `() => void` | Go back one step |
| `redo` | `() => void` | Go forward one step |
| `goTo` | `(index: number) => void` | Jump to specific history index |
| `clear` | `() => void` | Clear history (keep current value) |
| `reset` | `(value?: T) => void` | Reset to initial or provided value |

</div>

## Advanced Examples

### Form with History

```tsx
interface FormData {
  name: string
  email: string
  message: string
}

function FormWithHistory() {
  const {
    value,
    setValue,
    undo,
    redo,
    canUndo,
    canRedo,
    history
  } = useStateWithHistory<FormData>({
    name: '',
    email: '',
    message: ''
  })

  const updateField = (field: keyof FormData, fieldValue: string) => {
    setValue(prev => ({
      ...prev,
      [field]: fieldValue
    }))
  }

  return (
    <form>
      <div>
        <button type="button" onClick={undo} disabled={!canUndo}>
          ↩️ Undo
        </button>
        <button type="button" onClick={redo} disabled={!canRedo}>
          ↪️ Redo
        </button>
      </div>

      <input
        value={value.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="Name"
      />
      
      <input
        value={value.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder="Email"
      />
      
      <textarea
        value={value.message}
        onChange={(e) => updateField('message', e.target.value)}
        placeholder="Message"
      />

      <div>
        <h3>History ({history.length} entries)</h3>
        {history.map((entry, index) => (
          <div 
            key={index}
            onClick={() => goTo(index)}
            style={{ 
              cursor: 'pointer',
              fontWeight: index === historyIndex ? 'bold' : 'normal'
            }}
          >
            {index}: {entry.name || '(empty)'}
          </div>
        ))}
      </div>
    </form>
  )
}
```

### Drawing App with Undo

```tsx
interface DrawingState {
  paths: Path[]
  currentPath: Point[]
}

function DrawingCanvas() {
  const {
    value,
    setValue,
    undo,
    redo,
    canUndo,
    canRedo,
    clear
  } = useStateWithHistory<DrawingState>({
    paths: [],
    currentPath: []
  }, {
    maxHistorySize: 100
  })

  const startDrawing = (point: Point) => {
    setValue(prev => ({
      ...prev,
      currentPath: [point]
    }))
  }

  const continueDrawing = (point: Point) => {
    setValue(prev => ({
      ...prev,
      currentPath: [...prev.currentPath, point]
    }))
  }

  const finishDrawing = () => {
    setValue(prev => ({
      paths: [...prev.paths, prev.currentPath],
      currentPath: []
    }))
  }

  return (
    <div>
      <div>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
        <button onClick={clear}>Clear History</button>
        <button onClick={() => setValue({ paths: [], currentPath: [] })}>
          Clear Canvas
        </button>
      </div>
      
      <canvas
        onMouseDown={(e) => startDrawing(getPoint(e))}
        onMouseMove={(e) => {
          if (value.currentPath.length > 0) {
            continueDrawing(getPoint(e))
          }
        }}
        onMouseUp={finishDrawing}
      />
      
      <div>Paths: {value.paths.length}</div>
    </div>
  )
}
```

### Time Travel Debugging

```tsx
function TimeTravelDebugger() {
  const {
    value,
    setValue,
    history,
    historyIndex,
    goTo
  } = useStateWithHistory(initialAppState, {
    maxHistorySize: 200
  })

  const [playbackSpeed, setPlaybackSpeed] = useState(1000)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      if (historyIndex < history.length - 1) {
        goTo(historyIndex + 1)
      } else {
        setIsPlaying(false)
      }
    }, playbackSpeed)

    return () => clearInterval(timer)
  }, [isPlaying, historyIndex, history.length, playbackSpeed, goTo])

  return (
    <div>
      <div>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <input
          type="range"
          min={0}
          max={history.length - 1}
          value={historyIndex}
          onChange={(e) => goTo(Number(e.target.value))}
        />
        <span>{historyIndex + 1} / {history.length}</span>
      </div>
      
      <div>
        Speed: 
        <select 
          value={playbackSpeed} 
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
        >
          <option value={2000}>0.5x</option>
          <option value={1000}>1x</option>
          <option value={500}>2x</option>
          <option value={250}>4x</option>
        </select>
      </div>

      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  )
}
```

### Persistent History

```tsx
function PersistentEditor() {
  const storageKey = 'editor-history'
  
  // Load history from localStorage
  const loadHistory = () => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : { content: '', history: [] }
    } catch {
      return { content: '', history: [] }
    }
  }

  const {
    value,
    setValue,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    historyIndex
  } = useStateWithHistory(loadHistory().content)

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({
      content: value,
      history: history.slice(0, historyIndex + 1)
    }))
  }, [value, history, historyIndex])

  return (
    <div>
      <div>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
        <button onClick={() => localStorage.removeItem(storageKey)}>
          Clear Storage
        </button>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Your content is auto-saved with history..."
      />
    </div>
  )
}
```

### Collaborative Editing

```tsx
function CollaborativeEditor() {
  const {
    value,
    setValue,
    history,
    goTo
  } = useStateWithHistory('')

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsUrl)

  // Send changes to other users
  useEffect(() => {
    sendJsonMessage({
      type: 'content-change',
      content: value,
      timestamp: Date.now()
    })
  }, [value, sendJsonMessage])

  // Receive changes from other users
  useEffect(() => {
    if (lastJsonMessage?.type === 'content-change') {
      setValue(lastJsonMessage.content)
    }
  }, [lastJsonMessage, setValue])

  // Conflict resolution UI
  const [conflicts, setConflicts] = useState<any[]>([])

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      
      {conflicts.length > 0 && (
        <div>
          <h3>Resolve Conflicts</h3>
          {conflicts.map((conflict, i) => (
            <div key={i}>
              <button onClick={() => setValue(conflict.theirVersion)}>
                Use Their Version
              </button>
              <button onClick={() => setValue(conflict.ourVersion)}>
                Keep Our Version
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Performance Optimization

### 1. Debounce Frequent Updates
```tsx
import { useDebounce } from 'react-denuse-kit'

function OptimizedEditor() {
  const [tempValue, setTempValue] = useState('')
  const debouncedValue = useDebounce(tempValue, 500)
  
  const {
    value,
    setValue,
    undo,
    redo
  } = useStateWithHistory('')

  // Only add to history after user stops typing
  useEffect(() => {
    if (debouncedValue !== value) {
      setValue(debouncedValue)
    }
  }, [debouncedValue])

  return (
    <textarea
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
    />
  )
}
```

### 2. Limit History Size
```tsx
// For memory-intensive data
const { value, setValue } = useStateWithHistory(largeObject, {
  maxHistorySize: 20 // Keep history manageable
})
```

### 3. Use Immutable Updates
```tsx
// ✅ Good - creates new object
setValue(prev => ({
  ...prev,
  field: newValue
}))

// ❌ Bad - mutates existing object
setValue(prev => {
  prev.field = newValue // Don't do this!
  return prev
})
```

## Common Patterns

### Keyboard Shortcuts
```tsx
function EditorWithShortcuts() {
  const { undo, redo, canUndo, canRedo } = useStateWithHistory(initialValue)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey && canUndo) {
          e.preventDefault()
          undo()
        } else if ((e.key === 'z' && e.shiftKey || e.key === 'y') && canRedo) {
          e.preventDefault()
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  // ... rest of component
}
```

### History Branching
```tsx
// When you undo and then make a new change,
// the "future" history is discarded
const { value, setValue, history, historyIndex } = useStateWithHistory('A')

setValue('B') // history: ['A', 'B'], index: 1
setValue('C') // history: ['A', 'B', 'C'], index: 2
undo()        // history: ['A', 'B', 'C'], index: 1, value: 'B'
setValue('D') // history: ['A', 'B', 'D'], index: 2
// 'C' is now lost
```