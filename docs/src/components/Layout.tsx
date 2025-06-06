import { Outlet, Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const hooks = [
  { name: 'useLocalStorage', path: '/hooks/use-local-storage', category: 'State' },
  { name: 'useDebounce', path: '/hooks/use-debounce', category: 'Performance' },
  { name: 'useToggle', path: '/hooks/use-toggle', category: 'State' },
  { name: 'useWindowSize', path: '/hooks/use-window-size', category: 'DOM' },
  { name: 'usePrevious', path: '/hooks/use-previous', category: 'Lifecycle' },
  { name: 'useAsync', path: '/hooks/use-async', category: 'Async' },
  { name: 'useMediaQuery', path: '/hooks/use-media-query', category: 'DOM' },
  { name: 'useOnClickOutside', path: '/hooks/use-on-click-outside', category: 'DOM' },
  { name: 'useInterval', path: '/hooks/use-interval', category: 'Timers' },
  { name: 'useEventListener', path: '/hooks/use-event-listener', category: 'Events' },
  { name: 'useFetch', path: '/hooks/use-fetch', category: 'Async' },
  { name: 'useIntersectionObserver', path: '/hooks/use-intersection-observer', category: 'DOM' },
  { name: 'useCounter', path: '/hooks/use-counter', category: 'State' },
  { name: 'useHover', path: '/hooks/use-hover', category: 'Events' },
  { name: 'useKeyPress', path: '/hooks/use-key-press', category: 'Events' },
  { name: 'useClickAway', path: '/hooks/use-click-away', category: 'Events' },
  { name: 'useThrottle', path: '/hooks/use-throttle', category: 'Performance' },
  { name: 'useIsFirstRender', path: '/hooks/use-is-first-render', category: 'Lifecycle' },
  { name: 'useUpdateEffect', path: '/hooks/use-update-effect', category: 'Lifecycle' },
  { name: 'useTimeout', path: '/hooks/use-timeout', category: 'Timers' },
];

const categories = ['State', 'Performance', 'DOM', 'Events', 'Async', 'Lifecycle', 'Timers'];

export default function Layout({ theme, toggleTheme }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="hidden lg:block w-64 bg-card border-r overflow-y-auto"
          >
            <div className="p-6">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold gradient-text">ReactDeNUse</span>
              </Link>
            </div>
            
            <nav className="px-4 pb-6">
              <div className="space-y-1 mb-6">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/getting-started"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`
                  }
                >
                  Getting Started
                </NavLink>
              </div>

              <div className="space-y-4">
                <h3 className="px-4 text-sm font-semibold text-muted-foreground">HOOKS</h3>
                {categories.map(category => (
                  <div key={category}>
                    <h4 className="px-4 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {category}
                    </h4>
                    <div className="space-y-1">
                      {hooks
                        .filter(hook => hook.category === category)
                        .map(hook => (
                          <NavLink
                            key={hook.path}
                            to={hook.path}
                            className={({ isActive }) =>
                              `block px-4 py-2 text-sm rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted'
                              }`
                            }
                          >
                            {hook.name}
                          </NavLink>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-card border-r overflow-y-auto z-50"
            >
              <div className="p-6">
                <Link to="/" className="flex items-center space-x-2">
                  <span className="text-2xl font-bold gradient-text">ReactDeNUse</span>
                </Link>
              </div>
              
              <nav className="px-4 pb-6">
                <div className="space-y-1 mb-6">
                  <NavLink
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/getting-started"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`
                    }
                  >
                    Getting Started
                  </NavLink>
                </div>

                <div className="space-y-4">
                  <h3 className="px-4 text-sm font-semibold text-muted-foreground">HOOKS</h3>
                  {categories.map(category => (
                    <div key={category}>
                      <h4 className="px-4 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {hooks
                          .filter(hook => hook.category === category)
                          .map(hook => (
                            <NavLink
                              key={hook.path}
                              to={hook.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                }`
                              }
                            >
                              {hook.name}
                            </NavLink>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 rounded-lg hover:bg-muted"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/react-denuse/react-denuse-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-muted"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted"
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
