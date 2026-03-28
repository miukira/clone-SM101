import { useState, useEffect, useCallback } from 'react'
import { 
  getSlotProviders, 
  getSportsbookProviders, 
  getCasinoProviders, 
  getTogelProviders, 
  getFishProviders, 
  getArcadeProviders, 
  getPokerProviders, 
  getCockfightProviders,
  getGameList as apiGetGameList
} from '../services/api'

// Map category IDs to their API fetcher functions
const fetchers = {
  slots: getSlotProviders,
  sports: getSportsbookProviders,
  casino: getCasinoProviders,
  togel: getTogelProviders,
  fishing: getFishProviders,
  arcade: getArcadeProviders,
  poker: getPokerProviders,
  sabung: getCockfightProviders,
}

/**
 * Transform API provider data to frontend format
 * API schema: { provider_id, name, logo, character }
 * Frontend needs: { id, provider_id, name, logoImg, characterImg, logoAlt }
 */
function transformProviderData(apiData) {
  if (!apiData || apiData.length === 0) return []
  
  return apiData.map(provider => ({
    id: provider.provider_id,
    provider_id: provider.provider_id,
    name: provider.name,
    display_name: provider.name?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    logoImg: provider.logo || null,
    characterImg: provider.character || null,
    logoAlt: provider.name,
  }))
}

/**
 * Custom hook to fetch provider data for a given category from the API
 * All data including images comes from API - no more hardcoded static config
 * @param {string} category - The category ID (slots, sports, casino, togel, fishing, arcade, poker, sabung)
 * @returns {{ providers: Array, loading: boolean, error: Error|null }}
 */
export function useProviders(category) {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProviders = async () => {
      setLoading(true)
      setError(null)
      
      const fetchProviderFn = fetchers[category]
      
      if (fetchProviderFn) {
        try {
          const apiData = await fetchProviderFn()
          // Log provider response
          console.log(`📋 Provider Response [${category.toUpperCase()}]: ${apiData.length} item(s)`)
          apiData.forEach((p, i) => {
            console.log(`   [${i+1}] provider_id: ${p.provider_id}, name: "${p.name}", logo: "${p.logo}", character: "${p.character}"`)
          })
          // Transform API data to frontend format (images from API)
          const transformedData = transformProviderData(apiData)
          setProviders(transformedData)
        } catch (err) {
          console.error(`Error fetching ${category} providers:`, err)
          setError(err)
          setProviders([])
        } finally {
          setLoading(false)
        }
      } else {
        console.warn(`Unknown provider category: ${category}`)
        setProviders([])
        setLoading(false)
      }
    }
    
    loadProviders()
  }, [category])

  return { providers, loading, error }
}

/**
 * Custom hook to fetch game list for a specific provider
 * @param {number|string} providerId - The provider ID
 * @returns {{ games: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useGameList(providerId) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGames = useCallback(async () => {
    if (!providerId) {
      setGames([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await apiGetGameList(providerId)
      // Log game list sesuai Swagger Game[] schema (hanya id, name, image)
      console.log(`🎮 Game List Response [provider_id: ${providerId}]: ${data?.length || 0} item(s)`)
      if (data && data.length > 0) {
        data.slice(0, 5).forEach((g, i) => {
          console.log(`   [${i+1}] id: ${g.id}, name: "${g.name}", image: ${g.image || 'null'}`)
        })
        if (data.length > 5) {
          console.log(`   ... dan ${data.length - 5} game lainnya`)
        }
      }
      setGames(data || [])
    } catch (err) {
      console.error(`Error fetching game list for provider ${providerId}:`, err)
      setError(err)
      setGames([])
    } finally {
      setLoading(false)
    }
  }, [providerId])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  return { games, loading, error, refetch: fetchGames }
}

export default useProviders
