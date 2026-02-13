import { Link } from 'react-router-dom'
import { FaHome, FaDollarSign, FaComments, FaBars, FaWhatsapp, FaFacebookF, FaInstagram, FaTelegramPlane } from 'react-icons/fa'
import { useContext } from 'react'
import { MenuContext } from '../App'
import Footer from '../components/Footer'
import logo from '../assets/images/logo.png'

const contactLinks = [
  {
    id: 1,
    name: 'WHATSAPP',
    icon: FaWhatsapp,
    url: 'https://wa.me/',
    username: 'pusatcepat.site',
    gradient: 'from-green-500 via-green-400 to-cyan-400',
    iconBg: 'bg-green-500',
    iconColor: 'text-white'
  },
  {
    id: 2,
    name: 'FACEBOOK',
    icon: FaFacebookF,
    url: 'https://facebook.com/',
    username: 'pusatcepat.site',
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white'
  },
  {
    id: 3,
    name: 'INSTAGRAM',
    icon: FaInstagram,
    url: 'https://instagram.com/',
    username: 'pusatcepat.site',
    gradient: 'from-purple-500 via-pink-500 to-cyan-400',
    iconBg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    iconColor: 'text-white'
  },
  {
    id: 4,
    name: 'TELEGRAM',
    icon: FaTelegramPlane,
    url: 'https://t.me/',
    username: 'pusatcepat.site',
    gradient: 'from-blue-500 via-blue-400 to-cyan-300',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white'
  }
]

export default function ContactPage() {
  const { openMenu } = useContext(MenuContext)

  return (
    <div className="min-h-screen bg-[#0d1829] rounded-lg md:rounded-xl overflow-hidden">
      {/* Header Navigation - hidden on mobile (bottom nav exists), visible on desktop */}
      <div className="hidden md:block sticky top-0 z-40 bg-[#0d1829] rounded-t-lg md:rounded-t-xl">
        <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-16 py-4 md:py-6 px-4">
          <Link 
            to="/"
            className="flex items-center gap-2 md:gap-4 px-3 sm:px-6 md:px-10 py-2 md:py-4 text-white/60 hover:text-white transition-colors"
          >
            <FaHome className="text-xl md:text-3xl" />
            <span className="text-sm md:text-xl font-medium">Home</span>
          </Link>
          <Link 
            to="/promo"
            className="flex items-center gap-2 md:gap-4 px-3 sm:px-6 md:px-10 py-2 md:py-4 text-white/60 hover:text-white transition-colors"
          >
            <FaDollarSign className="text-xl md:text-3xl" />
            <span className="text-sm md:text-xl font-medium">Promosi</span>
          </Link>
          <Link 
            to="/contact"
            className="flex items-center gap-2 md:gap-4 px-4 sm:px-8 md:px-12 py-2 md:py-4 rounded-full bg-[#1e2d3d] text-white transition-colors"
          >
            <FaComments className="text-xl md:text-3xl" />
            <span className="text-sm md:text-xl font-medium">Hubungi Kami</span>
          </Link>
          <button 
            onClick={openMenu}
            className="flex items-center gap-2 md:gap-4 px-3 sm:px-6 md:px-10 py-2 md:py-4 text-white/60 hover:text-white transition-colors"
          >
            <FaBars className="text-xl md:text-3xl" />
            <span className="text-sm md:text-xl font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* Logo and Welcome Message Header */}
      <div className="bg-[#0d1829] border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center">
          {/* Logo - Left */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="PUSATTOGEL" className="h-12 md:h-16 object-contain" />
          </Link>
          
          {/* Welcome Message - Center */}
          <p className="flex-1 text-cyan-400 text-xs sm:text-sm md:text-lg italic text-center px-4">
            Hai! Selamat Datang Di Pusat Layanan Pelanggan Setia PUSATTOGEL
          </p>
        </div>
      </div>

      {/* Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400"></div>

      {/* Spacer */}
      <div className="h-6 md:h-10"></div>

      {/* Contact Links - Centered */}
      <div className="w-full px-2 sm:px-3 md:px-6 lg:px-12 flex justify-center">
        <div className="flex flex-col gap-5 md:gap-6 w-full max-w-2xl">
          {contactLinks.map((contact) => {
            const Icon = contact.icon
            return (
              <a
                key={contact.id}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden"
              >
                {/* Main Card */}
                <div className={`relative flex items-center bg-gradient-to-r ${contact.gradient} rounded-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-[1.02]`}>
                  {/* Left diagonal section with icon */}
                  <div className="relative w-28 sm:w-36 md:w-44 h-20 md:h-24 flex items-center justify-center flex-shrink-0">
                    {/* Diagonal background */}
                    <div className="absolute inset-0 bg-slate-800/40" style={{
                      clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)'
                    }}></div>
                    {/* Icon circle */}
                    <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full ${contact.iconBg} flex items-center justify-center shadow-lg`}>
                      <Icon className={`text-2xl md:text-3xl ${contact.iconColor}`} />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 pl-2 sm:pl-4 md:pl-8 pr-4 md:pr-6 py-4">
                    <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-wider">
                      {contact.name}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm md:text-base mt-1">
                      {contact.username}
                    </p>
                  </div>

                  {/* Right edge decoration */}
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-cyan-400/50"></div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Spacer before Footer */}
      <div className="h-12 md:h-16"></div>

      {/* Footer */}
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </div>
  )
}
