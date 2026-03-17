import { Link } from 'react-router-dom'
import { FaHome, FaDollarSign, FaComments, FaBars } from 'react-icons/fa'
import { useContext, useState, useEffect } from 'react'
import { MenuContext } from '../App'
import Footer from '../components/Footer'
import { getPromo } from '../services/api'

// Import existing banner images as fallback
import bonusDeposit from '../assets/banners/popup-deposit-imlek.webp'
import welcomeBonus from '../assets/banners/welcome-bonus.webp'
import putarRoda from '../assets/banners/putar-roda.webp'
import bannerBaru from '../assets/banners/banner-baru.webp'
import hadiah from '../assets/banners/hadiah-togel.webp'
import bannerQris from '../assets/banners/banner-qris.webp'

// Image mapping untuk fallback jika API image tidak tersedia
const imageMap = [
  bonusDeposit,
  welcomeBonus,
  bannerBaru,
  hadiah,
  bannerQris,
  bonusDeposit,
  welcomeBonus,
  bannerBaru,
  welcomeBonus,
  hadiah,
  putarRoda,
  bannerBaru
]

export default function PromoPage() {
  const { openMenu } = useContext(MenuContext)
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPromo()
        // Map API data ke format yang digunakan UI
        // Struktur siap untuk MySQL: jika image null/empty, gunakan fallback
        const mappedData = data.map((promo, index) => {
          // Handle image: jika null/empty/404, gunakan fallback local image
          let imageUrl = promo.image
          if (!imageUrl || imageUrl === '' || imageUrl.startsWith('http')) {
            // Jika image null atau URL external yang mungkin 404, gunakan fallback
            imageUrl = imageMap[index % imageMap.length]
          }
          
          return {
            id: promo.id,
            title: promo.title,
            image: imageUrl,
            dateStart: promo.start_date || '2025-10-14', // Akan ada di MySQL nanti
            dateEnd: promo.end_date || '2025-10-14' // Akan ada di MySQL nanti
          }
        })
        setPromotions(mappedData)
      } catch (err) {
        console.error('Error fetching promotions:', err)
        setError(err.data?.message || 'Failed to load promotions')
        // Fallback ke empty array atau default data
        setPromotions([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPromos()
  }, [])

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

      {/* Promo Grid - 1 column on mobile, 2 columns on desktop */}
      {!loading && !error && (
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {promotions.length > 0 ? (
              promotions.map((promo) => (
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
                  onError={(e) => {
                    // Fallback jika image gagal load (404, dll)
                    const fallbackIndex = promo.id % imageMap.length
                    e.target.src = imageMap[fallbackIndex]
                  }}
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-white/60">No promotions available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer before Footer */}
      <div className="h-8 md:h-12"></div>

      {/* Footer */}
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </div>
  )
}
