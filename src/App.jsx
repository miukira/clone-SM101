import Header from './components/Header'
import Banner from './components/Banner'
import Marquee from './components/Marquee'
import GameGrid from './components/GameGrid'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import PopupModal from './components/PopupModal'
import BottomNav from './components/BottomNav'
import { useState } from 'react'

function App() {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a1420]">
      {showPopup && <PopupModal onClose={() => setShowPopup(false)} />}
      
      <Header />
      
      {/* Main Content with padding */}
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-2 md:py-4 space-y-2 md:space-y-4">
        <Banner />
        <Marquee />
        <GameGrid />
      </div>
      
      {/* Footer - Show on all screens with bottom padding for mobile nav */}
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
      
      <ChatWidget />
      <BottomNav />
    </div>
  )
}

export default App
