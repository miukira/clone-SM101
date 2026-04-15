import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react'
import { publicAssetUrl } from '../utils/publicAssetUrl'
import { useWebsite } from './WebsiteContext'

// ============================================
// THEME OPTIONS (paths → absolute URL)
// ============================================

const SEASONS_RAW = {
  none: { name: 'Tidak Ada', item: null },
  imlek: { name: 'Imlek', item: '/angpao.svg' },
  lebaran: { name: 'Lebaran', item: '/ketupat.png' },
  halloween: { name: 'Halloween', item: '/pumpkin.svg' },
  christmas: { name: 'Christmas', item: '/snow.svg' },
  jackpot: { name: 'Jackpot', item: '/coin.svg' }
}

export const SEASONS = Object.fromEntries(
  Object.entries(SEASONS_RAW).map(([k, v]) => [
    k,
    { ...v, item: v.item ? publicAssetUrl(v.item) : v.item }
  ])
)

// Background Colors
export const BG_COLORS = {
  default: { name: 'Default (Gelap)', value: '#0a0a0a' },
  darkBlue: { name: 'Biru Gelap', value: '#0a1628' },
  darkPurple: { name: 'Ungu Gelap', value: '#1a0a28' },
  darkGreen: { name: 'Hijau Gelap', value: '#0a1a0f' },
  darkRed: { name: 'Merah Gelap', value: '#1a0a0a' },
  navy: { name: 'Navy', value: '#0d1b2a' },
  charcoal: { name: 'Charcoal', value: '#1a1a2e' }
}

const BG_IMAGES_RAW = {
  none: { name: 'Tidak Ada', src: null },
  casino1: { name: 'Casino 1', src: '/bg-casino-1.webp' },
  casino2: { name: 'Casino 2', src: '/bg-casino-2.webp' }
}

export const BG_IMAGES = Object.fromEntries(
  Object.entries(BG_IMAGES_RAW).map(([k, v]) => [
    k,
    { ...v, src: v.src ? publicAssetUrl(v.src) : v.src }
  ])
)

// UI Colors (Border & Line colors)
export const UI_COLORS = {
  silver: { 
    name: 'Chrome Silver', 
    primary: '#C0C0C0',
    secondary: '#808080',
    border: '#606060',
    glow: 'rgba(192, 192, 192, 0.3)'
  },
  gold: { 
    name: 'Gold', 
    primary: '#FFD700',
    secondary: '#B8860B',
    border: '#8B6914',
    glow: 'rgba(255, 215, 0, 0.3)'
  },
  red: { 
    name: 'Merah', 
    primary: '#DC143C',
    secondary: '#8B0000',
    border: '#5C0000',
    glow: 'rgba(220, 20, 60, 0.3)'
  },
  blue: { 
    name: 'Biru', 
    primary: '#1E90FF',
    secondary: '#0066CC',
    border: '#004499',
    glow: 'rgba(30, 144, 255, 0.3)'
  },
  green: { 
    name: 'Hijau', 
    primary: '#50C878',
    secondary: '#228B22',
    border: '#006400',
    glow: 'rgba(80, 200, 120, 0.3)'
  },
  purple: { 
    name: 'Ungu', 
    primary: '#9966CC',
    secondary: '#663399',
    border: '#4B0082',
    glow: 'rgba(153, 102, 204, 0.3)'
  },
  pink: { 
    name: 'Pink', 
    primary: '#FF69B4',
    secondary: '#DB7093',
    border: '#C71585',
    glow: 'rgba(255, 105, 180, 0.3)'
  }
}

// ============================================
// THEME CONTEXT
// ============================================

const ThemeContext = createContext()

/** Terapkan `WebsiteConfig.theme` dari GET /website (sudah di WebsiteContext). */
function applyConfigTheme(theme, setters) {
  if (!theme || typeof theme !== 'object') return
  const {
    setSeason,
    setBgColor,
    setBgImage,
    setCustomBgImageUrl,
    setUiColor,
  } = setters
  if (theme.season) setSeason(theme.season)
  if (theme.background_color) {
    const matchedBgColor = Object.entries(BG_COLORS).find(
      ([, val]) => val.value.toLowerCase() === String(theme.background_color).toLowerCase(),
    )
    if (matchedBgColor) setBgColor(matchedBgColor[0])
  }
  if (theme.background_image) {
    const bgImageUrl = theme.background_image
    const matchedBgImage = Object.entries(BG_IMAGES).find(
      ([, val]) => val.src && val.src === bgImageUrl,
    )
    if (matchedBgImage) {
      setBgImage(matchedBgImage[0])
      setCustomBgImageUrl(null)
    } else {
      setBgImage('custom')
      setCustomBgImageUrl(bgImageUrl)
    }
  }
  if (theme.border_color) {
    const colorMap = {
      '#C0C0C0': 'silver',
      '#FFD700': 'gold',
      '#DC143C': 'red',
      '#1E90FF': 'blue',
      '#50C878': 'green',
      '#9966CC': 'purple',
      '#FF69B4': 'pink',
    }
    const matchedColor = Object.entries(colorMap).find(
      ([hex]) => hex.toLowerCase() === String(theme.border_color).toLowerCase(),
    )
    if (matchedColor) setUiColor(matchedColor[1])
  }
}

export function ThemeProvider({ children }) {
  const { config } = useWebsite()
  const [season, setSeason] = useState('none')
  const [bgColor, setBgColor] = useState('default')
  const [bgImage, setBgImage] = useState('none')
  const [customBgImageUrl, setCustomBgImageUrl] = useState(null) // For absolute URLs from server
  const [uiColor, setUiColor] = useState('silver')
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)

  const lastServerThemeKeyRef = useRef('')

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('pusattogel-theme')
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme)
        if (parsed.season) setSeason(parsed.season)
        if (parsed.bgColor) setBgColor(parsed.bgColor)
        if (parsed.bgImage) setBgImage(parsed.bgImage)
        if (parsed.customBgImageUrl) setCustomBgImageUrl(parsed.customBgImageUrl)
        if (parsed.uiColor) setUiColor(parsed.uiColor)
      } catch (e) {
        console.error('Failed to parse saved theme', e)
      }
    }
  }, [])

  // Theme dari WebsiteContext — terapkan hanya saat payload `theme` berubah
  useEffect(() => {
    const t = config?.theme
    if (!t || typeof t !== 'object') return
    const key = JSON.stringify(t)
    if (key === lastServerThemeKeyRef.current) return
    lastServerThemeKeyRef.current = key
    applyConfigTheme(t, {
      setSeason,
      setBgColor,
      setBgImage,
      setCustomBgImageUrl,
      setUiColor,
    })
  }, [config?.theme])

  // Save to localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('pusattogel-theme', JSON.stringify({
      season, bgColor, bgImage, customBgImageUrl, uiColor
    }))
  }, [season, bgColor, bgImage, customBgImageUrl, uiColor])
  
  // Compute bgImageData - supports both predefined and custom absolute URLs
  const bgImageData = useMemo(() => {
    if (bgImage === 'custom' && customBgImageUrl) {
      return { name: 'Custom (Server)', src: customBgImageUrl }
    }
    return BG_IMAGES[bgImage] || BG_IMAGES.none
  }, [bgImage, customBgImageUrl])

  // Apply theme to body
  useEffect(() => {
    const bgColorValue = BG_COLORS[bgColor]?.value || BG_COLORS.default.value
    document.body.style.backgroundColor = bgColorValue
    
    // Set CSS variables for UI colors
    const uiColorData = UI_COLORS[uiColor] || UI_COLORS.silver
    document.documentElement.style.setProperty('--ui-primary', uiColorData.primary)
    document.documentElement.style.setProperty('--ui-secondary', uiColorData.secondary)
    document.documentElement.style.setProperty('--ui-border', uiColorData.border)
    document.documentElement.style.setProperty('--ui-glow', uiColorData.glow)
  }, [bgColor, uiColor])

  const value = {
    // Current values
    season,
    bgColor,
    bgImage,
    customBgImageUrl,
    uiColor,
    isCustomizerOpen,
    
    // Setters
    setSeason,
    setBgColor,
    setBgImage,
    setCustomBgImageUrl,
    setUiColor,
    setIsCustomizerOpen,
    
    // Data
    seasonData: SEASONS[season],
    bgColorData: BG_COLORS[bgColor],
    bgImageData, // Now computed to support absolute URLs
    uiColorData: UI_COLORS[uiColor],
    
    // Options
    SEASONS,
    BG_COLORS,
    BG_IMAGES,
    UI_COLORS
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
