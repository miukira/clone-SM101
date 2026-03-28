// Hook untuk fetch lottery/togel data dari API
import { useState, useEffect, useCallback } from 'react'
import * as api from '../services/api'
import { useWebsite } from '../context/WebsiteContext'

/**
 * Hook untuk get lottery results dari WebsiteContext
 * Returns lottery results with market, date, result
 */
export function useLotteryResults() {
  const { lotteryResults, loading } = useWebsite()
  
  useEffect(() => {
    if (lotteryResults && lotteryResults.length > 0) {
      console.log(`🎰 Lottery Results from Context: ${lotteryResults.length} item(s)`)
    }
  }, [lotteryResults])

  return { results: lotteryResults, loading, error: null }
}

/**
 * Hook untuk fetch market info (prize, status, discount, etc.)
 */
export function useMarketInfo(market, type = '4d') {
  const [marketInfo, setMarketInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMarketInfo = useCallback(async () => {
    if (!market) return

    setLoading(true)
    setError(null)

    try {
      const data = await api.getMarketInfo(market, type)
      // Log market info lengkap sesuai Swagger MarketInfo schema
      console.log(`🎯 Market Info Response [${market.toUpperCase()}]:`)
      console.log(`   market: "${data.market || market}"`)
      console.log(`   status: "${data.status}"`)
      console.log(`   prize: { 4d: ${data.prize?.['4d']}, 3d: ${data.prize?.['3d']}, 2d: ${data.prize?.['2d']} }`)
      console.log(`   min_bet: ${data.min_bet}`)
      console.log(`   bet_shortcut: [${data.bet_shortcut?.join(', ')}]`)
      console.log(`   discount_percentage: ${data.discount_percentage}`)
      setMarketInfo(data)
    } catch (err) {
      console.error('Error fetching market info:', err)
      setError(err)
      setMarketInfo(null)
    } finally {
      setLoading(false)
    }
  }, [market, type])

  useEffect(() => {
    if (market) {
      fetchMarketInfo()
    }
  }, [market, type, fetchMarketInfo])

  return { marketInfo, loading, error, refetch: fetchMarketInfo }
}

/**
 * Hook untuk fetch bet history untuk market tertentu
 */
export function useBetHistory(market) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchHistory = useCallback(async () => {
    if (!market) return

    setLoading(true)
    setError(null)

    try {
      const data = await api.getBetHistory(market)
      // Log bet history sesuai Swagger BetHistory[] schema
      if (data && data.length > 0) {
        console.log(`📜 Bet History [${market.toUpperCase()}]: ${data.length} item(s)`)
        data.forEach((bet, i) => {
          console.log(`   [${i+1}] market: "${bet.market}", type: "${bet.type}", number: "${bet.number}", amount: ${bet.amount}, pay: ${bet.pay}, status: "${bet.status}", created_at: "${bet.created_at}"`)
        })
      } else {
        console.log(`📜 Bet History [${market.toUpperCase()}]: empty`)
      }
      setHistory(data || [])
    } catch (err) {
      console.error('Error fetching bet history:', err)
      setError(err)
      setHistory([])
    } finally {
      setLoading(false)
    }
  }, [market])

  useEffect(() => {
    if (market) {
      fetchHistory()
    }
  }, [market, fetchHistory])

  return { history, loading, error, refetch: fetchHistory }
}

/**
 * Hook untuk place bets
 */
export function usePlaceBet() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const placeBet = useCallback(async (bets) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setLastResult(null)

    // Log request sesuai Swagger BetRequest[] schema
    console.log('📤 Place Bet Request (BetRequest[]):')
    bets.forEach((bet, i) => {
      console.log(`   [${i+1}] market: "${bet.market}", type: "${bet.type}", prize: ${bet.prize}, discount: ${bet.discount}, number: "${bet.number}", amount: ${bet.amount}, pay: ${bet.pay}, position: "${bet.position}"`)
    })

    try {
      const result = await api.placeBet(bets)
      setSuccess(true)
      setLastResult(result)
      // Log response sesuai Swagger (message: success + tambahan new_balance, total_bet)
      console.log('✅ Place Bet Response:')
      console.log(`   message: "${result.message}"`)
      console.log(`   new_balance: ${result.new_balance}`)
      console.log(`   total_bet: ${result.total_bet}`)
      return result
    } catch (err) {
      console.error('❌ Error placing bet:', err)
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setSuccess(false)
    setLastResult(null)
  }, [])

  return { placeBet, loading, error, success, lastResult, reset }
}

/**
 * Combined hook untuk togel betting page
 * Menggabungkan market info, bet history, dan place bet
 */
export function useTogelBetting(market) {
  const { marketInfo, loading: marketLoading, error: marketError, refetch: refetchMarket } = useMarketInfo(market)
  const { history, loading: historyLoading, error: historyError, refetch: refetchHistory } = useBetHistory(market)
  const { placeBet, loading: betLoading, error: betError, success: betSuccess, lastResult, reset: resetBet } = usePlaceBet()

  // Refetch both after successful bet
  const handlePlaceBet = useCallback(async (bets) => {
    const result = await placeBet(bets)
    if (result) {
      // Refresh history after bet
      setTimeout(() => {
        refetchHistory()
      }, 500)
    }
    return result
  }, [placeBet, refetchHistory])

  return {
    // Market Info
    marketInfo,
    marketLoading,
    marketError,
    refetchMarket,
    
    // Bet History
    history,
    historyLoading,
    historyError,
    refetchHistory,
    
    // Place Bet
    placeBet: handlePlaceBet,
    betLoading,
    betError,
    betSuccess,
    lastResult, // new_balance, total_bet
    resetBet,
    
    // Combined loading state
    loading: marketLoading || historyLoading || betLoading,
  }
}

// Market display names
export const MARKET_DISPLAY_NAMES = {
  singapore: { name: 'Singapore', day: 'Senin, Rabu, Kamis, Sabtu, Minggu', time: '17:30 WIB' },
  hongkong: { name: 'Hong Kong', day: 'Setiap Hari', time: '23:00 WIB' },
  sydney: { name: 'Sydney', day: 'Setiap Hari', time: '14:00 WIB' },
  sidney: { name: 'Sidney', day: 'Setiap Hari', time: '14:00 WIB' },
  cambodia: { name: 'Cambodia', day: 'Setiap Hari', time: '19:30 WIB' },
  taiwan: { name: 'Taiwan', day: 'Sabtu, Minggu', time: '20:30 WIB' },
  china: { name: 'China', day: 'Setiap Hari', time: '21:00 WIB' },
  japan: { name: 'Japan', day: 'Setiap Hari', time: '19:00 WIB' },
  macau: { name: 'Toto Macau', day: 'Setiap Hari', time: '21:30 WIB' },
}

// Format result string (e.g., "3927" -> "3 9 2 7")
export const formatResult = (result) => {
  if (!result) return ''
  return result.toString().split('').join(' ')
}

// Parse result to array of numbers
export const parseResultToNumbers = (result) => {
  if (!result) return []
  return result.toString().split('').map(Number)
}

export default useLotteryResults
