import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { publicAssetUrl, withCacheBust, setRuntimeAssetBaseUrl } from '../utils/publicAssetUrl'
import { loadWebsitePublicBundle } from '../utils/websitePublicDataCache.js'
import { syncWebsiteHeadMeta } from '../utils/websiteHeadMeta'
import { DEFAULT_MIN_WITHDRAW } from '../constants/transactionLimits'

const WebsiteContext = createContext()
const VERBOSE = import.meta.env.VITE_API_VERBOSE === 'true'

function updateFaviconFromConfig(faviconUrl, assetRev) {
  if (!faviconUrl || typeof document === 'undefined') return

  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  const base = publicAssetUrl(faviconUrl)
  const href = withCacheBust(base, assetRev)
  if (!href) return
  link.href = href
  const lower = String(faviconUrl).toLowerCase()
  if (lower.endsWith('.svg')) link.type = 'image/svg+xml'
  else if (lower.endsWith('.png')) link.type = 'image/png'
  else link.removeAttribute('type')
  if (VERBOSE) console.log('🎨 Favicon updated:', faviconUrl)
}

/**
 * Ekstrak konten JS dari dalam tag <script>...</script> jika ada.
 * Contoh: "<script>console.log('hello');</script>" → "console.log('hello');"
 */
function extractScriptContent(script) {
  if (typeof script !== 'string') return null
  const s = script.trim()
  if (s.length < 2) return null

  // Jika dibungkus <script>...</script>, ekstrak isinya
  const scriptTagMatch = s.match(/^<script[^>]*>([\s\S]*)<\/script>$/i)
  if (scriptTagMatch) {
    const inner = scriptTagMatch[1].trim()
    return inner.length > 0 ? inner : null
  }

  // Bukan script tag, cek apakah valid JS snippet
  // Skip jika dimulai dengan < (HTML/XML lain) atau <? (PHP)
  if (s.startsWith('<') || s.startsWith('<?')) return null
  // Skip jika hanya URL
  if (/^https?:\/\/\S+$/i.test(s)) return null

  return s
}

function runExternalScriptsFromConfig(scripts) {
  if (!scripts || !Array.isArray(scripts)) return

  if (VERBOSE) console.log('🔧 Executing external scripts from API...')
  scripts.forEach((script, index) => {
    const jsContent = extractScriptContent(script)
    if (!jsContent) {
      if (VERBOSE) console.warn(`⏭️ External script ${index + 1} skipped`)
      return
    }
    try {
      const fn = new Function(jsContent)
      fn()
      if (VERBOSE) console.log(`✅ External script ${index + 1} executed`)
    } catch (err) {
      console.error(`❌ Error executing external script ${index + 1}:`, err)
    }
  })
}

export function WebsiteProvider({ children }) {
  const [websiteData, setWebsiteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  /** Naik tiap GET config sukses — cache-bust src logo/banner/favicon */
  const [configAssetRev, setConfigAssetRev] = useState(0)
  const externalScriptsRanRef = useRef(false)

  const fetchWebsiteData = useCallback(async (opts = {}) => {
    const force = opts.force === true
    try {
      setLoading(true)
      setError(null)

      const bundle = await loadWebsitePublicBundle({ reset: force })
      const combined = {
        notification: bundle.notification || [],
        lottery_result: bundle.lottery_result || [],
        withdraw_list: bundle.withdraw_list || [],
        min_withdraw: bundle.min_withdraw,
        config: bundle.config || {},
        banks: [],
        promotions: [],
        referral: {},
      }

      setWebsiteData(combined)
      setConfigAssetRev(Date.now())
    } catch (err) {
      console.error('❌ Error fetching website data:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWebsiteData()
  }, [fetchWebsiteData])

  /** Path CDN dinamis: optional `asset_base_url` | `cdn_base_url` pada WebsiteConfig (ekstensi backend). */
  const runtimeCdnBaseFromConfig = useMemo(() => {
    const cfg = websiteData?.config
    if (!cfg || typeof cfg !== 'object') return ''
    const assetBase = cfg.asset_base_url != null ? String(cfg.asset_base_url).trim() : ''
    const cdnBase = cfg.cdn_base_url != null ? String(cfg.cdn_base_url).trim() : ''
    return assetBase || cdnBase || ''
  }, [websiteData?.config])

  // Sinkron ke modul sebelum child render — providerAssetUrl() pakai basis ini untuk path relatif.
  setRuntimeAssetBaseUrl(runtimeCdnBaseFromConfig)

  const refetchWebsite = useCallback(() => fetchWebsiteData({ force: true }), [fetchWebsiteData])

  /** Sinkronisasi head: title, favicon, meta_tag, google_verification, external_script */
  useEffect(() => {
    const cfg = websiteData?.config
    if (!cfg || typeof cfg !== 'object') return undefined

    const rawTitle = cfg.title != null ? String(cfg.title).trim() : ''
    document.title = rawTitle !== '' ? rawTitle : 'PUSATTOGEL'

    if (cfg.favicon) {
      updateFaviconFromConfig(cfg.favicon, configAssetRev)
    }

    if (
      Array.isArray(cfg.external_script) &&
      cfg.external_script.length > 0 &&
      !externalScriptsRanRef.current
    ) {
      runExternalScriptsFromConfig(cfg.external_script)
      externalScriptsRanRef.current = true
    }

    return syncWebsiteHeadMeta(cfg)
  }, [websiteData, configAssetRev])

  // Config dari /website (WebsiteConfig)
  const config = websiteData?.config || {}

  // Info dari /info (WebsiteInfo)
  const notifications = websiteData?.notification || []
  const lotteryResults = websiteData?.lottery_result || []
  const withdrawList = websiteData?.withdraw_list || []

  // Data terpisah dari endpoint masing-masing
  const banks = websiteData?.banks || []
  const promotions = websiteData?.promotions || []
  const referralInfo = websiteData?.referral || {}

  const maintenance = config.maintenance || { status: false }
  const isUnderMaintenance = maintenance.status === true

  const banners = config.banner || []
  const theme = config.theme || {}
  const contact = config.contact || {}
  const rawLogo = config.logo != null ? String(config.logo).trim() : ''
  const logo = withCacheBust(
    publicAssetUrl(rawLogo !== '' ? rawLogo : '/logo.png'),
    configAssetRev || null,
  )
  const title =
    (config.title != null && String(config.title).trim() !== ''
      ? String(config.title).trim()
      : null) || 'PUSATTOGEL'
  const about = config.about || ''

  const rawMinWithdraw = websiteData?.min_withdraw
  const minWithdraw = (() => {
    const n = Number(rawMinWithdraw)
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_MIN_WITHDRAW
  })()

  const value = {
    loading,
    error,
    refetch: refetchWebsite,

    config,
    notifications,
    lotteryResults,
    withdrawList,
    banks,
    promotions,
    referralInfo,

    maintenance,
    isUnderMaintenance,

    banners,
    theme,
    contact,
    logo,
    /** Naik setiap fetch website sukses — untuk cache-bust gambar promo */
    configAssetRev,
    title,
    about,
    minWithdraw,
  }

  return (
    <WebsiteContext.Provider value={value}>
      {children}
    </WebsiteContext.Provider>
  )
}

export function useWebsite() {
  const context = useContext(WebsiteContext)
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider')
  }
  return context
}

export default WebsiteContext
