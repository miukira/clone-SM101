import {
  getSlotProviders,
  getSportsbookProviders,
  getCasinoProviders,
  getFishProviders,
} from '../services/api'

const IS_DEV = import.meta.env.DEV === true
import {
  slotProviders,
  sportsProviders,
  casinoProviders,
  fishingProviders,
} from '../config/providers'
import { transformProviderData } from './transformProviderApi.js'

export const CATEGORY_IDS = [
  'slots',
  'sports',
  'casino',
  'fishing',
]

/** Urutan awal home: mulai dari slots lalu sisanya */
export const PROVIDER_NAV_PRIORITY_IDS = ['slots']

const fetchers = {
  slots: getSlotProviders,
  sports: getSportsbookProviders,
  casino: getCasinoProviders,
  fishing: getFishProviders,
}

const staticByCategory = {
  slots: slotProviders,
  sports: sportsProviders,
  casino: casinoProviders,
  fishing: fishingProviders,
}

function mergeStaticExtras(transformed, staticList) {
  if (!staticList?.length) return transformed
  return transformed.map((p) => {
    const sid = Number(p.provider_id)
    const s = staticList.find((x) => Number(x.provider_id) === sid)
    if (!s) return p
    return {
      ...p,
      name: s.name ?? p.display_name ?? p.name,
      logoAlt: s.logoAlt ?? p.logoAlt,
      badge: p.badge ?? s.badge ?? null,
      overlayImg: s.overlayImg ?? null,
      glowColor: s.glowColor,
      glowColorHover: s.glowColorHover,
      animationPrefix: s.animationPrefix,
    }
  })
}

const cache = {}
const inflight = new Map()

export function getCachedProviderCategorySnapshot() {
  const out = {}
  for (const id of CATEGORY_IDS) {
    if (cache[id]) out[id] = cache[id]
  }
  return out
}

export function isFullProviderCategoryCache() {
  return CATEGORY_IDS.every((id) => Array.isArray(cache[id]))
}

/**
 * Satu request per kategori (cache modul) — dipakai ProviderCategoryContexts + ensureProviderCategory.
 */
export async function ensureProviderCategory(category) {
  if (cache[category]) return cache[category]
  let p = inflight.get(category)
  if (p) return p

  const fetcher = fetchers[category]
  if (!fetcher) {
    cache[category] = []
    return []
  }

  p = (async () => {
    try {
      const raw = await fetcher()
      if (!Array.isArray(raw)) {
        if (IS_DEV) console.warn(`⚠️ /${category} non-array response`)
        cache[category] = []
        return []
      }
      const t = transformProviderData(raw)
      const merged = mergeStaticExtras(t, staticByCategory[category])
      cache[category] = merged
      return merged
    } catch (err) {
      if (IS_DEV) console.warn(`⚠️ /${category} failed`)
      cache[category] = []
      return []
    }
  })()

  inflight.set(category, p)
  p.finally(() => {
    inflight.delete(category)
  })

  return p
}
