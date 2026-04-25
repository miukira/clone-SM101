/**
 * Public / CDN asset URLs — hasil akhir untuk <img src> biasanya absolute (https://...).
 *
 * Vite publicDir: `public/` (flat + folder: banners, animated-brand, icons, popups; favicon dsb. di root).
 * Dev: tanpa VITE_PUBLIC_ASSET_BASE_URL — path "/banners/foo.png" jadi http://localhost:5173/banners/foo.png
 *
 * Produksi/CDN: set VITE_PUBLIC_ASSET_BASE_URL (tanpa trailing slash)
 *
 * Basis CDN dinamis: GET /website — optional `asset_base_url` | `cdn_base_url` (setRuntimeAssetBaseUrl di WebsiteContext).
 *
 * `mapLegacyPublicPath` memetakan bentuk lama (/static/..., /internal/animated-brand/...) ke path sekarang.
 */

const ASSET_EXT = /\.(webp|png|jpe?g|svg|gif|avif|ico)(\?.*)?$/i

/** Path gambar kartu provider (sama dengan path respons API) — mirror: public/animated-brand/ */
export const ANIMATED_BRAND_PATH_PREFIX = '/animated-brand/'

/** Alias untuk baca kode: file disajikan di path yang sama */
export const ANIMATED_BRAND_SERVED_PREFIX = '/animated-brand/'

/** Basis CDN dari GET /website (tanpa trailing slash); kosong = belum di-set / pakai env/origin */
let runtimePublicAssetBase = ''

function trimSlash(s) {
  return s.replace(/\/$/, '')
}

/**
 * Path lama (refactor /static, /internal) → path disajikan sekarang.
 * Path kanon: /banners/..., /icons/..., /popups/..., /animated-brand/..., /favicon.svg, dll.
 */
export function mapLegacyPublicPath(path) {
  if (path == null || path === '' || path === '/static' || path === '/internal') return path
  if (path === '/static/' || path.startsWith('/static/')) {
    return path.replace(/^\/static\//, '/')
  }
  if (path === '/internal/animated-brand' || path.startsWith('/internal/animated-brand/')) {
    return path.replace(/^\/internal(?=\/animated-brand)/, '')
  }
  return path
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

  const apiAssetBase = toOriginBase(import.meta.env?.VITE_API_ASSET_BASE_URL)
  if (apiAssetBase) return apiAssetBase
  const apiBase = toOriginBase(import.meta.env?.VITE_API_BASE_URL)
  if (apiBase) return apiBase
  return ''
}

/**
 * Hindari gambar/logo "nyangkut" di cache bila path URL sama tapi file di server diganti.
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

  const publicBase = trimSlash(import.meta.env?.VITE_PUBLIC_ASSET_BASE_URL || '')
  if (publicBase) return publicBase

  if (runtimePublicAssetBase) return runtimePublicAssetBase

  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimSlash(window.location.origin)
  }
  return ''
}

/**
 * Origin host API sering URL absolut /animated-brand/... padahal aset disajikan dari FE.
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
 * https://api/animated-brand/slot/x.webp → origin FE, path /animated-brand/... sama
 */
function rewriteAnimatedBrandFromApiHosts(absoluteUrlString) {
  try {
    const u = new URL(absoluteUrlString)
    if (!u.pathname.startsWith(ANIMATED_BRAND_PATH_PREFIX)) return null
    const origins = apiOriginsEligibleForAnimatedBrandRewrite()
    if (!origins.includes(u.origin)) return null
    const pathAndQuery = `${u.pathname}${u.search}${u.hash}`
    const base = resolveProviderAssetBase()
    if (base) return `${base}${pathAndQuery}`
    return pathAndQuery
  } catch {
    return null
  }
}

/**
 * URL gambar kartu provider — path relatif /animated-brand/... mengikuti host FE/CDN
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

  let normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  normalized = mapLegacyPublicPath(normalized)
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

  const normalized = mapLegacyPublicPath(trimmed.startsWith('/') ? trimmed : `/${trimmed}`)

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
