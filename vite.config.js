import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/global-anti-ccp-resistance-hub/',
  server: {
    host: true,
    allowedHosts: 'all'
  }
})
