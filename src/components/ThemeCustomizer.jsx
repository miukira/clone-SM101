import { useState, useEffect } from 'react'
import { useTheme, SEASONS, BG_COLORS, BG_IMAGES, UI_COLORS } from '../context/ThemeContext'

// Settings icon
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function ThemeCustomizer() {
  const {
    season, setSeason,
    bgColor, setBgColor,
    bgImage, setBgImage,
    uiColor, setUiColor,
    uiColorData,
    isCustomizerOpen, toggleCustomizer, setIsCustomizerOpen
  } = useTheme()

  // Pending changes (before Apply)
  const [pendingSeason, setPendingSeason] = useState(season)
  const [pendingBgColor, setPendingBgColor] = useState(bgColor)
  const [pendingBgImage, setPendingBgImage] = useState(bgImage)
  const [pendingUiColor, setPendingUiColor] = useState(uiColor)
  const [hasChanges, setHasChanges] = useState(false)

  // Sync pending with actual when panel opens
  useEffect(() => {
    if (isCustomizerOpen) {
      setPendingSeason(season)
      setPendingBgColor(bgColor)
      setPendingBgImage(bgImage)
      setPendingUiColor(uiColor)
      setHasChanges(false)
    }
  }, [isCustomizerOpen, season, bgColor, bgImage, uiColor])

  // Check for changes
  useEffect(() => {
    const changed = 
      pendingSeason !== season ||
      pendingBgColor !== bgColor ||
      pendingBgImage !== bgImage ||
      pendingUiColor !== uiColor
    setHasChanges(changed)
  }, [pendingSeason, pendingBgColor, pendingBgImage, pendingUiColor, season, bgColor, bgImage, uiColor])

  // Apply all changes
  const applyChanges = () => {
    setSeason(pendingSeason)
    setBgColor(pendingBgColor)
    setBgImage(pendingBgImage)
    setUiColor(pendingUiColor)
    setHasChanges(false)
  }

  // Get preview UI color data
  const previewUiColor = UI_COLORS[pendingUiColor] || UI_COLORS.silver

  return (
    <>

      {/* Overlay */}
      {isCustomizerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[10001] backdrop-blur-sm"
          onClick={() => setIsCustomizerOpen(false)}
        />
      )}

      {/* Settings Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 bg-[#1a1a1a] border-l border-[#2a2a2a] z-[10002] transform transition-transform duration-300 overflow-y-auto ${
          isCustomizerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div 
          className="sticky top-0 p-4 border-b border-[#2a2a2a] flex items-center justify-between z-10"
          style={{ background: `linear-gradient(135deg, ${previewUiColor.primary}20, #1a1a1a)` }}
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span style={{ color: previewUiColor.primary }}>🎨</span>
            Theme Settings
          </h2>
          <button 
            onClick={() => setIsCustomizerOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* === SEASONAL EFFECTS === */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span>🎊</span> Efek Musiman
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(SEASONS).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setPendingSeason(key)}
                  className={`p-3 rounded-lg text-center transition-all border ${
                    pendingSeason === key 
                      ? 'scale-105' 
                      : 'border-transparent hover:bg-white/5'
                  }`}
                  style={{
                    background: pendingSeason === key ? `${previewUiColor.primary}20` : 'transparent',
                    borderColor: pendingSeason === key ? previewUiColor.primary : 'transparent',
                  }}
                >
                  <span className="text-2xl block mb-1">{data.icon}</span>
                  <span className="text-xs text-gray-400">{data.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* === BACKGROUND COLOR === */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span>🎨</span> Warna Background
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(BG_COLORS).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setPendingBgColor(key)}
                  className={`p-2 rounded-lg transition-all border ${
                    pendingBgColor === key ? 'scale-105' : 'border-transparent'
                  }`}
                  style={{ borderColor: pendingBgColor === key ? previewUiColor.primary : 'transparent' }}
                >
                  <div 
                    className="w-full h-8 rounded-md mb-1 border border-white/20"
                    style={{ background: data.value }}
                  />
                  <span className="text-xs text-gray-400 block truncate">{data.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* === BACKGROUND IMAGE === */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span>🖼️</span> Gambar Background
            </h3>
            <div className="space-y-2">
              {Object.entries(BG_IMAGES).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setPendingBgImage(key)}
                  className={`w-full p-2 rounded-lg transition-all flex items-center gap-3 border ${
                    pendingBgImage === key ? '' : 'border-transparent hover:bg-white/5'
                  }`}
                  style={{ 
                    background: pendingBgImage === key ? `${previewUiColor.primary}20` : 'transparent',
                    borderColor: pendingBgImage === key ? previewUiColor.primary : 'transparent'
                  }}
                >
                  {data.src ? (
                    <div 
                      className="w-16 h-10 rounded bg-cover bg-center border border-white/20"
                      style={{ backgroundImage: `url(${data.src})` }}
                    />
                  ) : (
                    <div className="w-16 h-10 rounded bg-[#2a2a2a] flex items-center justify-center text-gray-500 border border-white/10">
                      🚫
                    </div>
                  )}
                  <span className="text-sm text-gray-300">{data.name}</span>
                  {pendingBgImage === key && (
                    <span className="ml-auto" style={{ color: previewUiColor.primary }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Gambar akan ditampilkan dengan opacity 20%
            </p>
          </div>

          {/* === UI COLORS === */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span>✨</span> Warna UI & Garis
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(UI_COLORS).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setPendingUiColor(key)}
                  className={`p-3 rounded-lg transition-all flex items-center gap-2 border ${
                    pendingUiColor === key ? 'scale-105' : 'border-transparent hover:bg-white/5'
                  }`}
                  style={{ 
                    background: pendingUiColor === key ? `${data.primary}20` : 'transparent',
                    borderColor: pendingUiColor === key ? data.primary : 'transparent'
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded-full border-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${data.primary}, ${data.secondary})`,
                      borderColor: data.border
                    }}
                  />
                  <span className="text-xs text-gray-300">{data.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* === PREVIEW === */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span>👁️</span> Preview
            </h3>
            <div 
              className="rounded-lg p-4 relative overflow-hidden"
              style={{ 
                background: BG_COLORS[pendingBgColor]?.value || '#0a0a0a',
                border: `1px solid ${previewUiColor.border}`
              }}
            >
              {/* BG Image preview */}
              {BG_IMAGES[pendingBgImage]?.src && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${BG_IMAGES[pendingBgImage].src})` }}
                />
              )}
              
              <div className="relative z-10 space-y-2">
                <div 
                  className="text-sm font-bold"
                  style={{ color: previewUiColor.primary }}
                >
                  Sample Title
                </div>
                <div 
                  className="h-2 rounded"
                  style={{ background: `linear-gradient(90deg, ${previewUiColor.primary}, ${previewUiColor.secondary})` }}
                />
                <div 
                  className="p-2 rounded text-xs text-gray-400"
                  style={{ 
                    border: `1px solid ${previewUiColor.border}`,
                    background: 'rgba(0,0,0,0.3)'
                  }}
                >
                  Sample card content
                </div>
              </div>
            </div>
          </div>

          {/* === APPLY BUTTON === */}
          <div className="sticky bottom-0 pt-4 pb-2 bg-[#1a1a1a] border-t border-[#2a2a2a] space-y-2">
            <button
              onClick={applyChanges}
              disabled={!hasChanges}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                hasChanges 
                  ? 'text-black hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              style={hasChanges ? {
                background: `linear-gradient(135deg, ${previewUiColor.primary}, ${previewUiColor.secondary})`,
              } : {}}
            >
              {hasChanges ? '✓ APPLY CHANGES' : 'No Changes'}
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                setPendingSeason('none')
                setPendingBgColor('default')
                setPendingBgImage('none')
                setPendingUiColor('silver')
              }}
              className="w-full py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-white/5 transition-colors text-sm"
            >
              Reset ke Default
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
