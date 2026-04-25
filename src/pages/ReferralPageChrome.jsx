// ReferralPageChrome.jsx - Referral page with Chrome theme
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import FooterChrome from '../components/FooterChrome'
import { HomeIconChrome, PromoIconChrome, ReferralIconChrome, HelpIconChrome, AccountIconChrome } from '../components/IconsChrome'
import { getReferral } from '../services/api'
import { publicAssetUrl } from '../utils/publicAssetUrl'
import { normalizeImageUrl } from '../utils/normalizeImageUrl'
import AuthModal from '../components/AuthModal'
import { useAuth } from '../context/AuthContext'
import { useWebsite } from '../context/WebsiteContext'
import ChromeContactSheet from '../components/ChromeContactSheet'
import ChromeAppHeader, { ChromeSimpleDesktopNav } from '../components/ChromeAppHeader'
import { CHROME_COMPACT_HEADER_NAV } from '../config/chromeCompactTopNav'

const fallbackBanner = publicAssetUrl('/banners/banner-1.webp')

// Mobile Bottom Navigation
function MobileBottomNav({ navigate }) {
  const { t } = useTranslation()
  const { contact } = useWebsite()
  const [contactSheetOpen, setContactSheetOpen] = useState(false)

  const runContact = () => setContactSheetOpen(true)

  const navItems = useMemo(
    () => [
      { id: 'home', icon: HomeIconChrome, label: t('nav.home'), path: '/' },
      { id: 'promo', icon: PromoIconChrome, label: t('nav.promo'), path: '/promo' },
      { id: 'livechat', icon: HelpIconChrome, label: t('nav.liveChat'), path: '#' },
      { id: 'referral', icon: ReferralIconChrome, label: t('nav.referral'), path: '/referral' },
      { id: 'contact', icon: AccountIconChrome, label: t('nav.contact'), path: '#' },
    ],
    [t],
  )

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-[#0a0a0a] to-[#0d0d0d] border-t border-[#2a2a2a] py-2 px-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === 'referral'
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'contact') {
                    runContact()
                    return
                  }
                  if (item.path !== '#') navigate(item.path)
                }}
                className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] shadow-lg shadow-white/5'
                    : ''
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent rounded-full blur-sm" />
                )}
                <Icon size={22} active={true} />
                <span
                  className={`text-[8px] font-bold tracking-wider ${
                    isActive ? 'text-[#F0F0F0]' : 'text-[#C0C0C0]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
      <ChromeContactSheet
        isOpen={contactSheetOpen}
        onClose={() => setContactSheetOpen(false)}
        contact={contact}
      />
    </>
  )
}

// Main ReferralPageChrome Component
export default function ReferralPageChrome() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, user, loginSuccess, logout, refreshBalance } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')
  const [referralImage, setReferralImage] = useState(fallbackBanner)
  const [referralDescription, setReferralDescription] = useState('')
  const [referralLoading, setReferralLoading] = useState(true)
  const [referralError, setReferralError] = useState(null)

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }

  useEffect(() => {
    let cancelled = false
    setReferralLoading(true)
    setReferralError(null)
    getReferral()
      .then((data) => {
        if (cancelled || !data) return
        const img = normalizeImageUrl(data.image)
        setReferralImage(img ? publicAssetUrl(img) : fallbackBanner)
        setReferralDescription(String(data.description ?? '').trim())
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Error fetching referral:', err)
        setReferralError(err.data?.message || t('referral.loadError'))
        setReferralImage(fallbackBanner)
        setReferralDescription('')
      })
      .finally(() => {
        if (!cancelled) setReferralLoading(false)
      })
    return () => {
      cancelled = true
    }
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
          <ChromeSimpleDesktopNav items={CHROME_COMPACT_HEADER_NAV} activeId="referral" navigate={navigate} />
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
                {t('referral.title')}
              </h1>
              {referralLoading && (
                <p className="text-sm text-[#606060] mt-1 h-4 w-64 max-w-full bg-[#2a2a2a] rounded animate-pulse" />
              )}
            </div>
          </div>

          {referralError && (
            <p className="text-sm text-amber-400/90 mb-4" role="alert">
              {referralError}
            </p>
          )}

          {/* Referral banner + deskripsi dari GET /referral (OpenAPI: image, description) */}
          <div className="rounded-2xl overflow-hidden themed-card shadow-2xl">
            {referralLoading ? (
              <div
                className="w-full aspect-[2/1] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] animate-pulse"
                aria-hidden
              />
            ) : (
              <img
                src={referralImage}
                alt={t('referral.imageAlt')}
                className="w-full h-auto"
                onError={(e) => {
                  const t = e.target
                  t.onerror = null
                  t.src = fallbackBanner
                }}
              />
            )}
          </div>

          {!referralLoading && referralDescription && (
            <p className="mt-4 md:mt-6 text-sm md:text-base text-[#a0a0a0] leading-relaxed max-w-3xl">
              {referralDescription}
            </p>
          )}
        </div>
      </main>
      
      {/* Mobile View */}
      <main className="md:hidden pt-[130px] pb-24 relative z-10">
        <div className="px-3 py-4">
          {/* Page Title - Mobile */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-lg flex items-center justify-center border border-[#3a3a3a]">
              <ReferralIconChrome size={22} active={false} />
            </div>
            <div>
              <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                {t('referral.title')}
              </h1>
              {referralLoading && (
                <p className="text-xs text-[#606060] mt-0.5 h-3 w-40 bg-[#2a2a2a] rounded animate-pulse" />
              )}
            </div>
          </div>

          {referralError && (
            <p className="text-xs text-amber-400/90 mb-3" role="alert">
              {referralError}
            </p>
          )}

          <div className="rounded-xl overflow-hidden themed-card">
            {referralLoading ? (
              <div className="w-full aspect-[2/1] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] animate-pulse" aria-hidden />
            ) : (
              <img
                src={referralImage}
                alt={t('referral.imageAlt')}
                className="w-full h-auto"
                onError={(e) => {
                  const t = e.target
                  t.onerror = null
                  t.src = fallbackBanner
                }}
              />
            )}
          </div>

          {!referralLoading && referralDescription && (
            <p className="mt-4 text-xs sm:text-sm text-[#a0a0a0] leading-relaxed">
              {referralDescription}
            </p>
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
