import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true,
      interval: 300, // Verifica a cada 300ms
    },
  },
})