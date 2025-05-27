import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const hooks = [
  {
    category: 'State Management',
    items: [
      { name: 'useLocalStorage', path: '/hooks/use-local-storage', description: 'Persist state to localStorage' },
      { name: 'useToggle', path: '/hooks/use-toggle', description: 'Toggle boolean state' },
      { name: 'useCounter', path: '/hooks/use-counter', description: 'Counter with utility functions' },
    ],
  },
  {
    category: 'Performance',
    items: [
      { name: 'useDebounce', path: '/hooks/use-debounce', description: 'Debounce rapidly changing values' },
      { name: 'useThrottle', path: '/hooks/use-throttle', description: 'Throttle rapidly changing values' },
    ],
  },
  {
    category: 'DOM',
    items: [
      { name: 'useWindowSize', path: '/hooks/use-window-size', description: 'Track window dimensions' },
      { name: 'useMediaQuery', path: '/hooks/use-media-query', description: 'Track media query matches' },
      { name: 'useOnClickOutside', path: '/hooks/use-on-click-outside', description: 'Detect clicks outside element' },
      { name: 'useIntersectionObserver', path: '/hooks/use-intersection-observer', description: 'Track element visibility' },
    ],
  },
  {
    category: 'Events',
    items: [
      { name: 'useEventListener', path: '/hooks/use-event-listener', description: 'Add event listeners safely' },
      { name: 'useKeyPress', path: '/hooks/use-key-press', description: 'Detect key presses' },
      { name: 'useHover', path: '/hooks/use-hover', description: 'Track hover state' },
      { name: 'useClickAway', path: '/hooks/use-click-away', description: 'Detect clicks outside' },
    ],
  },
  {
    category: 'Async',
    items: [
      { name: 'useAsync', path: '/hooks/use-async', description: 'Handle async operations' },
      { name: 'useFetch', path: '/hooks/use-fetch', description: 'Fetch data with loading states' },
    ],
  },
  {
    category: 'Lifecycle',
    items: [
      { name: 'usePrevious', path: '/hooks/use-previous', description: 'Get previous value' },
      { name: 'useIsFirstRender', path: '/hooks/use-is-first-render', description: 'Detect first render' },
      { name: 'useUpdateEffect', path: '/hooks/use-update-effect', description: 'useEffect skipping first render' },
    ],
  },
  {
    category: 'Timers',
    items: [
      { name: 'useInterval', path: '/hooks/use-interval', description: 'Setup intervals declaratively' },
      { name: 'useTimeout', path: '/hooks/use-timeout', description: 'Setup timeouts declaratively' },
    ],
  },
];

export default function HooksPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold mb-4">Hooks Reference</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive collection of production-ready React hooks.
        </p>
      </div>

      <div className="space-y-8">
        {hooks.map((category, categoryIndex) => (
          <motion.section
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          >
            <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {category.items.map((hook) => (
                <Link
                  key={hook.path}
                  to={hook.path}
                  className="block p-4 rounded-lg border bg-card hover:bg-muted transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-1">{hook.name}</h3>
                  <p className="text-sm text-muted-foreground">{hook.description}</p>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}
