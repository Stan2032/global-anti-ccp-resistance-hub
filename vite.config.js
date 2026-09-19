import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path: configurable via VITE_BASE_PATH env var
  // Cloudflare / local dev: / (default)
  // GitHub Pages: /global-anti-ccp-resistance-hub/ (set VITE_BASE_PATH in deploy.yml)
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large vendor libraries into cacheable chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: 'all'
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
    // Content-freshness specs assert that human-rights data has been
    // re-verified against its sources recently. They fail with the passage of
    // time rather than from a code change, so they run separately via
    // `npm run test:content` (see vitest.content.config.js) and are excluded
    // here to keep this suite a true code-correctness gate.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'src/test/data-freshness.test.ts',
      'src/test/data-staleness-guard.test.ts',
    ],
  }
})
