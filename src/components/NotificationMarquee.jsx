import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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

function applyBrand(lines, brand) {
  if (!Array.isArray(lines)) return []
  return lines.map((s) => String(s).replace(/\{\{brand\}\}/g, brand))
}

/**
 * Marquee teks dari GET /info → notification (array string OpenAPI).
 * variant classic: amber stripe + lampu (HomePage lama).
 * chrome-*: gaya HomePageChrome.
 */
export default function NotificationMarquee({ variant = 'chrome-desktop' }) {
  const { t, i18n } = useTranslation()
  const { notifications, title } = useWebsite()
  const brand = title || 'PUSATTOGEL'

  const segments = useMemo(() => {
    const fromApi = normalizeNotifications(notifications)
    if (fromApi.length > 0) return fromApi
    if (variant === 'classic') return null
    if (variant === 'chrome-mobile') {
      const raw = t('marquee.chromeMobile', { returnObjects: true })
      return applyBrand(raw, brand)
    }
    const raw = t('marquee.chromeDesktop', { returnObjects: true })
    return applyBrand(raw, brand)
  }, [notifications, variant, brand, t, i18n.language])

  if (variant === 'classic') {
    const line = segments?.length
      ? segments.join(' • ')
      : t('marquee.classic', { brand })
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

  if (!segments?.length) return null

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
