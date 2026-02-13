import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaMoneyBillWave, FaBars } from 'react-icons/fa'
import { BiTransfer } from 'react-icons/bi'
import { useContext } from 'react'
import { MenuContext } from '../App'

export default function BottomNav() {
  const location = useLocation()
  const currentPath = location.pathname
  const { openMenu } = useContext(MenuContext)

  return (
    <nav className="md:hidden fixed bottom-2 left-2 right-2 bg-[#0d1829] border border-slate-700/50 rounded-xl z-40 shadow-lg">
      <div className="flex items-end justify-around py-2 px-2">
        {/* Home */}
        <Link 
          to="/"
          className={`flex flex-col items-center gap-1 transition-colors px-3 py-1 ${
            currentPath === '/' ? 'text-cyan-400' : 'text-white/80 hover:text-cyan-400'
          }`}
        >
          <FaHome className="text-xl" />
          <span className="text-xs">Home</span>
        </Link>
        
        {/* Deposit */}
        <Link 
          to="/deposit"
          className={`flex flex-col items-center gap-1 transition-colors px-3 py-1 ${
            currentPath === '/deposit' ? 'text-cyan-400' : 'text-white/80 hover:text-cyan-400'
          }`}
        >
          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
            <span className="text-sm font-bold">$</span>
          </div>
          <span className="text-xs">Deposit</span>
        </Link>
        
        {/* Promosi - Center, Larger */}
        <Link 
          to="/promo"
          className={`flex flex-col items-center gap-1 transition-colors px-3 -mt-4 ${
            currentPath === '/promo' ? 'text-cyan-400' : 'text-cyan-400'
          }`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
            currentPath === '/promo' 
              ? 'bg-gradient-to-b from-cyan-300 to-cyan-500 shadow-cyan-400/50' 
              : 'bg-gradient-to-b from-cyan-400 to-cyan-600 shadow-cyan-500/30'
          }`}>
            <BiTransfer className="text-2xl text-white" />
          </div>
          <span className="text-xs mt-1">Promosi</span>
        </Link>
        
        {/* Withdraw */}
        <Link 
          to="/withdraw"
          className={`flex flex-col items-center gap-1 transition-colors px-3 py-1 ${
            currentPath === '/withdraw' ? 'text-cyan-400' : 'text-white/80 hover:text-cyan-400'
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <FaMoneyBillWave className="text-xl" />
          </div>
          <span className="text-xs">Withdraw</span>
        </Link>
        
        {/* Menu */}
        <button 
          onClick={openMenu}
          className="flex flex-col items-center gap-1 transition-colors px-3 py-1 text-white/80 hover:text-cyan-400"
        >
          <FaBars className="text-xl" />
          <span className="text-xs">Menu</span>
        </button>
      </div>
    </nav>
  )
}
