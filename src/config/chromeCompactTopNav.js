import {
  HomeIconChrome,
  SlotsIconChrome,
  CasinoIconChrome,
  SportsIconChrome,
  FishingIconChrome,
  PromoIconChrome,
  ReferralIconChrome,
} from '../components/IconsChrome'

/**
 * Item bar navigasi horizontal compact — sama dengan `headerMenuContent` di HomePageChrome
 * (kategori sebelum login), supaya setelah login / halaman Promosi/Referral tidak memuat daftar penuh.
 */
export const CHROME_COMPACT_HEADER_NAV = [
  { id: 'home', name: 'HOME', icon: HomeIconChrome, path: '/' },
  { id: 'slots', name: 'SLOTS', icon: SlotsIconChrome, path: '/providers/slots' },
  { id: 'casino', name: 'CASINO', icon: CasinoIconChrome, path: '/providers/casino' },
  { id: 'sports', name: 'SPORTS', icon: SportsIconChrome, path: '/providers/sports' },
  { id: 'fishing', name: 'FISHING', icon: FishingIconChrome, path: '/providers/fishing' },
  { id: 'promosi', name: 'PROMOSI', icon: PromoIconChrome, path: '/promo' },
  { id: 'referral', name: 'REFERRAL', icon: ReferralIconChrome, path: '/referral' },
]
