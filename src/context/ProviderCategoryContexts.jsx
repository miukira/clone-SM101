import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  CATEGORY_IDS,
  ensureProviderCategory,
  getCachedProviderCategorySnapshot,
} from '../utils/providerCategoryApiCache.js'

/** Satu React Context per id kategori — terpisah supaya konsumen tidak share satu blob state. */
const categoryContexts = Object.fromEntries(CATEGORY_IDS.map((id) => [id, createContext(undefined)]))

function SingleCategoryProvider({ categoryId, children }) {
  const Ctx = categoryContexts[categoryId]
  const initialSnap = getCachedProviderCategorySnapshot()
  const [providers, setProviders] = useState(() =>
    Array.isArray(initialSnap[categoryId]) ? initialSnap[categoryId] : [],
  )
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(() => Array.isArray(initialSnap[categoryId]))
  const [error, setError] = useState(null)

  const ensureLoaded = useCallback(async () => {
    if (loaded || loading) return providers
    setError(null)
    setLoading(true)
    try {
      const data = await ensureProviderCategory(categoryId)
      const normalized = Array.isArray(data) ? data : []
      setProviders(normalized)
      setLoaded(true)
      return normalized
    } catch (e) {
      setError(e)
      setProviders([])
      return []
    } finally {
      setLoading(false)
    }
  }, [categoryId, loaded, loading, providers])

  const value = useMemo(
    () => ({ providers, loading, loaded, error, ensureLoaded }),
    [providers, loading, loaded, error, ensureLoaded],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/**
 * Membungkus app dengan satu provider per kategori — tiap kategori punya Context sendiri.
 */
export function ProviderCategoriesProvider({ children }) {
  let node = children
  for (let i = CATEGORY_IDS.length - 1; i >= 0; i--) {
    const id = CATEGORY_IDS[i]
    node = (
      <SingleCategoryProvider key={id} categoryId={id}>
        {node}
      </SingleCategoryProvider>
    )
  }
  return node
}

/**
 * @param {string} categoryId — salah satu dari CATEGORY_IDS (mis. 'slots', 'fishing')
 * @param {{ autoLoad?: boolean }} [options] — default true; set false untuk baca cache/fallback tanpa trigger fetch
 * @returns {{ providers: Array, loading: boolean, error: Error|null }}
 */
export function useProviderCategory(categoryId, options = undefined) {
  const Ctx = categoryContexts[categoryId]
  if (!Ctx) {
    throw new Error(`Unknown provider category: ${categoryId}`)
  }
  const v = useContext(Ctx)
  if (v === undefined) {
    throw new Error('useProviderCategory must be used within ProviderCategoriesProvider')
  }
  const autoLoad = options?.autoLoad !== false

  useEffect(() => {
    if (!autoLoad) return
    v.ensureLoaded?.()
  }, [autoLoad, v.ensureLoaded])

  return { providers: v.providers, loading: v.loading, error: v.error }
}
