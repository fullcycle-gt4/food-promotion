import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    hmr: process.env.CODESPACES ? { clientPort: 443 } : undefined,
    watch: { usePolling: process.env.VITE_POLLING === 'true' },
  },
});