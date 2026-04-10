/**
 * Base URL API dari .env (VITE_API_BASE_URL) + fallback per API_MODE.
 * Dipakai oleh src/services/api.js — logika murni agar bisa diuji di Node tanpa Vite.
 */

export function trimTrailingSlash(s) {
  if (s == null || typeof s !== 'string') return ''
  return s.trim().replace(/\/+$/, '')
}

/**
 * @param {'mock-direct' | 'mock-server' | 'real'} apiMode
 * @param {string | undefined} viteApiBaseUrl — nilai import.meta.env.VITE_API_BASE_URL
 * @param {Record<string, string | null>} fallbacks — mis. { 'mock-server': 'http://...', 'real': '/api/v1', 'mock-direct': null }
 */
export function resolveApiBaseUrl(apiMode, viteApiBaseUrl, fallbacks) {
  if (apiMode === 'mock-direct') return null
  const env = trimTrailingSlash(viteApiBaseUrl)
  if (env !== '') return env
  return fallbacks[apiMode] ?? null
}
