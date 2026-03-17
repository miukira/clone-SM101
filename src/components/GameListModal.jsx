// Modal untuk menampilkan daftar game dari provider
import { useState, useEffect } from 'react'
import { playGame } from '../services/api'
import { useGameList } from '../hooks/useProviders'

// Loading Spinner
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-[#333] rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-[#C0C0C0] rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

// Game Card Component
// Game schema dari Swagger: { id, name, image }
function GameCard({ game, onPlay, isLoading }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className="group relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-[#444] transition-all duration-300 hover:shadow-lg hover:shadow-white/5">
      {/* Game Image */}
      <div className="relative aspect-[4/3] bg-[#111] overflow-hidden">
        {!imageError && game.image ? (
          <img
            src={game.image}
            alt={game.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
            <span className="text-4xl opacity-30">🎮</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onPlay(game)}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-black text-sm font-bold tracking-wider shadow-lg transform scale-90 group-hover:scale-100 transition-transform disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'PLAY NOW'}
          </button>
        </div>
      </div>
      
      {/* Game Info */}
      <div className="p-3">
        <h3 className="text-xs font-bold text-[#E0E0E0] truncate">
          {game.name}
        </h3>
      </div>
    </div>
  )
}

// Main Modal Component
export default function GameListModal({ isOpen, onClose, provider }) {
  const [playingGameId, setPlayingGameId] = useState(null)
  const { games, loading, error, refetch } = useGameList(provider?.provider_id)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPlayingGameId(null)
    }
  }, [isOpen])

  // Handle play game - uses game.id (sesuai Swagger Game schema)
  const handlePlay = async (game) => {
    try {
      setPlayingGameId(game.id)
      const response = await playGame(provider.provider_id, game.id)
      // Response sesuai Swagger: { game_url }
      if (response?.game_url) {
        console.log(`🎮 Opening game: ${response.game_url}`)
        window.open(response.game_url, '_blank')
      }
    } catch (err) {
      console.error('Failed to play game:', err)
      alert('Gagal memulai game. Silakan coba lagi.')
    } finally {
      setPlayingGameId(null)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 sm:inset-8 lg:inset-16 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-2xl z-50 overflow-hidden flex flex-col border border-[#333]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#333] bg-gradient-to-r from-[#1a1a1a] via-[#222] to-[#1a1a1a]">
          <div className="flex items-center gap-4">
            {/* Provider Logo */}
            {provider?.logoImg && (
              <img
                src={provider.logoImg}
                alt={provider.name}
                className="h-8 sm:h-10 w-auto object-contain"
              />
            )}
            <div>
              <h2 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                {provider?.name || 'Game List'}
              </h2>
              <p className="text-[10px] sm:text-xs text-[#606060]">
                {loading ? 'Loading...' : `${games.length} games tersedia`}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#404040] text-[#808080] hover:text-[#C0C0C0] hover:border-[#505050] transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-4">😕</span>
              <p className="text-[#808080] mb-4">Gagal memuat game list</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-[#2a2a2a] border border-[#404040] rounded-lg text-xs font-bold text-[#C0C0C0] hover:bg-[#333] transition-all"
              >
                Coba Lagi
              </button>
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-4">🎮</span>
              <p className="text-[#808080]">Belum ada game tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={handlePlay}
                  isLoading={playingGameId === game.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[#333] bg-[#111]">
          <p className="text-[10px] text-[#505050]">
            Provider ID: {provider?.provider_id}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#404040] rounded-lg text-xs font-bold text-[#808080] hover:text-[#C0C0C0] hover:border-[#505050] transition-all tracking-wider"
          >
            TUTUP
          </button>
        </div>
      </div>
    </>
  )
}
