// FooterChrome.jsx - Reusable footer component for Chrome theme

import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { providerAssetUrl } from '../utils/publicAssetUrl'
import { normalizeImageUrl } from '../utils/normalizeImageUrl'
import { useWebsite } from '../context/WebsiteContext'
import { useProviderCategory } from '../context/ProviderCategoryContexts.jsx'
import {
  slotProviders,
  sportsProviders,
  casinoProviders,
  fishingProviders,
} from '../config/providers'
import ChromeSiteBrand from './ChromeSiteBrand'
import { dedupeFooterProvidersByBrandAndImage } from '../utils/footerProviderDedupe.js'

/**
 * Game Providers di footer: data dari API (kategori slot/sports/casino/fishing), URL gambar
 * lewat providerAssetUrl (CDN / GET /website). Tanpa bundle gambar lokal; bila URL kosong/404 tampil nama.
 */
function FooterProviderThumb({ provider }) {
  const name = provider.display_name || provider.name || 'Provider'
  const raw =
    normalizeImageUrl(provider.logoImg) ?? normalizeImageUrl(provider.characterImg) ?? null
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [raw, provider.provider_id, provider.id])

  const canShowImg = raw != null && raw !== '' && !failed
  const src = canShowImg ? providerAssetUrl(raw) : null

  return (
    <div
      className="aspect-[3/2] bg-[#111] themed-card rounded-md flex items-center justify-center p-1.5 hover:bg-[#1a1a1a] transition-all cursor-default overflow-hidden"
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="max-w-full max-h-full object-contain filter brightness-90 hover:brightness-110 transition-all"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-[8px] sm:text-[9px] text-center text-[#707070] leading-tight line-clamp-3 px-0.5 font-medium">
          {name}
        </span>
      )}
    </div>
  )
}

function useFooterGameProviders() {
  const { providers: slots, loading: ls } = useProviderCategory('slots', { autoLoad: false })
  const { providers: sports, loading: lsp } = useProviderCategory('sports', { autoLoad: false })
  const { providers: casino, loading: lc } = useProviderCategory('casino', { autoLoad: false })
  const { providers: fishing, loading: lf } = useProviderCategory('fishing', { autoLoad: false })

  const merged = useMemo(() => {
    const m = new Map()

    // Seed from static config so footer stays complete even when API category is empty/partial.
    for (const p of [...slotProviders, ...sportsProviders, ...casinoProviders, ...fishingProviders]) {
      const id = p?.provider_id ?? p?.id
      if (id == null) continue
      const key = String(id)
      if (!m.has(key)) m.set(key, p)
    }

    // API takes precedence for latest names/images/badges.
    for (const p of [...(slots || []), ...(sports || []), ...(casino || []), ...(fishing || [])]) {
      const id = p?.provider_id ?? p?.id
      if (id == null) continue
      const key = String(id)
      const prev = m.get(key)
      if (!prev) {
        m.set(key, p)
        continue
      }
      const merged = { ...prev, ...p }
      // Simpan id slug string dari config (bukan 1015) supaya dedup antar kategori
      // jili + jili-fishing → satu kunci di footerProviderDedupe.
      if (typeof prev.id === 'string' && String(prev.id).trim() !== '' && (typeof p.id === 'number' || p.id == null)) {
        merged.id = prev.id
      }
      m.set(key, merged)
    }

    // Satu tile per brand: logoAlt + normalisasi label (bukan cuma display_name) + path gambar
    // supaya JILI/Pragmatic tidak double antar kategori/override API.
    return dedupeFooterProvidersByBrandAndImage(Array.from(m.values()))
  }, [slots, sports, casino, fishing])

  const loading = ls || lsp || lc || lf
  return { providers: merged, loading }
}

const BRAND_TOKEN = 'PUSATTOGEL'

/** Ganti token PUSATTOGEL dengan title; kemunculan nama brand diberi warna emas */
function interleaveBrand(text, title) {
  if (!text) return null
  const parts = text.split(BRAND_TOKEN)
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? <span className="text-[#fbbf24]">{title}</span> : null}
    </Fragment>
  ))
}

// Bank/Payment SVG Components - matching momo99 style
const BankLogos = {
  LocalBank: () => (
    <div className="flex items-center gap-1.5 px-2">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#22c55e"/>
        <path d="M6 12h12M6 16h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <div className="text-left">
        <div className="text-[9px] font-bold text-white leading-tight">Local Bank</div>
        <div className="text-[7px] text-green-300 leading-tight">TRANSFER</div>
      </div>
    </div>
  ),
  EWallet: () => (
    <div className="flex items-center gap-1.5 px-2">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">E</span>
      </div>
      <div className="text-left">
        <div className="text-[9px] font-bold text-orange-400 leading-tight">E-WALLET</div>
        <div className="text-[6px] text-orange-300 leading-tight">OVO, DANA, GOPAY</div>
      </div>
    </div>
  ),
  Pulsa: () => (
    <div className="flex items-center gap-1.5 px-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="2" width="14" height="20" rx="2" fill="#8b5cf6"/>
        <rect x="7" y="4" width="10" height="12" rx="1" fill="#1a1a1a"/>
        <circle cx="12" cy="18" r="1.5" fill="white"/>
      </svg>
      <div className="text-left">
        <div className="text-[9px] font-bold text-purple-400 leading-tight">PULSA</div>
        <div className="text-[6px] text-purple-300 leading-tight">XL, TELKOMSEL</div>
      </div>
    </div>
  ),
  QRIS: () => (
    <div className="flex items-center gap-1.5 px-2">
      <div className="bg-white rounded px-1 py-0.5">
        <span className="text-[8px] font-bold text-black">QRIS</span>
      </div>
      <div className="text-[7px] text-gray-400 leading-tight">QR Code Standar<br/>Pembayaran Nasional</div>
    </div>
  ),
  GoPay: () => (
    <div className="flex items-center gap-1.5 px-2">
      <div className="w-5 h-5 rounded-full bg-[#00aed6] flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">G</span>
      </div>
      <span className="text-sm font-bold text-[#00aed6]">gopay</span>
    </div>
  ),
  PermataBank: () => (
    <div className="flex items-center gap-1 px-2">
      <span className="text-[11px] font-medium text-gray-300">PermataBank</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#22c55e">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    </div>
  ),
  CIMB: () => (
    <div className="flex items-center gap-1 px-1">
      <div className="bg-[#a6192e] px-1.5 py-0.5 rounded">
        <span className="text-[8px] font-bold text-white">CIMB</span>
      </div>
      <span className="text-[10px] font-bold text-white">NIAGA</span>
    </div>
  ),
  Maybank: () => (
    <div className="flex items-center gap-1.5 px-2 bg-[#ffc72c] rounded h-full">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6" fill="#ffc72c"/>
      </svg>
      <span className="text-[10px] font-bold text-black">Maybank</span>
    </div>
  ),
  BCA: () => (
    <div className="flex items-center gap-1.5 px-2">
      <div className="w-5 h-5 rounded-full bg-[#003b7c] flex items-center justify-center border border-white/20">
        <span className="text-[6px] font-bold text-white">BCA</span>
      </div>
      <span className="text-lg font-black text-[#003b7c]" style={{color: '#0066cc'}}>BCA</span>
    </div>
  ),
  BNI: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#f15a22"/>
        <path d="M8 8v8M12 8v8M16 8v8" stroke="white" strokeWidth="2"/>
      </svg>
      <span className="text-lg font-black text-[#f15a22]">BNI</span>
    </div>
  ),
  BRI: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="2" fill="#0066cc"/>
        <text x="12" y="14" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">BRI</text>
      </svg>
      <span className="text-[11px] font-bold text-[#0066cc]">BANK BRI</span>
    </div>
  ),
  BSI: () => (
    <div className="flex items-center gap-1 px-2">
      <span className="text-lg font-black text-[#00a651]">BSI</span>
      <div className="text-[6px] text-[#00a651] leading-tight">BANK SYARIAH<br/>INDONESIA</div>
    </div>
  ),
  DANA: () => (
    <div className="flex items-center gap-1 px-2">
      <div className="w-5 h-5 rounded-lg bg-[#118eea] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">D</span>
      </div>
      <span className="text-sm font-bold text-[#118eea]">DANA</span>
    </div>
  ),
  Danamon: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="20" height="14" viewBox="0 0 30 20">
        <path d="M0 10 L15 0 L30 10 L15 20 Z" fill="#ffc72c"/>
        <path d="M5 10 L15 3 L25 10 L15 17 Z" fill="#f97316"/>
      </svg>
      <span className="text-[10px] font-medium text-[#f97316]">Danamon</span>
    </div>
  ),
  Jago: () => (
    <div className="flex items-center gap-1.5 px-2">
      <span className="text-lg font-bold text-[#ffcc00]">ü</span>
      <span className="text-sm font-bold text-white">Jago</span>
    </div>
  ),
  Jenius: () => (
    <div className="flex items-center gap-1 px-2 bg-white rounded h-full">
      <span className="text-[8px] text-gray-600">SMBC/</span>
      <div className="bg-[#00adb5] rounded px-1">
        <span className="text-[8px] font-bold text-white">Jenius</span>
      </div>
    </div>
  ),
  Mandiri: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="24" height="14" viewBox="0 0 40 20">
        <path d="M5 5 Q20 0 35 5 Q20 10 5 5" fill="#ffc72c" stroke="#ffc72c"/>
        <path d="M5 15 Q20 10 35 15 Q20 20 5 15" fill="#ffc72c" stroke="#ffc72c"/>
      </svg>
      <span className="text-[11px] font-medium text-[#003b7c]">mandiri</span>
    </div>
  ),
  ShopeePay: () => (
    <div className="flex items-center gap-1 px-2">
      <div className="w-4 h-4 rounded bg-[#ee4d2d] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">S</span>
      </div>
      <span className="text-[10px] font-bold text-[#ee4d2d]">ShopeePay</span>
    </div>
  ),
  SeaBank: () => (
    <div className="flex items-center gap-1 px-2">
      <div className="w-4 h-4 rounded-full bg-[#00adb5] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">S</span>
      </div>
      <span className="text-[10px] font-bold text-[#00adb5]">SeaBank</span>
    </div>
  ),
  Telkomsel: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="16" height="16" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#e4002b" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" fill="#e4002b"/>
      </svg>
      <span className="text-[9px] font-bold text-white">TELKOMSEL</span>
    </div>
  ),
  OVO: () => (
    <div className="flex items-center justify-center px-2">
      <span className="text-xl font-black text-[#4c3494]" style={{letterSpacing: '-2px'}}>OVO</span>
    </div>
  ),
  LinkAja: () => (
    <div className="flex items-center justify-center px-2">
      <div className="text-center">
        <span className="text-sm font-bold text-[#e4002b] italic">Link</span>
        <span className="text-sm font-bold text-[#e4002b]">Aja!</span>
      </div>
    </div>
  ),
  XL: () => (
    <div className="flex items-center justify-center px-2">
      <svg width="32" height="20" viewBox="0 0 40 24">
        <path d="M5 4 L20 20 M20 4 L5 20" stroke="#0066b3" strokeWidth="4" strokeLinecap="round"/>
        <path d="M22 8 L22 20 L35 20" stroke="#00a651" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  ),
}

// Bank items array
const bankItems = [
  'LocalBank', 'EWallet', 'Pulsa', 'QRIS', 'GoPay', 'PermataBank',
  'CIMB', 'Maybank', 'BCA', 'BNI', 'BRI', 'BSI',
  'DANA', 'Danamon', 'Jago', 'Jenius', 'Mandiri', 'ShopeePay',
  'SeaBank', 'Telkomsel', 'OVO', 'LinkAja', 'XL'
]

export default function FooterChrome() {
  const { t } = useTranslation()
  const { title, name } = useWebsite()
  const { providers: footerProviders, loading: footerProvidersLoading } = useFooterGameProviders()
  const brandName = (name && String(name).trim()) || title

  return (
    <footer className="bg-[#0a0a0a] themed-border-top mt-8 relative z-10">
      {/* Game Providers Section — URL gambar dari API + providerAssetUrl (bukan file di public/ lokal) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 themed-border-bottom">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[#C0C0C0] tracking-wider">{t('footer.gameProviders')}</h3>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-2 sm:gap-3">
          {footerProvidersLoading ? (
            Array.from({ length: 24 }).map((_, i) => (
              <div
                key={`fp-skel-${i}`}
                className="aspect-[3/2] bg-[#1a1a1a] themed-card rounded-md animate-pulse"
              />
            ))
          ) : footerProviders.length === 0 ? (
            <p className="col-span-full text-center text-xs text-[#505050] py-4">
              {t('footer.noProviders')}
            </p>
          ) : (
            footerProviders.map((p) => (
              <FooterProviderThumb
                key={p.provider_id ?? p.id}
                provider={p}
              />
            ))
          )}
        </div>
      </section>

      {/* Preferred Banks Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 themed-border-bottom">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2">
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[#C0C0C0] tracking-wider">{t('footer.preferredBanks')}</h3>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {bankItems.map((bankKey, i) => {
            const BankComponent = BankLogos[bankKey]
            return (
              <div
                key={i}
                className="h-12 sm:h-14 bg-[#111] themed-card rounded-lg flex items-center justify-center hover:bg-[#1a1a1a] transition-all cursor-pointer overflow-hidden"
              >
                <BankComponent />
              </div>
            )
          })}
        </div>
      </section>

      {/* Powered By Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#00bfff">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <span className="text-xs text-[#606060]">{t('common.poweredBy')}</span>
          </div>
          
          <div className="flex items-center gap-3 min-w-0">
            <ChromeSiteBrand variant="footer" hideTitle className="min-w-0" />
          </div>
        </div>
      </section>

      {/* Copyright */}
      <div className="border-t border-[#1a1a1a] py-4 text-center">
        <p className="text-[10px] text-[#404040]">
          © 2026 {brandName}. {t('common.allRights')}
        </p>
      </div>
    </footer>
  )
}
