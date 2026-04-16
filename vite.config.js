import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  /** Dev: browser memanggil /api/v1/* (same-origin); proxy ke mock atau staging → hindari CORS */
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:4010'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
        // Asset provider dari API staging kadang berupa path relatif (/providers/...).
        '/providers': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
