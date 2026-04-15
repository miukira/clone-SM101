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

  const base = trimSlash(import.meta.env?.VITE_PUBLIC_ASSET_BASE_URL || '')
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
