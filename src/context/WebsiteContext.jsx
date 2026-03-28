import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getInfo } from '../services/api'

const WebsiteContext = createContext()

export function WebsiteProvider({ children }) {
  const [websiteData, setWebsiteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [externalScriptsExecuted, setExternalScriptsExecuted] = useState(false)

  const fetchWebsiteData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📡 Fetching website data from /info...')
      const data = await getInfo()
      console.log('✅ Website data loaded:', data)
      setWebsiteData(data)
      
      if (data.config?.external_script && !externalScriptsExecuted) {
        executeExternalScripts(data.config.external_script)
        setExternalScriptsExecuted(true)
      }
      
      if (data.config?.favicon) {
        updateFavicon(data.config.favicon)
      }
      
      if (data.config?.title) {
        document.title = data.config.title
      }
      
    } catch (err) {
      console.error('❌ Error fetching website data:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [externalScriptsExecuted])

  const executeExternalScripts = (scripts) => {
    if (!scripts || !Array.isArray(scripts)) return
    
    console.log('🔧 Executing external scripts from API...')
    scripts.forEach((script, index) => {
      try {
        const fn = new Function(script)
        fn()
        console.log(`✅ External script ${index + 1} executed successfully`)
      } catch (err) {
        console.error(`❌ Error executing external script ${index + 1}:`, err)
      }
    })
  }

  const updateFavicon = (faviconUrl) => {
    if (!faviconUrl) return
    
    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = faviconUrl
    console.log('🎨 Favicon updated:', faviconUrl)
  }

  useEffect(() => {
    fetchWebsiteData()
  }, [])

  const config = websiteData?.config || {}
  const notifications = websiteData?.notification || []
  const lotteryResults = websiteData?.lottery_result || []
  const withdrawList = websiteData?.withdraw_list || []
  const banks = websiteData?.banks || []
  const promotions = websiteData?.promotions || []
  const referralInfo = websiteData?.referral || {}
  
  const maintenance = config.maintenance || { status: false }
  const isUnderMaintenance = maintenance.status === true
  
  const banners = config.banner || []
  const theme = config.theme || {}
  const contact = config.contact || {}
  const logo = config.logo || '/logo.png'
  const title = config.title || 'PUSATTOGEL'
  const about = config.about || ''

  const value = {
    loading,
    error,
    refetch: fetchWebsiteData,
    
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
