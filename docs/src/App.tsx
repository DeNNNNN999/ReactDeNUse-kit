import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import GettingStarted from './pages/GettingStarted';
import HooksPage from './pages/hooks/HooksPage';

// Import all hook pages
import UseLocalStoragePage from './pages/hooks/UseLocalStoragePage';
import UseDebouncePage from './pages/hooks/UseDebouncePage';
import UseTogglePage from './pages/hooks/UseTogglePage';
import UseWindowSizePage from './pages/hooks/UseWindowSizePage';
import UsePreviousPage from './pages/hooks/UsePreviousPage';
import UseAsyncPage from './pages/hooks/UseAsyncPage';
import UseMediaQueryPage from './pages/hooks/UseMediaQueryPage';
import UseOnClickOutsidePage from './pages/hooks/UseOnClickOutsidePage';
import UseIntervalPage from './pages/hooks/UseIntervalPage';
import UseEventListenerPage from './pages/hooks/UseEventListenerPage';
import UseFetchPage from './pages/hooks/UseFetchPage';
import UseIntersectionObserverPage from './pages/hooks/UseIntersectionObserverPage';
import UseCounterPage from './pages/hooks/UseCounterPage';
import UseHoverPage from './pages/hooks/UseHoverPage';
import UseKeyPressPage from './pages/hooks/UseKeyPressPage';
import UseClickAwayPage from './pages/hooks/UseClickAwayPage';
import UseThrottlePage from './pages/hooks/UseThrottlePage';
import UseIsFirstRenderPage from './pages/hooks/UseIsFirstRenderPage';
import UseUpdateEffectPage from './pages/hooks/UseUpdateEffectPage';
import UseTimeoutPage from './pages/hooks/UseTimeoutPage';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      return (stored as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
          <Route index element={<Home />} />
          <Route path="getting-started" element={<GettingStarted />} />
          <Route path="hooks" element={<HooksPage />} />
          <Route path="hooks/use-local-storage" element={<UseLocalStoragePage />} />
          <Route path="hooks/use-debounce" element={<UseDebouncePage />} />
          <Route path="hooks/use-toggle" element={<UseTogglePage />} />
          <Route path="hooks/use-window-size" element={<UseWindowSizePage />} />
          <Route path="hooks/use-previous" element={<UsePreviousPage />} />
          <Route path="hooks/use-async" element={<UseAsyncPage />} />
          <Route path="hooks/use-media-query" element={<UseMediaQueryPage />} />
          <Route path="hooks/use-on-click-outside" element={<UseOnClickOutsidePage />} />
          <Route path="hooks/use-interval" element={<UseIntervalPage />} />
          <Route path="hooks/use-event-listener" element={<UseEventListenerPage />} />
          <Route path="hooks/use-fetch" element={<UseFetchPage />} />
          <Route path="hooks/use-intersection-observer" element={<UseIntersectionObserverPage />} />
          <Route path="hooks/use-counter" element={<UseCounterPage />} />
          <Route path="hooks/use-hover" element={<UseHoverPage />} />
          <Route path="hooks/use-key-press" element={<UseKeyPressPage />} />
          <Route path="hooks/use-click-away" element={<UseClickAwayPage />} />
          <Route path="hooks/use-throttle" element={<UseThrottlePage />} />
          <Route path="hooks/use-is-first-render" element={<UseIsFirstRenderPage />} />
          <Route path="hooks/use-update-effect" element={<UseUpdateEffectPage />} />
          <Route path="hooks/use-timeout" element={<UseTimeoutPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
