import { useEffect, useState, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

// Single falling item component
function FallingItem({ item, delay, duration, left, size }) {
  // Debug: log the item path
  console.log('FallingItem src:', item)
  
  // Check if item is an image path
  const isImage = item && (item.startsWith('/') || item.startsWith('http'))
  
  return (
    <div
      className="absolute animate-fall pointer-events-none select-none"
      style={{
        left: `${left}%`,
        top: '-60px',
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity: 0.9,
        zIndex: 9999,
      }}
    >
      {isImage ? (
        <img 
          src={item} 
          alt="seasonal effect" 
          style={{ width: size, height: size, objectFit: 'contain' }}
          onError={(e) => console.error('Failed to load:', item, e)}
        />
      ) : (
        <span style={{ fontSize: size }}>{item}</span>
      )}
    </div>
  )
}

export default function SeasonalEffects() {
  const { seasonData, season } = useTheme()
  const [items, setItems] = useState([])

  // Generate random falling items
  const fallingItems = useMemo(() => {
    if (!seasonData?.item || season === 'none') return []
    
    const generated = []
    // Limit to 15 items for performance
    for (let i = 0; i < 15; i++) {
      generated.push({
        id: i,
        item: seasonData.item,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 4, // 5-9 seconds
        left: Math.random() * 100,
        size: 28 + Math.random() * 16, // 28-44px
      })
    }
    return generated
  }, [seasonData, season])

  useEffect(() => {
    if (season === 'none') {
      setItems([])
      return
    }
    setItems(fallingItems)
  }, [season, fallingItems])

  if (season === 'none' || items.length === 0) return null

  return (
    <>
      {/* CSS for fall animation */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(280px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
      
      {/* Container - limited to top 280px */}
      <div 
        className="fixed top-0 left-0 right-0 overflow-hidden pointer-events-none"
        style={{ height: '280px', zIndex: 9998 }}
      >
        {items.map(item => (
          <FallingItem
            key={item.id}
            item={item.item}
            delay={item.delay}
            duration={item.duration}
            left={item.left}
            size={item.size}
          />
        ))}
      </div>
    </>
  )
}
