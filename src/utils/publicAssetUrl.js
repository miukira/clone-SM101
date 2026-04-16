/**
 * Public / CDN asset URLs — selalu absolute (https://... atau http://...).
 *
 * Set VITE_PUBLIC_ASSET_BASE_URL (tanpa trailing slash), contoh: https://cdn.imageurl.com
 * Jika kosong, di browser dipakai window.location.origin + path.
 */

const ASSET_EXT = /\.(webp|png|jpe?g|svg|gif|avif|ico)(\?.*)?$/i

function trimSlash(s) {
  return s.replace(/\/$/, '')
}

function toOriginBase(raw) {
  if (typeof raw !== 'string') return ''
  const t = raw.trim()
  if (t === '') return ''
  try {
    const u = new URL(t)
    return trimSlash(u.origin)
  } catch {
    return ''
  }
}

function resolveDynamicAssetBase() {
  const explicit = trimSlash(import.meta.env?.VITE_PUBLIC_ASSET_BASE_URL || '')
  if (explicit) return explicit

  // Staging sering mengembalikan path relatif (/providers/...): pakai origin API bila tersedia.
  const apiAssetBase = toOriginBase(import.meta.env?.VITE_API_ASSET_BASE_URL)
  if (apiAssetBase) return apiAssetBase
  const apiBase = toOriginBase(import.meta.env?.VITE_API_BASE_URL)
  if (apiBase) return apiBase
  // NOTE: Tidak pakai VITE_API_PROXY_TARGET untuk asset resolution
  // karena proxy hanya untuk API calls, bukan untuk static assets
  return ''
}

/**
 * Hindari gambar/logo “nyangkut” di cache bila path URL sama tapi file di server diganti.
 * Dipakai setelah GET /website sukses (satu revision per fetch).
 */
export function withCacheBust(url, revision) {
  if (url == null || url === '') return url
  if (typeof url !== 'string') return url
  if (revision == null || revision === '') return url
  if (/^(data:|blob:)/i.test(url)) return url
  const key = encodeURIComponent(String(revision))
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}_cfg=${key}`
}

export function publicAssetUrl(path) {
  if (path == null) return null
  if (typeof path !== 'string') return path
  const trimmed = path.trim()
  if (trimmed === '') return null
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

  const base = resolveDynamicAssetBase()
  if (base) return `${base}${normalized}`

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${normalized}`
  }

  return normalized
}

export function resolveAssetUrlsDeep(input) {
  if (input == null) return input
  if (typeof input === 'string') {
    if (input.startsWith('/') && ASSET_EXT.test(input)) return publicAssetUrl(input)
    return input
  }
  if (Array.isArray(input)) return input.map(resolveAssetUrlsDeep)
  if (typeof input === 'object' && input.constructor === Object) {
    const out = {}
    for (const [k, v] of Object.entries(input)) {
      out[k] = resolveAssetUrlsDeep(v)
    }
    return out
  }
  return input
}
