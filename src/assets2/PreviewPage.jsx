import { useState } from 'react'
import ProviderCard from '../components/ProviderCard'
import { providers, sportsProviders, casinoProviders, togelProviders, fishingProviders, arcadeProviders, pokerProviders, cockfightProviders, TOTAL_SLOTS, TOTAL_SPORTS_SLOTS, TOTAL_CASINO_SLOTS, TOTAL_TOGEL_SLOTS, TOTAL_FISHING_SLOTS, TOTAL_ARCADE_SLOTS, TOTAL_POKER_SLOTS, TOTAL_COCKFIGHT_SLOTS } from '../config/providers'

// Colorful Icons
import {
  SlotsIcon,
  SportsIcon,
  CasinoIcon,
  LotteryIcon,
  FishingIcon,
  ArcadeIcon,
  PokerIcon,
  CockFightingIcon,
  PromoIcon,
  ReferralIcon,
  HomeIcon,
  PromoMenuIcon,
  DepositIcon,
  HelpIcon,
  AccountIcon
} from '../components/Icons'

// Chrome Icons
import {
  SlotsIconChrome,
  SportsIconChrome,
  CasinoIconChrome,
  LotteryIconChrome,
  FishingIconChrome,
  ArcadeIconChrome,
  PokerIconChrome,
  CockFightingIconChrome,
  PromoIconChrome,
  ReferralIconChrome,
  HomeIconChrome,
  PromoMenuIconChrome,
  DepositIconChrome,
  HelpIconChrome,
  AccountIconChrome
} from '../components/IconsChrome'

// Empty placeholder card
function EmptyCard() {
  return (
    <div className="flex items-center justify-center" style={{ perspective: '800px' }}>
      <div className="relative w-[290px] h-[180px] cursor-pointer select-none">
        <div className="absolute inset-0 rounded-lg p-[1.5px] bg-gradient-to-br from-[#404040] via-[#303030] to-[#202020]">
          <div className="relative w-full h-full rounded-[6.5px] bg-black/80 overflow-hidden flex items-center justify-center">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(rgba(192,192,192,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(192,192,192,0.5) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
            {/* Coming Soon text */}
            <div className="text-center z-[1]">
              <p className="text-[#404040] text-[11px] font-bold tracking-[0.3em] uppercase">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Category Tab Component - Colorful Theme
function CategoryTabColorful({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-1.5 px-4 py-3 min-w-[80px]
        rounded-xl transition-all duration-300 ease-out group
        ${active 
          ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/50' 
          : 'bg-transparent border border-transparent hover:border-white/10 hover:bg-white/5'
        }
      `}
    >
      <div className={`
        transition-all duration-300
        ${active 
          ? 'scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
          : 'opacity-60 group-hover:opacity-100 group-hover:scale-105'
        }
      `}>
        <Icon size={28} />
      </div>
      <span className={`
        text-[10px] font-bold tracking-wider uppercase transition-colors duration-300
        ${active ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'}
      `}>
        {label}
      </span>
      {active && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none" />
      )}
    </button>
  )
}

// Category Tab Component - Chrome Theme
function CategoryTabChrome({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-1.5 px-4 py-3 min-w-[80px]
        rounded-lg transition-all duration-300 ease-out group
        ${active 
          ? 'bg-gradient-to-b from-[#252525] to-[#1a1a1a] border border-[#505050] shadow-[0_0_15px_rgba(192,192,192,0.15)]' 
          : 'bg-transparent border border-transparent hover:border-[#303030] hover:bg-[#151515]'
        }
      `}
    >
      <div className={`
        transition-all duration-300
        ${active 
          ? 'scale-110 drop-shadow-[0_0_8px_rgba(192,192,192,0.4)]' 
          : 'group-hover:scale-105'
        }
      `}>
        <Icon size={28} active={active} />
      </div>
      <span className={`
        text-[10px] font-semibold tracking-wider uppercase transition-colors duration-300
        ${active ? 'text-[#E0E0E0]' : 'text-[#505050] group-hover:text-[#808080]'}
      `}>
        {label}
      </span>
      {active && (
        <>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent" />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
        </>
      )}
    </button>
  )
}

// Bottom Menu Button - Colorful Theme
function MenuButtonColorful({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[64px]
        transition-all duration-200 group
        ${active ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}
      `}
    >
      <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
        <Icon size={22} />
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-wider">{label}</span>
    </button>
  )
}

// Bottom Menu Button - Chrome Theme
function MenuButtonChrome({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[64px]
        transition-all duration-200 group
        ${active ? 'text-[#E0E0E0]' : 'text-[#404040] hover:text-[#808080]'}
      `}
    >
      <div className={`
        transition-all duration-200 
        ${active ? 'scale-110 drop-shadow-[0_0_6px_rgba(192,192,192,0.3)]' : 'group-hover:scale-105'}
      `}>
        <Icon size={22} active={active} />
      </div>
      <span className={`text-[9px] font-semibold uppercase tracking-wider ${active ? 'text-[#C0C0C0]' : ''}`}>{label}</span>
    </button>
  )
}

// Theme Toggle Button
function ThemeToggle({ isChrome, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151515] border border-[#303030] transition-all duration-300 hover:border-[#505050]"
    >
      <span className={`text-xs font-medium transition-colors ${!isChrome ? 'text-amber-400' : 'text-[#505050]'}`}>
        Colorful
      </span>
      <div className="relative w-10 h-5 rounded-full bg-[#0a0a0a] border border-[#303030]">
        <div 
          className={`
            absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300
            ${isChrome 
              ? 'left-5 bg-gradient-to-br from-[#C0C0C0] to-[#808080]' 
              : 'left-0.5 bg-gradient-to-br from-amber-400 to-orange-500'
            }
          `}
        />
      </div>
      <span className={`text-xs font-medium transition-colors ${isChrome ? 'text-[#C0C0C0]' : 'text-[#505050]'}`}>
        Chrome
      </span>
    </button>
  )
}

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState('slots')
  const [activeMenu, setActiveMenu] = useState('home')
  const [isChrome, setIsChrome] = useState(false)
  
  // Category tabs configuration - Colorful
  const categoryTabsColorful = [
    { id: 'slots', label: 'Slots', icon: SlotsIcon },
    { id: 'sports', label: 'Sports', icon: SportsIcon },
    { id: 'casino', label: 'Casino', icon: CasinoIcon },
    { id: 'togel', label: 'Lottery', icon: LotteryIcon },
    { id: 'fishing', label: 'Fishing', icon: FishingIcon },
    { id: 'arcade', label: 'Arcade', icon: ArcadeIcon },
    { id: 'poker', label: 'Poker', icon: PokerIcon },
    { id: 'cockfight', label: 'Sabung', icon: CockFightingIcon },
    { id: 'promo', label: 'Promo', icon: PromoIcon },
    { id: 'referral', label: 'Referral', icon: ReferralIcon },
  ]
  
  // Category tabs configuration - Chrome
  const categoryTabsChrome = [
    { id: 'slots', label: 'Slots', icon: SlotsIconChrome },
    { id: 'sports', label: 'Sports', icon: SportsIconChrome },
    { id: 'casino', label: 'Casino', icon: CasinoIconChrome },
    { id: 'togel', label: 'Lottery', icon: LotteryIconChrome },
    { id: 'fishing', label: 'Fishing', icon: FishingIconChrome },
    { id: 'arcade', label: 'Arcade', icon: ArcadeIconChrome },
    { id: 'poker', label: 'Poker', icon: PokerIconChrome },
    { id: 'cockfight', label: 'Sabung', icon: CockFightingIconChrome },
    { id: 'promo', label: 'Promo', icon: PromoIconChrome },
    { id: 'referral', label: 'Referral', icon: ReferralIconChrome },
  ]
  
  // Bottom menu configuration - Colorful
  const menuItemsColorful = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'promo', label: 'Promo', icon: PromoMenuIcon },
    { id: 'deposit', label: 'Deposit', icon: DepositIcon },
    { id: 'help', label: 'Bantuan', icon: HelpIcon },
    { id: 'account', label: 'Akun', icon: AccountIcon },
  ]
  
  // Bottom menu configuration - Chrome
  const menuItemsChrome = [
    { id: 'home', label: 'Home', icon: HomeIconChrome },
    { id: 'promo', label: 'Promo', icon: PromoMenuIconChrome },
    { id: 'deposit', label: 'Deposit', icon: DepositIconChrome },
    { id: 'help', label: 'Bantuan', icon: HelpIconChrome },
    { id: 'account', label: 'Akun', icon: AccountIconChrome },
  ]
  
  // Select based on theme
  const categoryTabs = isChrome ? categoryTabsChrome : categoryTabsColorful
  const menuItems = isChrome ? menuItemsChrome : menuItemsColorful
  const CategoryTab = isChrome ? CategoryTabChrome : CategoryTabColorful
  const MenuButton = isChrome ? MenuButtonChrome : MenuButtonColorful
  
  // Get current providers based on active tab
  const getProvidersAndTotal = () => {
    switch (activeTab) {
      case 'slots':
        return { currentProviders: providers, totalSlots: TOTAL_SLOTS }
      case 'sports':
        return { currentProviders: sportsProviders, totalSlots: TOTAL_SPORTS_SLOTS }
      case 'casino':
        return { currentProviders: casinoProviders, totalSlots: TOTAL_CASINO_SLOTS }
      case 'togel':
        return { currentProviders: togelProviders, totalSlots: TOTAL_TOGEL_SLOTS }
      case 'fishing':
        return { currentProviders: fishingProviders, totalSlots: TOTAL_FISHING_SLOTS }
      case 'arcade':
        return { currentProviders: arcadeProviders, totalSlots: TOTAL_ARCADE_SLOTS }
      case 'poker':
        return { currentProviders: pokerProviders, totalSlots: TOTAL_POKER_SLOTS }
      case 'cockfight':
        return { currentProviders: cockfightProviders, totalSlots: TOTAL_COCKFIGHT_SLOTS }
      default:
        return { currentProviders: providers, totalSlots: TOTAL_SLOTS }
    }
  }
  
  const { currentProviders, totalSlots } = getProvidersAndTotal()
  
  // Calculate empty slots needed
  const emptySlots = Math.max(0, totalSlots - currentProviders.length)

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      isChrome 
        ? 'bg-[#000000]' 
        : 'bg-gradient-to-b from-[#0a0a0f] via-[#0d0d14] to-[#0a0a0f]'
    }`}>
      {/* Top Header */}
      <header className={`sticky top-0 z-50 pb-4 transition-colors duration-500 ${
        isChrome 
          ? 'bg-gradient-to-b from-[#000000] to-transparent' 
          : 'bg-gradient-to-b from-[#0a0a0f] to-transparent'
      }`}>
        <div className="flex flex-col items-center justify-center py-4 gap-3">
          <h1 className={`text-xl font-bold tracking-wider transition-colors duration-500 ${
            isChrome 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#808080] via-[#C0C0C0] to-[#808080]' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400'
          }`}>
            GAME PROVIDERS
          </h1>
          
          {/* Theme Toggle */}
          <ThemeToggle isChrome={isChrome} onToggle={() => setIsChrome(!isChrome)} />
        </div>
        
        {/* Category Navigation - Horizontal Scroll */}
        <div className="relative px-2">
          {/* Left fade */}
          <div className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-colors duration-500 ${
            isChrome 
              ? 'bg-gradient-to-r from-[#000000] to-transparent' 
              : 'bg-gradient-to-r from-[#0a0a0f] to-transparent'
          }`} />
          {/* Right fade */}
          <div className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-colors duration-500 ${
            isChrome 
              ? 'bg-gradient-to-l from-[#000000] to-transparent' 
              : 'bg-gradient-to-l from-[#0a0a0f] to-transparent'
          }`} />
          
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-4">
            {categoryTabs.map((tab) => (
              <CategoryTab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 px-4 pb-24">
        {/* Provider Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-[1280px] mx-auto justify-items-center py-6">
          {/* Render active provider cards from config */}
          {currentProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              characterImg={provider.characterImg}
              characterImgAlt={provider.characterImgAlt}
              logoImg={provider.logoImg}
              logoAlt={provider.logoAlt}
              logoWidth={provider.logoWidth}
              logoTop={provider.logoTop}
              logoLeft={provider.logoLeft}
              characterWidth={provider.characterWidth}
              characterPosition={provider.characterPosition}
              characterCentered={provider.characterCentered}
              glowColor={provider.glowColor}
              glowColorHover={provider.glowColorHover}
              badge={provider.badge}
              overlayImg={provider.overlayImg}
              animationPrefix={provider.animationPrefix}
            />
          ))}

          {/* Render empty "Coming Soon" slots */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <EmptyCard key={`empty-${index}`} />
          ))}
        </div>
      </main>

      {/* Bottom Navigation Menu */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        {/* Blur backdrop */}
        <div className={`absolute inset-0 backdrop-blur-xl transition-colors duration-500 ${
          isChrome 
            ? 'bg-gradient-to-t from-[#000000] via-[#000000]/95 to-transparent' 
            : 'bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/95 to-transparent'
        }`} />
        
        {/* Border glow */}
        <div className={`absolute top-0 left-0 right-0 h-[1px] transition-colors duration-500 ${
          isChrome 
            ? 'bg-gradient-to-r from-transparent via-[#404040] to-transparent' 
            : 'bg-gradient-to-r from-transparent via-amber-500/30 to-transparent'
        }`} />
        
        <div className="relative flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
          {menuItems.map((item) => (
            <MenuButton
              key={item.id}
              active={activeMenu === item.id}
              onClick={() => setActiveMenu(item.id)}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}
