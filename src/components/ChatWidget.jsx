import { useState } from 'react'
import { FaArrowLeft, FaEllipsisH, FaMinus } from 'react-icons/fa'
import logo from '../assets/images/logo.png'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)

  return (
    <>
      {/* Chat Button - Higher on mobile to avoid bottom nav */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div className="absolute right-14 md:right-16 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg px-3 md:px-4 py-2 whitespace-nowrap">
            <p className="text-slate-800 text-xs md:text-sm">Selamat datang di Pusattogel</p>
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute -right-1 -top-1 w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs hover:bg-slate-300"
            >
              ×
            </button>
            {/* Arrow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="border-8 border-transparent border-l-white"></div>
            </div>
          </div>
        )}
        
        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.07-1.37l4.43 1.37-1.37-4.43C21.5 15.58 22 13.85 22 12c0-5.52-4.48-10-10-10z"/>
              </svg>
            </div>
            <div className="absolute -inset-1 border-2 border-white/30 rounded-full"></div>
          </div>
        </button>
      </div>

      {/* Chat Window - Full Screen Style */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full sm:w-96 h-[600px] sm:h-[550px] sm:bottom-6 sm:right-6 bg-[#1a1a2e] sm:rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-colors"
              >
                <FaArrowLeft className="text-sm" />
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <FaEllipsisH />
              </button>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-colors"
            >
              <FaMinus className="text-sm" />
            </button>
          </div>
          
          {/* Agent Info */}
          <div className="flex flex-col items-center py-4">
            <div className="bg-slate-800 rounded-full px-6 py-3 flex items-center gap-3">
              {/* Double Avatar */}
              <div className="flex -space-x-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="CS" className="w-8 h-8 object-contain" />
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="CS" className="w-8 h-8 object-contain" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">CS01</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <p className="text-slate-400 text-sm">Product Expert</p>
              </div>
            </div>
          </div>
          
          {/* Chat Body */}
          <div className="flex-1 px-4 py-2">
            {/* Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img src={logo} alt="CS" className="w-5 h-5 object-contain" />
              </div>
              <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                <p className="text-white text-sm">Selamat datang di Pusattogel</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Action */}
          <div className="p-4 mt-auto">
            <button className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-semibold py-4 rounded-full transition-colors text-lg">
              Ayo mengobrol
            </button>
            
            {/* Powered by */}
            <div className="flex items-center justify-center gap-2 mt-4 mb-2">
              <span className="text-slate-500 text-sm">Powered by</span>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <span className="text-white font-semibold text-sm">LiveChat</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
