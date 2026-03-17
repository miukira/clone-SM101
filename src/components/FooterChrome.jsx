// FooterChrome.jsx - Reusable footer component for Chrome theme

// Import provider logos from assets2
import pragmaticLogo from '../assets2/pragmatic-play-logo-new.png'
import pgSoftLogo from '../assets2/download.png'
import nolimitLogo from '../assets2/nolimit-city-logo-new.png'
import luckyMonacoLogo from '../assets2/lucky-monaco-logo.png'
import jokerLogo from '../assets2/joker-logo.png'
import cq9Logo from '../assets2/cq9-logo.png'
import habaneroLogo from '../assets2/habanero-logo.png'
import yggdrasilLogo from '../assets2/yggdrasil-logo-new.png'
import worldmatchLogo from '../assets2/worldmatch-logo.png'
import sboslotLogo from '../assets2/sboslot-logo.png'
import funkygamesLogo from '../assets2/funkygames-logo.png'
import microgamingLogo from '../assets2/microgaming-logo-new.png'
import netentLogo from '../assets2/netent-logo.png'
import afb777Logo from '../assets2/afb777-logo.png'
import jiliLogo from '../assets2/jili-logo.png'
import rich88Logo from '../assets2/rich88-logo.png'
import advantplayLogo from '../assets2/advantplay-logo.png'
import kingmakerLogo from '../assets2/kingmaker-logo.png'
import ygrLogo from '../assets2/ygr-logo.png'
import playstarLogo from '../assets2/playstar-logo.png'
import fastspinLogo from '../assets2/fastspin-logo.png'
import dragoonsoftLogo from '../assets2/dragoonsoft-logo.png'
import nagagamesLogo from '../assets2/nagagames-logo.png'
import sbobetLogo from '../assets2/sbobet-logo.png'
import sabaLogo from '../assets2/saba-logo.png'
import btiLogo from '../assets2/bti-logo.png'

// Game Provider logos - ONLY providers with actual logos
const gameProviders = [
  { name: 'Pragmatic Play', logo: pragmaticLogo },
  { name: 'YGR', logo: ygrLogo },
  { name: 'Dragoon Soft', logo: dragoonsoftLogo },
  { name: 'FastSpin', logo: fastspinLogo },
  { name: 'Playstar', logo: playstarLogo },
  { name: 'PG Soft', logo: pgSoftLogo },
  { name: 'Advant Play', logo: advantplayLogo },
  { name: 'Rich88', logo: rich88Logo },
  { name: 'Joker', logo: jokerLogo },
  { name: 'Habanero', logo: habaneroLogo },
  { name: 'Funky Games', logo: funkygamesLogo },
  { name: 'SBOBET', logo: sbobetLogo },
  { name: 'CQ9', logo: cq9Logo },
  { name: 'Microgaming', logo: microgamingLogo },
  { name: 'Yggdrasil', logo: yggdrasilLogo },
  { name: 'Nolimit City', logo: nolimitLogo },
  { name: 'Saba Sports', logo: sabaLogo },
  { name: 'BTi', logo: btiLogo },
  { name: 'JILI', logo: jiliLogo },
  { name: 'Naga Games', logo: nagagamesLogo },
  { name: 'Lucky Monaco', logo: luckyMonacoLogo },
  { name: 'World Match', logo: worldmatchLogo },
  { name: 'SBO Slot', logo: sboslotLogo },
  { name: 'NetEnt', logo: netentLogo },
  { name: 'AFB777', logo: afb777Logo },
  { name: 'Kingmaker', logo: kingmakerLogo },
]

// Promo list
const promoList = [
  'EVENT PROMOSI LOMBA PANJAT TO PUSATTOGEL',
  'PROMO BONUS EXTRA AJAK TEMAN 10% (AWAL DEPOSITO PERTAMA)',
  'PROMO BONUS AKUN LEVEL SULTAN PUSATTOGEL',
  'EVENT PROMOSI SILVER & GOLDEN TICKET LUCKY SPIN',
  'BONUS SALDO GRATIS / FREEBET 30, 50 , 100K',
  'BONUS EXTRA DOWNLOAD APLIKASI DAPAT FREECHIP GRATIS RP.5.000',
  'EVENT PROMO SPACEMAN BONUS BERLIMPAH',
  'PROMO MIX SPORT TARUHAN OLAHRAGA PUSATTOGEL',
  'EVENT PROMO BONUS ULANG TAHUN',
  'BONUS NEW MEMBER 50%',
  'BONUS CASHBACK MINGGUAN 0,5% SETIAP HARI SELASA',
  'BONUS CASHBACK SPORTBET 0.25%',
  'BONUS REFERRAL 0,3%',
  'BONUS DEPOSIT PULSA TANPA POTONGAN',
  'EVENT VIP PRAGMATIC PLAY & PG SOFT',
]

// Bank/Payment SVG Components - matching momo99 style
const BankLogos = {
  LocalBank: () => (
    <div className="flex items-center gap-1.5 px-2">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#22c55e"/>
        <path d="M6 12h12M6 16h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <div className="text-left">
        <div className="text-[9px] font-bold text-white leading-tight">Local Bank</div>
        <div className="text-[7px] text-green-300 leading-tight">TRANSFER</div>
      </div>
    </div>
  ),
  EWallet: () => (
    <div className="flex items-center gap-1.5 px-2">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">E</span>
      </div>
      <div className="text-left">
        <div className="text-[9px] font-bold text-orange-400 leading-tight">E-WALLET</div>
        <div className="text-[6px] text-orange-300 leading-tight">OVO, DANA, GOPAY</div>
      </div>
    </div>
  ),
  Pulsa: () => (
    <div className="flex items-center gap-1.5 px-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="2" width="14" height="20" rx="2" fill="#8b5cf6"/>
        <rect x="7" y="4" width="10" height="12" rx="1" fill="#1a1a1a"/>
        <circle cx="12" cy="18" r="1.5" fill="white"/>
      </svg>
      <div className="text-left">
        <div className="text-[9px] font-bold text-purple-400 leading-tight">PULSA</div>
        <div className="text-[6px] text-purple-300 leading-tight">XL, TELKOMSEL</div>
      </div>
    </div>
  ),
  QRIS: () => (
    <div className="flex items-center gap-1.5 px-2">
      <div className="bg-white rounded px-1 py-0.5">
        <span className="text-[8px] font-bold text-black">QRIS</span>
      </div>
      <div className="text-[7px] text-gray-400 leading-tight">QR Code Standar<br/>Pembayaran Nasional</div>
    </div>
  ),
  GoPay: () => (
    <div className="flex items-center gap-1.5 px-2">
      <div className="w-5 h-5 rounded-full bg-[#00aed6] flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">G</span>
      </div>
      <span className="text-sm font-bold text-[#00aed6]">gopay</span>
    </div>
  ),
  PermataBank: () => (
    <div className="flex items-center gap-1 px-2">
      <span className="text-[11px] font-medium text-gray-300">PermataBank</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#22c55e">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    </div>
  ),
  CIMB: () => (
    <div className="flex items-center gap-1 px-1">
      <div className="bg-[#a6192e] px-1.5 py-0.5 rounded">
        <span className="text-[8px] font-bold text-white">CIMB</span>
      </div>
      <span className="text-[10px] font-bold text-white">NIAGA</span>
    </div>
  ),
  Maybank: () => (
    <div className="flex items-center gap-1.5 px-2 bg-[#ffc72c] rounded h-full">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6" fill="#ffc72c"/>
      </svg>
      <span className="text-[10px] font-bold text-black">Maybank</span>
    </div>
  ),
  BCA: () => (
    <div className="flex items-center gap-1.5 px-2">
      <div className="w-5 h-5 rounded-full bg-[#003b7c] flex items-center justify-center border border-white/20">
        <span className="text-[6px] font-bold text-white">BCA</span>
      </div>
      <span className="text-lg font-black text-[#003b7c]" style={{color: '#0066cc'}}>BCA</span>
    </div>
  ),
  BNI: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#f15a22"/>
        <path d="M8 8v8M12 8v8M16 8v8" stroke="white" strokeWidth="2"/>
      </svg>
      <span className="text-lg font-black text-[#f15a22]">BNI</span>
    </div>
  ),
  BRI: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="2" fill="#0066cc"/>
        <text x="12" y="14" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">BRI</text>
      </svg>
      <span className="text-[11px] font-bold text-[#0066cc]">BANK BRI</span>
    </div>
  ),
  BSI: () => (
    <div className="flex items-center gap-1 px-2">
      <span className="text-lg font-black text-[#00a651]">BSI</span>
      <div className="text-[6px] text-[#00a651] leading-tight">BANK SYARIAH<br/>INDONESIA</div>
    </div>
  ),
  DANA: () => (
    <div className="flex items-center gap-1 px-2">
      <div className="w-5 h-5 rounded-lg bg-[#118eea] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">D</span>
      </div>
      <span className="text-sm font-bold text-[#118eea]">DANA</span>
    </div>
  ),
  Danamon: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="20" height="14" viewBox="0 0 30 20">
        <path d="M0 10 L15 0 L30 10 L15 20 Z" fill="#ffc72c"/>
        <path d="M5 10 L15 3 L25 10 L15 17 Z" fill="#f97316"/>
      </svg>
      <span className="text-[10px] font-medium text-[#f97316]">Danamon</span>
    </div>
  ),
  Jago: () => (
    <div className="flex items-center gap-1.5 px-2">
      <span className="text-lg font-bold text-[#ffcc00]">ü</span>
      <span className="text-sm font-bold text-white">Jago</span>
    </div>
  ),
  Jenius: () => (
    <div className="flex items-center gap-1 px-2 bg-white rounded h-full">
      <span className="text-[8px] text-gray-600">SMBC/</span>
      <div className="bg-[#00adb5] rounded px-1">
        <span className="text-[8px] font-bold text-white">Jenius</span>
      </div>
    </div>
  ),
  Mandiri: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="24" height="14" viewBox="0 0 40 20">
        <path d="M5 5 Q20 0 35 5 Q20 10 5 5" fill="#ffc72c" stroke="#ffc72c"/>
        <path d="M5 15 Q20 10 35 15 Q20 20 5 15" fill="#ffc72c" stroke="#ffc72c"/>
      </svg>
      <span className="text-[11px] font-medium text-[#003b7c]">mandiri</span>
    </div>
  ),
  ShopeePay: () => (
    <div className="flex items-center gap-1 px-2">
      <div className="w-4 h-4 rounded bg-[#ee4d2d] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">S</span>
      </div>
      <span className="text-[10px] font-bold text-[#ee4d2d]">ShopeePay</span>
    </div>
  ),
  SeaBank: () => (
    <div className="flex items-center gap-1 px-2">
      <div className="w-4 h-4 rounded-full bg-[#00adb5] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">S</span>
      </div>
      <span className="text-[10px] font-bold text-[#00adb5]">SeaBank</span>
    </div>
  ),
  Telkomsel: () => (
    <div className="flex items-center gap-1 px-2">
      <svg width="16" height="16" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#e4002b" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" fill="#e4002b"/>
      </svg>
      <span className="text-[9px] font-bold text-white">TELKOMSEL</span>
    </div>
  ),
  OVO: () => (
    <div className="flex items-center justify-center px-2">
      <span className="text-xl font-black text-[#4c3494]" style={{letterSpacing: '-2px'}}>OVO</span>
    </div>
  ),
  LinkAja: () => (
    <div className="flex items-center justify-center px-2">
      <div className="text-center">
        <span className="text-sm font-bold text-[#e4002b] italic">Link</span>
        <span className="text-sm font-bold text-[#e4002b]">Aja!</span>
      </div>
    </div>
  ),
  XL: () => (
    <div className="flex items-center justify-center px-2">
      <svg width="32" height="20" viewBox="0 0 40 24">
        <path d="M5 4 L20 20 M20 4 L5 20" stroke="#0066b3" strokeWidth="4" strokeLinecap="round"/>
        <path d="M22 8 L22 20 L35 20" stroke="#00a651" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  ),
}

// Bank items array
const bankItems = [
  'LocalBank', 'EWallet', 'Pulsa', 'QRIS', 'GoPay', 'PermataBank',
  'CIMB', 'Maybank', 'BCA', 'BNI', 'BRI', 'BSI',
  'DANA', 'Danamon', 'Jago', 'Jenius', 'Mandiri', 'ShopeePay',
  'SeaBank', 'Telkomsel', 'OVO', 'LinkAja', 'XL'
]

export default function FooterChrome() {
  return (
    <footer className="bg-[#0a0a0a] themed-border-top mt-8 relative z-10">
      {/* Promo Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 themed-border-bottom">
        <h3 className="text-sm sm:text-base font-bold text-[#fbbf24] mb-4 tracking-wider">
          DAFTAR UPDATE PROMO & BONUS TERBARU DI SITUS PUSATTOGEL
        </h3>
        <p className="text-[10px] sm:text-xs text-[#808080] mb-4 leading-relaxed">
          KAMI JUGA AKAN SELALU MEMBERIKAN UPDATE AN PROMO YANG MENARIK UNTUK SEMUA PARA PEMAIN / MEMBER DI{' '}
          <span className="text-[#fbbf24]">PUSATTOGEL</span> DENGAN REWARD HADIAH YANG TENTUNYA SANGAT BESAR DAN BISA DI
          DAPATKAN OLEH SEMUA PARA MEMBER DI SINI, BERIKUT DAFTAR PROMONYA :
        </p>
        <ul className="space-y-1 mb-4">
          {promoList.map((promo, i) => (
            <li key={i} className="text-[10px] sm:text-xs text-[#606060]">
              {promo}
            </li>
          ))}
        </ul>
        <p className="text-[10px] sm:text-xs text-[#808080] leading-relaxed">
          DENGAN REWARD PROMO TERBAIK YANG KAMI BERIKAN TENTU SAJA HAL INI AKAN MENJADI SALAH SATU PILIHAN TERBAIK MENGAPA
          ANDA MEMILIH <span className="text-[#fbbf24]">PUSATTOGEL</span> SEBAGAI SITUS PENYEDIA GAME ONLINE TERPERCAYA.
          AYO TUNGGU APALAGI MARI BERGABUNG SEKARANG JUGA BERSAMA PUSATTOGEL.
        </p>
      </section>

      {/* Game Providers Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 themed-border-bottom">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[#C0C0C0] tracking-wider">Game Providers</h3>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-2 sm:gap-3">
          {gameProviders.map((provider, i) => (
            <div
              key={i}
              className="aspect-[3/2] bg-[#111] themed-card rounded-md flex items-center justify-center p-1.5 hover:bg-[#1a1a1a] transition-all cursor-pointer overflow-hidden"
              title={provider.name}
            >
              <img 
                src={provider.logo} 
                alt={provider.name} 
                className="max-w-full max-h-full object-contain filter brightness-90 hover:brightness-110 transition-all"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Preferred Banks Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 themed-border-bottom">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2">
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[#C0C0C0] tracking-wider">Preferred Banks</h3>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {bankItems.map((bankKey, i) => {
            const BankComponent = BankLogos[bankKey]
            return (
              <div
                key={i}
                className="h-12 sm:h-14 bg-[#111] themed-card rounded-lg flex items-center justify-center hover:bg-[#1a1a1a] transition-all cursor-pointer overflow-hidden"
              >
                <BankComponent />
              </div>
            )
          })}
        </div>
      </section>

      {/* Powered By Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#00bfff">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <span className="text-xs text-[#606060]">Powered by</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-24 h-14 bg-[#111] themed-card rounded-lg flex items-center justify-center">
              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080]">
                🎰 PT
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <div className="border-t border-[#1a1a1a] py-4 text-center">
        <p className="text-[10px] text-[#404040]">
          © 2026 PUSATTOGEL. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
