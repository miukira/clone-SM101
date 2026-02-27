import { useState } from 'react'

/**
 * Unified Provider Card Component
 * 
 * Props:
 * - characterImg: string (required) - main character image
 * - characterImgAlt: string - alt text for character
 * - logoImg: string (required) - provider logo image
 * - logoAlt: string - alt text for logo
 * - logoWidth: string - logo width (default: '150px')
 * - logoTop: string - logo top position (default: 'top-5')
 * - characterWidth: string - character container width (default: 'w-[55%]')
 * - characterPosition: string - character position classes (default: 'left-[-10px] bottom-[-10px]')
 * - glowColor: string - ambient glow color (default: 'white')
 * - badge: object - { type: 'hot' | 'new' | 'top' | null, text?: string }
 * - overlayImg: string - optional overlay image (e.g., lightning for Zeus)
 * - animationClass: string - custom animation class prefix (default: 'provider')
 */
export default function ProviderCard({
  characterImg,
  characterImgAlt = 'Character',
  logoImg,
  logoAlt = 'Provider Logo',
  logoWidth = '150px',
  logoTop = '20px',
  logoLeft = '46%',
  characterWidth = 'w-[55%]',
  characterPosition = 'left-[-10px] bottom-[-10px]',
  characterCentered = false,
  glowColor = 'white',
  glowColorHover = 'white',
  badge = null,
  overlayImg = null,
  animationPrefix = 'provider',
}) {
  const [isHovered, setIsHovered] = useState(false)

  // Glow color mapping
  const glowColorMap = {
    white: 'from-white/[0.04]',
    orange: 'from-orange-500/[0.04]',
    yellow: 'from-yellow-600/[0.05]',
    red: 'from-red-600/[0.05]',
    cyan: 'from-cyan-400/[0.04]',
    purple: 'from-purple-500/[0.04]',
  }

  const glowColorHoverMap = {
    white: 'group-hover:from-white/[0.08]',
    orange: 'group-hover:from-orange-400/[0.1]',
    yellow: 'group-hover:from-yellow-500/[0.12]',
    red: 'group-hover:from-red-500/[0.12]',
    cyan: 'group-hover:from-cyan-400/[0.1]',
    purple: 'group-hover:from-purple-400/[0.1]',
  }

  const outerGlowHoverMap = {
    white: 'group-hover:from-white/[0.03]',
    orange: 'group-hover:from-orange-500/[0.03]',
    yellow: 'group-hover:from-yellow-500/[0.03]',
    red: 'group-hover:from-red-500/[0.03]',
    cyan: 'group-hover:from-cyan-400/[0.03]',
    purple: 'group-hover:from-purple-500/[0.03]',
  }

  const characterGlowMap = {
    white: 'from-white/20 via-white/5',
    orange: 'from-orange-500/20 via-red-500/5',
    yellow: 'from-yellow-500/20 via-amber-500/5',
    red: 'from-red-500/20 via-red-600/5',
    cyan: 'from-cyan-400/20 via-white/5',
    purple: 'from-purple-500/20 via-purple-600/5',
  }

  const dropShadowHover = {
    white: 'drop-shadow(0 0 20px rgba(192,192,192,0.5))',
    orange: 'drop-shadow(0 0 20px rgba(255,140,0,0.5))',
    yellow: 'drop-shadow(0 0 20px rgba(218,165,32,0.5))',
    red: 'drop-shadow(0 0 20px rgba(220,38,38,0.4))',
    cyan: 'drop-shadow(0 0 20px rgba(0,255,255,0.4))',
    purple: 'drop-shadow(0 0 20px rgba(168,85,247,0.4))',
  }

  // Character position classes
  const charPositionClass = characterCentered 
    ? `${characterPosition} top-[50%] -translate-y-1/2` 
    : characterPosition

  return (
    <div className="flex items-center justify-center" style={{ perspective: '800px' }}>
      {/* ===== PROVIDER CARD - Compact Landscape ===== */}
      <div
        className="provider-card group relative w-[290px] h-[180px] cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Outer Chrome Border - Silver gradient */}
        <div className="absolute inset-0 rounded-lg p-[1.5px] bg-gradient-to-br from-[#e8e8e8] via-[#808080] to-[#404040] group-hover:from-[#ffffff] group-hover:via-[#c0c0c0] group-hover:to-[#606060] transition-all duration-500">
          
          {/* Inner Black Card */}
          <div className="relative w-full h-full rounded-[6.5px] bg-black overflow-hidden">

            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" 
              style={{ 
                backgroundImage: 'linear-gradient(rgba(192,192,192,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(192,192,192,0.5) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}>
            </div>

            {/* Ambient light from character side (LEFT) */}
            <div className={`absolute left-[-15%] top-[-20%] w-[55%] h-[140%] bg-gradient-radial ${glowColorMap[glowColor] || glowColorMap.white} to-transparent blur-2xl ${glowColorHoverMap[glowColorHover] || glowColorHoverMap.white} transition-all duration-700`}></div>

            {/* ===== SHINE / GLEAM EFFECT ===== */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
              <div className="absolute -left-[120%] top-0 w-[60%] h-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent skew-x-[-20deg] provider-shine-sweep"></div>
            </div>

            {/* Chrome shimmer sweep on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none z-20">
              <div className="absolute -left-full top-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent skew-x-[-20deg] provider-shimmer-chrome"></div>
            </div>

            {/* ===== CHARACTER - LEFT SIDE ===== */}
            <div className={`absolute ${charPositionClass} ${characterWidth} z-[3]`}>
              
              {/* Main character body */}
              <img
                src={characterImg}
                alt={characterImgAlt}
                className={`
                  w-full h-auto relative z-[1]
                  ${isHovered ? `${animationPrefix}-body-hover` : `${animationPrefix}-body-idle`}
                `}
                style={{
                  transformOrigin: 'bottom center',
                  filter: isHovered 
                    ? `${dropShadowHover[glowColorHover] || dropShadowHover.white} brightness(1.1)` 
                    : 'drop-shadow(0 0 12px rgba(192,192,192,0.15))',
                  transition: 'filter 0.5s ease',
                  maskImage: 'linear-gradient(to bottom, black 75%, transparent 98%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 98%)',
                }}
              />

              {/* Overlay image (e.g., lightning for Zeus) */}
              {overlayImg && (
                <>
                  <img
                    src={overlayImg}
                    alt=""
                    className={`
                      absolute inset-0 w-full h-auto z-[2] pointer-events-none
                      ${isHovered ? `${animationPrefix}-overlay-active` : `${animationPrefix}-overlay-idle`}
                    `}
                    style={{
                      transformOrigin: 'center center',
                      mixBlendMode: 'screen',
                      maskImage: 'linear-gradient(to bottom, black 75%, transparent 98%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 98%)',
                    }}
                  />
                  <img
                    src={overlayImg}
                    alt=""
                    className={`
                      absolute inset-0 w-full h-auto z-[3] pointer-events-none
                      ${isHovered ? `${animationPrefix}-overlay-glow-active` : `${animationPrefix}-overlay-glow-idle`}
                    `}
                    style={{
                      transformOrigin: 'center center',
                      mixBlendMode: 'screen',
                      filter: 'blur(8px) brightness(1.5)',
                      maskImage: 'linear-gradient(to bottom, black 75%, transparent 98%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 98%)',
                    }}
                  />
                </>
              )}

              {/* Glow behind character on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none z-[0]">
                <div className={`w-full h-full bg-gradient-to-t ${characterGlowMap[glowColorHover] || characterGlowMap.white} to-transparent blur-xl provider-glow-pulse`}></div>
              </div>
            </div>

            {/* ===== PROVIDER LOGO - RIGHT SIDE ===== */}
            <div 
              className="absolute right-0 z-[4] flex items-center justify-center"
              style={{
                top: logoTop,
                left: logoLeft,
              }}
            >
              <img
                src={logoImg}
                alt={logoAlt}
                className="h-auto object-contain provider-text-shine"
                style={{
                  width: logoWidth,
                  filter: 'brightness(1.1) drop-shadow(0 0 8px rgba(255,255,255,0.1))',
                }}
              />
            </div>

            {/* ===== PLAY NOW BUTTON - RIGHT SIDE ===== */}
            <div className="absolute bottom-3 left-[46%] right-0 z-[4] flex justify-center">
              <button className="
                relative overflow-hidden
                w-[140px] py-[10px] px-5
                bg-gradient-to-b from-[#e0e0e0] via-[#c0c0c0] to-[#909090]
                text-black font-black text-[14px] tracking-[0.2em]
                rounded-[4px]
                border-t border-white/40
                shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.5)]
                transition-all duration-300
                group-hover:from-white group-hover:via-[#d0d0d0] group-hover:to-[#a0a0a0]
                group-hover:shadow-[0_4px_20px_rgba(192,192,192,0.3),inset_0_1px_0_rgba(255,255,255,0.6)]
                group-hover:scale-[1.05]
                active:scale-95
                provider-btn-chrome
              ">
                <span className="absolute -left-full top-0 w-[60%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] provider-btn-shine pointer-events-none"></span>
                PLAY NOW
              </button>
            </div>

            {/* Gleam highlight - top edge */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Inner subtle border highlight on hover */}
            <div className="absolute inset-0 rounded-[6.5px] border border-white/0 group-hover:border-white/[0.08] transition-all duration-500 pointer-events-none"></div>

            {/* Bottom reflection line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#808080]/15 to-transparent"></div>
          </div>
        </div>

        {/* ===== BADGE (HOT / NEW / TOP) ===== */}
        {badge && badge.type === 'hot' && (
          <div 
            className="absolute top-[-28px] left-[48%] -translate-x-1/2 z-30 flex items-center justify-center pointer-events-none"
            style={{ 
              transform: `translateX(-50%) translateZ(40px) ${isHovered ? 'scale(1.2) translateY(-4px)' : 'scale(1)'}`,
              filter: isHovered ? 'drop-shadow(0 8px 16px rgba(255,100,0,0.4))' : 'drop-shadow(0 4px 8px rgba(255,100,0,0.3))',
              transition: 'transform 0.5s ease, filter 0.5s ease'
            }}
          >
            <div className="relative">
              <span className="text-[62px] leading-none provider-fire-icon">🔥</span>
              <span 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] text-[9px] font-black text-white tracking-[0.2em] uppercase z-[1]"
                style={{ textShadow: '0 0 6px rgba(255,100,0,0.9), 0 0 14px rgba(255,50,0,0.6), 0 1px 3px rgba(0,0,0,1)' }}
              >
                HOT
              </span>
            </div>
          </div>
        )}

        {badge && badge.type === 'new' && (
          <div 
            className="absolute top-[-10px] right-[-10px] z-30 pointer-events-none"
            style={{ 
              transform: `translateZ(40px) rotate(3deg) ${isHovered ? 'scale(1.15) translateY(-3px)' : 'scale(1)'}`,
              filter: isHovered ? 'drop-shadow(0 6px 12px rgba(200,0,0,0.5))' : 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))',
              transition: 'transform 0.4s ease, filter 0.4s ease'
            }}
          >
            <div className="relative">
              <div 
                className="relative px-4 py-[6px] font-black text-white text-[13px] tracking-[0.15em] uppercase"
                style={{
                  background: 'linear-gradient(135deg, #e53935 0%, #c62828 50%, #b71c1c 100%)',
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)',
                  borderRadius: '3px 3px 0 0',
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                }}
              >
                NEW
              </div>
              <div 
                className="absolute top-0 left-[-4px] w-[4px] h-[8px]"
                style={{
                  background: 'linear-gradient(135deg, #7f0000, #9a0000)',
                  clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)',
                }}
              />
            </div>
          </div>
        )}

        {/* Outer subtle glow on hover */}
        <div className={`absolute -inset-2 rounded-xl bg-gradient-to-br from-white/0 to-[#c0c0c0]/0 ${outerGlowHoverMap[glowColorHover] || outerGlowHoverMap.white} group-hover:to-[#808080]/[0.02] blur-xl transition-all duration-500 -z-10`}></div>
      </div>
    </div>
  )
}
