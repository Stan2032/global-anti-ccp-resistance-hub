import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './styles/print.css'
import App from './App'

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
