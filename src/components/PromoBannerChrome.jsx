import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWebsite } from '../context/WebsiteContext'
import { mapConfigBannersToPromoSlides } from '../utils/mapHomePromoBanners.js'
import { openBannerLink } from '../utils/openBannerLink.js'
import { publicAssetUrl } from '../utils/publicAssetUrl'

/**
 * Banner carousel — `config.banner` dari website bundle; default `/banners/banner-1.webp` bila kosong.
 * @param {object} props
 * @param {boolean} [props.showTermsButton] — tombol "SYARAT & KETENTUAN" ke /promo (sembunyikan di halaman /promo)
 */
export default function PromoBannerChrome({ showTermsButton = true } = {}) {
  const navigate = useNavigate()
  const { banners: apiBanners, title: siteTitle, loading: websiteLoading, configAssetRev } =
    useWebsite()

  const slides = useMemo(
    () => mapConfigBannersToPromoSlides(apiBanners, siteTitle, configAssetRev || null),
    [apiBanners, siteTitle, configAssetRev],
  )

  const [currentSlide, setCurrentSlide] = useState(0)
  const slideCount = slides.length
  const currentIndex = slideCount > 0 ? currentSlide % slideCount : 0

  useEffect(() => {
    if (slideCount === 0) return undefined
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount)
    }, 5000)
    return () => clearInterval(timer)
  }, [slideCount])

  if (websiteLoading) {
    return (
      <div
        className="relative rounded-xl md:rounded-2xl overflow-hidden min-h-[180px] md:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] animate-pulse border border-[#2a2a2a]/60"
        aria-hidden
      />
    )
  }

  if (slideCount === 0) return null

  const banner = slides[currentIndex]

  return (
    <div className="relative rounded-xl md:rounded-2xl overflow-hidden">
      <div className={`relative min-h-[180px] md:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px]`}>
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={banner.image}
            alt=""
            className="w-full h-full object-cover object-center transition-opacity duration-500"
            onError={(e) => {
              const t = e.target
              t.onerror = null
              t.src = publicAssetUrl('/banners/banner-1.webp')
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 p-5 md:p-6 lg:p-8 xl:p-12 flex flex-col justify-center min-h-[180px] md:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px]">
          <div className="mb-3 md:mb-4">
            <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-[10px] md:text-xs font-bold text-white/90 tracking-wider">
              {banner.tag}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white mb-0.5 md:mb-1 drop-shadow-lg tracking-wide">
            {banner.titleLine1}
          </h2>
          <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white mb-2 md:mb-3 drop-shadow-lg">
            {banner.titleLine2}
          </h3>

          <p className="text-[10px] md:text-xs lg:text-sm text-white/60 mb-4 md:mb-5 lg:mb-6 max-w-md">
            {banner.description}
          </p>

          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => openBannerLink(banner.link, navigate)}
              className="px-4 md:px-5 lg:px-6 py-2 md:py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-black text-[10px] md:text-sm font-bold hover:from-white hover:to-[#B0B0B0] transition-all shadow-lg tracking-wider"
            >
              CLAIM SEKARANG
            </button>
            {showTermsButton && (
              <button
                type="button"
                onClick={() => navigate('/promo')}
                className="px-4 md:px-5 lg:px-6 py-2 md:py-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white/80 text-[10px] md:text-sm font-bold hover:bg-white/20 transition-all tracking-wider hidden md:block"
              >
                SYARAT & KETENTUAN
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 md:bottom-4 lg:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 md:h-2 rounded-full transition-all ${
              i === currentIndex ? 'w-5 md:w-6 lg:w-7 bg-white' : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur rounded-full items-center justify-center text-white hover:bg-black/70 transition-all"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slideCount)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur rounded-full items-center justify-center text-white hover:bg-black/70 transition-all"
      >
        ›
      </button>
    </div>
  )
}
