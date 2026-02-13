import { FaTimes } from 'react-icons/fa'
import popupBanner from '../assets/banners/popup-deposit-imlek.webp'

export default function PopupModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Larger and responsive */}
      <div className="relative z-10 w-[95%] sm:w-[90%] md:w-full max-w-lg md:max-w-xl lg:max-w-2xl animate-[slideInUp_0.4s_ease-out]">
        {/* Close button - Larger on mobile */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-9 h-9 sm:w-11 sm:h-11 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-colors z-20 shadow-lg border-2 border-slate-600"
        >
          <FaTimes className="text-sm sm:text-lg" />
        </button>

        {/* Banner - Full width with rounded corners */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl cursor-pointer" onClick={onClose}>
          <img 
            src={popupBanner}
            alt="Promo"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
        </div>
      </div>
    </div>
  )
}
