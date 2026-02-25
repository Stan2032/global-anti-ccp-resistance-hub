import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path: configurable via VITE_BASE_PATH env var
  // GitHub Pages: /global-anti-ccp-resistance-hub/ (default)
  // Cloudflare: / (auto-detected via CF_PAGES env var, or set VITE_BASE_PATH=/)
  base: process.env.VITE_BASE_PATH || (process.env.CF_PAGES ? '/' : '/global-anti-ccp-resistance-hub/'),
  server: {
    host: true,
    allowedHosts: 'all'
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
  }
})
