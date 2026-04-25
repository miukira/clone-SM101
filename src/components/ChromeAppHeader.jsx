import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ChromeSiteBrand from './ChromeSiteBrand'
import I18nLanguageSwitch from './I18nLanguageSwitch'
import { getStoredPlayerBalance } from '../services/api'
import { getNumberLocale } from '../i18n.js'

/**
 * Desktop nav tabs for Promo / Referral (no provider mega-dropdown).
 */
export function ChromeSimpleDesktopNav({ items, activeId, navigate }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2 overflow-x-auto hide-scrollbar">
      {items.map((category) => {
        const Icon = category.icon
        const active = category.id === activeId
        const handleClick = () => {
          if (category.path) navigate(category.path)
        }
        return (
          <button
            key={category.id}
            type="button"
            onClick={handleClick}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap ${
              active
                ? 'bg-gradient-to-b from-[#3a3a3a] via-[#2a2a2a] to-[#1a1a1a] text-[#E8E8E8] shadow-lg shadow-white/10 border border-[#505050]'
                : 'bg-transparent text-[#707070] hover:bg-[#1a1a1a] hover:text-[#C0C0C0]'
            }`}
          >
            {active && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine" />
            )}
            <Icon size={18} active={active} />
            <span className="tracking-wider relative z-10">
              {category.nameKey ? t(category.nameKey) : category.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Shared Chrome header: brand, saldo + akun (atau MASUK/DAFTAR), bar navigasi opsional (scroll horizontal di mobile).
 */
export default function ChromeAppHeader({
  navigate: navigateProp = null,
  onOpenAuth = () => {},
  isAuthenticated = false,
  user = null,
  onLogout = () => {},
  desktopNav = null,
  balanceOverride = null,
  onBalanceRefresh = null,
  /** Jika diisi (boolean), animasi putar ikon refresh mengikuti prop (parent mengatur saat API jalan). */
  balanceRefreshSpinning = undefined,
  showQuickDeposit = false,
  onQuickDeposit = null,
}) {
  const { t } = useTranslation()
  const numberLocale = getNumberLocale()
  const routerNavigate = useNavigate()
  const navigate = navigateProp || routerNavigate
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [internalRefreshSpinning, setInternalRefreshSpinning] = useState(false)

  const refreshSpinning =
    typeof balanceRefreshSpinning === 'boolean' ? balanceRefreshSpinning : internalRefreshSpinning

  const handleBalanceRefreshClick = async () => {
    if (!onBalanceRefresh) return
    const controlled = typeof balanceRefreshSpinning === 'boolean'
    if (!controlled) setInternalRefreshSpinning(true)
    const started = Date.now()
    const minSpinMs = 450
    try {
      await Promise.resolve(onBalanceRefresh())
    } finally {
      if (!controlled) {
        const wait = minSpinMs - (Date.now() - started)
        if (wait > 0) await new Promise((r) => setTimeout(r, wait))
        setInternalRefreshSpinning(false)
      }
    }
  }

  // Urutan: override halaman → cache LS (sumber tampilan utama; hindari saldo 0 dari context saat transisi) → context
  let displayBalance = balanceOverride
  if (displayBalance == null || displayBalance === undefined) {
    displayBalance = getStoredPlayerBalance()
  }
  if (displayBalance == null || displayBalance === undefined) {
    displayBalance = user?.balance
  }
  const balanceStr =
    displayBalance != null && displayBalance !== undefined
      ? Number(displayBalance).toLocaleString(numberLocale)
      : '0'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black to-[#0a0a0a] themed-border-bottom z-50">
        <div className="flex items-center justify-between px-3 md:px-6 lg:px-8 py-2 md:py-2.5 lg:py-3">
          <div className="flex items-center gap-2 md:gap-3">
            <ChromeSiteBrand variant="header" hideTitle onClick={() => navigate('/')} />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <I18nLanguageSwitch />
            {isAuthenticated && user ? (
              <>
                {showQuickDeposit && onQuickDeposit && (
                  <button
                    type="button"
                    onClick={onQuickDeposit}
                    className="hidden md:inline-flex items-center px-3 py-2 md:px-4 md:py-2 lg:px-5 lg:py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-[#1a1a1a] text-xs md:text-sm font-bold hover:from-[#F0F0F0] hover:to-[#B0B0B0] transition-all shadow-lg shrink-0"
                  >
                    {t('header.deposit')}
                  </button>
                )}
                <div className="flex items-center gap-1 px-2 py-1 md:gap-1.5 md:px-3 md:py-1.5 bg-[#1a1a1a] border border-[#333] rounded-lg shrink-0 min-w-0">
                  <span className="text-[10px] text-[#808080]">IDR</span>
                  <span className="text-xs font-bold text-[#C0C0C0]">{balanceStr}</span>
                  {onBalanceRefresh && (
                    <button
                      type="button"
                      onClick={handleBalanceRefreshClick}
                      disabled={refreshSpinning}
                      className="ml-0.5 p-1 text-[#606060] hover:text-[#C0C0C0] transition-colors rounded disabled:opacity-70 disabled:cursor-wait"
                      title={t('header.refreshBalance')}
                    >
                      <span
                        className={`inline-flex shrink-0 items-center justify-center origin-center ${
                          refreshSpinning ? 'animate-saldo-refresh motion-reduce:animate-none' : ''
                        }`}
                        aria-hidden
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="block"
                        >
                          <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                      </span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#404040] rounded-lg text-[#C0C0C0] hover:from-[#3a3a3a] hover:to-[#2a2a2a] hover:border-[#505050] transition-all"
                  >
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-[#E0E0E0] to-[#808080] rounded-full flex items-center justify-center">
                      <span className="text-[10px] md:text-xs font-bold text-black">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden md:inline text-[10px] md:text-xs font-bold tracking-wider">
                        {user.username?.toUpperCase() || t('header.userFallback')}
                    </span>
                    <svg
                      className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#333]">
                          <p className="text-xs font-bold text-[#C0C0C0]">{user.username?.toUpperCase()}</p>
                          <p className="text-[10px] text-[#606060]">IDR {balanceStr}</p>
                        </div>
                        <div className="py-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigate('/member/profile')
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs text-[#C0C0C0] hover:bg-[#2a2a2a] transition-colors flex items-center gap-3"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            {t('header.profile')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigate('/member/deposit')
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs text-[#C0C0C0] hover:bg-[#2a2a2a] transition-colors flex items-center gap-3"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            {t('header.deposit')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigate('/member/withdraw')
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs text-[#C0C0C0] hover:bg-[#2a2a2a] transition-colors flex items-center gap-3"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="5" width="20" height="14" rx="2" />
                              <path d="M2 10h20" />
                            </svg>
                            {t('header.withdraw')}
                          </button>
                          <div className="border-t border-[#333] my-2" />
                          <button
                            type="button"
                            onClick={() => {
                              onLogout()
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                            </svg>
                            {t('header.logout')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 md:px-5 py-1.5 md:py-2.5 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#404040] rounded-lg text-[#C0C0C0] text-[10px] md:text-xs font-bold hover:from-[#3a3a3a] hover:to-[#2a2a2a] hover:border-[#505050] transition-all tracking-wider"
                >
                  {t('header.masuk')}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-3 md:px-5 py-1.5 md:py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-black text-[10px] md:text-xs font-bold hover:from-white hover:to-[#B0B0B0] transition-all shadow-lg shadow-black/30 tracking-wider"
                >
                  {t('header.daftar')}
                </button>
              </>
            )}
          </div>
        </div>

        {desktopNav ? (
          <div className="block bg-[#0a0a0a] border-t border-[#1a1a1a]">{desktopNav}</div>
        ) : null}
      </header>
    </>
  )
}
