import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { publicAssetUrl, withCacheBust } from '../utils/publicAssetUrl'
import { loadWebsitePublicBundle } from '../utils/websitePublicDataCache.js'
import { syncWebsiteHeadMeta } from '../utils/websiteHeadMeta'

const WebsiteContext = createContext()

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
  console.log('🎨 Favicon updated:', faviconUrl)
}

/** Hanya eksekusi string yang masuk akal sebagai snippet JS (bukan URL/HTML dari CMS). */
function isExecutableExternalScriptSnippet(script) {
  if (typeof script !== 'string') return false
  const s = script.trim()
  if (s.length < 2) return false
  if (s.startsWith('<') || s.startsWith('<?')) return false
  // Satu baris URL saja — bukan kode; hindari SyntaxError Unexpected token '<' / invalid
  if (/^https?:\/\/\S+$/i.test(s)) return false
  return true
}

function runExternalScriptsFromConfig(scripts) {
  if (!scripts || !Array.isArray(scripts)) return

  console.log('🔧 Executing external scripts from API...')
  scripts.forEach((script, index) => {
    if (!isExecutableExternalScriptSnippet(script)) {
      console.warn(
        `⏭️ External script ${index + 1} skipped (bukan snippet JS valid — URL/HTML/dikosongkan?)`,
      )
      return
    }
    try {
      const fn = new Function(script)
      fn()
      console.log(`✅ External script ${index + 1} executed successfully`)
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
      console.log('📡 Fetching website data...')

      const bundle = await loadWebsitePublicBundle({ reset: force })
      const combined = {
        notification: bundle.notification || [],
        lottery_result: bundle.lottery_result || [],
        withdraw_list: bundle.withdraw_list || [],
        config: bundle.config || {},
        banks: [],
        promotions: [],
        referral: {},
      }

      console.log('✅ Website data loaded:', combined)
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
