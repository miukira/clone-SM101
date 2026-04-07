import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChromeSiteBrand from './ChromeSiteBrand'
import { useTheme } from '../context/ThemeContext'
import {
  HomeIconChrome,
  SlotsIconChrome,
  CasinoIconChrome,
  LotteryIconChrome,
  SportsIconChrome,
  FishingIconChrome,
  ArcadeIconChrome,
  PokerIconChrome,
  CockFightingIconChrome,
  PromoIconChrome,
  ReferralIconChrome,
  AccountIconChrome,
} from './IconsChrome'

function SettingsIconHeader() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

const gameCategories = [
  { id: 'slots', name: 'SLOTS', icon: SlotsIconChrome },
  { id: 'casino', name: 'CASINO', icon: CasinoIconChrome },
  { id: 'togel', name: 'TOGEL', icon: LotteryIconChrome },
  { id: 'sports', name: 'SPORTS', icon: SportsIconChrome },
  { id: 'fishing', name: 'FISHING', icon: FishingIconChrome },
  { id: 'arcade', name: 'ARCADE', icon: ArcadeIconChrome },
  { id: 'sabung', name: 'SABUNG', icon: CockFightingIconChrome },
  { id: 'poker', name: 'POKER', icon: PokerIconChrome },
]

function ChromeMobileDrawer({
  isOpen,
  onClose,
  navigate,
  currentPage,
  onOpenAuth,
  isAuthenticated,
  user,
  onLogout,
  gradientIdSuffix,
}) {
  const [categoryOpen, setCategoryOpen] = useState(false)
  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-r border-[#3a3a3a] shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a] gap-2">
          <ChromeSiteBrand
            variant="drawer"
            onClick={() => {
              navigate('/')
              onClose()
            }}
          />
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#3a3a3a]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              navigate('/')
              onClose()
            }}
            className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all overflow-hidden ${
              currentPage === 'home'
                ? 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border-2 border-[#C0C0C0] shadow-lg shadow-white/10'
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#2a2a2a] hover:border-[#404040]'
            }`}
          >
            {currentPage === 'home' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
            )}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#3a3a3a]">
              <HomeIconChrome size={24} active />
            </div>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#D0D0D0] to-[#C0C0C0] tracking-wider relative z-10">
              HOME
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/promo')
              onClose()
            }}
            className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all overflow-hidden ${
              currentPage === 'promo'
                ? 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border-2 border-[#C0C0C0] shadow-lg shadow-white/10'
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#2a2a2a] hover:border-[#404040]'
            }`}
          >
            {currentPage === 'promo' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
            )}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#3a3a3a]">
              <PromoIconChrome size={24} active />
            </div>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#D0D0D0] to-[#C0C0C0] tracking-wider relative z-10">
              PROMOSI
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/referral')
              onClose()
            }}
            className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all overflow-hidden ${
              currentPage === 'referral'
                ? 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border-2 border-[#C0C0C0] shadow-lg shadow-white/10'
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#2a2a2a] hover:border-[#404040]'
            }`}
          >
            {currentPage === 'referral' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
            )}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#3a3a3a]">
              <ReferralIconChrome size={24} active />
            </div>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#D0D0D0] to-[#C0C0C0] tracking-wider relative z-10">
              REFERRAL
            </span>
          </button>

          <div className="border border-[#3a3a3a] rounded-xl overflow-hidden bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090]">
            <button
              type="button"
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm font-bold text-black tracking-wider">Game Categories</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className={`transition-transform duration-300 ${categoryOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {categoryOpen && (
              <div className="bg-[#111] border-t border-[#3a3a3a] p-3 grid grid-cols-3 gap-2">
                {gameCategories.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        navigate(`/providers/${cat.id}`)
                        onClose()
                      }}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[#1a1a1a] transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#C0C0C0]/20 shadow-lg">
                        <Icon size={22} active />
                      </div>
                      <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] to-[#C0C0C0]">
                        {cat.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="my-4 border-t border-[#3a3a3a]" />

          {isAuthenticated && user ? (
            <>
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#3a3a3a]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E0E0E0] to-[#808080] rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-black">{user.username?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] to-[#C0C0C0]">
                      {user.username?.toUpperCase() || 'USER'}
                    </p>
                    <p className="text-xs text-[#808080]">Member</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a]">
                  <span className="text-xs text-[#808080]">Saldo</span>
                  <span className="text-sm font-bold text-[#C0C0C0]">
                    IDR {(user.balance ?? 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigate('/member')
                  onClose()
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] shadow-lg transition-all hover:from-white hover:to-[#B0B0B0]"
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <AccountIconChrome size={24} active={false} />
                </div>
                <span className="text-sm font-bold text-black tracking-wider">Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout()
                  onClose()
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-red-500/30 hover:border-red-500/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                      stroke="#EF4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-red-400 tracking-wider">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  onOpenAuth('register')
                  onClose()
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] shadow-lg transition-all hover:from-white hover:to-[#B0B0B0]"
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="9" cy="7" r="4" stroke="#333" strokeWidth="2" />
                    <path d="M19 8v6M22 11h-6" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-black tracking-wider">Daftar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenAuth('login')
                  onClose()
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#404040] hover:border-[#505050] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#3a3a3a]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id={`loginGradMenu${gradientIdSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#D0D0D0" />
                        <stop offset="100%" stopColor="#A0A0A0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
                      stroke={`url(#loginGradMenu${gradientIdSuffix})`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#D0D0D0] to-[#C0C0C0] tracking-wider">
                  Masuk
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Desktop nav tabs for Promo / Referral (no provider mega-dropdown).
 */
export function ChromeSimpleDesktopNav({ items, activeId, navigate }) {
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
            <span className="tracking-wider relative z-10">{category.name}</span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Shared Chrome header: brand, theme, saldo + akun (atau MASUK/DAFTAR), bar navigasi desktop opsional.
 */
export default function ChromeAppHeader({
  navigate: navigateProp = null,
  onOpenAuth = () => {},
  isAuthenticated = false,
  user = null,
  onLogout = () => {},
  mobileCurrentPage = 'home',
  desktopNav = null,
  hamburgerGradientIdSuffix = 'app',
  balanceOverride = null,
  onBalanceRefresh = null,
  /** Jika diisi (boolean), animasi putar ikon refresh mengikuti prop (parent mengatur saat API jalan). */
  balanceRefreshSpinning = undefined,
  showQuickDeposit = false,
  onQuickDeposit = null,
  useCustomMobileDrawer = false,
  onHamburgerClick = null,
}) {
  const routerNavigate = useNavigate()
  const navigate = navigateProp || routerNavigate
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [internalRefreshSpinning, setInternalRefreshSpinning] = useState(false)
  const { toggleCustomizer, uiColorData } = useTheme()

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

  const displayBalance =
    balanceOverride != null && balanceOverride !== undefined ? balanceOverride : user?.balance
  const balanceStr =
    displayBalance != null && displayBalance !== undefined
      ? Number(displayBalance).toLocaleString('id-ID')
      : '0'

  const gradId = `hamburgerGrad${hamburgerGradientIdSuffix}`

  const openMobileMenu = () => {
    if (useCustomMobileDrawer && typeof onHamburgerClick === 'function') {
      onHamburgerClick()
    } else {
      setMobileMenuOpen(true)
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black to-[#0a0a0a] themed-border-bottom z-50">
        <div className="flex items-center justify-between px-3 md:px-6 lg:px-8 py-2 md:py-2.5 lg:py-3">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="md:hidden w-8 h-8 flex items-center justify-center shrink-0"
              onClick={openMobileMenu}
              title="Menu"
              aria-label="Buka menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#D0D0D0" />
                    <stop offset="100%" stopColor="#A0A0A0" />
                  </linearGradient>
                </defs>
                <path d="M3 6h18M3 12h18M3 18h18" stroke={`url(#${gradId})`} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
            <ChromeSiteBrand variant="header" onClick={() => navigate('/')} />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={toggleCustomizer}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${uiColorData.primary}, ${uiColorData.secondary})`,
                color: '#1a1a1a',
              }}
              title="Theme Settings"
            >
              <SettingsIconHeader />
            </button>

            {isAuthenticated && user ? (
              <>
                {showQuickDeposit && onQuickDeposit && (
                  <button
                    type="button"
                    onClick={onQuickDeposit}
                    className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 lg:px-5 lg:py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-[#1a1a1a] text-xs md:text-sm font-bold hover:from-[#F0F0F0] hover:to-[#B0B0B0] transition-all shadow-lg shrink-0"
                  >
                    Deposit
                  </button>
                )}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-[#333] rounded-lg">
                  <span className="text-[10px] text-[#808080]">IDR</span>
                  <span className="text-xs font-bold text-[#C0C0C0]">{balanceStr}</span>
                  {onBalanceRefresh && (
                    <button
                      type="button"
                      onClick={handleBalanceRefreshClick}
                      disabled={refreshSpinning}
                      className="ml-0.5 p-1 text-[#606060] hover:text-[#C0C0C0] transition-colors rounded disabled:opacity-70 disabled:cursor-wait"
                      title="Segarkan saldo"
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
                      {user.username?.toUpperCase() || 'USER'}
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
                              navigate('/member')
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs text-[#C0C0C0] hover:bg-[#2a2a2a] transition-colors flex items-center gap-3"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            Dashboard
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
                            Deposit
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
                            Withdraw
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
                            Logout
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
                  MASUK
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-3 md:px-5 py-1.5 md:py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-black text-[10px] md:text-xs font-bold hover:from-white hover:to-[#B0B0B0] transition-all shadow-lg shadow-black/30 tracking-wider"
                >
                  DAFTAR
                </button>
              </>
            )}
          </div>
        </div>

        {desktopNav ? (
          <div className="hidden md:block bg-[#0a0a0a] border-t border-[#1a1a1a]">{desktopNav}</div>
        ) : null}
      </header>

      {!useCustomMobileDrawer && (
        <ChromeMobileDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navigate={navigate}
          currentPage={mobileCurrentPage}
          onOpenAuth={onOpenAuth}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={onLogout}
          gradientIdSuffix={hamburgerGradientIdSuffix}
        />
      )}
    </>
  )
}
