import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaBars } from 'react-icons/fa'
import { BiTransfer } from 'react-icons/bi'
import { useContext } from 'react'
import { MenuContext } from '../App'

export default function BottomNav() {
  const location = useLocation()
  const currentPath = location.pathname
  const { openMenu } = useContext(MenuContext)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d1829] border-t border-slate-700/50 z-40">
      <div className="flex items-end justify-around py-2 px-1">
        {/* Home */}
        <Link 
          to="/"
          className={`flex flex-col items-center gap-0.5 transition-colors min-w-[60px] py-1 ${
            currentPath === '/' ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          <FaHome className="text-xl" />
          <span className="text-[10px]">Home</span>
        </Link>
        
        {/* Deposit */}
        <Link 
          to="/deposit"
          className={`flex flex-col items-center gap-0.5 transition-colors min-w-[60px] py-1 ${
            currentPath === '/deposit' ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
            <span className="text-xs font-bold">$</span>
          </div>
          <span className="text-[10px]">Deposit</span>
        </Link>
        
        {/* Promosi - Center, Larger with raised circle */}
        <Link 
          to="/promo"
          className="flex flex-col items-center transition-colors min-w-[70px] -mt-5"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#2a4a6a] to-[#1a3a5a] flex items-center justify-center shadow-lg border border-slate-600/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 flex items-center justify-center">
              <BiTransfer className="text-xl text-white" />
            </div>
          </div>
          <span className="text-[10px] text-white/70 mt-1">Promosi</span>
        </Link>
        
        {/* Withdraw */}
        <Link 
          to="/withdraw"
          className={`flex flex-col items-center gap-0.5 transition-colors min-w-[60px] py-1 ${
            currentPath === '/withdraw' ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="6" width="20" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className="text-[10px]">Withdraw</span>
        </Link>
        
        {/* Menu */}
        <button 
          onClick={openMenu}
          className="flex flex-col items-center gap-0.5 transition-colors min-w-[60px] py-1 text-white/70 hover:text-white"
        >
          <FaBars className="text-xl" />
          <span className="text-[10px]">Menu</span>
        </button>
      </div>
    </nav>
  )
}
