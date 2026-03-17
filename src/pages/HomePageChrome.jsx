import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import ProviderCard from '../components/ProviderCard'
import FooterChrome from '../components/FooterChrome'
import AuthModal from '../components/AuthModal'
import GameListModal from '../components/GameListModal'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useProviders } from '../hooks/useProviders'
import { useLotteryResults, parseResultToNumbers, MARKET_DISPLAY_NAMES } from '../hooks/useLottery'

// Import promo banner images
import welcomeBonus from '../assets/banners/welcome-bonus.webp'
import bonusDeposit from '../assets/banners/popup-deposit-imlek.webp'
import bannerBaru from '../assets/banners/banner-baru.webp'
import hadiah from '../assets/banners/hadiah-togel.webp'
import putarRoda from '../assets/banners/putar-roda.webp'
import bannerQris from '../assets/banners/banner-qris.webp'
// Static config fallback - will be overridden by API data
import {
  slotProviders,
  sportsProviders,
  casinoProviders,
  togelProviders,
  fishingProviders,
  arcadeProviders,
  pokerProviders,
  cockfightProviders,
} from '../config/providers'
import {
  SlotsIconChrome,
  SportsIconChrome,
  CasinoIconChrome,
  LotteryIconChrome,
  FishingIconChrome,
  ArcadeIconChrome,
  PokerIconChrome,
  CockFightingIconChrome,
  HomeIconChrome,
  PromoIconChrome,
  ReferralIconChrome,
  HelpIconChrome,
  DepositIconChrome,
  AccountIconChrome,
} from '../components/IconsChrome'

// Togel Results Data - Fallback static data
const staticTogelResults = [
  { market: 'SINGAPORE', day: 'Minggu', numbers: [3, 9, 2, 7], date: '01/03/2026' },
  { market: 'SIDNEY', day: 'Minggu', numbers: [4, 6, 2, 0], date: '01/03/2026' },
  { market: 'HONGKONG', day: 'Sabtu', numbers: [7, 3, 0, 0], date: '28/02/2026' },
  { market: 'CAMBODIA', day: 'Minggu', numbers: [8, 1, 5, 3], date: '01/03/2026' },
  { market: 'TAIWAN', day: 'Sabtu', numbers: [2, 7, 4, 9], date: '28/02/2026' },
]

// Transform API lottery results to display format
const transformLotteryResults = (apiResults) => {
  if (!apiResults || apiResults.length === 0) return staticTogelResults
  
  return apiResults.map(result => {
    const marketKey = result.market?.toLowerCase()
    const displayInfo = MARKET_DISPLAY_NAMES[marketKey] || { name: result.market, day: '-' }
    const dateObj = result.date ? new Date(result.date) : new Date()
    const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'long' })
    const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
    
    return {
      market: displayInfo.name?.toUpperCase() || result.market?.toUpperCase(),
      day: dayName,
      numbers: parseResultToNumbers(result.result),
      date: dateStr,
    }
  })
}

// Header menu items (includes HOME, game categories, PROMOSI, REFERRAL)
const headerMenuItems = [
  { id: 'home', name: 'HOME', icon: HomeIconChrome, isPage: true, path: '/' },
  { id: 'slots', name: 'SLOTS', icon: SlotsIconChrome, providers: slotProviders },
  { id: 'casino', name: 'CASINO', icon: CasinoIconChrome, providers: casinoProviders },
  { id: 'togel', name: 'TOGEL', icon: LotteryIconChrome, providers: togelProviders },
  { id: 'sports', name: 'SPORTS', icon: SportsIconChrome, providers: sportsProviders },
  { id: 'fishing', name: 'FISHING', icon: FishingIconChrome, providers: fishingProviders },
  { id: 'arcade', name: 'ARCADE', icon: ArcadeIconChrome, providers: arcadeProviders },
  { id: 'poker', name: 'POKER', icon: PokerIconChrome, providers: pokerProviders },
  { id: 'sabung', name: 'SABUNG', icon: CockFightingIconChrome, providers: cockfightProviders },
  { id: 'promosi', name: 'PROMOSI', icon: PromoIconChrome, isPage: true, path: '/promo' },
  { id: 'referral', name: 'REFERRAL', icon: ReferralIconChrome, isPage: true, path: '/referral' },
]

// Provider box categories (game categories only - no HOME, PROMOSI, REFERRAL)
const categories = [
  { id: 'slots', name: 'SLOTS', icon: SlotsIconChrome, providers: slotProviders },
  { id: 'casino', name: 'CASINO', icon: CasinoIconChrome, providers: casinoProviders },
  { id: 'togel', name: 'TOGEL', icon: LotteryIconChrome, providers: togelProviders },
  { id: 'sports', name: 'SPORTS', icon: SportsIconChrome, providers: sportsProviders },
  { id: 'fishing', name: 'FISHING', icon: FishingIconChrome, providers: fishingProviders },
  { id: 'arcade', name: 'ARCADE', icon: ArcadeIconChrome, providers: arcadeProviders },
  { id: 'poker', name: 'POKER', icon: PokerIconChrome, providers: pokerProviders },
  { id: 'sabung', name: 'SABUNG', icon: CockFightingIconChrome, providers: cockfightProviders },
]

// Togel 4D Result Card Component - Larger Day & Date
function TogelResultCard({ market, day, numbers, date, onBetClick }) {
  // Map display name to market ID for betting
  const getMarketId = (displayMarket) => {
    const marketMap = {
      'SINGAPORE': 'singapore',
      'SIDNEY': 'sydney',
      'SYDNEY': 'sydney',
      'HONGKONG': 'hongkong',
      'HONG KONG': 'hongkong',
      'CAMBODIA': 'cambodia',
      'TAIWAN': 'taiwan',
      'CHINA': 'china',
      'JAPAN': 'japan',
      'MACAU': 'macau',
    }
    return marketMap[displayMarket?.toUpperCase()] || 'singapore'
  }

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] themed-card rounded-xl overflow-hidden transition-all">
      {/* Market Header */}
      <div className="bg-gradient-to-r from-[#2a2a2a] via-[#333] to-[#2a2a2a] py-2.5 px-3 border-b border-[#333]">
        <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-[0.15em]">
          {market}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-4 text-center">
        {/* Day - Larger */}
        <div className="text-sm font-bold text-[#808080] mb-1">{day}</div>
        {/* Date - Larger */}
        <div className="text-xs text-[#606060] mb-3">{date}</div>
        
        {/* Numbers - Silver Chrome Style */}
        <div className="flex justify-center gap-2 mb-4">
          {numbers.map((num, i) => (
            <span
              key={i}
              className="w-10 h-10 bg-gradient-to-b from-[#E8E8E8] via-[#C0C0C0] to-[#707070] rounded-full flex items-center justify-center text-lg font-black text-black shadow-md"
            >
              {num}
            </span>
          ))}
        </div>
        
        {/* BET Button - Links to betting page */}
        <button 
          onClick={() => onBetClick && onBetClick(getMarketId(market))}
          className="w-full py-2.5 bg-gradient-to-b from-[#333] to-[#1a1a1a] border border-[#404040] rounded-lg text-[10px] font-bold text-[#808080] hover:text-[#C0C0C0] hover:border-[#505050] transition-all tracking-widest hover:scale-[1.02]"
        >
          BET
        </button>
      </div>
    </div>
  )
}

// Category Tab Button with Hover Dropdown - DESKTOP ONLY
function CategoryTabDesktop({ category, active, onClick, setActiveCategory, navigate }) {
  const Icon = category.icon
  const hasProviders = category.providers && category.providers.length > 0
  const isPageLink = category.isPage
  
  const handleClick = () => {
    if (isPageLink) {
      // Navigate to specific page (HOME, PROMOSI, REFERRAL)
      navigate(category.path)
    } else {
      // Navigate to full providers list page
      navigate(`/providers/${category.id}`)
    }
  }
  
  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 overflow-hidden ${
          active
            ? 'bg-gradient-to-b from-[#2a2a2a] via-[#222222] to-[#1a1a1a] text-[#E0E0E0] shadow-lg shadow-white/5 border border-[#444444]'
            : 'bg-transparent hover:bg-[#1a1a1a] text-[#808080] hover:text-[#C0C0C0]'
        }`}
      >
        {/* Subtle shine effect overlay for active */}
        {active && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shine"></div>
        )}
        <Icon size={18} active={active} />
        <span className={`text-xs font-bold tracking-wider relative z-10 ${active ? 'text-[#E8E8E8]' : ''}`}>
          {category.name}
        </span>
      </button>
      
      {/* Dropdown on Hover - Horizontal Slider with Provider Cards */}
      {hasProviders && (
        <div className="fixed left-0 right-0 top-[110px] pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40">
          <div className="bg-gradient-to-b from-[#0d0d0d] to-[#000] themed-border-top themed-border-bottom py-4 shadow-2xl shadow-black/80">
            <div className="max-w-[1400px] mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon size={20} active={true} />
                  <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                    {category.name} PROVIDERS
                  </h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-[#C0C0C0] to-transparent"></div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-[#333] rounded-lg text-[#606060] hover:text-[#C0C0C0] hover:border-[#505050] transition-all">
                    ←
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-[#333] rounded-lg text-[#606060] hover:text-[#C0C0C0] hover:border-[#505050] transition-all">
                    →
                  </button>
                  <button 
                    onClick={() => navigate(`/providers/${category.id}`)}
                    className="ml-2 px-4 py-2 text-[10px] font-bold text-[#606060] hover:text-[#C0C0C0] tracking-wider transition-all"
                  >
                    LIHAT SEMUA ({category.providers.length}) →
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar scroll-smooth">
                  {category.providers.map(provider => (
                    <div 
                      key={provider.id} 
                      className="flex-shrink-0 w-[280px] transform hover:scale-[1.02] transition-transform"
                    >
                      <ProviderCard {...provider} />
                    </div>
                  ))}
                </div>
                
                <div className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-[#0d0d0d] to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-[#0d0d0d] to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Mobile Category Tab - Dark bg with chrome silver icon
function MobileCategoryTab({ category, active, onClick }) {
  const Icon = category.icon
  
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center min-w-[70px] py-3 px-2 rounded-xl transition-all duration-300 overflow-hidden ${
        active
          ? 'bg-gradient-to-b from-[#2a2a2a] via-[#222222] to-[#1a1a1a] shadow-lg shadow-white/5 border border-[#444444]'
          : 'bg-[#111111] border border-[#1a1a1a] hover:border-[#333333]'
      }`}
    >
      {/* Subtle shine effect overlay for active */}
      {active && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shine"></div>
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent rounded-full blur-[2px]"></div>
        </>
      )}
      <Icon size={24} active={active} />
      <span className={`text-[9px] font-bold mt-1.5 tracking-wider relative z-10 ${active ? 'text-[#F0F0F0]' : 'text-[#808080]'}`}>
        {category.name}
      </span>
    </button>
  )
}

// Promo Banner Component - Responsive with Styled Slider
function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const banners = [
    {
      titleLine1: 'WELCOME BONUS',
      titleLine2: 'NEW MEMBER 100%',
      description: 'Dapatkan bonus deposit pertama hingga 1.000.000 IDR',
      tag: '🎁 PROMO SPESIAL',
      gradient: 'from-[#1a1a40] via-[#15153a] to-[#0d0d25]',
      image: welcomeBonus,
    },
    {
      titleLine1: 'BONUS DEPOSIT',
      titleLine2: 'HARIAN 10%',
      description: 'Nikmati bonus deposit harian 10% setiap hari untuk semua game slot',
      tag: '🔥 BONUS HARIAN',
      gradient: 'from-[#1a2a1a] via-[#15251a] to-[#0d1a0d]',
      image: bonusDeposit,
    },
    {
      titleLine1: 'CASHBACK MINGGUAN',
      titleLine2: 'HINGGA 15%',
      description: 'Nikmati cashback setiap minggu tanpa syarat turnover',
      tag: '💰 CASHBACK',
      gradient: 'from-[#2a1a1a] via-[#251515] to-[#1a0d0d]',
      image: bannerBaru,
    },
  ]
  
  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])
  
  const banner = banners[currentSlide]
  
  return (
    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
      {/* Banner Content */}
      <div className={`relative min-h-[180px] sm:min-h-[280px] lg:min-h-[320px]`}>
        {/* Full background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={banner.image} 
            alt=""
            className="w-full h-full object-cover object-center transition-opacity duration-500"
          />
          {/* Left gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-5 sm:p-8 lg:p-12 flex flex-col justify-center min-h-[180px] sm:min-h-[280px] lg:min-h-[320px]">
          {/* Tag Badge */}
          <div className="mb-3 sm:mb-4">
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-[10px] sm:text-xs font-bold text-white/90 tracking-wider">
              {banner.tag}
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white mb-0.5 sm:mb-1 drop-shadow-lg tracking-wide">
            {banner.titleLine1}
          </h2>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white mb-2 sm:mb-3 drop-shadow-lg">
            {banner.titleLine2}
          </h3>
          
          {/* Description */}
          <p className="text-[10px] sm:text-sm text-white/60 mb-4 sm:mb-6 max-w-md">
            {banner.description}
          </p>
          
          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-black text-[10px] sm:text-sm font-bold hover:from-white hover:to-[#B0B0B0] transition-all shadow-lg tracking-wider">
              CLAIM SEKARANG
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white/80 text-[10px] sm:text-sm font-bold hover:bg-white/20 transition-all tracking-wider hidden sm:block">
              SYARAT & KETENTUAN
            </button>
          </div>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 sm:h-2 rounded-full transition-all ${
              i === currentSlide 
                ? 'w-5 sm:w-7 bg-white' 
                : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
      
      {/* Navigation Arrows - Desktop only */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur rounded-full items-center justify-center text-white hover:bg-black/70 transition-all"
      >
        ‹
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur rounded-full items-center justify-center text-white hover:bg-black/70 transition-all"
      >
        ›
      </button>
    </div>
  )
}

// Mobile Togel Result Card - Chrome Silver Style (matching desktop)
function MobileTogelCard({ market, numbers, date, onBetClick }) {
  // Map display name to market ID for betting
  const getMarketId = (displayMarket) => {
    const marketMap = {
      'SINGAPORE': 'singapore',
      'SIDNEY': 'sydney',
      'SYDNEY': 'sydney',
      'HONGKONG': 'hongkong',
      'HONG KONG': 'hongkong',
      'CAMBODIA': 'cambodia',
      'TAIWAN': 'taiwan',
      'CHINA': 'china',
      'JAPAN': 'japan',
      'MACAU': 'macau',
    }
    return marketMap[displayMarket?.toUpperCase()] || 'singapore'
  }

  return (
    <div className="flex-shrink-0 w-[100px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl overflow-hidden border border-[#2a2a2a]">
      {/* Market Header - Chrome Silver */}
      <div className="bg-gradient-to-r from-[#2a2a2a] via-[#333] to-[#2a2a2a] py-1.5 px-2 border-b border-[#333]">
        <span className="text-[8px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider block text-center truncate">
          {market}
        </span>
      </div>
      
      {/* Numbers - Chrome Silver */}
      <div className="p-2">
        <div className="flex justify-center gap-1 mb-1.5">
          {numbers.map((num, i) => (
            <span
              key={i}
              className="w-5 h-5 bg-gradient-to-b from-[#E8E8E8] via-[#C0C0C0] to-[#707070] rounded-full flex items-center justify-center text-[10px] font-black text-black shadow-sm"
            >
              {num}
            </span>
          ))}
        </div>
        
        {/* Date */}
        <div className="text-[7px] text-[#606060] text-center mb-1.5">{date}</div>
        
        {/* BET Button - Links to betting page */}
        <button 
          onClick={() => onBetClick && onBetClick(getMarketId(market))}
          className="w-full py-1 bg-gradient-to-b from-[#333] to-[#1a1a1a] border border-[#404040] rounded text-[7px] font-bold text-[#808080] tracking-wider hover:text-[#C0C0C0]"
        >
          BET
        </button>
      </div>
    </div>
  )
}

// Jackpot Counter Component - Chrome Silver with Animation
function JackpotCounter({ isMobile = false }) {
  const [jackpotValue, setJackpotValue] = useState(85185441217)
  
  // Animate jackpot number
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpotValue(prev => prev + Math.floor(Math.random() * 1000) + 100)
    }, 100)
    return () => clearInterval(interval)
  }, [])
  
  const formattedJackpot = jackpotValue.toLocaleString('id-ID')
  
  return (
    <div className={`relative bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-xl overflow-hidden themed-card ${isMobile ? '' : 'mb-6'}`}>
      {/* Shine animation overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine"></div>
      
      {/* Decorative elements */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40">
        <span className="text-2xl sm:text-3xl">⚡</span>
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40">
        <span className="text-2xl sm:text-3xl">⚡</span>
      </div>
      
      <div className="relative z-10 py-3 sm:py-4 px-4">
        <div className="text-center">
          <span className="text-[9px] sm:text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-[0.3em] block mb-1">JACKPOT</span>
          <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] animate-pulse-slow">
            {formattedJackpot}
          </span>
        </div>
      </div>
    </div>
  )
}

// Mobile Provider Card - Compact Grid Style with Animation
function MobileProviderCard({ provider }) {
  const [isHovered, setIsHovered] = useState(false)
  
  if (!provider) return null
  
  // Handle badge - can be object {type: 'hot'} or string 'HOT'
  const badgeType = typeof provider.badge === 'object' ? provider.badge?.type : provider.badge
  const isHot = badgeType === 'hot' || badgeType === 'HOT'
  const isNew = badgeType === 'new' || badgeType === 'NEW'
  
  // Use correct property names from providers.js
  const characterImage = provider.characterImg
  const logoImage = provider.logoImg
  const name = provider.name || provider.logoAlt || 'Provider'
  
  return (
    <div 
      className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl overflow-hidden themed-card transition-all duration-300 hover:shadow-lg hover:shadow-[#C0C0C0]/10 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 300)}
    >
      {/* Badge */}
      {(isHot || isNew) && (
        <div className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded text-[8px] font-bold animate-pulse ${
          isHot 
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
        }`}>
          {isHot ? 'HOT' : 'NEW'}
        </div>
      )}
      
      {/* Character Image with Animation */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-b from-[#252525] to-[#1a1a1a]">
        {characterImage ? (
          <img 
            src={characterImage} 
            alt={name}
            className={`w-full h-full object-cover object-top transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🎰</div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent"></div>
        
        {/* Glow effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#C0C0C0]/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Logo overlay with animation */}
        {logoImage && (
          <div className={`absolute bottom-2 right-2 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
            <img 
              src={logoImage} 
              alt={name}
              className="h-8 w-auto object-contain drop-shadow-lg"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        )}
      </div>
      
      {/* Play Button */}
      <div className="p-2">
        <button className={`w-full py-2 rounded-lg text-[10px] font-bold tracking-wider shadow-md transition-all duration-300 ${
          isHovered 
            ? 'bg-gradient-to-b from-white via-[#E0E0E0] to-[#C0C0C0] text-black' 
            : 'bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-black'
        }`}>
          PLAY NOW
        </button>
      </div>
    </div>
  )
}

// Mobile Hamburger Menu Component
function MobileHamburgerMenu({ isOpen, onClose, navigate, currentPage, onOpenAuth, isAuthenticated, user, onLogout }) {
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
      {/* Backdrop - No blur, semi-transparent */}
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
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#2a2a2a] hover:border-[#404040]'
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
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#2a2a2a] hover:border-[#404040]'
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
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#2a2a2a] hover:border-[#404040]'
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
          
          {/* Game Categories Dropdown - Silver Chrome Theme */}
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
            
            {/* Dropdown Content */}
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
          
          {isAuthenticated && user ? (
            <>
              {/* User Info Card */}
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
                    IDR {user.balance?.toLocaleString('id-ID') || '0'}
                  </span>
                </div>
              </div>
              
              {/* Dashboard */}
              <button
                onClick={() => { navigate('/member'); onClose(); }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] shadow-lg transition-all hover:from-white hover:to-[#B0B0B0]"
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <AccountIconChrome size={24} active={false} />
                </div>
                <span className="text-sm font-bold text-black tracking-wider">
                  Dashboard
                </span>
              </button>
              
              {/* Logout */}
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-red-500/30 hover:border-red-500/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm font-bold text-red-400 tracking-wider">
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              {/* DAFTAR */}
              <button
                onClick={() => { onOpenAuth('register'); onClose(); }}
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
                onClick={() => { onOpenAuth('login'); onClose(); }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#404040] hover:border-[#505050] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center border border-[#3a3a3a]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id="loginGradMenu" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF"/>
                        <stop offset="50%" stopColor="#D0D0D0"/>
                        <stop offset="100%" stopColor="#A0A0A0"/>
                      </linearGradient>
                    </defs>
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="url(#loginGradMenu)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

// Bottom Navigation - Mobile Only
function MobileBottomNav() {
  const [activeNav, setActiveNav] = useState('home')
  const navigate = useNavigate()
  
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
        {navItems.map((item) => {
          const isActive = activeNav === item.id
          return (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveNav(item.id)
                if (item.path !== '#') navigate(item.path)
              }}
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
              <item.icon size={22} active={true} />
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

// Settings Icon for Header
const SettingsIconHeader = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

// Header Component - Responsive
function Header({ activeCategory, setActiveCategory, navigate, onOpenAuth = () => {}, isAuthenticated = false, user = null, onLogout = () => {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { toggleCustomizer, uiColorData } = useTheme()
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black to-[#0a0a0a] themed-border-bottom z-50">
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
                  <linearGradient id="hamburgerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="50%" stopColor="#D0D0D0"/>
                    <stop offset="100%" stopColor="#A0A0A0"/>
                  </linearGradient>
                </defs>
                <path d="M3 6h18M3 12h18M3 18h18" stroke="url(#hamburgerGrad)" strokeWidth="2.5" strokeLinecap="round"/>
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

          {/* Settings + Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Settings Button */}
            <button 
              onClick={toggleCustomizer}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-all hover:scale-105"
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
                {/* User Balance */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#333] rounded-lg">
                  <span className="text-[10px] text-[#808080]">IDR</span>
                  <span className="text-xs font-bold text-[#C0C0C0]">{user.balance?.toLocaleString('id-ID') || '0'}</span>
                </div>
                {/* Profile Button with Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#404040] rounded-lg text-[#C0C0C0] hover:from-[#3a3a3a] hover:to-[#2a2a2a] hover:border-[#505050] transition-all"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#E0E0E0] to-[#808080] rounded-full flex items-center justify-center">
                      <span className="text-[10px] sm:text-xs font-bold text-black">{user.username?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                    <span className="hidden sm:inline text-[10px] sm:text-xs font-bold tracking-wider">{user.username?.toUpperCase() || 'USER'}</span>
                    <svg className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-[#333]">
                          <p className="text-xs font-bold text-[#C0C0C0]">{user.username?.toUpperCase()}</p>
                          <p className="text-[10px] text-[#606060]">IDR {user.balance?.toLocaleString('id-ID') || '0'}</p>
                        </div>
                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => { navigate('/member'); setShowUserMenu(false); }}
                            className="w-full px-4 py-2.5 text-left text-xs text-[#C0C0C0] hover:bg-[#2a2a2a] transition-colors flex items-center gap-3"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            Dashboard
                          </button>
                          <button
                            onClick={() => { navigate('/member/deposit'); setShowUserMenu(false); }}
                            className="w-full px-4 py-2.5 text-left text-xs text-[#C0C0C0] hover:bg-[#2a2a2a] transition-colors flex items-center gap-3"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            Deposit
                          </button>
                          <button
                            onClick={() => { navigate('/member/withdraw'); setShowUserMenu(false); }}
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
                            onClick={() => { onLogout(); setShowUserMenu(false); }}
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
                  onClick={() => onOpenAuth('login')}
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#404040] rounded-lg text-[#C0C0C0] text-[10px] sm:text-xs font-bold hover:from-[#3a3a3a] hover:to-[#2a2a2a] hover:border-[#505050] transition-all tracking-wider"
                >
                  MASUK
                </button>
                <button 
                  onClick={() => onOpenAuth('register')}
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-black text-[10px] sm:text-xs font-bold hover:from-white hover:to-[#B0B0B0] transition-all shadow-lg shadow-black/30 tracking-wider"
                >
                  DAFTAR
                </button>
              </>
            )}
          </div>
        </div>

        {/* Desktop Submenu Navigation with Hover Dropdown */}
        <div className="hidden sm:block bg-[#0a0a0a] border-t border-[#1a1a1a]">
          <div className="flex items-center justify-center gap-1 px-4 py-2 overflow-x-auto hide-scrollbar">
            {headerMenuItems.map(item => (
              <CategoryTabDesktop
                key={item.id}
                category={item}
                active={activeCategory === item.id}
                onClick={() => setActiveCategory(item.id)}
                setActiveCategory={setActiveCategory}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </header>
      
      {/* Mobile Hamburger Menu Overlay */}
      <MobileHamburgerMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        navigate={navigate}
        currentPage="home"
        onOpenAuth={onOpenAuth}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
      />
    </>
  )
}

// ============ MINI PROVIDER CARD (shortcut) ============
function MiniProviderCard({ provider, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-300 min-w-[72px] group ${
        isActive
          ? 'bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#505050] shadow-lg shadow-white/5'
          : 'bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#333] hover:bg-[#151515]'
      }`}
    >
      {/* Logo thumbnail */}
      <div className={`w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 ${
        isActive ? 'bg-[#1a1a1a] ring-1 ring-[#444]' : 'bg-[#111] group-hover:bg-[#1a1a1a]'
      }`}>
        <img 
          src={provider.logoImg} 
          alt={provider.name} 
          className={`max-w-[90%] max-h-[90%] object-contain transition-all duration-300 ${
            isActive ? 'brightness-125 drop-shadow-[0_0_4px_rgba(192,192,192,0.3)]' : 'brightness-75 group-hover:brightness-100'
          }`}
        />
      </div>
      <span className={`text-[8px] font-bold tracking-wider truncate max-w-full transition-colors ${
        isActive ? 'text-[#E0E0E0]' : 'text-[#606060] group-hover:text-[#A0A0A0]'
      }`}>
        {provider.name?.split(' ')[0]}
      </span>
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent rounded-full"></div>
      )}
    </button>
  )
}

// ============ PROVIDER CARD SKELETON ============
function ProviderCardSkeleton() {
  return (
    <div className="w-[290px] h-[180px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-lg overflow-hidden border border-[#2a2a2a] animate-pulse">
      <div className="relative w-full h-full p-4">
        {/* Logo skeleton */}
        <div className="absolute top-5 right-4 w-24 h-8 bg-[#2a2a2a] rounded"></div>
        {/* Character skeleton */}
        <div className="absolute left-2 bottom-2 w-[45%] h-[80%] bg-[#2a2a2a] rounded-lg"></div>
        {/* Button skeleton */}
        <div className="absolute bottom-3 right-4 w-[100px] h-[36px] bg-[#333] rounded"></div>
      </div>
    </div>
  )
}

// ============ TOGEL RESULT SKELETON ============
function TogelResultSkeleton() {
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl overflow-hidden animate-pulse">
      <div className="bg-gradient-to-r from-[#2a2a2a] via-[#333] to-[#2a2a2a] py-2.5 px-3 border-b border-[#333]">
        <div className="h-3 w-20 bg-[#444] rounded"></div>
      </div>
      <div className="p-4 text-center">
        <div className="h-3 w-16 bg-[#333] rounded mx-auto mb-1"></div>
        <div className="h-2 w-12 bg-[#2a2a2a] rounded mx-auto mb-3"></div>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="w-10 h-10 bg-[#333] rounded-full"></div>
          ))}
        </div>
        <div className="h-8 w-full bg-[#2a2a2a] rounded-lg"></div>
      </div>
    </div>
  )
}

// ============ MOBILE TOGEL SKELETON ============
function MobileTogelSkeleton() {
  return (
    <div className="flex-shrink-0 w-[100px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl overflow-hidden border border-[#2a2a2a] animate-pulse">
      <div className="bg-gradient-to-r from-[#2a2a2a] via-[#333] to-[#2a2a2a] py-1.5 px-2 border-b border-[#333]">
        <div className="h-2 w-12 bg-[#444] rounded mx-auto"></div>
      </div>
      <div className="p-2">
        <div className="flex justify-center gap-1 mb-1.5">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="w-5 h-5 bg-[#333] rounded-full"></div>
          ))}
        </div>
        <div className="h-2 w-10 bg-[#2a2a2a] rounded mx-auto mb-1.5"></div>
        <div className="h-5 w-full bg-[#333] rounded"></div>
      </div>
    </div>
  )
}

// ============ FULL PROVIDERS LIST PAGE ============
function ProvidersListPage({ category, navigate }) {
  const cat = categories.find(c => c.id === category) || categories[0]
  const Icon = cat.icon
  const { isAuthenticated, user, loginSuccess, logout } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')
  // Game modal state
  const [gameModalOpen, setGameModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)
  
  // Fetch providers from API
  const { providers: apiProviders, loading: providersLoading } = useProviders(category)
  
  // Use API data if available, otherwise fallback to static config
  const categoryProviders = apiProviders.length > 0 ? apiProviders : cat.providers
  
  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }
  
  const handleProviderClick = (provider) => {
    setSelectedProvider(provider)
    setGameModalOpen(true)
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        onLoginSuccess={loginSuccess}
      />
      
      {/* Game List Modal */}
      <GameListModal
        isOpen={gameModalOpen}
        onClose={() => setGameModalOpen(false)}
        provider={selectedProvider}
      />
      
      <Header 
        activeCategory={category}
        setActiveCategory={() => {}}
        navigate={navigate}
        onOpenAuth={openAuthModal}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
      />
      
      {/* Desktop */}
      <div className="hidden sm:block pt-[130px] pb-12">
        <div className="max-w-[1400px] mx-auto px-8">
          {/* Back + Title */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate('/')} 
              className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-[#808080] hover:text-[#C0C0C0] hover:border-[#444] transition-all"
            >
              ←
            </button>
            <Icon size={28} active={true} />
            <div>
              <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                {cat.name} PROVIDERS
              </h1>
              <p className="text-[11px] text-[#505050] tracking-wide mt-0.5">
                {providersLoading ? 'Loading...' : `${categoryProviders.length} providers tersedia`}
              </p>
            </div>
          </div>
          
          {/* Full Provider Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {providersLoading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <div key={`skeleton-list-${i}`} className="flex justify-center">
                  <ProviderCardSkeleton />
                </div>
              ))
            ) : (
              categoryProviders.map(provider => (
                <div key={provider.id || provider.provider_id} className="flex justify-center">
                  <ProviderCard 
                    {...provider} 
                    onPlayClick={() => handleProviderClick(provider)}
                  />
                </div>
              ))
            )}
            {/* Coming Soon placeholders */}
            {!providersLoading && Array.from({ length: Math.max(0, 8 - categoryProviders.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="flex justify-center">
                <div className="w-[280px] h-[180px] bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-[#1a1a1a] rounded-xl flex items-center justify-center">
                  <span className="text-[11px] font-bold text-[#2a2a2a] tracking-widest">COMING SOON</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile */}
      <div className="sm:hidden pt-[60px] pb-20">
        <div className="px-3">
          {/* Back + Title */}
          <div className="flex items-center gap-3 py-4">
            <button 
              onClick={() => navigate('/')} 
              className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#808080] hover:text-white transition-all"
            >
              ←
            </button>
            <Icon size={22} active={true} />
            <div>
              <h1 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                {cat.name} PROVIDERS
              </h1>
              <p className="text-[9px] text-[#505050] tracking-wide">
                {providersLoading ? 'Loading...' : `${categoryProviders.length} providers`}
              </p>
            </div>
          </div>
          
          {/* Category Scroll */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-3">
            {categories.map(c => {
              const CIcon = c.icon
              const isActive = c.id === category
              return (
                <button
                  key={c.id}
                  onClick={() => navigate(`/providers/${c.id}`)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] text-[#E0E0E0] border border-[#444]'
                      : 'bg-[#0d0d0d] text-[#606060] border border-[#1a1a1a]'
                  }`}
                >
                  <CIcon size={14} active={isActive} />
                  <span>{c.name}</span>
                </button>
              )
            })}
          </div>
          
          {/* Provider Grid */}
          <div className="grid grid-cols-2 gap-x-1 gap-y-1">
            {providersLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-mobile-list-${i}`} className="flex justify-center">
                  <div style={{ transform: 'scale(0.55)', transformOrigin: 'top center', marginBottom: '-80px' }}>
                    <ProviderCardSkeleton />
                  </div>
                </div>
              ))
            ) : (
              categoryProviders.map(provider => (
                <div key={provider.id || provider.provider_id} className="flex justify-center">
                  <div style={{ transform: 'scale(0.55)', transformOrigin: 'top center', marginBottom: '-80px' }}>
                    <ProviderCard 
                      {...provider} 
                      onPlayClick={() => handleProviderClick(provider)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <FooterChrome />
      
      <MobileBottomNav />
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

// Main HomePage Component
export default function HomePageChrome() {
  // Header menu state - HOME is default on home page
  const [headerCategory, setHeaderCategory] = useState('home')
  // Provider box state - independent from header
  const [providerBoxCategory, setProviderBoxCategory] = useState('slots')
  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')
  // Game list modal state
  const [gameModalOpen, setGameModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)
  
  // Fetch providers from API
  const { providers: apiProviders, loading: providersLoading } = useProviders(providerBoxCategory)
  
  // Fetch lottery results from API
  const { results: lotteryResults, loading: lotteryLoading } = useLotteryResults()
  
  // Use API data if available, otherwise fallback to static config
  const activeProviders = apiProviders.length > 0 
    ? apiProviders 
    : categories.find(c => c.id === providerBoxCategory)?.providers || []
  
  // Transform lottery results for display
  const togelResults = transformLotteryResults(lotteryResults)
  
  const categoryScrollRef = useRef(null)
  
  // Handle provider play click
  const handleProviderClick = (provider) => {
    setSelectedProvider(provider)
    setGameModalOpen(true)
  }
  const navigate = useNavigate()
  const location = useLocation()
  
  // Auth context
  const { isAuthenticated, user, loginSuccess, logout } = useAuth()
  
  // Check if we're on a providers sub-page
  const pathParts = location.pathname.split('/')
  const isProvidersPage = pathParts[1] === 'providers' && pathParts[2]
  const providerCategory = pathParts[2]

  // Open auth modal
  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }

  // If on providers page, render ProvidersListPage
  if (isProvidersPage) {
    return <ProvidersListPage category={providerCategory} navigate={navigate} />
  }

  // Scroll category tabs
  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        onLoginSuccess={loginSuccess}
      />
      
      {/* Game List Modal */}
      <GameListModal
        isOpen={gameModalOpen}
        onClose={() => setGameModalOpen(false)}
        provider={selectedProvider}
      />
      
      <Header 
        activeCategory={headerCategory}
        setActiveCategory={setHeaderCategory}
        navigate={navigate}
        onOpenAuth={openAuthModal}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
      />

      {/* ==================== MARQUEE - Both Desktop & Mobile ==================== */}
      <div className="hidden sm:block pt-[130px] relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] themed-card rounded-lg py-2.5 mb-4">
            <div className="marquee-track flex items-center gap-16 whitespace-nowrap">
              <span className="text-xs text-[#808080] font-medium tracking-wide">📢 <span className="text-[#C0C0C0]">PUSATTOGEL</span> - Situs Togel Online Terpercaya & Terlengkap Se-Indonesia</span>
              <span className="text-xs text-[#808080]">🔥 Bayar LUNAS!!! Withdraw tanpa batas, proses tercepat</span>
              <span className="text-xs text-[#808080]">🎰 Tersedia ribuan permainan dari provider ternama dunia</span>
              <span className="text-xs text-[#808080]">💰 Bonus New Member 100% | Cashback Togel hingga 5%</span>
              <span className="text-xs text-[#808080]">⚡ Deposit & Withdraw 24 Jam Non-Stop</span>
              <span className="text-xs text-[#808080]">📢 <span className="text-[#C0C0C0]">PUSATTOGEL</span> - Situs Togel Online Terpercaya & Terlengkap Se-Indonesia</span>
              <span className="text-xs text-[#808080]">🔥 Bayar LUNAS!!! Withdraw tanpa batas, proses tercepat</span>
              <span className="text-xs text-[#808080]">🎰 Tersedia ribuan permainan dari provider ternama dunia</span>
              <span className="text-xs text-[#808080]">💰 Bonus New Member 100% | Cashback Togel hingga 5%</span>
              <span className="text-xs text-[#808080]">⚡ Deposit & Withdraw 24 Jam Non-Stop</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <main className="hidden sm:block pb-8 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          
          {/* PROMO BANNER */}
          <section className="mb-6">
            <PromoBanner />
          </section>
          
          {/* LIVE JACKPOT - Desktop */}
          <section className="mb-6 pb-6 themed-border-bottom">
            <JackpotCounter isMobile={false} />
          </section>

          {/* MAIN GRID: TOGEL LEFT + PROVIDERS RIGHT */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* LEFT SIDEBAR - TOGEL RESULTS */}
            <aside className="col-span-3">
              <div className="flex items-center gap-3 mb-5">
                <LotteryIconChrome size={22} active={true} />
                <div>
                  <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                    TOGEL RESULT
                  </h2>
                  <div className="w-10 h-0.5 bg-gradient-to-r from-[#C0C0C0] to-transparent mt-1"></div>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 hide-scrollbar">
                {lotteryLoading ? (
                  // Loading skeletons
                  Array.from({ length: 4 }).map((_, i) => (
                    <TogelResultSkeleton key={`skeleton-${i}`} />
                  ))
                ) : (
                  togelResults.map((result, i) => (
                    <TogelResultCard 
                      key={i} 
                      {...result} 
                      onBetClick={(marketId) => navigate(`/togel/${marketId}`)}
                    />
                  ))
                )}
              </div>
              
              <button 
                onClick={() => navigate('/providers/togel')}
                className="block w-full mt-4 py-3 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-[10px] font-bold text-[#505050] hover:text-[#C0C0C0] hover:border-[#404040] transition-all tracking-widest text-center cursor-pointer"
              >
                LIHAT SEMUA PASARAN →
              </button>
            </aside>

            {/* MAIN CONTENT - PROVIDERS */}
            <div className="col-span-9">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {(() => {
                    const cat = categories.find(c => c.id === providerBoxCategory)
                    const Icon = cat?.icon || SlotsIconChrome
                    return <Icon size={22} active={true} />
                  })()}
                  <div>
                    <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                      {categories.find(c => c.id === providerBoxCategory)?.name} PROVIDERS
                    </h2>
                    <div className="w-10 h-0.5 bg-gradient-to-r from-[#C0C0C0] to-transparent mt-1"></div>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/providers/${providerBoxCategory}`)}
                  className="text-[10px] font-bold text-[#505050] hover:text-[#C0C0C0] tracking-wider transition-colors"
                >
                  LIHAT SEMUA →
                </button>
              </div>

              {/* Category Pills - Switch category in provider section only (independent from header) */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => {
                  const Icon = cat.icon
                  const isActive = providerBoxCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setProviderBoxCategory(cat.id)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-b from-[#2a2a2a] via-[#222222] to-[#1a1a1a] text-[#E8E8E8] shadow-lg shadow-white/5 border border-[#444444]'
                          : 'bg-[#111111] text-[#808080] hover:bg-[#1a1a1a] hover:text-[#C0C0C0] border border-[#1a1a1a]'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
                      )}
                      <Icon size={14} active={isActive} />
                      <span className="tracking-wider relative z-10">{cat.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Provider Cards Grid - 3x3 with scroll */}
              <div className="grid grid-cols-3 gap-5 max-h-[750px] overflow-y-auto pr-2 hide-scrollbar">
                {providersLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={`skeleton-${i}`} className="flex justify-center">
                      <ProviderCardSkeleton />
                    </div>
                  ))
                ) : (
                  activeProviders.map(provider => (
                    <div key={provider.id || provider.provider_id} className="flex justify-center">
                      <ProviderCard 
                        {...provider} 
                        onPlayClick={() => handleProviderClick(provider)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== MOBILE VIEW ==================== */}
      <main className="sm:hidden pt-[60px] pb-20 relative z-10">
        <div className="px-3">
          
          {/* Marquee Text - Running */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] rounded-lg py-2 mb-3">
            <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
              <span className="text-[10px] text-[#808080] font-medium">📢 <span className="text-[#C0C0C0]">PUSATTOGEL</span> - Situs Togel Online Terpercaya</span>
              <span className="text-[10px] text-[#808080]">🔥 Bayar LUNAS!!! Withdraw tanpa batas</span>
              <span className="text-[10px] text-[#808080]">💰 Bonus New Member 100%</span>
              <span className="text-[10px] text-[#808080]">⚡ Deposit & WD 24 Jam</span>
              <span className="text-[10px] text-[#808080]">📢 <span className="text-[#C0C0C0]">PUSATTOGEL</span> - Situs Togel Online Terpercaya</span>
              <span className="text-[10px] text-[#808080]">🔥 Bayar LUNAS!!! Withdraw tanpa batas</span>
              <span className="text-[10px] text-[#808080]">💰 Bonus New Member 100%</span>
              <span className="text-[10px] text-[#808080]">⚡ Deposit & WD 24 Jam</span>
            </div>
          </div>
          
          {/* Banner */}
          <section className="mb-3">
            <PromoBanner />
          </section>
          
          {/* Togel Results - Horizontal Scroll */}
          <section className="mb-3">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {lotteryLoading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <MobileTogelSkeleton key={`skeleton-${i}`} />
                ))
              ) : (
                togelResults.map((result, i) => (
                  <MobileTogelCard 
                    key={i} 
                    {...result} 
                    onBetClick={(marketId) => navigate(`/togel/${marketId}`)}
                  />
                ))
              )}
            </div>
          </section>
          
          {/* Jackpot Counter */}
          <section className="mb-4">
            <JackpotCounter />
          </section>
          
          {/* Category Tabs - Horizontal Scroll */}
          <section className="mb-4 relative">
            <div className="flex items-center">
              {/* Left Arrow */}
              <button 
                onClick={() => scrollCategories('left')}
                className="absolute left-0 z-10 w-6 h-full bg-gradient-to-r from-black to-transparent flex items-center justify-center text-[#606060]"
              >
                ‹
              </button>
              
              {/* Scrollable Categories */}
              <div 
                ref={categoryScrollRef}
                className="flex gap-2 overflow-x-auto hide-scrollbar px-6 py-2 scroll-smooth"
              >
                {categories.map(cat => (
                  <MobileCategoryTab
                    key={cat.id}
                    category={cat}
                    active={providerBoxCategory === cat.id}
                    onClick={() => setProviderBoxCategory(cat.id)}
                  />
                ))}
              </div>
              
              {/* Right Arrow */}
              <button 
                onClick={() => scrollCategories('right')}
                className="absolute right-0 z-10 w-6 h-full bg-gradient-to-l from-black to-transparent flex items-center justify-center text-[#606060]"
              >
                ›
              </button>
            </div>
          </section>
          
          {/* Provider Cards Grid - 2 columns with proper spacing */}
          <section className="overflow-hidden">
            <div className="grid grid-cols-2 gap-x-1 gap-y-1">
              {providersLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`skeleton-mobile-${i}`} className="flex justify-center">
                    <div style={{ transform: 'scale(0.55)', transformOrigin: 'top center', marginBottom: '-80px' }}>
                      <ProviderCardSkeleton />
                    </div>
                  </div>
                ))
              ) : (
                activeProviders.map(provider => (
                  <div key={provider.id || provider.provider_id} className="flex justify-center">
                    <div style={{ transform: 'scale(0.55)', transformOrigin: 'top center', marginBottom: '-80px' }}>
                      <ProviderCard 
                        {...provider} 
                        onPlayClick={() => handleProviderClick(provider)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          
        </div>
      </main>

      {/* Footer */}
      <FooterChrome />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Custom Styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 2.5s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        /* Marquee running text */
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        
        /* Mobile cards fit */
        @media (max-width: 639px) {
          .provider-card {
            width: 290px;
            height: 180px;
          }
        }
      `}</style>
    </div>
  )
}
