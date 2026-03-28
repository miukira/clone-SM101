import { useState, useEffect } from 'react'
import { useLotteryResults } from '../hooks/useLottery'
import togelMacau from '../assets/lottery/toto-macau.png'
import togelSingapore from '../assets/lottery/singapore.png'
import togelHongkong from '../assets/lottery/hongkong.png'
import togelSydney from '../assets/lottery/sydney.png'

// Market images mapping
const marketImages = {
  macau: togelMacau,
  singapore: togelSingapore,
  hongkong: togelHongkong,
  sydney: togelSydney,
  sidney: togelSydney,
}

// Market colors mapping
const marketColors = {
  macau: 'from-red-700 to-red-900',
  singapore: 'from-blue-600 to-blue-800',
  hongkong: 'from-purple-600 to-purple-800',
  sydney: 'from-amber-600 to-amber-800',
  sidney: 'from-amber-600 to-amber-800',
  cambodia: 'from-emerald-600 to-emerald-800',
  taiwan: 'from-cyan-600 to-cyan-800',
  china: 'from-rose-600 to-rose-800',
  japan: 'from-pink-600 to-pink-800',
}

// Transform API results to display format (no fallback - data must come from API)
const transformApiResults = (apiResults) => {
  if (!apiResults || apiResults.length === 0) return { lotteryResults: [], liveResults: [] }
  
  const transformed = apiResults.map((result, index) => {
    const marketKey = result.market?.toLowerCase()
    return {
      id: result.id || index + 1,
      name: result.market?.toUpperCase() || 'UNKNOWN',
      title: result.market?.charAt(0).toUpperCase() + result.market?.slice(1) || 'Unknown',
      subtitle: 'POOLS',
      image: marketImages[marketKey] || togelSingapore,
      periode: result.id?.toString() || String(index + 1),
      result: result.result || '0000',
      bgColor: marketColors[marketKey] || 'from-gray-600 to-gray-800'
    }
  })
  
  // Split into lottery results (first 2) and live results (next 2)
  return {
    lotteryResults: transformed.slice(0, 2),
    liveResults: transformed.slice(2, 4)
  }
}

function CountdownTimer({ initial = { hours: 4, minutes: 41, seconds: 5 } }) {
  const [time, setTime] = useState(initial)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <span className="text-white text-lg font-bold">
      {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
    </span>
  )
}

// Loading Skeleton for Lottery Card
function LotteryCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 animate-pulse">
      <div className="p-4 relative min-h-[140px]">
        <div className="relative z-10">
          <div className="h-4 w-24 bg-gray-600 rounded mb-1"></div>
          <div className="h-3 w-16 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-20 bg-gray-700 rounded mb-2"></div>
          <div className="h-6 w-24 bg-gray-600 rounded mb-2"></div>
          <div className="h-8 w-32 bg-gray-600 rounded"></div>
        </div>
      </div>
      <div className="bg-gray-800 py-2 px-3">
        <div className="h-3 w-28 bg-gray-700 rounded"></div>
      </div>
    </div>
  )
}

export default function LotterySection() {
  // Fetch lottery results from API
  const { results: apiResults, loading } = useLotteryResults()
  
  // Transform API results for display
  const { lotteryResults, liveResults } = transformApiResults(apiResults)
  
  return (
    <section className="flex rounded-xl overflow-hidden">
      {/* Empty sidebar space */}
      <div className="w-44 bg-[#0d1829] flex-shrink-0"></div>
      
      {/* Content */}
      <div className="flex-1 bg-[#0f1c2e] p-4 space-y-4">
        {/* Lottery Results - 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          {loading ? (
            // Loading skeletons
            [1, 2].map((i) => <LotteryCardSkeleton key={i} />)
          ) : (
            lotteryResults.map((lottery) => (
              <div
                key={lottery.id}
                className={`rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] bg-gradient-to-br ${lottery.bgColor}`}
              >
                <div className="p-4 relative min-h-[140px]">
                  <div className="absolute inset-0 opacity-20">
                    <img src={lottery.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-white text-base font-black">{lottery.title}</h3>
                    <p className="text-white/60 text-xs">{lottery.subtitle}</p>
                    <p className="text-white/70 text-xs mt-2">PERIODE: {lottery.periode}</p>
                    <div className="my-1"><CountdownTimer /></div>
                    <p className="text-white text-3xl font-black">{lottery.result}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] py-2 px-3">
                  <p className="text-white text-xs font-bold truncate">{lottery.name}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Results - 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          {loading ? (
            // Loading skeletons
            [1, 2].map((i) => <LotteryCardSkeleton key={i} />)
          ) : (
            liveResults.map((live) => (
              <div
                key={live.id}
                className={`rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] bg-gradient-to-br ${live.bgColor} border border-red-500/40`}
              >
                <div className="p-4 relative min-h-[160px]">
                  <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-3 py-1 font-bold rounded-br">
                    LIVE RESULT
                  </div>
                  <div className="absolute inset-0 opacity-20">
                    <img src={live.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative z-10 pt-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <img src={live.image} alt="" className="w-6 h-6 object-contain" />
                      <div>
                        <h3 className="text-white text-sm font-black">{live.title}</h3>
                        <p className="text-white/60 text-[10px]">{live.subtitle}</p>
                      </div>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded font-semibold my-2">
                      Watch live Stream
                    </button>
                    <p className="text-white/70 text-xs">PERIODE: {live.periode}</p>
                    <div className="my-1"><CountdownTimer initial={{ hours: 20, minutes: 30, seconds: 5 }} /></div>
                    <p className="text-white text-xl font-black">{live.result}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] py-2 px-3">
                  <p className="text-white text-xs font-bold">{live.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
