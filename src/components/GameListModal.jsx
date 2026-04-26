// Modal untuk menampilkan daftar game dari provider
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { playGame, getLobby, getToken } from '../services/api'
import { providerAssetUrl } from '../utils/publicAssetUrl'
import { normalizeImageUrl } from '../utils/normalizeImageUrl'
import { DEFAULT_PROVIDER_CARD_IMAGE } from '../utils/defaultProviderImage.js'
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
function GameCard({ game, onPlay, isLoading, tPlay, tLoad }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  /** 0: game / default file; 1: paksa default; 2: placeholder 🎰 (ukuran medium) */
  const [heroTier, setHeroTier] = useState(0)
  const gameImage = normalizeImageUrl(game.image)

  useEffect(() => {
    setHeroTier(0)
    setImageLoaded(false)
  }, [game.id, gameImage])

  const gameHeroUrl =
    heroTier === 0
      ? providerAssetUrl(gameImage ?? DEFAULT_PROVIDER_CARD_IMAGE)
      : heroTier === 1
        ? providerAssetUrl(DEFAULT_PROVIDER_CARD_IMAGE)
        : null

  const handleGameImgError = () => {
    setHeroTier((t) => {
      if (t === 0 && gameImage) return 1
      return 2
    })
  }

  return (
    <div className="group relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-[#444] transition-all duration-300 hover:shadow-lg hover:shadow-white/5">
      {/* Game Image */}
      <div className="relative aspect-[4/3] bg-[#111] overflow-hidden">
        {gameHeroUrl ? (
          <img
            src={gameHeroUrl}
            alt={game.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={handleGameImgError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
            <span className="text-3xl opacity-35 select-none" aria-hidden>
              🎰
            </span>
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
            {isLoading ? tLoad : tPlay}
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
export default function GameListModal({ isOpen, onClose, provider, onRequireAuth }) {
  const { t } = useTranslation()
  const [playingGameId, setPlayingGameId] = useState(null)
  const [openingLobby, setOpeningLobby] = useState(false)
  const { games, loading, error, refetch } = useGameList(provider?.provider_id)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPlayingGameId(null)
      setOpeningLobby(false)
    }
  }, [isOpen])

  // Handle play game - uses game.id (sesuai Swagger Game schema)
  const handlePlay = async (game) => {
    if (!getToken()) {
      onRequireAuth?.()
      alert(t('gameList.loginToPlay'))
      return
    }
    try {
      setPlayingGameId(game.id)
      const response = await playGame(provider.provider_id, game.id)
      if (response?.game_url) {
        console.log(`🎮 Opening game: ${response.game_url}`)
        window.open(response.game_url, '_blank')
      }
      if (response?.redirect) {
        window.open(response.redirect, '_blank')
      }
    } catch (err) {
      console.error('Failed to play game:', err)
      const status = err?.status
      const msg = err?.data?.message
      if (status === 401 || msg === 'please login' || msg === 'invalid token') {
        onRequireAuth?.()
        alert(t('gameList.sessionInvalid'))
      } else {
        alert(msg || t('gameList.playFailed'))
      }
    } finally {
      setPlayingGameId(null)
    }
  }

  const handleOpenLobby = async () => {
    if (!getToken()) {
      onRequireAuth?.()
      alert(t('gameList.loginToPlay'))
      return
    }
    try {
      setOpeningLobby(true)
      const response = await getLobby(provider?.provider_id)
      const url = (response?.lobby_url ?? response?.lobbyUrl) ?? ''
      const href = typeof url === 'string' ? url.trim() : ''
      if (href) {
        window.open(href, '_blank')
      }
      // 200 + lobby_url: "" di staging wajar — tidak alert; bila nanti terisi, redirect lewat klik lagi / polling
    } catch (err) {
      console.error('Failed to open lobby:', err)
      const status = err?.status
      const msg = err?.data?.message
      if (status === 401 || msg === 'please login' || msg === 'invalid token') {
        onRequireAuth?.()
        alert(t('gameList.sessionInvalid'))
      } else {
        alert(msg || t('gameList.lobbyFailed'))
      }
    } finally {
      setOpeningLobby(false)
    }
  }

  if (!isOpen) return null

  const providerThumb =
    normalizeImageUrl(provider?.logoImg) ?? normalizeImageUrl(provider?.characterImg)
  const headerLogoSrc = (() => {
    if (providerThumb) return providerAssetUrl(providerThumb)
    if (DEFAULT_PROVIDER_CARD_IMAGE) return providerAssetUrl(DEFAULT_PROVIDER_CARD_IMAGE)
    return null
  })()
  const hasHeaderLogo = headerLogoSrc != null && String(headerLogoSrc).trim() !== ''

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
            {/* Provider Logo — bukan file lokal default */}
            {hasHeaderLogo ? (
              <img
                src={headerLogoSrc}
                alt={provider?.name || 'Provider'}
                className="h-8 sm:h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div
                className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-3xl opacity-35 select-none"
                aria-hidden
              >
                🎰
              </div>
            )}
            <div>
              <h2 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] via-[#C0C0C0] to-[#808080] tracking-wider">
                {provider?.name || t('common.gameList')}
              </h2>
              <p className="text-[10px] sm:text-xs text-[#606060]">
                {loading ? t('common.loading') : t('gameList.gamesCount', { count: games.length })}
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
            <div className="flex flex-col items-center justify-center py-12 px-2">
              <button
                type="button"
                onClick={handleOpenLobby}
                disabled={openingLobby}
                className="w-full sm:w-auto min-w-[200px] px-6 py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-sm font-bold text-black tracking-wider shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
              >
                {openingLobby ? t('common.loading') : t('gameList.openLobby')}
              </button>
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-2">
              <button
                type="button"
                onClick={handleOpenLobby}
                disabled={openingLobby}
                className="w-full sm:w-auto min-w-[200px] px-6 py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] rounded-lg text-sm font-bold text-black tracking-wider shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
              >
                {openingLobby ? t('common.loading') : t('gameList.openLobby')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={handlePlay}
                  isLoading={playingGameId === game.id}
                  tPlay={t('common.playNow')}
                  tLoad={t('common.loading')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[#333] bg-[#111]">
          <p className="text-[10px] text-[#505050]">
            {t('gameList.providerId')}: {provider?.provider_id}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#404040] rounded-lg text-xs font-bold text-[#808080] hover:text-[#C0C0C0] hover:border-[#505050] transition-all tracking-wider"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </>
  )
}
