import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePageChrome from './pages/HomePageChrome'
import PromoPageChrome from './pages/PromoPageChrome'
import ReferralPageChrome from './pages/ReferralPageChrome'
import MemberDashboardChrome from './pages/MemberDashboardChrome'
import TogelBettingPage from './pages/TogelBettingPage'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import SeasonalEffects from './components/SeasonalEffects'
import ThemeCustomizer from './components/ThemeCustomizer'
import ThemedBackground from './components/ThemedBackground'
import { createContext } from 'react'

// Create context for menu state (kept for compatibility)
export const MenuContext = createContext()

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          {/* Global Theme Components */}
          <ThemedBackground />
          <SeasonalEffects />
          <ThemeCustomizer />
          
          <Routes>
            {/* Main Routes - Chrome Theme */}
            <Route path="/" element={<HomePageChrome />} />
            <Route path="/providers/:category" element={<HomePageChrome />} />
            <Route path="/promo" element={<PromoPageChrome />} />
            <Route path="/referral" element={<ReferralPageChrome />} />
            <Route path="/member" element={<MemberDashboardChrome />} />
            <Route path="/member/:section" element={<MemberDashboardChrome />} />
            
            {/* Togel Betting */}
            <Route path="/togel" element={<TogelBettingPage />} />
            <Route path="/togel/:market" element={<TogelBettingPage />} />
            
            {/* Fallback - redirect to home */}
            <Route path="*" element={<HomePageChrome />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
