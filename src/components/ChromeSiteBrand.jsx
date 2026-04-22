import { useWebsite } from '../context/WebsiteContext'

/**
 * Logo + site title from WebsiteContext (API /info).
 * @param {'header'|'drawer'|'footer'} variant
 * @param {() => void} [onClick] — if set and wrapper=true, renders as button
 * @param {string} [className]
 * @param {boolean} [hideTitleOnMobile]
 * @param {boolean} [hideTitle] — if true, logo only (no sitename label)
 * @param {boolean} [wrapper] — if false, only img + title fragment (parent supplies layout / click)
 */
export default function ChromeSiteBrand({
  variant = 'header',
  onClick,
  className = '',
  hideTitleOnMobile = false,
  hideTitle = false,
  wrapper = true,
}) {
  const { logo, title } = useWebsite()

  const imgClass =
    variant === 'drawer'
      ? 'h-8 w-auto max-w-[160px] object-contain object-left flex-shrink-0'
      : variant === 'footer'
        ? 'h-10 sm:h-12 w-auto max-w-[140px] object-contain object-left flex-shrink-0'
        : 'h-9 md:h-10 w-auto max-w-[200px] object-contain object-left flex-shrink-0'

  const titleClass =
    variant === 'drawer'
      ? 'text-xs font-bold text-[#C0C0C0] tracking-wider truncate min-w-0'
      : variant === 'footer'
        ? 'text-xs sm:text-sm font-bold text-[#A0A0A0] tracking-wide truncate min-w-0'
        : `text-[10px] md:text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#909090] tracking-wider truncate min-w-0 ${
            hideTitleOnMobile ? 'hidden md:block' : ''
          }`

  const rowClass = `flex items-center gap-2 min-w-0 ${className}`.trim()

  const img = (
    <img
      key={logo ?? 'brand'}
      src={logo || undefined}
      alt={title}
      className={imgClass}
      decoding="async"
    />
  )
  const label = hideTitle ? null : <span className={titleClass}>{title}</span>

  if (!wrapper) {
    return (
      <>
        {img}
        {label}
      </>
    )
  }

  const inner = (
    <>
      {img}
      {label}
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClass}>
        {inner}
      </button>
    )
  }

  return <div className={rowClass}>{inner}</div>
}
