// ReferralPageChrome.jsx - Referral page with Chrome theme
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FooterChrome from '../components/FooterChrome'
import {
  HomeIconChrome,
  SlotsIconChrome,
  CasinoIconChrome,
  LotteryIconChrome,
  SportsIconChrome,
  FishingIconChrome,
  ArcadeIconChrome,
  CrushIconChrome,
  EsportsIconChrome,
  PokerIconChrome,
  CockFightingIconChrome,
  PromoIconChrome,
  ReferralIconChrome,
  HelpIconChrome,
  AccountIconChrome,
} from '../components/IconsChrome'

// Import referral banner image
import referralBanner from '../assets/banners/referral-banner.png'
import { publicAssetUrl } from '../utils/publicAssetUrl'
import AuthModal from '../components/AuthModal'
import { useAuth } from '../context/AuthContext'
import ChromeAppHeader, { ChromeSimpleDesktopNav } from '../components/ChromeAppHeader'

const referralBannerSrc = publicAssetUrl(referralBanner)

// Categories for header
const categories = [
  { id: 'slots', name: 'SLOTS', icon: SlotsIconChrome },
  { id: 'casino', name: 'CASINO', icon: CasinoIconChrome },
  { id: 'togel', name: 'TOGEL', icon: LotteryIconChrome },
  { id: 'sports', name: 'SPORTS', icon: SportsIconChrome },
  { id: 'fishing', name: 'FISHING', icon: FishingIconChrome },
  { id: 'arcade', name: 'ARCADE', icon: ArcadeIconChrome },
  { id: 'crush', name: 'CRUSH', icon: CrushIconChrome },
  { id: 'esports', name: 'ESPORTS', icon: EsportsIconChrome },
  { id: 'poker', name: 'POKER', icon: PokerIconChrome },
  { id: 'sabung', name: 'SABUNG', icon: CockFightingIconChrome },
]

// Header Menu Items
const headerMenuItems = [
  { id: 'home', name: 'HOME', icon: HomeIconChrome, path: '/' },
  ...categories.map(cat => ({ ...cat, path: `/providers/${cat.id}` })),
  { id: 'promosi', name: 'PROMOSI', icon: PromoIconChrome, path: '/promo' },
  { id: 'referral', name: 'REFERRAL', icon: ReferralIconChrome, path: '/referral' },
]

// Mobile Bottom Navigation
function MobileBottomNav({ navigate }) {
  const navItems = [
    { id: 'home', icon: HomeIconChrome, label: 'HOME', path: '/' },
    { id: 'promo', icon: PromoIconChrome, label: 'PROMO', path: '/promo' },
    { id: 'livechat', icon: HelpIconChrome, label: 'LIVE CHAT', path: '#' },
    { id: 'referral', icon: ReferralIconChrome, label: 'REFERRAL', path: '/referral' },
    { id: 'contact', icon: AccountIconChrome, label: 'CONTACT', path: '#' },
  ]
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-[#0a0a0a] to-[#0d0d0d] border-t border-[#2a2a2a] py-2 px-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = item.id === 'referral'
          return (
            <button
              key={item.id}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] shadow-lg shadow-white/5' 
                  : ''
              }`}
            >
              {/* Glow effect for active */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent rounded-full blur-sm"></div>
              )}
              <Icon size={22} active={true} />
              <span className={`text-[8px] font-bold tracking-wider ${isActive ? 'text-[#F0F0F0]' : 'text-[#C0C0C0]'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// Main ReferralPageChrome Component
export default function ReferralPageChrome() {
  const navigate = useNavigate()
  const { isAuthenticated, user, loginSuccess, logout, refreshBalance } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }
  
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        onLoginSuccess={loginSuccess}
      />
      <ChromeAppHeader
        navigate={navigate}
        onOpenAuth={openAuthModal}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        mobileCurrentPage="referral"
        hamburgerGradientIdSuffix="referral"
        showQuickDeposit={isAuthenticated}
        onQuickDeposit={() => navigate('/member/deposit')}
        onBalanceRefresh={refreshBalance}
        desktopNav={
          <ChromeSimpleDesktopNav items={headerMenuItems} activeId="referral" navigate={navigate} />
        }
      />
      
      {/* Desktop View */}
      <main className="hidden md:block pt-[130px] pb-12 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Page Title */}
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#3a3a3a] shrink-0">
              <ReferralIconChrome size={28} active={false} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                REFERRAL
              </h1>
              <p className="text-sm text-[#606060]">
                Ajak teman dan dapatkan komisi seumur hidup
              </p>
            </div>
          </div>
          
          {/* Referral Banner Image */}
          <div className="rounded-2xl overflow-hidden themed-card shadow-2xl">
            <img 
              src={referralBannerSrc} 
              alt="Bonus Referral - Hasilkan Pasif Income Jutaan Rupiah Tanpa Modal"
              className="w-full h-auto"
            />
          </div>
        </div>
      </main>
      
      {/* Mobile View */}
      <main className="md:hidden pt-[60px] pb-24 relative z-10">
        <div className="px-3 py-4">
          {/* Page Title - Mobile */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-lg flex items-center justify-center border border-[#3a3a3a]">
              <ReferralIconChrome size={22} active={false} />
            </div>
            <div>
              <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                REFERRAL
              </h1>
              <p className="text-xs text-[#606060]">
                Ajak teman dan dapatkan komisi seumur hidup
              </p>
            </div>
          </div>
          
          {/* Referral Banner Image - Mobile */}
          <div className="rounded-xl overflow-hidden themed-card">
            <img 
              src={referralBannerSrc} 
              alt="Bonus Referral - Hasilkan Pasif Income Jutaan Rupiah Tanpa Modal"
              className="w-full h-auto"
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <FooterChrome />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav navigate={navigate} />
      
      {/* Custom Styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
