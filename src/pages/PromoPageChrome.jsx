// PromoPageChrome.jsx - Promo page with Chrome theme
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FooterChrome from '../components/FooterChrome'
import { getPromo } from '../services/api'
import {
  HomeIconChrome,
  PromoIconChrome,
  ReferralIconChrome,
  HelpIconChrome,
  AccountIconChrome,
} from '../components/IconsChrome'
import { publicAssetUrl } from '../utils/publicAssetUrl'
import { normalizeImageUrl } from '../utils/normalizeImageUrl'
import AuthModal from '../components/AuthModal'
import { useAuth } from '../context/AuthContext'
import ChromeAppHeader, { ChromeSimpleDesktopNav } from '../components/ChromeAppHeader'
import { CHROME_COMPACT_HEADER_NAV } from '../config/chromeCompactTopNav'

/** Fallback promo — hanya file yang benar-benar ada di aset/banners/ (lihat mapHomePromoBanners DEFAULT_CONFIG). */
const imageMap = {
  default: publicAssetUrl('/banners/banner-1.webp'),
  bonusDeposit: publicAssetUrl('/banners/banner-2.webp'),
  bannerBaru: publicAssetUrl('/banners/banner-3.webp'),
  hadiah: publicAssetUrl('/banners/banner-1.webp'),
  putarRoda: publicAssetUrl('/banners/banner-2.webp'),
  bannerQris: publicAssetUrl('/banners/banner-3.webp'),
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-[#0a0a0a] to-[#0d0d0d] border-t border-[#2a2a2a] py-2 px-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = item.id === 'promo'
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

// Promo Card Component
function PromoCard({ promo }) {
  const tagColors = {
    'HOT': 'from-red-600 to-orange-600',
    'DAILY': 'from-green-600 to-emerald-600',
    'WEEKLY': 'from-blue-600 to-cyan-600',
    'REFERRAL': 'from-purple-600 to-pink-600',
    'LIFETIME': 'from-yellow-600 to-amber-600',
  }
  
  return (
    <div className="group relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] themed-card rounded-2xl overflow-hidden hover:border-[#404040] transition-all duration-300 hover:shadow-xl hover:shadow-white/5">
      {/* Tag */}
      <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-gradient-to-r ${tagColors[promo.tag] || 'from-gray-600 to-gray-700'} text-white text-[10px] font-bold tracking-wider shadow-lg`}>
        {promo.tag}
      </div>
      
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={publicAssetUrl(promo.image)}
          alt={promo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const t = e.target
            t.onerror = null
            const keys = Object.keys(imageMap)
            t.src = imageMap[keys[Number(promo.id) % keys.length]] || imageMap.default
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#909090] mb-2 line-clamp-2">
          {promo.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-[#606060] mb-3 line-clamp-2">
          {promo.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#404040]">
            {promo.dateStart} - {promo.dateEnd}
          </span>
          <button className="px-4 py-1.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-black text-[10px] font-bold hover:from-white hover:to-[#B0B0B0] transition-all shadow-md">
            CLAIM
          </button>
        </div>
      </div>
    </div>
  )
}

// Main PromoPageChrome Component
export default function PromoPageChrome() {
  const navigate = useNavigate()
  const { isAuthenticated, user, loginSuccess, logout, refreshBalance } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPromo()
        // Map API data ke format yang digunakan UI
        // Struktur siap untuk MySQL: handle null/empty image, dates, dll
        const mappedData = data.map((promo, index) => {
          const titleStr = String(promo.title ?? '')
          // Tag: field API `tag` atau infer dari title; default HOT (format API: { id, title, image, description } tanpa tag)
          let tag = promo.tag || 'HOT'
          if (!promo.tag) {
            const t = titleStr.toLowerCase()
            if (t.includes('daily') || t.includes('harian')) tag = 'DAILY'
            else if (t.includes('weekly') || t.includes('mingguan')) tag = 'WEEKLY'
            else if (t.includes('referral')) tag = 'REFERRAL'
            else if (t.includes('togel')) tag = 'TOGEL'
            else if (t.includes('lucky') || t.includes('wheel')) tag = 'EVENT'
          }

          // URL absolut (https://...) atau path relatif dipakai apa adanya; fallback hanya bila image kosong
          let image = normalizeImageUrl(promo.image)
          if (!image) {
            const imageKeys = Object.keys(imageMap)
            const imageKey = imageKeys[index % imageKeys.length]
            image = imageMap[imageKey] || imageMap.default
          }

          return {
            id: promo.id,
            title: titleStr,
            description: String(promo.description ?? ''),
            image,
            dateStart: promo.start_date
              ? new Date(promo.start_date).toLocaleDateString('id-ID')
              : '01/01/2026',
            dateEnd: promo.end_date
              ? new Date(promo.end_date).toLocaleDateString('id-ID')
              : '31/12/2026',
            tag,
          }
        })
        setPromotions(mappedData)
      } catch (err) {
        console.error('Error fetching promotions:', err)
        setError(err.data?.message || 'Failed to load promotions')
        // Fallback ke empty array
        setPromotions([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPromos()
  }, [])
  
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
        showQuickDeposit={isAuthenticated}
        onQuickDeposit={() => navigate('/member/deposit')}
        onBalanceRefresh={refreshBalance}
        desktopNav={
          <ChromeSimpleDesktopNav items={CHROME_COMPACT_HEADER_NAV} activeId="promosi" navigate={navigate} />
        }
      />
      
      {/* Desktop View */}
      <main className="hidden md:block pt-[130px] pb-12 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Page Title */}
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <PromoIconChrome size={32} active={true} />
            <div>
              <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                PROMOSI
              </h1>
              <p className="text-xs text-[#505050] tracking-wide mt-1">
                Dapatkan bonus dan promo menarik setiap hari
              </p>
            </div>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-white text-lg">Loading promotions...</div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-400 text-lg">Error: {error}</div>
            </div>
          )}

          {/* Promo Grid - 3 columns */}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
              {promotions.length > 0 ? (
                promotions.map(promo => (
                  <PromoCard key={promo.id} promo={promo} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-white/60">No promotions available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Mobile View */}
      <main className="md:hidden pt-[130px] pb-24 relative z-10">
        <div className="px-3">
          {/* Page Title */}
          <div className="flex items-center gap-3 py-4">
            <PromoIconChrome size={24} active={true} />
            <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
              PROMOSI
            </h1>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-white text-sm">Loading promotions...</div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-400 text-sm">Error: {error}</div>
            </div>
          )}

          {/* Promo Grid - 1 column on mobile */}
          {!loading && !error && (
            <div className="grid grid-cols-1 gap-4">
              {promotions.length > 0 ? (
                promotions.map(promo => (
                  <PromoCard key={promo.id} promo={promo} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/60">No promotions available</p>
                </div>
              )}
            </div>
          )}
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
