import { useWebsite } from '../context/WebsiteContext'

export default function MaintenancePage() {
  const { maintenance, logo, title, contact } = useWebsite()
  
  const expectedEnd = maintenance.expected_end 
    ? new Date(maintenance.expected_end) 
    : null
  
  const formatDate = (date) => {
    if (!date) return '-'
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt={title}
            className="h-16 sm:h-20 mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
            {title}
          </h1>
        </div>

        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#404040] shadow-2xl">
            <svg 
              className="w-12 h-12 sm:w-16 sm:h-16 text-[#C0C0C0] animate-pulse" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>

        {/* Maintenance Message */}
        <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-[#333] rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Sedang Dalam Pemeliharaan
          </h2>
          
          <p className="text-sm sm:text-base text-[#808080] mb-6 leading-relaxed">
            {maintenance.message || 'Sistem sedang dalam perbaikan. Mohon maaf atas ketidaknyamanannya.'}
          </p>

          {/* Estimated End Time */}
          {expectedEnd && (
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-4">
              <p className="text-xs text-[#606060] mb-1 tracking-wider">ESTIMASI SELESAI</p>
              <p className="text-sm sm:text-base font-bold text-[#C0C0C0]">
                {formatDate(expectedEnd)}
              </p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <p className="text-xs text-[#606060] tracking-wider">HUBUNGI KAMI</p>
          <div className="flex justify-center gap-4">
            {contact.whatsapp && (
              <a 
                href={contact.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium hover:bg-green-600/30 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}
            {contact.telegram && (
              <a 
                href={contact.telegram.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-3 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#404040] rounded-lg text-[#808080] text-sm font-medium hover:text-white hover:border-[#505050] transition-all"
        >
          Cek Status Terbaru
        </button>

        {/* Footer */}
        <p className="mt-8 text-xs text-[#404040]">
          © 2026 {title}. All rights reserved.
        </p>
      </div>
    </div>
  )
}
