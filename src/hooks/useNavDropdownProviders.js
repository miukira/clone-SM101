import { useState, useEffect } from 'react'
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
import { transformProviderData } from '../utils/transformProviderApi.js'

const CATEGORY_IDS = [
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

let cachedProvidersByCategory = null
let inflightPromise = null

async function loadDropdownProviders() {
  if (cachedProvidersByCategory) return cachedProvidersByCategory
  if (inflightPromise) return inflightPromise

  inflightPromise = (async () => {
    const results = await Promise.all(CATEGORY_IDS.map((id) => fetchers[id]()))
    const out = {}
    CATEGORY_IDS.forEach((id, i) => {
      const raw = results[i] || []
      const t = transformProviderData(raw)
      out[id] = mergeStaticExtras(t, staticByCategory[id])
    })
    cachedProvidersByCategory = out
    inflightPromise = null
    return out
  })().catch((err) => {
    inflightPromise = null
    throw err
  })

  return inflightPromise
}

/**
 * Prefetch daftar provider per kategori untuk dropdown desktop — sama dengan mock API
 * (gambar `/animated-brand/...`). Di-merge dengan config statis untuk badge, overlay, glow.
 */
export function useNavDropdownProviders() {
  const [providersByCategory, setProvidersByCategory] = useState(
    () => cachedProvidersByCategory || {}
  )
  const [loading, setLoading] = useState(!cachedProvidersByCategory)

  useEffect(() => {
    let cancelled = false
    loadDropdownProviders()
      .then((data) => {
        if (!cancelled) setProvidersByCategory(data)
      })
      .catch((e) => {
        console.error('Nav dropdown providers:', e)
        if (!cancelled) setProvidersByCategory({})
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { providersByCategory, loading }
}
