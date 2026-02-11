import { FaTimes } from 'react-icons/fa'
import popupBanner from '../assets/banners/popup-deposit-imlek.webp'

export default function PopupModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-w-md w-full animate-[slideInUp_0.4s_ease-out]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-colors z-20 shadow-lg border border-slate-700"
        >
          <FaTimes />
        </button>

        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer" onClick={onClose}>
          <img 
            src={popupBanner}
            alt="Promo"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        </div>
      </div>
    </div>
  )
}
