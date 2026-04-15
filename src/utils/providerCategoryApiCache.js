import {
  getSlotProviders,
  getSportsbookProviders,
  getCasinoProviders,
  getTogelProviders,
  getFishProviders,
  getArcadeProviders,
  getCrushProviders,
  getEsportsProviders,
  getPokerProviders,
  getCockfightProviders,
} from '../services/api'
import {
  slotProviders,
  sportsProviders,
  casinoProviders,
  togelProviders,
  fishingProviders,
  arcadeProviders,
  crushProviders,
  esportsProviders,
  pokerProviders,
  cockfightProviders,
} from '../config/providers'
import { transformProviderData } from './transformProviderApi.js'

export const CATEGORY_IDS = [
  'slots',
  'sports',
  'casino',
  'togel',
  'fishing',
  'arcade',
  'crush',
  'esports',
  'poker',
  'sabung',
]

/** Urutan awal home: kotak provider default + strip togel — selebihnya di fase berikutnya */
export const PROVIDER_NAV_PRIORITY_IDS = ['slots', 'togel']

const fetchers = {
  slots: getSlotProviders,
  sports: getSportsbookProviders,
  casino: getCasinoProviders,
  togel: getTogelProviders,
  fishing: getFishProviders,
  arcade: getArcadeProviders,
  crush: getCrushProviders,
  esports: getEsportsProviders,
  poker: getPokerProviders,
  sabung: getCockfightProviders,
}

const staticByCategory = {
  slots: slotProviders,
  sports: sportsProviders,
  casino: casinoProviders,
  togel: togelProviders,
  fishing: fishingProviders,
  arcade: arcadeProviders,
  crush: crushProviders,
  esports: esportsProviders,
  poker: pokerProviders,
  sabung: cockfightProviders,
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
 * Satu request per kategori — dipakai nav dropdown + useProviders (hindari GET /slot dua kali).
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
    const raw = await fetcher()
    const t = transformProviderData(raw || [])
    const merged = mergeStaticExtras(t, staticByCategory[category])
    cache[category] = merged
    return merged
  })()

  inflight.set(category, p)
  p.finally(() => {
    inflight.delete(category)
  })

  return p
}
