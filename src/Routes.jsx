import { Routes, Route } from 'react-router-dom'
import HomePageChrome from './pages/HomePageChrome'
import PromoPageChrome from './pages/PromoPageChrome'
import ReferralPageChrome from './pages/ReferralPageChrome'
import MemberDashboardChrome from './pages/MemberDashboardChrome'
import TogelBettingPage from './pages/TogelBettingPage'
import TogelRulesPage from './pages/TogelRulesPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePageChrome />} />
      <Route path="/providers/:category" element={<HomePageChrome />} />
      <Route path="/promo" element={<PromoPageChrome />} />
      <Route path="/referral" element={<ReferralPageChrome />} />
      <Route path="/member" element={<MemberDashboardChrome />} />
      <Route path="/member/:section" element={<MemberDashboardChrome />} />

      <Route path="/togel/rules" element={<TogelRulesPage />} />
      <Route path="/togel" element={<TogelBettingPage />} />
      <Route path="/togel/:market" element={<TogelBettingPage />} />

      <Route path="*" element={<HomePageChrome />} />
    </Routes>
  )
}
