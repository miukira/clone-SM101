import { useState, useEffect } from 'react'
import togelMacau from '../assets/lottery/toto-macau.png'
import togelSingapore from '../assets/lottery/singapore.png'
import togelHongkong from '../assets/lottery/hongkong.png'
import togelSydney from '../assets/lottery/sydney.png'

const lotteryResults = [
  { 
    id: 1, 
    name: 'TOTO MACAU MALA...', 
    title: 'TOTO MACAU',
    subtitle: 'POOLS',
    image: togelMacau, 
    periode: '1182', 
    result: '2495',
    bgColor: 'from-red-700 to-red-900'
  },
  { 
    id: 2, 
    name: 'SINGAPORE', 
    title: 'SINGAPORE',
    subtitle: 'POOLS/4D',
    image: togelSingapore, 
    periode: '844', 
    result: '4405',
    bgColor: 'from-blue-600 to-blue-800'
  },
]

const liveResults = [
  { 
    id: 1, 
    name: 'SYDNEY LOTTO', 
    title: 'SYDNEY',
    subtitle: 'LOTTO',
    image: togelSydney, 
    periode: '449', 
    result: '8396,7689,4846',
    bgColor: 'from-amber-600 to-amber-800'
  },
  { 
    id: 2, 
    name: 'HONGKONG LOTTO', 
    title: 'HongKong',
    subtitle: 'Lotto',
    image: togelHongkong, 
    periode: '448', 
    result: '3626,9921,1057',
    bgColor: 'from-purple-600 to-purple-800'
  },
]

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

export default function LotterySection() {
  return (
    <section className="flex rounded-xl overflow-hidden">
      {/* Empty sidebar space */}
      <div className="w-44 bg-[#0d1829] flex-shrink-0"></div>
      
      {/* Content */}
      <div className="flex-1 bg-[#0f1c2e] p-4 space-y-4">
        {/* Lottery Results - 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          {lotteryResults.map((lottery) => (
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
          ))}
        </div>

        {/* Live Results - 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          {liveResults.map((live) => (
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
          ))}
        </div>
      </div>
    </section>
  )
}
