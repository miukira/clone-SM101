/**
 * Public / CDN asset URLs — hasil akhir untuk <img src> biasanya absolute (https://...).
 *
 * Dev lokal tanpa CDN: jangan set VITE_PUBLIC_ASSET_BASE_URL — path "/foo/bar.png" dipakai sebagai
 * origin + path (mis. http://localhost:5173/foo/bar.png); file di public/foo/bar.png.
 *
 * Produksi/CDN: set VITE_PUBLIC_ASSET_BASE_URL (tanpa trailing slash), contoh https://cdn.example.com
 *
 * Basis CDN dinamis (runtime): GET /website — optional `asset_base_url` | `cdn_base_url`
 * (setRuntimeAssetBaseUrl di WebsiteContext). Urutan: env build, lalu runtime, lalu origin.
 */

const ASSET_EXT = /\.(webp|png|jpe?g|svg|gif|avif|ico)(\?.*)?$/i

/** Basis CDN dari GET /website (tanpa trailing slash); kosong = belum di-set / pakai env/origin */
let runtimePublicAssetBase = ''

function trimSlash(s) {
  return s.replace(/\/$/, '')
}

/**
 * Dipanggil dari WebsiteContext saat config website termuat.
 * @param {string | null | undefined} base — mis. https://cdn.domain.com (tanpa trailing slash)
 */
export function setRuntimeAssetBaseUrl(base) {
  if (base == null || typeof base !== 'string') {
    runtimePublicAssetBase = ''
    return
  }
  const t = base.trim()
  runtimePublicAssetBase = t === '' ? '' : trimSlash(t)
}

export function getRuntimeAssetBaseUrl() {
  return runtimePublicAssetBase
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

  if (runtimePublicAssetBase) return runtimePublicAssetBase

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

function resolveProviderAssetBase() {
  const explicit = trimSlash(import.meta.env?.VITE_PROVIDER_IMAGE_BASE_URL || '')
  if (explicit) return explicit

  // Ikuti host FE/CDN yang sama seperti aset publik aplikasi.
  const publicBase = trimSlash(import.meta.env?.VITE_PUBLIC_ASSET_BASE_URL || '')
  if (publicBase) return publicBase

  if (runtimePublicAssetBase) return runtimePublicAssetBase

  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimSlash(window.location.origin)
  }
  return ''
}

/** Path prefix kartu provider di public/ — jangan proxy ke API di Vite; file dari public/animated-brand */
export const ANIMATED_BRAND_PATH_PREFIX = '/animated-brand/'

/**
 * Origin host API/staging yang sering mengembalikan URL absolut ke /animated-brand/…
 * padahal static tidak diserve (placeholder). Dipakai untuk rewrite ke origin FE.
 */
function apiOriginsEligibleForAnimatedBrandRewrite() {
  const a = toOriginBase(import.meta.env?.VITE_API_BASE_URL)
  const b = toOriginBase(import.meta.env?.VITE_API_ASSET_BASE_URL)
  const set = new Set()
  if (a) set.add(a)
  if (b) set.add(b)
  return [...set]
}

/**
 * https://api-host/animated-brand/slot/x.webp → same path di resolveProviderAssetBase() (dev: localhost + public/).
 */
function rewriteAnimatedBrandFromApiHosts(absoluteUrlString) {
  try {
    const u = new URL(absoluteUrlString)
    if (!u.pathname.startsWith(ANIMATED_BRAND_PATH_PREFIX)) return null
    const origins = apiOriginsEligibleForAnimatedBrandRewrite()
    if (!origins.includes(u.origin)) return null
    const pathAndQuery = `${u.pathname}${u.search}`
    const base = resolveProviderAssetBase()
    if (base) return `${base}${pathAndQuery}`
    return pathAndQuery
  } catch {
    return null
  }
}

/**
 * URL untuk gambar kartu provider:
 * - URL absolut (mis. CDN): dipakai apa adanya.
 * - Path relatif (/path/to/image.png): ke host FE/CDN, atau override via VITE_PROVIDER_IMAGE_BASE_URL.
 * - URL absolut ke origin VITE_API_BASE_URL atau VITE_API_ASSET_BASE_URL + path /animated-brand/...:
 *   di-rewrite ke origin FE (atau VITE_PROVIDER_IMAGE_BASE_URL), karena host API sering tidak
 *   menyajikan static (respons teks placeholder / text/plain) sementara file ada di public/ build.
 */
export function providerAssetUrl(path) {
  if (path == null) return null
  if (typeof path !== 'string') return path
  const trimmed = path.trim()
  if (trimmed === '') return null
  if (/^(data:|blob:)/i.test(trimmed)) return trimmed

  if (/^https?:/i.test(trimmed)) {
    const rewritten = rewriteAnimatedBrandFromApiHosts(trimmed)
    if (rewritten != null) return rewritten
    return trimmed
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const base = resolveProviderAssetBase()
  if (base) return `${base}${normalized}`
  return normalized
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
