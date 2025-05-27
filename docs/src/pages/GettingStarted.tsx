import { motion } from 'framer-motion';
import CodeBlock from '../components/CodeBlock';

export default function GettingStarted() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl"
    >
      <div>
        <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
        <p className="text-lg text-muted-foreground">
          Get up and running with ReactDeNUse-KIT in minutes.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Prerequisites</h2>
        <p className="text-muted-foreground">
          Before you begin, ensure you have the following installed:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Node.js 16.0 or higher</li>
          <li>React 16.8.0 or higher (for Hooks support)</li>
          <li>TypeScript 4.0 or higher (optional, but recommended)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <p className="text-muted-foreground">
          Install ReactDeNUse-KIT using your preferred package manager:
        </p>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">npm</p>
            <CodeBlock code="npm install react-denuse-kit" language="bash" />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">yarn</p>
            <CodeBlock code="yarn add react-denuse-kit" language="bash" />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">pnpm</p>
            <CodeBlock code="pnpm add react-denuse-kit" language="bash" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Usage</h2>
        <p className="text-muted-foreground">
          Import and use any hook from ReactDeNUse-KIT:
        </p>
        
        <CodeBlock
          code={`import { useLocalStorage, useDebounce, useToggle } from 'react-denuse-kit';

function MyComponent() {
  // Persist state to localStorage
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  // Toggle boolean state
  const [isOpen, toggleOpen] = useToggle(false);
  
  // Debounce input value
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Current theme: {theme}
      </button>
      
      <button onClick={toggleOpen}>
        {isOpen ? 'Close' : 'Open'} Menu
      </button>
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {/* Use debouncedSearchTerm for API calls */}
    </div>
  );
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">TypeScript Support</h2>
        <p className="text-muted-foreground">
          ReactDeNUse-KIT is written in TypeScript and provides full type definitions:
        </p>
        
        <CodeBlock
          code={`import { useLocalStorage } from 'react-denuse-kit';

interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

function Settings() {
  // Fully typed with TypeScript
  const [settings, setSettings] = useLocalStorage<UserSettings>('settings', {
    theme: 'light',
    language: 'en',
    notifications: true,
  });
  
  return (
    <div>
      <h2>Current theme: {settings.theme}</h2>
      <button onClick={() => setSettings({ ...settings, theme: 'dark' })}>
        Switch to Dark Mode
      </button>
    </div>
  );
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Server-Side Rendering (SSR)</h2>
        <p className="text-muted-foreground">
          All hooks in ReactDeNUse-KIT are SSR-compatible and work seamlessly with Next.js:
        </p>
        
        <CodeBlock
          code={`// pages/index.tsx (Next.js)
import { useWindowSize, useMediaQuery } from 'react-denuse-kit';

export default function HomePage() {
  // These hooks safely check for window availability
  const { width, height } = useWindowSize();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      <p>Window size: {width} x {height}</p>
      <p>Mobile view: {isMobile ? 'Yes' : 'No'}</p>
    </div>
  );
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Always follow the Rules of Hooks</li>
          <li>Use TypeScript for better development experience</li>
          <li>Leverage memoization hooks when dealing with expensive computations</li>
          <li>Clean up side effects properly (handled automatically by our hooks)</li>
          <li>Consider performance implications when using hooks in large lists</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Next Steps</h2>
        <p className="text-muted-foreground">
          Now that you have ReactDeNUse-KIT installed, explore our comprehensive collection of hooks:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Browse the <a href="/hooks" className="text-primary hover:underline">complete hooks reference</a></li>
          <li>Check out real-world examples for each hook</li>
          <li>Learn about advanced patterns and use cases</li>
          <li>Contribute to the project on <a href="https://github.com/react-denuse/react-denuse-kit" className="text-primary hover:underline">GitHub</a></li>
        </ul>
      </section>
    </motion.div>
  );
}
