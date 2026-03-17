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
  PokerIconChrome,
  CockFightingIconChrome,
  PromoIconChrome,
  ReferralIconChrome,
  HelpIconChrome,
  AccountIconChrome,
} from '../components/IconsChrome'

// Import referral banner image
import referralBanner from '../assets/banners/referral-banner.png'

// Categories for header
const categories = [
  { id: 'slots', name: 'SLOTS', icon: SlotsIconChrome },
  { id: 'casino', name: 'CASINO', icon: CasinoIconChrome },
  { id: 'togel', name: 'TOGEL', icon: LotteryIconChrome },
  { id: 'sports', name: 'SPORTS', icon: SportsIconChrome },
  { id: 'fishing', name: 'FISHING', icon: FishingIconChrome },
  { id: 'arcade', name: 'ARCADE', icon: ArcadeIconChrome },
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

// Mobile Hamburger Menu Component - Silver Chrome Theme
function MobileHamburgerMenu({ isOpen, onClose, navigate, currentPage }) {
  const [categoryOpen, setCategoryOpen] = useState(false)
  
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
  
  if (!isOpen) return null
  
  return (
    <div className="sm:hidden fixed inset-0 z-[60]">
      {/* Backdrop - No blur */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-r border-[#3a3a3a] shadow-2xl overflow-y-auto">
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#E0E0E0] via-[#C0C0C0] to-[#808080] rounded-lg flex items-center justify-center">
              <span className="text-base">🎰</span>
            </div>
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080]">
              PUSATTOGEL
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#3a3a3a]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {/* HOME */}
          <button
            onClick={() => { navigate('/'); onClose(); }}
            className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all overflow-hidden ${
              currentPage === 'home'
                ? 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border-2 border-[#C0C0C0] shadow-lg shadow-white/10'
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] themed-card hover:border-[#404040]'
            }`}
          >
            {/* Shine effect for selected */}
            {currentPage === 'home' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
            )}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#3a3a3a]">
              <HomeIconChrome size={24} active={true} />
            </div>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#D0D0D0] to-[#C0C0C0] tracking-wider relative z-10">
              HOME
            </span>
          </button>
          
          {/* PROMOSI */}
          <button
            onClick={() => { navigate('/promo'); onClose(); }}
            className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all overflow-hidden ${
              currentPage === 'promo'
                ? 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border-2 border-[#C0C0C0] shadow-lg shadow-white/10'
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] themed-card hover:border-[#404040]'
            }`}
          >
            {/* Shine effect for selected */}
            {currentPage === 'promo' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
            )}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#3a3a3a]">
              <PromoIconChrome size={24} active={true} />
            </div>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#D0D0D0] to-[#C0C0C0] tracking-wider relative z-10">
              PROMOSI
            </span>
          </button>
          
          {/* REFERRAL */}
          <button
            onClick={() => { navigate('/referral'); onClose(); }}
            className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all overflow-hidden ${
              currentPage === 'referral'
                ? 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border-2 border-[#C0C0C0] shadow-lg shadow-white/10'
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] themed-card hover:border-[#404040]'
            }`}
          >
            {currentPage === 'referral' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
            )}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#3a3a3a]">
              <ReferralIconChrome size={24} active={true} />
            </div>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#D0D0D0] to-[#C0C0C0] tracking-wider relative z-10">
              REFERRAL
            </span>
          </button>
          
          {/* Game Categories Dropdown - Silver Chrome */}
          <div className="border border-[#3a3a3a] rounded-xl overflow-hidden bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090]">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm font-bold text-black tracking-wider">
                Game Categories
              </span>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none"
                className={`transition-transform duration-300 ${categoryOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {categoryOpen && (
              <div className="bg-[#111] border-t border-[#3a3a3a] p-3 grid grid-cols-3 gap-2">
                {gameCategories.map(cat => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { navigate(`/providers/${cat.id}`); onClose(); }}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[#1a1a1a] transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#C0C0C0]/20 shadow-lg">
                        <Icon size={22} active={true} />
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
          
          {/* Divider */}
          <div className="my-4 border-t border-[#3a3a3a]"></div>
          
          {/* DAFTAR */}
          <button
            onClick={onClose}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] shadow-lg transition-all hover:from-white hover:to-[#B0B0B0]"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="#333" strokeWidth="2"/>
                <path d="M19 8v6M22 11h-6" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-black tracking-wider">
              Daftar
            </span>
          </button>
          
          {/* MASUK */}
          <button
            onClick={onClose}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#404040] hover:border-[#505050] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#3a3a3a]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="loginGradMenuRef" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="50%" stopColor="#D0D0D0"/>
                    <stop offset="100%" stopColor="#A0A0A0"/>
                  </linearGradient>
                </defs>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="url(#loginGradMenuRef)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#D0D0D0] to-[#C0C0C0] tracking-wider">
              Masuk
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Category Tab Desktop
function CategoryTabDesktop({ category, active, onClick, navigate }) {
  const Icon = category.icon
  
  const handleClick = () => {
    if (category.path) {
      navigate(category.path)
    }
    onClick()
  }
  
  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap ${
        active
          ? 'bg-gradient-to-b from-[#3a3a3a] via-[#2a2a2a] to-[#1a1a1a] text-[#E8E8E8] shadow-lg shadow-white/10 border border-[#505050]'
          : 'bg-transparent text-[#707070] hover:bg-[#1a1a1a] hover:text-[#C0C0C0]'
      }`}
    >
      {active && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine"></div>
      )}
      <Icon size={18} active={active} />
      <span className="tracking-wider relative z-10">{category.name}</span>
    </button>
  )
}

// Header Component
function Header({ navigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black to-[#0a0a0a] border-b border-[#2a2a2a] z-50">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-3 sm:px-8 py-2 sm:py-3">
          {/* Mobile: Hamburger + Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Hamburger - Mobile only */}
            <button 
              className="sm:hidden w-8 h-8 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hamburgerGradRef" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="50%" stopColor="#D0D0D0"/>
                    <stop offset="100%" stopColor="#A0A0A0"/>
                  </linearGradient>
                </defs>
                <path d="M3 6h18M3 12h18M3 18h18" stroke="url(#hamburgerGradRef)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-[#E0E0E0] via-[#C0C0C0] to-[#808080] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-black/30">
                <span className="text-base sm:text-xl">🎰</span>
              </div>
              <span className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                PUSATTOGEL
              </span>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#404040] rounded-lg text-[#C0C0C0] text-[10px] sm:text-xs font-bold hover:from-[#3a3a3a] hover:to-[#2a2a2a] hover:border-[#505050] transition-all tracking-wider">
              MASUK
            </button>
            <button className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-black text-[10px] sm:text-xs font-bold hover:from-white hover:to-[#B0B0B0] transition-all shadow-lg shadow-black/30 tracking-wider">
              DAFTAR
            </button>
          </div>
        </div>

        {/* Desktop Submenu Navigation */}
        <div className="hidden sm:block bg-[#0a0a0a] themed-border-top">
          <div className="flex items-center justify-center gap-1 px-4 py-2 overflow-x-auto hide-scrollbar">
            {headerMenuItems.map(cat => (
              <CategoryTabDesktop
                key={cat.id}
                category={cat}
                active={cat.id === 'referral'}
                onClick={() => {}}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </header>
      
      {/* Mobile Hamburger Menu */}
      <MobileHamburgerMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        navigate={navigate}
        currentPage="referral"
      />
    </>
  )
}

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
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-[#0a0a0a] to-[#0d0d0d] border-t border-[#2a2a2a] py-2 px-2 z-50">
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
  
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Header navigate={navigate} />
      
      {/* Desktop View */}
      <main className="hidden sm:block pt-[130px] pb-12 relative z-10">
        <div className="max-w-[1400px] mx-auto px-8">
          {/* Page Title */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#3a3a3a]">
              <ReferralIconChrome size={28} active={false} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
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
              src={referralBanner} 
              alt="Bonus Referral - Hasilkan Pasif Income Jutaan Rupiah Tanpa Modal"
              className="w-full h-auto"
            />
          </div>
        </div>
      </main>
      
      {/* Mobile View */}
      <main className="sm:hidden pt-[60px] pb-24 relative z-10">
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
              src={referralBanner} 
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
