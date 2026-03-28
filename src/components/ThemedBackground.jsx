import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemedBackground() {
  const { bgColorData, bgImageData, uiColorData } = useTheme()
  
  // Extract actual values from data objects
  const bgColorValue = bgColorData?.value || '#0a0a0a'
  const bgImageSrc = bgImageData?.src || null

  // Apply CSS variables for UI colors globally
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--ui-primary', uiColorData.primary)
    root.style.setProperty('--ui-secondary', uiColorData.secondary)
    root.style.setProperty('--ui-border', uiColorData.border)
  }, [uiColorData])

  return (
    <>
      {/* Base background color - covers entire viewport */}
      <div 
        className="fixed inset-0 transition-colors duration-500"
        style={{ 
          background: bgColorValue,
          zIndex: -30,
        }}
      />
      
      {/* Background image with 30% opacity - more visible */}
      {bgImageSrc && (
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{ 
            backgroundImage: `url(${bgImageSrc})`,
            opacity: 0.3,
            zIndex: -20,
          }}
        />
      )}
      
      {/* Lighter gradient overlay - less blocking */}
      <div 
        className="fixed inset-0 transition-colors duration-500"
        style={{
          background: `linear-gradient(to bottom, ${bgColorValue}70, ${bgColorValue}95)`,
          zIndex: -10,
        }}
      />

      {/* UI Border Lines - Top */}
      <div 
        className="fixed top-0 left-0 right-0 h-[2px] transition-colors duration-500"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${uiColorData.primary}, transparent)`,
          zIndex: 9990,
        }}
      />

      {/* UI Border Lines - Decorative corners */}
      <div 
        className="fixed top-0 left-0 w-20 h-20 pointer-events-none transition-colors duration-500"
        style={{ zIndex: 9990 }}
      >
        <div 
          className="absolute top-2 left-2 w-12 h-[2px]"
          style={{ background: uiColorData.primary }}
        />
        <div 
          className="absolute top-2 left-2 w-[2px] h-12"
          style={{ background: uiColorData.primary }}
        />
      </div>

      <div 
        className="fixed top-0 right-0 w-20 h-20 pointer-events-none transition-colors duration-500"
        style={{ zIndex: 9990 }}
      >
        <div 
          className="absolute top-2 right-2 w-12 h-[2px]"
          style={{ background: uiColorData.primary }}
        />
        <div 
          className="absolute top-2 right-2 w-[2px] h-12"
          style={{ background: uiColorData.primary }}
        />
      </div>

      {/* Bottom decorative line */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-[2px] transition-colors duration-500"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${uiColorData.primary}50, transparent)`,
          zIndex: 9990,
        }}
      />

      {/* Side accent lines */}
      <div 
        className="fixed top-1/4 left-0 w-[2px] h-32 transition-colors duration-500"
        style={{ 
          background: `linear-gradient(to bottom, transparent, ${uiColorData.primary}, transparent)`,
          zIndex: 9990,
        }}
      />
      <div 
        className="fixed top-1/4 right-0 w-[2px] h-32 transition-colors duration-500"
        style={{ 
          background: `linear-gradient(to bottom, transparent, ${uiColorData.primary}, transparent)`,
          zIndex: 9990,
        }}
      />
    </>
  )
}
