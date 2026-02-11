import { FaLightbulb } from 'react-icons/fa'

export default function Marquee() {
  const message = "PUSATTOGEL – Agen Togel Online Terbaik Dan Terpercaya Masa Kini – Selamat Bergabung Dan Semoga Beruntung • RAIH KEMENANGAN ANDA BERSAMA PUSATTOGEL • PUSATTOGEL – Agen Togel Online Terbaik Dan Terpercaya Masa Kini – "

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Yellow/Black warning stripe border - Top */}
      <div className="h-2 md:h-3 bg-repeat-x" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24 0px, #fbbf24 12px, #1a1a1a 12px, #1a1a1a 24px)',
        backgroundSize: '34px 100%'
      }}></div>
      
      {/* Marquee content */}
      <div className="bg-[#0f1c2e] py-2 md:py-3 overflow-hidden">
        <div className="flex items-center">
          <div className="flex-shrink-0 px-2 md:px-4 text-amber-400">
            <FaLightbulb className="text-lg md:text-2xl animate-pulse" />
          </div>
          
          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex">
              <span className="text-amber-400 text-sm md:text-lg font-semibold">{message}</span>
              <span className="text-amber-400 text-sm md:text-lg font-semibold">{message}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom stripe */}
      <div className="h-2 md:h-3 bg-repeat-x" style={{
        backgroundImage: 'repeating-linear-gradient(-45deg, #fbbf24 0px, #fbbf24 12px, #1a1a1a 12px, #1a1a1a 24px)',
        backgroundSize: '34px 100%'
      }}></div>
    </div>
  )
}
