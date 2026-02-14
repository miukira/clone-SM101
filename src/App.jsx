import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PromoPage from './pages/PromoPage'
import ContactPage from './pages/ContactPage'
import RegisterPage from './pages/RegisterPage'
import ChatWidget from './components/ChatWidget'
import PopupModal from './components/PopupModal'
import BottomNav from './components/BottomNav'
import MenuSidebar from './components/MenuSidebar'
import { useState, createContext } from 'react'

// Create context for menu state
export const MenuContext = createContext()

function App() {
  const [showPopup, setShowPopup] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const openMenu = () => setIsMenuOpen(true)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <BrowserRouter>
      <MenuContext.Provider value={{ isMenuOpen, openMenu, closeMenu }}>
        <div className="min-h-screen bg-[#0a1420]">
          {showPopup && <PopupModal onClose={() => setShowPopup(false)} />}
          
          {/* Menu Sidebar */}
          <MenuSidebar isOpen={isMenuOpen} onClose={closeMenu} />
          
          {/* Main Content */}
          <div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/promo" element={<PromoPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
          
          <ChatWidget />
          <BottomNav />
        </div>
      </MenuContext.Provider>
    </BrowserRouter>
  )
}

export default App
