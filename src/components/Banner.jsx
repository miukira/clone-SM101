import { useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import bannerQris from '../assets/banners/banner-qris.webp'
import bannerBonusImlek from '../assets/banners/bonus-deposit-imlek.webp'
import bannerWelcome from '../assets/banners/welcome-bonus.webp'
import bannerPutarRoda from '../assets/banners/putar-roda.webp'
import bannerHadiah from '../assets/banners/hadiah-togel.webp'
import bannerApk from '../assets/banners/apk-download.webp'
import bannerBaru from '../assets/banners/banner-baru.webp'

const banners = [
  { id: 1, image: bannerQris, alt: 'Deposit via QRIS' },
  { id: 2, image: bannerBonusImlek, alt: 'Bonus Deposit Imlek' },
  { id: 3, image: bannerWelcome, alt: 'Welcome Bonus New Member' },
  { id: 4, image: bannerPutarRoda, alt: 'Putar Roda Keberuntungan' },
  { id: 5, image: bannerHadiah, alt: 'Hadiah Togel Terbesar' },
  { id: 6, image: bannerApk, alt: 'Download APK' },
  { id: 7, image: bannerBaru, alt: 'Promo Terbaru' },
]

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [isHovered])

  return (
    <div 
      className="relative rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[180px] sm:h-[240px] md:h-[320px] lg:h-[400px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <img 
              src={banner.image} 
              alt={banner.alt}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isHovered && index === currentSlide ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <FaChevronLeft />
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/40 w-1.5 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
