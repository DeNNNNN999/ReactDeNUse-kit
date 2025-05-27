# ReactDeNUse-KIT 🚀

Professional React Hooks Library with TypeScript support. Created by a Senior Full-Stack Developer with 15 years of experience.

[![npm version](https://img.shields.io/npm/v/react-denuse-kit.svg)](https://www.npmjs.com/package/react-denuse-kit)
[![npm downloads](https://img.shields.io/npm/dm/react-denuse-kit.svg)](https://www.npmjs.com/package/react-denuse-kit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-denuse-kit)](https://bundlephobia.com/package/react-denuse-kit)
[![license](https://img.shields.io/npm/l/react-denuse-kit.svg)](https://github.com/react-denuse/react-denuse-kit/blob/main/LICENSE)

## Installation

```bash
npm install react-denuse-kit
# or
yarn add react-denuse-kit
# or
pnpm add react-denuse-kit
```

## Quick Start

```tsx
import { useLocalStorage, useDebounce, useToggle } from 'react-denuse-kit';

function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [isOpen, toggle] = useToggle(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  return (
    <div data-theme={theme}>
      <button onClick={toggle}>Toggle Menu</button>
      <input onChange={(e) => setSearchTerm(e.target.value)} />
      {/* Use debouncedSearch for API calls */}
    </div>
  );
}
```

## Available Hooks

- **State Management**: `useToggle`, `useCounter`, `useLocalStorage`
- **Performance**: `useDebounce`, `useThrottle`
- **DOM**: `useWindowSize`, `useMediaQuery`, `useOnClickOutside`, `useIntersectionObserver`
- **Events**: `useEventListener`, `useKeyPress`, `useHover`, `useClickAway`
- **Async**: `useAsync`, `useFetch`
- **Lifecycle**: `usePrevious`, `useIsFirstRender`, `useUpdateEffect`
- **Timers**: `useInterval`, `useTimeout`

## Documentation

Visit our documentation site: [https://react-denuse-kit.vercel.app](https://react-denuse-kit.vercel.app)

## Features

- 🎯 **20+ Custom Hooks** - Comprehensive collection of production-ready hooks
- 🔒 **TypeScript Support** - Full type safety and IntelliSense
- 🚀 **Performance Optimized** - Using best practices like useCallback, useMemo
- 🧪 **Battle-tested** - Based on industry standards and patterns
- 📦 **Zero Dependencies** - Only React as peer dependency
- 🌐 **SSR Compatible** - Works with Next.js and other SSR frameworks
- 📱 **Mobile Friendly** - Touch events support where applicable

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © ReactDeNUse Team
