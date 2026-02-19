import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // NOTE: Change base to '/' when deploying to Cloudflare Pages
  // Current value is for GitHub Pages deployment
  base: '/global-anti-ccp-resistance-hub/',
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
