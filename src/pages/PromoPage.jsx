import { Link } from 'react-router-dom'
import { FaHome, FaDollarSign, FaComments, FaBars } from 'react-icons/fa'
import { useContext } from 'react'
import { MenuContext } from '../App'
import Footer from '../components/Footer'

// Import existing banner images as placeholders
import bonusDeposit from '../assets/banners/popup-deposit-imlek.webp'
import welcomeBonus from '../assets/banners/welcome-bonus.webp'
import putarRoda from '../assets/banners/putar-roda.webp'
import bannerBaru from '../assets/banners/banner-baru.webp'
import hadiah from '../assets/banners/hadiah-togel.webp'
import bannerQris from '../assets/banners/banner-qris.webp'

const promoData = [
  {
    id: 1,
    title: 'BONUS DEPOSIT HARIAN 10% KHUSUS SLOT GAME',
    image: bonusDeposit,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 2,
    title: 'BONUS CASHBACK KEKALAHAN SPORTSBOOK UP TO 5%',
    image: welcomeBonus,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 3,
    title: 'BONUS CASHBACK TURNOVER 0.5% ( SPORTSBOOK )',
    image: bannerBaru,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 4,
    title: 'BONUS CASHBACK TURNOVER 0.5% ( SLOT GAMES )',
    image: hadiah,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 5,
    title: 'BONUS CASHBACK TURNOVER LIVE GAME 0.5%',
    image: bannerQris,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 6,
    title: 'BONUS CASHBACK KEKALAHAN SLOT GAMES 5%',
    image: bonusDeposit,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 7,
    title: 'BONUS CASHBACK KEKALAHAN LIVEGAME Up To 5%',
    image: welcomeBonus,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 8,
    title: 'BONUS REFERRAL',
    image: bannerBaru,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 9,
    title: 'SPECIAL BONUS NEW MEMBER 30%',
    image: welcomeBonus,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 10,
    title: 'BONUS EXTRA AJAK TEMAN 10%',
    image: hadiah,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 11,
    title: 'LUCKY WHEEL',
    image: putarRoda,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
  {
    id: 12,
    title: 'EVENT SCATTER MAHJONG WAYS 1 & 2',
    image: bannerBaru,
    dateStart: '2025-10-14',
    dateEnd: '2025-10-14'
  },
]

export default function PromoPage() {
  const { openMenu } = useContext(MenuContext)

  return (
    <div className="min-h-screen bg-[#0d1829] rounded-lg md:rounded-xl overflow-hidden">
      {/* Header Navigation - hidden on mobile (bottom nav exists), visible on desktop */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-[#0d1829] border-b border-slate-800/50">
        <div className="flex items-center justify-center gap-8 md:gap-16 py-6 md:py-8 px-4">
          <Link 
            to="/"
            className="flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-4 text-white/60 hover:text-white transition-colors"
          >
            <FaHome className="text-2xl md:text-3xl" />
            <span className="text-lg md:text-xl font-medium">Home</span>
          </Link>
          <Link 
            to="/promo"
            className="flex items-center gap-3 md:gap-4 px-8 md:px-12 py-3 md:py-4 rounded-full bg-[#1e2d3d] text-white transition-colors"
          >
            <FaDollarSign className="text-2xl md:text-3xl" />
            <span className="text-lg md:text-xl font-medium">Promosi</span>
          </Link>
          <Link 
            to="/contact"
            className="flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-4 text-white/60 hover:text-white transition-colors"
          >
            <FaComments className="text-2xl md:text-3xl" />
            <span className="text-lg md:text-xl font-medium">Hubungi Kami</span>
          </Link>
          <button 
            onClick={openMenu}
            className="flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-4 text-white/60 hover:text-white transition-colors"
          >
            <FaBars className="text-2xl md:text-3xl" />
            <span className="text-lg md:text-xl font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-6 md:h-[90px]"></div>

      {/* Title */}
      <div className="py-4 md:py-6 px-4">
        <h1 className="text-center text-white text-2xl md:text-3xl font-semibold tracking-[0.3em]">PROMOSI</h1>
      </div>

      {/* Spacer */}
      <div className="h-4 md:h-8"></div>

      {/* Promo Grid - 1 column on mobile, 2 columns on desktop */}
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {promoData.map((promo) => (
            <div 
              key={promo.id}
              className="bg-[#141e2d] rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform p-3 md:p-4"
            >
              {/* Promo Image */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                <img 
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Promo Info */}
              <div className="pt-3 md:pt-4">
                <h3 className="text-white text-sm md:text-base font-bold leading-tight mb-2 line-clamp-2">
                  {promo.title}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm">
                  {promo.dateStart} —— {promo.dateEnd}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacer before Footer */}
      <div className="h-8 md:h-12"></div>

      {/* Footer */}
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </div>
  )
}
