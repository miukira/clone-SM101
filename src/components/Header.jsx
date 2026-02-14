import { Link, useLocation } from 'react-router-dom'
import { FaUser, FaLock, FaQuestionCircle, FaUserPlus, FaHome, FaDollarSign, FaComments, FaBars, FaStar } from 'react-icons/fa'
import { useContext } from 'react'
import { MenuContext } from '../App'
import logo from '../assets/images/logo.png'

export default function Header() {
  const location = useLocation()
  const currentPath = location.pathname
  const { openMenu } = useContext(MenuContext)

  return (
    <header className="bg-[#0a1420] fixed top-0 left-0 right-0 z-50">
      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Row: Logo + Actions */}
        <div className="flex items-center justify-between py-2 px-3">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="PUSATTOGEL" className="h-10 object-contain" />
          </Link>
          
          {/* Right Actions: Lupa Password + Daftar */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-white/90 hover:text-white">
              <FaQuestionCircle className="text-xl" />
              <span className="text-[11px] leading-tight text-center">Lupa<br/>password</span>
            </button>
            <Link 
              to="/register"
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-2.5 rounded-lg text-sm shadow-lg shadow-cyan-500/30 w-[72px] text-center"
            >
              Daftar
            </Link>
          </div>
        </div>
        
        {/* Login Form Row */}
        <div className="flex items-center gap-2 px-3 pb-3">
          {/* Username Input */}
          <div className="flex-[1] flex items-center bg-slate-700/60 rounded-lg overflow-hidden h-11 min-w-0">
            <div className="w-9 h-11 flex items-center justify-center text-slate-400 flex-shrink-0">
              <FaUser className="text-sm" />
            </div>
            <input 
              type="text" 
              placeholder="Username" 
              className="bg-transparent py-2 pr-2 text-sm text-white placeholder-slate-400 focus:outline-none w-full min-w-0"
            />
          </div>
          
          {/* Password Input */}
          <div className="flex-[1] flex items-center bg-slate-700/60 rounded-lg overflow-hidden h-11 min-w-0">
            <div className="w-9 h-11 flex items-center justify-center text-slate-400 flex-shrink-0">
              <FaLock className="text-sm" />
            </div>
            <input 
              type="password"
              placeholder="Password" 
              className="bg-transparent py-2 pr-2 text-sm text-white placeholder-slate-400 focus:outline-none w-full min-w-0"
            />
          </div>
          
          {/* Masuk Button - Half width of password field */}
          <button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold h-11 rounded-lg text-sm shadow-lg shadow-cyan-500/30 flex-[0.5] min-w-[72px]">
            Masuk
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        {/* Top Bar - Logo and links */}
        <div className="flex items-center justify-between py-5 px-8 border-b border-slate-700/50">
          <Link to="/">
            <img src={logo} alt="PUSATTOGEL" className="h-16 object-contain" />
          </Link>
          <div className="flex items-center gap-6 lg:gap-10">
            <button className="flex items-center gap-2 text-white hover:text-white/80 text-base lg:text-lg">
              <FaStar className="text-white text-xl lg:text-2xl" />
              <span>Bookmark</span>
            </button>
            <button className="flex items-center gap-2 text-white hover:text-white/80 text-base lg:text-lg">
              <FaQuestionCircle className="text-xl lg:text-2xl" />
              <span>Lupa password</span>
            </button>
            <Link 
              to="/register"
              className="flex items-center gap-2 text-white hover:text-white/80 text-base lg:text-lg"
            >
              <FaUserPlus className="text-xl lg:text-2xl" />
              <span>Daftar</span>
            </Link>
          </div>
        </div>
        
        {/* Navigation + Login Row */}
        <div className="flex items-center py-3 lg:py-5 px-4 lg:px-8 gap-4 lg:gap-6">
          {/* Navigation Tabs */}
          <div className="flex-1 flex items-center justify-center gap-2 lg:gap-4">
            <Link 
              to="/"
              className={`flex-1 max-w-[180px] flex items-center justify-center gap-2 py-3 lg:py-4 px-3 lg:px-6 rounded-lg text-sm lg:text-lg font-medium transition-colors ${
                currentPath === '/' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FaHome className="text-lg lg:text-2xl" />
              <span>Home</span>
            </Link>
            <Link 
              to="/promo"
              className={`flex-1 max-w-[180px] flex items-center justify-center gap-2 py-3 lg:py-4 px-3 lg:px-6 rounded-lg text-sm lg:text-lg font-medium transition-colors ${
                currentPath === '/promo' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FaDollarSign className="text-lg lg:text-2xl" />
              <span>Promosi</span>
            </Link>
            <Link 
              to="/contact"
              className={`flex-1 max-w-[220px] flex items-center justify-center gap-2 py-3 lg:py-4 px-3 lg:px-6 rounded-lg text-sm lg:text-lg font-medium whitespace-nowrap transition-colors ${
                currentPath === '/contact' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FaComments className="text-lg lg:text-2xl" />
              <span>Hubungi Kami</span>
            </Link>
            <button 
              onClick={openMenu}
              className="flex-1 max-w-[180px] flex items-center justify-center gap-2 text-white/80 hover:text-white py-3 lg:py-4 px-3 lg:px-6 rounded-lg text-sm lg:text-lg font-medium transition-colors hover:bg-white/10"
            >
              <FaBars className="text-lg lg:text-2xl" />
              <span>Menu</span>
            </button>
          </div>
          
          {/* Login Form - Desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center bg-slate-700/50 rounded-lg overflow-hidden h-12 lg:h-14 w-40 lg:w-48">
              <div className="w-12 lg:w-14 h-12 lg:h-14 flex items-center justify-center text-slate-400">
                <FaUser className="text-lg lg:text-xl" />
              </div>
              <input 
                type="text" 
                placeholder="Username" 
                className="bg-transparent py-2 px-2 text-base lg:text-lg text-white placeholder-slate-400 focus:outline-none flex-1 w-full"
              />
            </div>
            <div className="flex items-center bg-slate-700/50 rounded-lg overflow-hidden h-12 lg:h-14 w-40 lg:w-48">
              <div className="w-12 lg:w-14 h-12 lg:h-14 flex items-center justify-center text-slate-400">
                <FaLock className="text-lg lg:text-xl" />
              </div>
              <input 
                type="password"
                placeholder="Password" 
                className="bg-transparent py-2 px-2 text-base lg:text-lg text-white placeholder-slate-400 focus:outline-none flex-1 w-full"
              />
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-12 lg:h-14 w-28 lg:w-36 rounded-lg text-base lg:text-lg transition-colors">
              Masuk
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
