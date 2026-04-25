import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'
import { MdChatBubbleOutline } from 'react-icons/md'
import { getContactMenuItems, openExternalContactHref } from '../utils/websiteContact'

const Icon = ({ name, className = '' }) => {
  const cn = `h-[1.1rem] w-[1.1rem] sm:h-5 sm:w-5 shrink-0 ${className}`.trim()
  switch (name) {
    case 'wa':
      return <FaWhatsapp className={cn} aria-hidden />
    case 'tg':
      return <FaTelegramPlane className={cn} aria-hidden />
    case 'testimoni':
      return <MdChatBubbleOutline className={cn} aria-hidden />
    default:
      return <span className="h-5 w-5 shrink-0" aria-hidden />
  }
}

/** Ikon + badge bulat — warna channel, aktif jelas / nonaktif redup. */
function iconPillClass(icon, has) {
  if (icon === 'wa') {
    return has
      ? 'bg-[#25D366] text-white shadow-[0_0_12px_rgba(37,211,102,0.45)]'
      : 'bg-[#25D366]/15 text-[#2fe576]/70 ring-1 ring-[#25D366]/25'
  }
  if (icon === 'tg') {
    return has
      ? 'bg-[#2AABEE] text-white shadow-[0_0_12px_rgba(42,171,238,0.45)]'
      : 'bg-[#2AABEE]/15 text-[#5bc8f7]/80 ring-1 ring-[#2AABEE]/25'
  }
  if (icon === 'testimoni') {
    return has
      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]'
      : 'bg-amber-500/12 text-amber-300/70 ring-1 ring-amber-400/25'
  }
  return 'bg-[#3a3a3a] text-[#888]'
}

/**
 * Popover melayang di atas bottom nav — ikon kiri, teks kanan, sesuai rujukan.
 * URL hanya dari `contact`: whatsapp, telegram, testimoni. Baris tanpa URL nonaktif.
 */
export default function ChromeContactSheet({ isOpen, onClose, contact = {} }) {
  if (!isOpen) return null
  const items = getContactMenuItems(contact)

  const handleRow = (href) => {
    if (!href) return
    openExternalContactHref(href)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] pointer-events-auto" role="dialog" aria-modal aria-label="Menu kontak">
      <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Tutup" />
      <div className="absolute left-1/2 bottom-[4.5rem] z-10 w-[min(20rem,92vw)] -translate-x-1/2 max-md:max-w-[92vw] md:bottom-24">
        <div
          className="rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 py-1.5 text-center text-[10px] font-bold tracking-wider text-[#808080] border-b border-[#333]">
          CONTACT
          </p>
          <ul className="max-h-[min(70vh,360px)] overflow-y-auto">
            {items.map((it) => {
              const has = Boolean(it.href)
              return (
                <li key={it.id} className="border-b border-[#3a3a3a] last:border-0">
                  <button
                    type="button"
                    onClick={() => has && handleRow(it.href)}
                    disabled={!has}
                    className={
                      'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition ' +
                      (has
                        ? 'hover:bg-[#353535] active:bg-[#404040] text-white'
                        : 'text-[#606060] cursor-not-allowed opacity-70')
                    }
                  >
                    <span
                      className={
                        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ' +
                        iconPillClass(it.icon, has)
                      }
                    >
                      <Icon name={it.icon} />
                    </span>
                    <span className="min-w-0 text-[12px] font-medium leading-tight break-words">{it.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
