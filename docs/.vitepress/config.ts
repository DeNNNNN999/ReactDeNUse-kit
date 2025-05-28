import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ReactDeNUse Kit',
  description: 'Professional React Hooks Library with TypeScript',
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Hooks', link: '/hooks/overview' },
      { text: 'Examples', link: '/examples/' },
      { text: 'API', link: '/api/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Why ReactDeNUse Kit?', link: '/guide/why' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'TypeScript', link: '/guide/typescript' },
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Performance', link: '/guide/performance' },
            { text: 'Best Practices', link: '/guide/best-practices' },
            { text: 'Testing', link: '/guide/testing' },
          ]
        }
      ],
      
      '/hooks/': [
        {
          text: 'Overview',
          items: [
            { text: 'All Hooks', link: '/hooks/overview' },
          ]
        },
        {
          text: 'Performance Hooks',
          items: [
            { text: 'useVirtualList', link: '/hooks/useVirtualList' },
            { text: 'useDeepMemo', link: '/hooks/useDeepMemo' },
          ]
        },
        {
          text: 'State Management',
          items: [
            { text: 'useStateWithHistory', link: '/hooks/useStateWithHistory' },
            { text: 'useUndo', link: '/hooks/useUndo' },
            { text: 'useReducerWithMiddleware', link: '/hooks/useReducerWithMiddleware' },
          ]
        },
        {
          text: 'Network & Async',
          items: [
            { text: 'useWebSocket', link: '/hooks/useWebSocket' },
            { text: 'useSSE', link: '/hooks/useSSE' },
            { text: 'usePolling', link: '/hooks/usePolling' },
            { text: 'useAsync', link: '/hooks/useAsync' },
            { text: 'useFetch', link: '/hooks/useFetch' },
          ]
        },
        {
          text: 'DOM & UI',
          items: [
            { text: 'useMeasure', link: '/hooks/useMeasure' },
            { text: 'useScrollLock', link: '/hooks/useScrollLock' },
            { text: 'useClickAway', link: '/hooks/useClickAway' },
            { text: 'useHover', link: '/hooks/useHover' },
            { text: 'useIntersectionObserver', link: '/hooks/useIntersectionObserver' },
            { text: 'useWindowSize', link: '/hooks/useWindowSize' },
            { text: 'useMediaQuery', link: '/hooks/useMediaQuery' },
            { text: 'useEventListener', link: '/hooks/useEventListener' },
          ]
        },
        {
          text: 'Utilities',
          items: [
            { text: 'useDebounce', link: '/hooks/useDebounce' },
            { text: 'useThrottle', link: '/hooks/useThrottle' },
            { text: 'useToggle', link: '/hooks/useToggle' },
            { text: 'useCounter', link: '/hooks/useCounter' },
            { text: 'useTimeout', link: '/hooks/useTimeout' },
            { text: 'useInterval', link: '/hooks/useInterval' },
            { text: 'useLocalStorage', link: '/hooks/useLocalStorage' },
            { text: 'usePrevious', link: '/hooks/usePrevious' },
            { text: 'useKeyPress', link: '/hooks/useKeyPress' },
            { text: 'useUpdateEffect', link: '/hooks/useUpdateEffect' },
            { text: 'useIsFirstRender', link: '/hooks/useIsFirstRender' },
          ]
        }
      ],
      
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Virtual List', link: '/examples/virtual-list' },
            { text: 'WebSocket Chat', link: '/examples/websocket-chat' },
            { text: 'Form with History', link: '/examples/form-history' },
            { text: 'Infinite Scroll', link: '/examples/infinite-scroll' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/DeNNNNN999/ReactDeNUse-kit' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present DeNNNNN999'
    },

    search: {
      provider: 'local'
    }
  }
})