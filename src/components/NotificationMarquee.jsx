import { useMemo } from 'react'
import { FaLightbulb } from 'react-icons/fa'
import { useWebsite } from '../context/WebsiteContext'

function normalizeNotifications(raw) {
  if (!raw || !Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (typeof item === 'string') return item.trim()
      if (item && typeof item === 'object') {
        return String(item.message ?? item.text ?? item.title ?? '').trim()
      }
      return ''
    })
    .filter(Boolean)
}

const FALLBACK_CLASSIC_LINE =
  'PUSATTOGEL – Agen Togel Online Terbaik Dan Terpercaya Masa Kini – Selamat Bergabung Dan Semoga Beruntung • RAIH KEMENANGAN ANDA BERSAMA PUSATTOGEL • PUSATTOGEL – Agen Togel Online Terbaik Dan Terpercaya Masa Kini – '

const FALLBACK_CHROME_DESKTOP = [
  '📢 PUSATTOGEL - Situs Togel Online Terpercaya & Terlengkap Se-Indonesia',
  '🔥 Bayar LUNAS YOOO!!! Withdraw tanpa batas, proses tercepat',
  '🎰 Tersedia ribuan permainan dari provider ternama dunia',
  '💰 Bonus New Member 100% | Cashback Togel hingga 5%',
  '⚡ Deposit & Withdraw 24 Jam Non-Stop',
]

const FALLBACK_CHROME_MOBILE = [
  '📢 PUSATTOGEL - Situs Togel Online Terpercaya',
  '🔥 Bayar LUNAS!!! Withdraw tanpa batas',
  '💰 Bonus New Member 100%',
  '⚡ Deposit & WD 24 Jam',
]

/**
 * Marquee teks dari GET /info → notification (array string OpenAPI).
 * variant classic: amber stripe + lampu (HomePage lama).
 * chrome-*: gaya HomePageChrome.
 */
export default function NotificationMarquee({ variant = 'chrome-desktop' }) {
  const { notifications, title } = useWebsite()
  const brand = title || 'PUSATTOGEL'

  const segments = useMemo(() => {
    const fromApi = normalizeNotifications(notifications)
    if (fromApi.length > 0) return fromApi
    if (variant === 'classic') return null
    if (variant === 'chrome-mobile') {
      return FALLBACK_CHROME_MOBILE.map((s) => s.replace(/PUSATTOGEL/g, brand))
    }
    return FALLBACK_CHROME_DESKTOP.map((s) => s.replace(/PUSATTOGEL/g, brand))
  }, [notifications, variant, brand])

  if (variant === 'classic') {
    const line = segments?.length
      ? segments.join(' • ')
      : FALLBACK_CLASSIC_LINE.replace(/PUSATTOGEL/g, brand)
    return (
      <div className="relative rounded-xl overflow-hidden">
        <div
          className="h-2 md:h-3 bg-repeat-x"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fbbf24 0px, #fbbf24 12px, #1a1a1a 12px, #1a1a1a 24px)',
            backgroundSize: '34px 100%',
          }}
        />
        <div className="bg-[#0f1c2e] py-2 md:py-3 overflow-hidden">
          <div className="flex items-center">
            <div className="flex-shrink-0 px-2 md:px-4 text-amber-400">
              <FaLightbulb className="text-lg md:text-2xl animate-pulse" />
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap flex">
                <span className="text-amber-400 text-sm md:text-lg font-semibold">{line}</span>
                <span className="text-amber-400 text-sm md:text-lg font-semibold">{line}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="h-2 md:h-3 bg-repeat-x"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #fbbf24 0px, #fbbf24 12px, #1a1a1a 12px, #1a1a1a 24px)',
            backgroundSize: '34px 100%',
          }}
        />
      </div>
    )
  }

  const isMobile = variant === 'chrome-mobile'
  const gapClass = isMobile ? 'gap-12' : 'gap-16'
  const textClass = isMobile
    ? 'text-[10px] text-[#808080] font-medium'
    : 'text-xs text-[#808080] font-medium tracking-wide'

  const loop = [...segments, ...segments]

  return (
    <div className={`marquee-track flex items-center ${gapClass} whitespace-nowrap`}>
      {loop.map((text, i) => (
        <span key={i} className={textClass}>
          {text}
        </span>
      ))}
    </div>
  )
}
