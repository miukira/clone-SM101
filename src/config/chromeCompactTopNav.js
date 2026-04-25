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
 * Bar navigasi horizontal compact — `nameKey` untuk i18n (namespace default).
 * Sama maksud dengan `headerMenuItems` di HomePageChrome.
 */
export const CHROME_COMPACT_HEADER_NAV = [
  { id: 'home', nameKey: 'nav.home', icon: HomeIconChrome, path: '/' },
  { id: 'slots', nameKey: 'nav.slots', icon: SlotsIconChrome, path: '/providers/slots' },
  { id: 'casino', nameKey: 'nav.casino', icon: CasinoIconChrome, path: '/providers/casino' },
  { id: 'sports', nameKey: 'nav.sports', icon: SportsIconChrome, path: '/providers/sports' },
  { id: 'fishing', nameKey: 'nav.fishing', icon: FishingIconChrome, path: '/providers/fishing' },
  { id: 'promosi', nameKey: 'nav.promosi', icon: PromoIconChrome, path: '/promo' },
  { id: 'referral', nameKey: 'nav.referral', icon: ReferralIconChrome, path: '/referral' },
]
