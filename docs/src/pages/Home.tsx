import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CodeBlock from '../components/CodeBlock';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <h1 className="text-6xl font-bold mb-6">
          <span className="gradient-text">ReactDeNUse-KIT</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Professional React Hooks Library with TypeScript support. 
          Created by a Senior Full-Stack Developer with 15 years of experience.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/getting-started"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/react-denuse/react-denuse-kit"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            View on GitHub
          </a>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="p-6 rounded-lg border bg-card">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
          <p className="text-muted-foreground">
            Optimized with memoization and best practices for maximum performance.
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Type Safe</h3>
          <p className="text-muted-foreground">
            Built with TypeScript for complete type safety and excellent DX.
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">20+ Hooks</h3>
          <p className="text-muted-foreground">
            Comprehensive collection of production-ready hooks for every use case.
          </p>
        </div>
      </motion.section>

      {/* Quick Example */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-6">Quick Example</h2>
        <CodeBlock
          code={`import { useLocalStorage, useDebounce, useToggle } from 'react-denuse-kit';

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
}`}
          language="tsx"
        />
      </motion.section>

      {/* Hook Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-6">Hook Categories</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">State Management</h3>
            <p className="text-sm text-muted-foreground">
              useToggle, useCounter, useLocalStorage
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Performance</h3>
            <p className="text-sm text-muted-foreground">
              useDebounce, useThrottle
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">DOM</h3>
            <p className="text-sm text-muted-foreground">
              useWindowSize, useMediaQuery, useOnClickOutside, useIntersectionObserver
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Events</h3>
            <p className="text-sm text-muted-foreground">
              useEventListener, useKeyPress, useHover, useClickAway
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Async</h3>
            <p className="text-sm text-muted-foreground">
              useAsync, useFetch
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Lifecycle</h3>
            <p className="text-sm text-muted-foreground">
              usePrevious, useIsFirstRender, useUpdateEffect
            </p>
          </div>
        </div>
      </motion.section>

      {/* Installation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-6">Installation</h2>
        <div className="space-y-4">
          <CodeBlock
            code="npm install react-denuse-kit"
            language="bash"
          />
          <CodeBlock
            code="yarn add react-denuse-kit"
            language="bash"
          />
          <CodeBlock
            code="pnpm add react-denuse-kit"
            language="bash"
          />
        </div>
      </motion.section>
    </div>
  );
}
