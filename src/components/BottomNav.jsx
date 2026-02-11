import { FaHome, FaWallet, FaGift, FaMoneyBillWave, FaBars } from 'react-icons/fa'
import { BiTransfer } from 'react-icons/bi'

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a1420] border-t border-slate-700/50 z-50">
      <div className="flex items-end justify-around py-2 px-2">
        {/* Home */}
        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-cyan-400 transition-colors px-3 py-1">
          <FaHome className="text-xl" />
          <span className="text-xs">Home</span>
        </button>
        
        {/* Deposit */}
        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-cyan-400 transition-colors px-3 py-1">
          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
            <span className="text-sm font-bold">$</span>
          </div>
          <span className="text-xs">Deposit</span>
        </button>
        
        {/* Promosi - Center, Larger */}
        <button className="flex flex-col items-center gap-1 text-cyan-400 transition-colors px-3 -mt-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <BiTransfer className="text-2xl text-white" />
          </div>
          <span className="text-xs mt-1">Promosi</span>
        </button>
        
        {/* Withdraw */}
        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-cyan-400 transition-colors px-3 py-1">
          <div className="w-8 h-8 flex items-center justify-center">
            <FaMoneyBillWave className="text-xl" />
          </div>
          <span className="text-xs">Withdraw</span>
        </button>
        
        {/* Menu */}
        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-cyan-400 transition-colors px-3 py-1">
          <FaBars className="text-xl" />
          <span className="text-xs">Menu</span>
        </button>
      </div>
    </nav>
  )
}
