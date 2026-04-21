import { useCallback, useEffect, useState } from 'react'
import { getGameList as apiGetGameList } from '../services/api'
import { useProviderCategory } from '../context/ProviderCategoryContexts.jsx'
import { transformProviderData } from '../utils/transformProviderApi.js'
import { normalizeImageUrl } from '../utils/normalizeImageUrl.js'

export { transformProviderData }

/**
 * Data provider untuk satu kategori — dari Context kategori yang sesuai (cache API sama di bawahnya).
 */
export function useProviders(category) {
  return useProviderCategory(category)
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
          console.log(`   [${i + 1}] id: ${g.id}, name: "${g.name}", image: ${g.image || 'null'}`)
        })
        if (data.length > 5) {
          console.log(`   ... dan ${data.length - 5} game lainnya`)
        }
      }
      setGames(
        (data || []).map((g) => ({
          ...g,
          image: normalizeImageUrl(g.image),
        })),
      )
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
