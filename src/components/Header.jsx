import { useState } from 'react'
import { FaUser, FaLock, FaQuestionCircle, FaUserPlus, FaHome, FaDollarSign, FaComments, FaBars, FaStar } from 'react-icons/fa'
import logo from '../assets/images/logo.png'

export default function Header() {
  return (
    <header className="bg-[#0a1420] sticky top-0 z-50">
      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Row: Logo, Lupa Password, Daftar */}
        <div className="flex items-center justify-between py-3 px-4">
          <img src={logo} alt="PUSATTOGEL" className="h-10 object-contain" />
          <button className="flex items-center gap-1 text-white text-xs">
            <FaQuestionCircle className="text-base" />
            <span className="leading-tight text-center">Lupa<br/>password</span>
          </button>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg text-xs">
            Daftar
          </button>
        </div>
        
        {/* Login Form Row */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <div className="flex-1 flex items-center bg-slate-700/50 rounded-lg overflow-hidden h-10">
            <div className="w-8 h-10 flex items-center justify-center text-slate-400">
              <FaUser className="text-sm" />
            </div>
            <input 
              type="text" 
              placeholder="Username" 
              className="bg-transparent py-1.5 px-1 text-xs text-white placeholder-slate-400 focus:outline-none flex-1 w-full"
            />
          </div>
          <div className="flex-1 flex items-center bg-slate-700/50 rounded-lg overflow-hidden h-10">
            <div className="w-8 h-10 flex items-center justify-center text-slate-400">
              <FaLock className="text-sm" />
            </div>
            <input 
              type="password"
              placeholder="Password" 
              className="bg-transparent py-1.5 px-1 text-xs text-white placeholder-slate-400 focus:outline-none flex-1 w-full"
            />
          </div>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold h-10 px-5 rounded-lg text-xs flex-shrink-0">
            Masuk
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        {/* Top Bar - Logo and links */}
        <div className="flex items-center justify-between py-5 px-8 border-b border-slate-700/50">
          <img src={logo} alt="PUSATTOGEL" className="h-16 object-contain" />
          <div className="flex items-center gap-6 lg:gap-10">
            <button className="flex items-center gap-2 text-white hover:text-white/80 text-base lg:text-lg">
              <FaStar className="text-white text-xl lg:text-2xl" />
              <span>Bookmark</span>
            </button>
            <button className="flex items-center gap-2 text-white hover:text-white/80 text-base lg:text-lg">
              <FaQuestionCircle className="text-xl lg:text-2xl" />
              <span>Lupa password</span>
            </button>
            <button className="flex items-center gap-2 text-white hover:text-white/80 text-base lg:text-lg">
              <FaUserPlus className="text-xl lg:text-2xl" />
              <span>Daftar</span>
            </button>
          </div>
        </div>
        
        {/* Navigation + Login Row */}
        <div className="flex items-center py-3 lg:py-5 px-4 lg:px-8 gap-4 lg:gap-6">
          {/* Navigation Tabs */}
          <div className="flex-1 flex items-center justify-center gap-2 lg:gap-4">
            <button className="flex-1 max-w-[180px] flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 lg:py-4 px-3 lg:px-6 rounded-lg text-sm lg:text-lg font-medium transition-colors">
              <FaHome className="text-lg lg:text-2xl" />
              <span>Home</span>
            </button>
            <button className="flex-1 max-w-[180px] flex items-center justify-center gap-2 text-white/80 hover:text-white py-3 lg:py-4 px-3 lg:px-6 rounded-lg text-sm lg:text-lg font-medium transition-colors hover:bg-white/10">
              <FaDollarSign className="text-lg lg:text-2xl" />
              <span>Promosi</span>
            </button>
            <button className="flex-1 max-w-[180px] flex items-center justify-center gap-2 text-white/80 hover:text-white py-3 lg:py-4 px-3 lg:px-6 rounded-lg text-sm lg:text-lg font-medium transition-colors hover:bg-white/10">
              <FaComments className="text-lg lg:text-2xl" />
              <span className="hidden lg:inline">Hubungi Kami</span>
              <span className="lg:hidden">Hubungi</span>
            </button>
            <button className="flex-1 max-w-[180px] flex items-center justify-center gap-2 text-white/80 hover:text-white py-3 lg:py-4 px-3 lg:px-6 rounded-lg text-sm lg:text-lg font-medium transition-colors hover:bg-white/10">
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
