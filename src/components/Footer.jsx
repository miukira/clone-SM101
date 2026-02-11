import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaHeadset, FaInfoCircle } from 'react-icons/fa'
import { SiLine, SiWhatsapp } from 'react-icons/si'

// Provider logos
import agGaming from '../assets/footer/providers/ag-gaming.svg'
import boardGames from '../assets/footer/providers/board-games.svg'
import ebet from '../assets/footer/providers/ebet.svg'
import pgSoft from '../assets/footer/providers/pg-soft.svg'
import inSports from '../assets/footer/providers/in-sports.svg'
import wmGaming from '../assets/footer/providers/wm-gaming.svg'
import gameplay from '../assets/footer/providers/gameplay.svg'
import joker from '../assets/footer/providers/joker.svg'
import icg from '../assets/footer/providers/icg.svg'
import s128 from '../assets/footer/providers/s128.svg'

// License logos
import mgaLogo from '../assets/footer/licenses/mga.svg'
import bviLogo from '../assets/footer/licenses/bvi.svg'
import gamblingCommission from '../assets/footer/licenses/gambling-commission.svg'
import pagcorLogo from '../assets/footer/licenses/pagcor.svg'

export default function Footer() {
  const [articleOpen, setArticleOpen] = useState(false)

  // Provider logos array
  const providers = [
    { name: 'AG Gaming', logo: agGaming },
    { name: 'Board Games', logo: boardGames },
    { name: 'eBET', logo: ebet },
    { name: 'PG Soft', logo: pgSoft },
    { name: 'IN Sports', logo: inSports },
    { name: 'WM Gaming', logo: wmGaming },
    { name: 'Gameplay', logo: gameplay },
    { name: 'JOKER', logo: joker },
    { name: 'ICG', logo: icg },
    { name: 'S128', logo: s128 },
  ]

  // License logos array
  const licenses = [
    { 
      name: 'MGA', 
      logo: mgaLogo, 
      description: 'Sertifikasi Lisensi Malta (MGA)' 
    },
    { 
      name: 'BVI', 
      logo: bviLogo, 
      description: 'Sertifikasi Kepulauan Virgin Inggris (BVI)' 
    },
    { 
      name: 'Gambling Commission', 
      logo: gamblingCommission, 
      description: 'Dewan Pengawas GC Inggris' 
    },
    { 
      name: 'PAGCOR', 
      logo: pagcorLogo, 
      description: 'Lisensi Pengawasan Filipina (PAGCOR)' 
    },
  ]

  return (
    <footer className="px-2 sm:px-4 md:px-6 lg:px-8 pb-4">
      <div className="bg-[#0a1525] rounded-xl overflow-hidden">
        {/* Article Dropdown - Full width centered */}
        <button 
          onClick={() => setArticleOpen(!articleOpen)}
          className="w-full py-4 md:py-5 px-4 md:px-6 flex items-center justify-center gap-2 md:gap-3 text-white hover:bg-white/5 transition-colors border-t border-slate-700/50"
        >
          <span className="text-lg md:text-xl font-semibold">Article</span>
          {articleOpen ? <FaChevronUp className="text-base md:text-lg" /> : <FaChevronDown className="text-base md:text-lg" />}
        </button>
        
        {articleOpen && (
          <div className="px-4 md:px-6 pb-6 md:pb-8 border-t border-slate-700/50">
            <div className="py-6 md:py-8">
              <h2 className="text-blue-400 text-base md:text-xl font-bold text-center mb-4 md:mb-6 px-2">
                PIONEER SITUS GAME ONLINE DENGAN PASARAN TERLENGKAP & HADIAH TERBESAR
              </h2>
              <p className="text-slate-400 text-sm md:text-base text-center leading-relaxed md:leading-loose mb-4 md:mb-6 px-2">
                <span className="text-blue-400">PIONEER</span> MERUPAKAN SITUS GAME ONLINE DENGAN PASARAN TERLENGKAP DAN HADIAH TERBESAR SAAT INI DENGAN FITUR TERLENGKAP YANG TERSEDIA UNTUK PARA PEMAIN SETIA.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8 text-blue-400 text-sm md:text-base">
                <a href="#" className="hover:text-white transition-colors">CARA BERMAIN</a>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <a href="#" className="hover:text-white transition-colors">LUPA PASSWORD</a>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <a href="#" className="hover:text-white transition-colors">PROMOSI</a>
              </div>
            </div>
          </div>
        )}

        {/* Provider Logos Section */}
        <div className="border-t border-slate-700/50 py-6 md:py-10 px-4 md:px-8 bg-[#0c1a2e]">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {providers.map((provider, index) => (
              <div 
                key={index}
                className="hover:opacity-100 opacity-70 transition-opacity cursor-pointer"
              >
                <img 
                  src={provider.logo} 
                  alt={provider.name}
                  className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain filter brightness-90 hover:brightness-110 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* License Section with Logos - Dark Background matching footer */}
        <div className="border-t border-slate-700/50 py-8 md:py-12 px-4 md:px-8 bg-[#0a1525]">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-6">
            {/* License Logos - Grid layout - Centered */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-start justify-items-center">
              {licenses.map((license, index) => (
                <div key={index} className="text-center flex flex-col items-center">
                  <img 
                    src={license.logo} 
                    alt={license.name}
                    className="h-12 sm:h-14 md:h-16 w-auto mb-3 object-contain brightness-150"
                  />
                  <p className="text-slate-400 text-[10px] md:text-xs leading-tight">{license.description}</p>
                </div>
              ))}
            </div>

            {/* Customer Service Section - Center on mobile, right on desktop */}
            <div className="flex flex-col items-center gap-2 lg:border-l lg:border-slate-600 lg:pl-8 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-slate-300 mb-1">
                <FaHeadset className="text-lg" />
                <span className="text-xs font-medium">pelayanan pelanggan</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <FaInfoCircle className="text-xs" />
                <span className="text-[10px]">tentang kami</span>
              </div>
              
              {/* WhatsApp Consult Button */}
              <button className="flex items-center justify-center gap-2 w-32 py-2 border border-slate-500 rounded-md text-slate-300 hover:bg-slate-700 transition-colors text-xs">
                <SiWhatsapp className="text-green-500" />
                <span>Consult</span>
              </button>
              
              {/* LINE Button */}
              <div className="flex items-center gap-2 my-1">
                <SiLine className="text-green-500 text-lg" />
                <span className="text-slate-300 text-xs font-medium">LINE</span>
              </div>
              
              <button className="w-32 py-2 border border-slate-500 rounded-md text-slate-300 hover:bg-slate-700 transition-colors text-xs">
                Consult
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer - Dark background */}
        <div className="border-t border-slate-700/50 py-6 md:py-10 px-4 md:px-8 bg-[#0a1525]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-slate-400 text-xs md:text-sm lg:text-base leading-relaxed md:leading-loose text-center max-w-5xl mb-4 md:mb-6 px-2">
              PIONEER memiliki lisensi legal yang dikeluarkan oleh European Malta MGA, Komisi Pengawasan GC Inggris (Komisi Perjudian) dan Pemerintah Filipina (PAGCOR). Terdaftar di Kepulauan Virgin Britania Raya, ini adalah perusahaan legal yang diakui oleh asosiasi industri internasional. Pastikan Anda berusia minimal 18 tahun sebelum mendaftar dan bersenang-senanglah!
            </p>
            <p className="text-slate-500 text-xs md:text-sm lg:text-base text-center">
              Hak Cipta 2019-2021 PIONEER Semua Hak Dilindungi Undang-undang
            </p>
          </div>
        </div>

        {/* Back to top button - Higher on mobile to avoid bottom nav */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 left-4 md:bottom-6 w-10 h-10 bg-slate-800/80 hover:bg-slate-700 rounded-lg flex items-center justify-center text-white transition-colors z-40"
        >
          <FaChevronUp className="text-lg" />
        </button>
      </div>
    </footer>
  )
}
