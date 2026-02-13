import { Link } from 'react-router-dom'
import { 
  FaTimes, 
  FaLock, 
  FaHeadset, 
  FaDice, 
  FaChartBar, 
  FaCube, 
  FaTrophy, 
  FaDownload, 
  FaComments, 
  FaExclamationCircle 
} from 'react-icons/fa'

const menuItems = [
  {
    id: 1,
    name: 'LUPA PASSWORD',
    icon: FaLock,
    path: '/forgot-password'
  },
  {
    id: 2,
    name: 'Hubungi Kami',
    icon: FaHeadset,
    path: '/contact'
  },
  {
    id: 3,
    name: 'Prediksi Togel',
    icon: FaDice,
    path: '/prediksi'
  },
  {
    id: 4,
    name: 'Rtp Slot',
    icon: FaChartBar,
    path: '/rtp-slot'
  },
  {
    id: 5,
    name: 'Cara Bermain',
    icon: FaCube,
    path: '/cara-bermain'
  },
  {
    id: 6,
    name: 'Bukti Jp',
    icon: FaTrophy,
    path: '/bukti-jp'
  },
  {
    id: 7,
    name: 'Download Apk',
    icon: FaDownload,
    path: '/download'
  },
  {
    id: 8,
    name: 'Live Chat',
    icon: FaComments,
    path: '/live-chat'
  },
  {
    id: 9,
    name: 'Pengaduan Customer',
    icon: FaExclamationCircle,
    path: '/pengaduan'
  }
]

export default function MenuSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[420px] bg-[#1a1a1a] z-[60] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 md:p-6 flex-shrink-0">
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <FaTimes className="text-4xl md:text-5xl" />
          </button>
        </div>

        {/* Menu Items - Spread evenly */}
        <nav className="flex-1 flex flex-col px-2 md:px-4 pb-6">
          <ul className="flex-1 flex flex-col justify-between">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <li key={item.id} className="border-b border-gray-700/30 last:border-b-0">
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center gap-5 md:gap-6 py-4 md:py-5 px-5 md:px-8 hover:bg-white/5 transition-colors group"
                  >
                    <Icon className="text-xl md:text-2xl text-white/50 group-hover:text-white flex-shrink-0 w-7 text-center" />
                    <span className="text-white text-lg md:text-xl font-medium tracking-wide">
                      {item.name}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
