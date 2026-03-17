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

// Import static provider configs (contain images)
import { 
  providers as slotProvidersConfig,
  sportsProviders as sportsProvidersConfig,
  casinoProviders as casinoProvidersConfig,
  togelProviders as togelProvidersConfig,
  fishingProviders as fishingProvidersConfig,
  arcadeProviders as arcadeProvidersConfig,
  pokerProviders as pokerProvidersConfig,
  cockfightProviders as cockfightProvidersConfig
} from '../config/providers'

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

// Map category IDs to their static configs (for images)
const staticConfigs = {
  slots: slotProvidersConfig,
  sports: sportsProvidersConfig,
  casino: casinoProvidersConfig,
  togel: togelProvidersConfig,
  fishing: fishingProvidersConfig,
  arcade: arcadeProvidersConfig,
  poker: pokerProvidersConfig,
  sabung: cockfightProvidersConfig,
}

/**
 * Merge API data with static config to get images
 * @param {Array} apiData - Data from API
 * @param {Array} staticConfig - Static config with images
 * @returns {Array} Merged data with images
 */
function mergeWithStaticConfig(apiData, staticConfig) {
  if (!apiData || apiData.length === 0) return staticConfig || []
  if (!staticConfig || staticConfig.length === 0) return apiData
  
  return apiData.map(apiProvider => {
    // Find matching static provider by provider_id or name
    // Swagger Provider schema: { provider_id, name }
    const staticProvider = staticConfig.find(sp => 
      sp.provider_id === apiProvider.provider_id ||
      sp.id === apiProvider.provider_id ||
      sp.name?.toLowerCase() === apiProvider.name?.toLowerCase()
    )
    
    if (staticProvider) {
      // Merge: API data + static images
      return {
        ...staticProvider,          // Base from static (has images)
        ...apiProvider,             // Override with API data
        // Ensure images from static config are preserved
        characterImg: staticProvider.characterImg,
        logoImg: staticProvider.logoImg,
        logoAlt: staticProvider.logoAlt || staticProvider.display_name || apiProvider.name,
        // Keep both id formats
        id: apiProvider.provider_id || staticProvider.id,
        provider_id: apiProvider.provider_id || staticProvider.provider_id,
      }
    }
    
    // No match found - return API data as is
    return {
      ...apiProvider,
      id: apiProvider.provider_id || apiProvider.id,
      provider_id: apiProvider.provider_id || apiProvider.id,
    }
  })
}

/**
 * Custom hook to fetch provider data for a given category from the API
 * Merges API data with static config to include images
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
      const staticConfig = staticConfigs[category]
      
      if (fetchProviderFn) {
        try {
          const apiData = await fetchProviderFn()
          // Log provider response sesuai Swagger Provider[] schema (hanya provider_id & name)
          console.log(`📋 Provider Response [${category.toUpperCase()}]: ${apiData.length} item(s)`)
          apiData.forEach((p, i) => {
            console.log(`   [${i+1}] provider_id: ${p.provider_id}, name: "${p.name}"`)
          })
          // Merge API data with static config (for images)
          const mergedData = mergeWithStaticConfig(apiData, staticConfig)
          setProviders(mergedData)
        } catch (err) {
          console.error(`Error fetching ${category} providers:`, err)
          setError(err)
          // Fallback to static config on error
          if (staticConfig) {
            console.log(`⚠️ Using static config for ${category}`)
            setProviders(staticConfig)
          } else {
            setProviders([])
          }
        } finally {
          setLoading(false)
        }
      } else {
        // Unknown category - try static config
        if (staticConfig) {
          setProviders(staticConfig)
        } else {
          console.warn(`Unknown provider category: ${category}`)
          setProviders([])
        }
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
