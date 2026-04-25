import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  /** Dev: bila API memakai path same-origin /api (tanpa VITE_API_BASE_URL absolut) — proxy ke staging, bukan mock */
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'https://staging.rdd-server.com'

  const cdnBase = (env.VITE_PUBLIC_ASSET_BASE_URL || '').replace(/\/$/, '')
  const faviconHref =
    env.VITE_FAVICON_URL || (cdnBase ? `${cdnBase}/favicon.svg` : '/favicon.svg')

  return {
    publicDir: 'public',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-cdn-favicon',
        transformIndexHtml(html) {
          return html.replace(
            /<link rel="icon"[^>]*href="[^"]*"[^>]*>/,
            `<link rel="icon" type="image/svg+xml" href="${faviconHref}" />`,
          )
        },
      },
    ],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
        // JANGAN proxy path `/providers/*` — itu dipakai route SPA (React) `/providers/:category`.
        // Proksi ini membuat reload ke /providers/casino diarahkan ke host API → bukan index.html (tampil placeholder “It works!”, dsb).
        // Jika butuh aset lewat host staging, set URL di API/CDN penuh atau atur path lain, bukan bercanda dengan rute app.
      },
    },
  }
})
