import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePageChrome from './pages/HomePageChrome'
import PromoPageChrome from './pages/PromoPageChrome'
import ReferralPageChrome from './pages/ReferralPageChrome'
import MemberDashboardChrome from './pages/MemberDashboardChrome'
import TogelBettingPage from './pages/TogelBettingPage'
import MaintenancePage from './pages/MaintenancePage'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { WebsiteProvider, useWebsite } from './context/WebsiteContext'
import SeasonalEffects from './components/SeasonalEffects'
import ThemeCustomizer from './components/ThemeCustomizer'
import ThemedBackground from './components/ThemedBackground'
import { createContext } from 'react'

export const MenuContext = createContext()

function MaintenanceWrapper({ children }) {
  const { isUnderMaintenance, loading } = useWebsite()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#C0C0C0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#808080] text-sm">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (isUnderMaintenance) {
    return <MaintenancePage />
  }
  
  return children
}

function AppContent() {
  return (
    <MaintenanceWrapper>
      <ThemeProvider>
        <ThemedBackground />
        <SeasonalEffects />
        <ThemeCustomizer />
        
        <Routes>
          <Route path="/" element={<HomePageChrome />} />
          <Route path="/providers/:category" element={<HomePageChrome />} />
          <Route path="/promo" element={<PromoPageChrome />} />
          <Route path="/referral" element={<ReferralPageChrome />} />
          <Route path="/member" element={<MemberDashboardChrome />} />
          <Route path="/member/:section" element={<MemberDashboardChrome />} />
          
          <Route path="/togel" element={<TogelBettingPage />} />
          <Route path="/togel/:market" element={<TogelBettingPage />} />
          
          <Route path="*" element={<HomePageChrome />} />
        </Routes>
      </ThemeProvider>
    </MaintenanceWrapper>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebsiteProvider>
          <AppContent />
        </WebsiteProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
