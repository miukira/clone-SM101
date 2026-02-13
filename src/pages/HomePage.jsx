import Header from '../components/Header'
import Banner from '../components/Banner'
import Marquee from '../components/Marquee'
import GameGrid from '../components/GameGrid'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="bg-[#0d1829] rounded-lg md:rounded-xl overflow-hidden">
      <Header />
      
      {/* Main Content with padding and spacing between sections */}
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 pt-3 md:pt-4">
        {/* Banner Section */}
        <section>
          <Banner />
        </section>
        
        {/* Spacer */}
        <div className="h-3 md:h-5"></div>
        
        {/* Marquee Section */}
        <section>
          <Marquee />
        </section>
        
        {/* Spacer */}
        <div className="h-4 md:h-6"></div>
        
        {/* Game Grid Section */}
        <section>
          <GameGrid />
        </section>
        
        {/* Spacer before footer */}
        <div className="h-6 md:h-10"></div>
      </div>
      
      {/* Footer - Show on all screens with bottom padding for mobile nav */}
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </div>
  )
}
