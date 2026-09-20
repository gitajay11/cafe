import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Reservation API (npm run server) during development.
    proxy: { "/api": "http://localhost:8790" },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep the animation runtime in its own long-lived chunk.
        codeSplitting: {
          groups: [{ name: 'motion', test: /node_modules[/\\](framer-motion|motion-dom|motion-utils)[/\\]/ }],
        },
      },
    },
  },
})
