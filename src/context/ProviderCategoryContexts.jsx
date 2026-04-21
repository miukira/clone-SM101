import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import {
  CATEGORY_IDS,
  PROVIDER_NAV_PRIORITY_IDS,
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
  const [loading, setLoading] = useState(() => !Array.isArray(initialSnap[categoryId]))
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setError(null)

    ;(async () => {
      try {
        if (!PROVIDER_NAV_PRIORITY_IDS.includes(categoryId)) {
          await Promise.all(PROVIDER_NAV_PRIORITY_IDS.map((id) => ensureProviderCategory(id)))
        }
        const data = await ensureProviderCategory(categoryId)
        if (!cancelled) setProviders(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!cancelled) {
          setError(e)
          setProviders([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [categoryId])

  const value = useMemo(() => ({ providers, loading, error }), [providers, loading, error])

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
 * @returns {{ providers: Array, loading: boolean, error: Error|null }}
 */
export function useProviderCategory(categoryId) {
  const Ctx = categoryContexts[categoryId]
  if (!Ctx) {
    throw new Error(`Unknown provider category: ${categoryId}`)
  }
  const v = useContext(Ctx)
  if (v === undefined) {
    throw new Error('useProviderCategory must be used within ProviderCategoriesProvider')
  }
  return v
}
