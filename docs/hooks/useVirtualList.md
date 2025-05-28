# useVirtualList

Efficiently render large lists by only rendering visible items. Perfect for tables, feeds, and any scrollable list with many items.

## Demo

<div class="demo-container">
  <p>Rendering 10,000 items with smooth scrolling!</p>
</div>

## Usage

```tsx
import { useVirtualList } from 'react-denuse-kit'

function VirtualListExample() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `Description for item ${i}`
  }))

  const {
    virtualItems,
    totalHeight,
    containerProps,
    wrapperProps,
    scrollToIndex,
    isScrolling
  } = useVirtualList(items, 600, {
    itemHeight: 80,
    overscan: 3
  })

  return (
    <div>
      <button onClick={() => scrollToIndex(500, { behavior: 'smooth' })}>
        Scroll to Item 500
      </button>
      
      <div {...containerProps}>
        <div {...wrapperProps}>
          {virtualItems.map(({ index, item, style, key }) => (
            <div key={key} style={style}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {isScrolling && <div>Scrolling...</div>}
    </div>
  )
}
```

## API

### Parameters

```ts
useVirtualList<T>(
  items: T[],
  containerHeight: number,
  options: VirtualListOptions<T>
): VirtualListReturn<T>
```

#### items
- **Type:** `T[]`
- **Required:** Yes
- **Description:** Array of items to virtualize

#### containerHeight
- **Type:** `number`
- **Required:** Yes
- **Description:** Height of the scrollable container in pixels

#### options
- **Type:** `VirtualListOptions<T>`
- **Required:** Yes

<div class="api-table">

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `itemHeight` | `number \| (index, item) => number` | Required | Fixed height or function returning height per item |
| `overscan` | `number` | `3` | Number of items to render outside visible area |
| `estimatedItemHeight` | `number` | `50` | Estimated height for unmeasured items |
| `getItemKey` | `(index, item) => string \| number` | `index` | Function to generate unique keys |
| `onScroll` | `(scrollTop: number) => void` | - | Scroll event handler |
| `scrollThreshold` | `number` | `0.9` | Threshold for `onEndReached` (0-1) |
| `onEndReached` | `() => void` | - | Called when scrolled near the end |

</div>

### Returns

<div class="api-table">

| Property | Type | Description |
|----------|------|-------------|
| `virtualItems` | `VirtualItem<T>[]` | Array of items currently in view |
| `totalHeight` | `number` | Total height of all items |
| `scrollToIndex` | `(index, options?) => void` | Programmatically scroll to item |
| `containerProps` | `object` | Props to spread on container element |
| `wrapperProps` | `object` | Props to spread on wrapper element |
| `isScrolling` | `boolean` | Whether the list is currently scrolling |

</div>

## Advanced Examples

### Dynamic Height Items

```tsx
function DynamicHeightList() {
  const { virtualItems, containerProps, wrapperProps } = useVirtualList(
    items,
    600,
    {
      itemHeight: (index, item) => {
        // Calculate height based on content
        return item.type === 'header' ? 100 : 60
      },
      estimatedItemHeight: 70
    }
  )

  return (
    <div {...containerProps}>
      <div {...wrapperProps}>
        {virtualItems.map(({ item, style, key }) => (
          <div key={key} style={style}>
            {item.type === 'header' ? (
              <h2>{item.title}</h2>
            ) : (
              <p>{item.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Infinite Scroll

```tsx
function InfiniteScrollList() {
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (loading) return
    setLoading(true)
    
    const newItems = await fetchMoreItems()
    setItems(prev => [...prev, ...newItems])
    setLoading(false)
  }

  const { virtualItems, containerProps, wrapperProps } = useVirtualList(
    items,
    600,
    {
      itemHeight: 80,
      onEndReached: loadMore,
      scrollThreshold: 0.8
    }
  )

  return (
    <div {...containerProps}>
      <div {...wrapperProps}>
        {virtualItems.map(({ item, style, key }) => (
          <div key={key} style={style}>
            {/* Item content */}
          </div>
        ))}
        {loading && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            Loading more...
          </div>
        )}
      </div>
    </div>
  )
}
```

### Horizontal List

```tsx
function HorizontalVirtualList() {
  // Note: For horizontal lists, you'll need to modify the hook
  // or create a wrapper that transforms the layout
  const { virtualItems, containerProps, wrapperProps } = useVirtualList(
    items,
    800, // width instead of height
    {
      itemHeight: 200, // actually item width
      overscan: 2
    }
  )

  return (
    <div 
      {...containerProps}
      style={{
        ...containerProps.style,
        overflowX: 'auto',
        overflowY: 'hidden',
        display: 'flex'
      }}
    >
      <div 
        {...wrapperProps}
        style={{
          ...wrapperProps.style,
          width: wrapperProps.style.height,
          height: '100%',
          display: 'flex'
        }}
      >
        {virtualItems.map(({ item, style, key }) => (
          <div 
            key={key} 
            style={{
              ...style,
              position: 'absolute',
              left: style.top,
              top: 0,
              width: style.height,
              height: '100%'
            }}
          >
            {/* Item content */}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Performance Tips

### 1. Stable Item Heights
For best performance, use fixed item heights when possible:
```tsx
// ✅ Best performance
itemHeight: 80

// 🔶 Good performance with caching
itemHeight: (index, item) => item.type === 'header' ? 100 : 60

// ❌ Avoid complex calculations
itemHeight: (index, item) => calculateComplexHeight(item)
```

### 2. Memoize Items
Prevent unnecessary re-renders:
```tsx
const items = useMemo(() => 
  rawData.map(item => ({
    id: item.id,
    content: processItem(item)
  })),
  [rawData]
)
```

### 3. Use React.memo for Item Components
```tsx
const ListItem = React.memo(({ item, style }) => (
  <div style={style}>
    {item.content}
  </div>
))
```

### 4. Optimize getItemKey
```tsx
// ✅ Fast and stable
getItemKey: (index, item) => item.id

// ❌ Avoid creating new objects
getItemKey: (index, item) => `${item.type}-${index}`
```

## Common Issues

### Items Not Rendering
Ensure container has explicit height:
```tsx
// ✅ Correct
<div style={{ height: '600px' }} {...containerProps}>

// ❌ Won't work
<div style={{ height: '100%' }} {...containerProps}>
```

### Jumpy Scrolling
Use consistent item heights or provide accurate `estimatedItemHeight`:
```tsx
{
  itemHeight: (index, item) => getItemHeight(item),
  estimatedItemHeight: 75 // Close to average height
}
```

### Memory Leaks
The hook automatically cleans up, but ensure your item components don't hold references:
```tsx
// ✅ Good
const ListItem = ({ item }) => <div>{item.name}</div>

// ❌ Potential memory leak
const ListItem = ({ item }) => {
  // Don't store items in external state
  globalStore.items[item.id] = item
  return <div>{item.name}</div>
}
```