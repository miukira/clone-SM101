import { BrowserRouter } from 'react-router-dom'
import MaintenancePage from './pages/MaintenancePage'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { WebsiteProvider, useWebsite } from './context/WebsiteContext'
import SeasonalEffects from './components/SeasonalEffects'
import ThemeCustomizer from './components/ThemeCustomizer'
import ThemedBackground from './components/ThemedBackground'
import AppRoutes from './Routes'

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
        <AppRoutes />
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
