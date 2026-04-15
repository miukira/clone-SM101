import { useState, useEffect } from 'react'
import {
  CATEGORY_IDS,
  PROVIDER_NAV_PRIORITY_IDS,
  ensureProviderCategory,
  getCachedProviderCategorySnapshot,
  isFullProviderCategoryCache,
} from '../utils/providerCategoryApiCache.js'

/**
 * Prefetch daftar provider per kategori untuk dropdown desktop.
 * Fase 1: slots + togel (kebutuhan home utama), fase 2: kategori lain — hindari 11 GET paralel sekaligus.
 * Cache per kategori dipakai bersama useProviders (satu GET per kategori di seluruh app).
 */
export function useNavDropdownProviders() {
  const [providersByCategory, setProvidersByCategory] = useState(() =>
    getCachedProviderCategorySnapshot(),
  )
  const [loading, setLoading] = useState(!isFullProviderCategoryCache())

  useEffect(() => {
    if (isFullProviderCategoryCache()) {
      setProvidersByCategory(getCachedProviderCategorySnapshot())
      setLoading(false)
      return undefined
    }

    let cancelled = false

    const pushSnapshot = () => {
      if (!cancelled) setProvidersByCategory(getCachedProviderCategorySnapshot())
    }

    ;(async () => {
      try {
        await Promise.all(PROVIDER_NAV_PRIORITY_IDS.map((id) => ensureProviderCategory(id)))
        if (cancelled) return
        pushSnapshot()
        setLoading(false)

        const rest = CATEGORY_IDS.filter((id) => !PROVIDER_NAV_PRIORITY_IDS.includes(id))
        await Promise.all(rest.map((id) => ensureProviderCategory(id)))
        if (!cancelled) pushSnapshot()
      } catch (e) {
        console.error('Nav dropdown providers:', e)
        if (!cancelled) setProvidersByCategory(getCachedProviderCategorySnapshot())
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return { providersByCategory, loading }
}
