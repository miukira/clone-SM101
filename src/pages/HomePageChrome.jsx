import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ProviderCard from '../components/ProviderCard'
import FooterChrome from '../components/FooterChrome'
import AuthModal from '../components/AuthModal'
import GameListModal from '../components/GameListModal'
import { useAuth } from '../context/AuthContext'
import { useNavDropdownProviders } from '../hooks/useNavDropdownProviders'
import { useProviderCategory } from '../context/ProviderCategoryContexts.jsx'
import { useLotteryResults, parseResultToNumbers, MARKET_DISPLAY_NAMES } from '../hooks/useLottery'
import { providerAssetUrl } from '../utils/publicAssetUrl'
import { normalizeImageUrl } from '../utils/normalizeImageUrl'
import { DEFAULT_PROVIDER_CARD_IMAGE } from '../utils/defaultProviderImage.js'
import { mapConfigBannersToPromoSlides } from '../utils/mapHomePromoBanners.js'
import { useWebsite } from '../context/WebsiteContext'

import {
  slotProviders,
  sportsProviders,
  casinoProviders,
  fishingProviders,
} from '../config/providers'
import NotificationMarquee from '../components/NotificationMarquee'
import ChromeAppHeader from '../components/ChromeAppHeader'
import {
  SlotsIconChrome,
  SportsIconChrome,
  CasinoIconChrome,
  LotteryIconChrome,
  FishingIconChrome,
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
  { id: 'sports', name: 'SPORTS', icon: SportsIconChrome, providers: sportsProviders },
  { id: 'fishing', name: 'FISHING', icon: FishingIconChrome, providers: fishingProviders },
  { id: 'promosi', name: 'PROMOSI', icon: PromoIconChrome, isPage: true, path: '/promo' },
  { id: 'referral', name: 'REFERRAL', icon: ReferralIconChrome, isPage: true, path: '/referral' },
]

// Provider box categories (game categories only - no HOME, PROMOSI, REFERRAL)
const categories = [
  { id: 'slots', name: 'SLOTS', icon: SlotsIconChrome, providers: slotProviders },
  { id: 'casino', name: 'CASINO', icon: CasinoIconChrome, providers: casinoProviders },
  { id: 'sports', name: 'SPORTS', icon: SportsIconChrome, providers: sportsProviders },
  { id: 'fishing', name: 'FISHING', icon: FishingIconChrome, providers: fishingProviders },
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
function CategoryTabDesktop({ category, active, navigate, dropdownProvidersByCategory }) {
  const Icon = category.icon
  const apiList = dropdownProvidersByCategory?.[category.id]
  const fallback = category.providers || []
  const list = apiList && apiList.length > 0 ? apiList : fallback
  const hasProviders = list.length > 0
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
                    LIHAT SEMUA ({list.length}) →
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar scroll-smooth">
                  {list.map((provider) => (
                    <div 
                      key={provider.provider_id ?? provider.id} 
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

function HomeChromeDesktopNavRow({ activeCategory, setActiveCategory, navigate, dropdownProvidersByCategory }) {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2 overflow-x-auto hide-scrollbar">
      {headerMenuItems.map((item) => (
        <CategoryTabDesktop
          key={item.id}
          category={item}
          active={activeCategory === item.id}
          navigate={navigate}
          dropdownProvidersByCategory={dropdownProvidersByCategory}
        />
      ))}
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

function openBannerLink(link, navigate) {
  const l = (link || '/promo').trim()
  if (/^https?:\/\//i.test(l)) {
    window.open(l, '_blank', 'noopener,noreferrer')
  } else {
    navigate(l.startsWith('/') ? l : `/${l}`)
  }
}

/** Teks `config.about` dari API — sama sumber dengan footer */
function HomeAboutBlurb() {
  const { about } = useWebsite()
  const text = about?.trim()
  if (!text) return null
  return (
    <section className="mb-4 md:mb-6" aria-label="Tentang situs">
      <p className="text-[10px] md:text-xs text-[#909090] leading-relaxed border-l-2 border-[#fbbf24]/40 pl-3">
        {text}
      </p>
    </section>
  )
}

// Promo Banner — `config.banner` dari GET /info; kosong → default `/banners/banner-1.webp` (CDN)
function PromoBanner() {
  const navigate = useNavigate()
  const { banners: apiBanners, title: siteTitle, loading: websiteLoading, configAssetRev } =
    useWebsite()

  const slides = useMemo(
    () => mapConfigBannersToPromoSlides(apiBanners, siteTitle, configAssetRev || null),
    [apiBanners, siteTitle, configAssetRev],
  )

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    setCurrentSlide(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length === 0) return undefined
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (websiteLoading) {
    return (
      <div
        className="relative rounded-xl md:rounded-2xl overflow-hidden min-h-[180px] md:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] animate-pulse border border-[#2a2a2a]/60"
        aria-hidden
      />
    )
  }

  if (slides.length === 0) return null

  const banner = slides[currentSlide]

  return (
    <div className="relative rounded-xl md:rounded-2xl overflow-hidden">
      {/* Banner Content */}
      <div className={`relative min-h-[180px] md:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px]`}>
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
        <div className="relative z-10 p-5 md:p-6 lg:p-8 xl:p-12 flex flex-col justify-center min-h-[180px] md:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px]">
          {/* Tag Badge */}
          <div className="mb-3 md:mb-4">
            <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-[10px] md:text-xs font-bold text-white/90 tracking-wider">
              {banner.tag}
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white mb-0.5 md:mb-1 drop-shadow-lg tracking-wide">
            {banner.titleLine1}
          </h2>
          <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white mb-2 md:mb-3 drop-shadow-lg">
            {banner.titleLine2}
          </h3>
          
          {/* Description */}
          <p className="text-[10px] md:text-xs lg:text-sm text-white/60 mb-4 md:mb-5 lg:mb-6 max-w-md">
            {banner.description}
          </p>
          
          {/* Buttons */}
          <div className="flex gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => openBannerLink(banner.link, navigate)}
              className="px-4 md:px-5 lg:px-6 py-2 md:py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-black text-[10px] md:text-sm font-bold hover:from-white hover:to-[#B0B0B0] transition-all shadow-lg tracking-wider"
            >
              CLAIM SEKARANG
            </button>
            <button
              type="button"
              onClick={() => navigate('/promo')}
              className="px-4 md:px-5 lg:px-6 py-2 md:py-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white/80 text-[10px] md:text-sm font-bold hover:bg-white/20 transition-all tracking-wider hidden md:block"
            >
              SYARAT & KETENTUAN
            </button>
          </div>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-3 md:bottom-4 lg:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 md:h-2 rounded-full transition-all ${
              i === currentSlide 
                ? 'w-5 md:w-6 lg:w-7 bg-white' 
                : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
      
      {/* Navigation Arrows - Desktop only */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur rounded-full items-center justify-center text-white hover:bg-black/70 transition-all"
      >
        ‹
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur rounded-full items-center justify-center text-white hover:bg-black/70 transition-all"
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
        <span className="text-2xl md:text-3xl">⚡</span>
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40">
        <span className="text-2xl md:text-3xl">⚡</span>
      </div>
      
      <div className="relative z-10 py-3 md:py-4 px-4">
        <div className="text-center">
          <span className="text-[9px] md:text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-[0.3em] block mb-1">JACKPOT</span>
          <span className="text-xl md:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] animate-pulse-slow">
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
  /** 0: API / default file; 1: paksa default; 2: 🎰 */
  const [heroTier, setHeroTier] = useState(0)

  // Handle badge - can be object {type: 'hot'} or string 'HOT'
  const badgeType =
    provider && typeof provider.badge === 'object' ? provider.badge?.type : provider?.badge
  const isHot = badgeType === 'hot' || badgeType === 'HOT'
  const isNew = badgeType === 'new' || badgeType === 'NEW'

  const characterImage = normalizeImageUrl(provider?.characterImg)
  const logoImage = normalizeImageUrl(provider?.logoImg)
  const heroImage = logoImage ?? characterImage
  const showCornerLogo =
    Boolean(logoImage && characterImage && logoImage !== characterImage)
  const name = provider?.name || provider?.logoAlt || 'Provider'

  useEffect(() => {
    setHeroTier(0)
  }, [heroImage])

  if (!provider) return null

  const mobileHeroUrl =
    heroTier === 0
      ? providerAssetUrl(heroImage ?? DEFAULT_PROVIDER_CARD_IMAGE)
      : heroTier === 1
        ? providerAssetUrl(DEFAULT_PROVIDER_CARD_IMAGE)
        : null

  const handleMobileHeroError = () => {
    setHeroTier((t) => {
      if (t === 0 && heroImage) return 1
      return 2
    })
  }

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
      
      {/* Satu gambar penuh (API: logo & character sama URL → tanpa overlay ganda) */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-b from-[#252525] to-[#1a1a1a]">
        {mobileHeroUrl ? (
          <img
            src={mobileHeroUrl}
            alt={name}
            className={`w-full h-full object-cover object-center transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={handleMobileHeroError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🎰</div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#C0C0C0]/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />

        {showCornerLogo && (
          <div
            className={`absolute bottom-2 right-2 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          >
            <img
              src={providerAssetUrl(logoImage)}
              alt={name}
              className="h-8 w-auto object-contain drop-shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-[#0a0a0a] to-[#0d0d0d] border-t border-[#2a2a2a] py-2 px-2 z-50">
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

// ============ MINI PROVIDER CARD (shortcut) ============
function MiniProviderCard({ provider, isActive, onClick }) {
  const thumb =
    normalizeImageUrl(provider.logoImg) ?? normalizeImageUrl(provider.characterImg)
  const [thumbTier, setThumbTier] = useState(0)

  useEffect(() => {
    setThumbTier(0)
  }, [thumb])

  const miniThumbUrl =
    thumbTier === 0
      ? providerAssetUrl(thumb ?? DEFAULT_PROVIDER_CARD_IMAGE)
      : thumbTier === 1
        ? providerAssetUrl(DEFAULT_PROVIDER_CARD_IMAGE)
        : null

  const handleMiniThumbError = () => {
    setThumbTier((t) => {
      if (t === 0 && thumb) return 1
      return 2
    })
  }

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
        {miniThumbUrl ? (
          <img
            src={miniThumbUrl}
            alt={provider.name}
            onError={handleMiniThumbError}
            className={`max-w-[90%] max-h-[90%] object-contain transition-all duration-300 ${
              isActive ? 'brightness-125 drop-shadow-[0_0_4px_rgba(192,192,192,0.3)]' : 'brightness-75 group-hover:brightness-100'
            }`}
          />
        ) : (
          <span className="text-lg opacity-40" aria-hidden>
            🎰
          </span>
        )}
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
    <div className="mx-auto w-full max-w-[290px] aspect-[290/180] min-h-[110px] rounded-lg overflow-hidden border border-[#2a2a2a] animate-pulse bg-[#1a1a1a]">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 bg-[#252525]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-2 flex justify-center px-2">
          <div className="h-8 w-[min(100%,140px)] rounded bg-[#2a2a2a]" />
        </div>
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
function ProvidersListPage({ category, navigate, dropdownProvidersByCategory }) {
  const cat = categories.find(c => c.id === category) || categories[0]
  const Icon = cat.icon
  const { isAuthenticated, user, loginSuccess, logout, refreshBalance } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')
  // Game modal state
  const [gameModalOpen, setGameModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)

  /** Satu sumber data: konteks kategori = GET /slot|/fish|… → Provider[] (OpenAPI) + transformProviderData */
  const { providers: apiProviders, loading: providerCategoryLoading } = useProviderCategory(cat.id)
  const providersLoading =
    providerCategoryLoading && (!Array.isArray(apiProviders) || apiProviders.length === 0)

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
        onRequireAuth={() => {
          setGameModalOpen(false)
          openAuthModal('login')
        }}
      />
      
      <ChromeAppHeader
        navigate={navigate}
        onOpenAuth={openAuthModal}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        showQuickDeposit={isAuthenticated}
        onQuickDeposit={() => navigate('/member/deposit')}
        onBalanceRefresh={refreshBalance}
        desktopNav={
          <HomeChromeDesktopNavRow
            activeCategory={category}
            setActiveCategory={() => {}}
            navigate={navigate}
            dropdownProvidersByCategory={dropdownProvidersByCategory}
          />
        }
      />
      
      {/* Desktop */}
      <div className="hidden md:block pt-[130px] pb-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6 [contain:paint]">
            {providersLoading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <div key={`skeleton-list-${i}`} className="flex min-w-0 justify-center sm:justify-stretch">
                  <ProviderCardSkeleton />
                </div>
              ))
            ) : (
              categoryProviders.map(provider => (
                <div
                  key={provider.id || provider.provider_id}
                  className="flex min-w-0 justify-center sm:justify-stretch"
                >
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
      <div className="md:hidden pt-[130px] pb-20">
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
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {providersLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-mobile-list-${i}`} className="flex min-w-0 justify-center">
                  <ProviderCardSkeleton />
                </div>
              ))
            ) : categoryProviders.length === 0 ? (
              <div className="col-span-2 py-8 text-center text-xs text-[#606060]">
                Belum ada provider.
              </div>
            ) : (
              categoryProviders.map(provider => (
                <div key={provider.id || provider.provider_id} className="flex min-w-0 justify-center">
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

  const { providersByCategory: dropdownProvidersByCategory } = useNavDropdownProviders()

  /** Grid kartu home: konteks kategori aktif — selaras kontrak Provider + transform (bukan slice dari snapshot nav) */
  const { providers: apiProviders, loading: providerCategoryLoading } =
    useProviderCategory(providerBoxCategory)
  const providersLoading =
    providerCategoryLoading && (!Array.isArray(apiProviders) || apiProviders.length === 0)

  // Fetch lottery results from API
  const { results: lotteryResults, loading: lotteryLoading } = useLotteryResults()

  const activeProviders =
    apiProviders.length > 0
      ? apiProviders
      : categories.find((c) => c.id === providerBoxCategory)?.providers || []
  
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
  const { isAuthenticated, user, loginSuccess, logout, refreshBalance } = useAuth()
  
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
    return (
      <ProvidersListPage
        category={providerCategory}
        navigate={navigate}
        dropdownProvidersByCategory={dropdownProvidersByCategory}
      />
    )
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
        onRequireAuth={() => {
          setGameModalOpen(false)
          openAuthModal('login')
        }}
      />
      
      <ChromeAppHeader
        navigate={navigate}
        onOpenAuth={openAuthModal}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        showQuickDeposit={isAuthenticated}
        onQuickDeposit={() => navigate('/member/deposit')}
        onBalanceRefresh={refreshBalance}
        desktopNav={
          <HomeChromeDesktopNavRow
            activeCategory={headerCategory}
            setActiveCategory={setHeaderCategory}
            navigate={navigate}
            dropdownProvidersByCategory={dropdownProvidersByCategory}
          />
        }
      />

      {/* ==================== MARQUEE - Both Desktop & Mobile ==================== */}
      <div className="hidden md:block pt-[130px] relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] themed-card rounded-lg py-2.5 mb-4">
            <NotificationMarquee variant="chrome-desktop" />
          </div>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <main className="hidden md:block pb-8 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          
          {/* PROMO BANNER */}
          <section className="mb-6">
            <PromoBanner />
          </section>

          {/* LIVE JACKPOT - Desktop */}
          <section className="mb-6 pb-6 themed-border-bottom">
            <JackpotCounter isMobile={false} />
          </section>

          {/* MAIN GRID: TOGEL LEFT + PROVIDERS RIGHT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* LEFT SIDEBAR - TOGEL RESULTS */}
            <aside className="md:col-span-3">
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
                onClick={() => navigate('/togel')}
                className="block w-full mt-4 py-3 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-[10px] font-bold text-[#505050] hover:text-[#C0C0C0] hover:border-[#404040] transition-all tracking-widest text-center cursor-pointer"
              >
                LIHAT SEMUA PASARAN →
              </button>
            </aside>

            {/* MAIN CONTENT - PROVIDERS */}
            <div className="md:col-span-9">
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
              <div className="grid max-h-[750px] grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 overflow-y-auto pr-1 md:pr-2 hide-scrollbar [contain:paint]">
                {providersLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={`skeleton-${i}`} className="flex min-w-0 justify-center sm:justify-stretch">
                      <ProviderCardSkeleton />
                    </div>
                  ))
                ) : (
                  activeProviders.map(provider => (
                    <div
                      key={provider.id || provider.provider_id}
                      className="flex min-w-0 justify-center sm:justify-stretch"
                    >
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
      <main className="md:hidden pt-[130px] pb-20 relative z-10">
        <div className="px-3">
          
          {/* Marquee Text - Running */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] rounded-lg py-2 mb-3">
            <NotificationMarquee variant="chrome-mobile" />
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
          
          {/* Provider cards — tanpa scale (hindari kolaps/terpotong overflow); 2 kolom kompak */}
          <section className="pb-2">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {providersLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`skeleton-mobile-${i}`} className="flex min-w-0 justify-center">
                    <ProviderCardSkeleton />
                  </div>
                ))
              ) : activeProviders.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-xs text-[#606060]">
                  Belum ada provider untuk kategori ini.
                </div>
              ) : (
                activeProviders.map(provider => (
                  <div
                    key={provider.id || provider.provider_id}
                    className="flex min-w-0 justify-center"
                  >
                    <ProviderCard
                      {...provider}
                      onPlayClick={() => handleProviderClick(provider)}
                    />
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
        
      `}</style>
    </div>
  )
}
