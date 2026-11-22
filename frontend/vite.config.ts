import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    host: '127.0.0.1',
    // Wails proxies this exact port. A silent fallback would leave its webview disconnected.
    port: Number(process.env.WAILS_VITE_PORT || 9245),
    strictPort: true,
    // Docker Desktop bind mounts do not always forward host file events.
    watch: { usePolling: process.env.WAILS_VITE_POLLING === '1' },
  },
})
