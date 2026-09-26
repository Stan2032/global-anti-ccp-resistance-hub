import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './styles/print.css'
import App from './App'
import { logger } from './utils/logger'
import { readStoredValue, writeStoredValue } from './utils/ssr'

const root = document.getElementById('root')!

// Routes pre-rendered at build time (see scripts/prerender.mjs) arrive with
// their markup already in place, so attach to it instead of throwing it away
// and re-rendering. Routes that were not pre-rendered — the live-feed pages —
// still ship an empty #root and mount normally.
if (root.hasChildNodes()) {
  hydrateRoot(root, <StrictMode><App /></StrictMode>)
} else {
  createRoot(root).render(<StrictMode><App /></StrictMode>)
}

/*
 * Register the service worker.
 *
 * This lived as an inline <script> in index.html, where the production CSP
 * (`script-src 'self'`) refused to execute it — "Refused to execute inline
 * script". So sw.js shipped with every deploy and never once registered, and
 * the offline support it provides never existed for anyone. Readers on
 * censored or intermittent connections are exactly who that was for.
 *
 * Bundled code is same-origin, so the CSP allows it and no exception has to
 * be carved out. Registration waits for load so it never competes with the
 * first paint.
 *
 * sw.js serves navigations network-first, so a reader still gets fresh
 * content whenever they are online — a cached page is only ever a fallback
 * for being offline, never a stale answer.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      // Not fatal: the site works without it, just without offline support.
      logger.warn('sw', 'Service worker registration failed:', error)
    })
  })
}

/*
 * Tidy what earlier versions left in the reader's browser storage.
 *
 * They wrote these keys on every visit, whether or not the reader had chosen
 * anything, and cached fetched headlines. A key holding only the default
 * records no choice, only that this site was visited, so it goes. The
 * headline cache should never have been stored at all. A real choice — a
 * light theme, a ticked checklist item — is left alone.
 *
 * Safe to delete once returning readers have had time to visit again.
 */
const LEFT_BY_EARLIER_VERSIONS: Record<string, string | null> = {
  rss_feed_cache: null, // whatever it holds
  'resistance-hub-theme': 'dark',
  language: 'en',
  safetyChecklist: '[]',
  dismissedAlerts: '[]',
  'notification-prefs': '{"critical":true,"sanctions":true,"data":true,"action":true}',
}
for (const [key, onlyIfEquals] of Object.entries(LEFT_BY_EARLIER_VERSIONS)) {
  if (onlyIfEquals === null || readStoredValue(key) === onlyIfEquals) writeStoredValue(key, null)
}
