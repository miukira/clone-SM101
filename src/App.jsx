import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PromoPage from './pages/PromoPage'
import ContactPage from './pages/ContactPage'
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
          
          {/* Main Content with edge padding - all sides */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-10 xl:px-16 py-3 sm:py-4 md:py-5 lg:py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/promo" element={<PromoPage />} />
              <Route path="/contact" element={<ContactPage />} />
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
