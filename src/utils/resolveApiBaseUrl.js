/**
 * Base URL REST API dari VITE_API_BASE_URL (.env) dengan fallback untuk dev lokal.
 * Dipakai oleh src/services/api.js — logika murni agar bisa diuji di Node tanpa Vite.
 */

export function trimTrailingSlash(s) {
  if (s == null || typeof s !== 'string') return ''
  return s.trim().replace(/\/+$/, '')
}

/**
 * @param {string | undefined} viteApiBaseUrl — import.meta.env.VITE_API_BASE_URL
 * @param {string} fallbackBaseUrl — mis. https://staging.rdd-server.com/api/v1 atau /api/v1
 */
export function resolveApiBaseUrl(viteApiBaseUrl, fallbackBaseUrl) {
  const env = trimTrailingSlash(viteApiBaseUrl)
  if (env !== '') return env
  return trimTrailingSlash(fallbackBaseUrl)
}
