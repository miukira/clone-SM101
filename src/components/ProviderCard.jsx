import { useState } from 'react'
import { publicAssetUrl } from '../utils/publicAssetUrl'

/**
 * Kartu provider — satu gambar penuh (API: image → logoImg & characterImg sama).
 *
 * Props tetap kompatibel: logoImg, characterImg, logoAlt, badge, overlayImg, onPlayClick, provider_id, dll.
 */
export default function ProviderCard({
  characterImg,
  characterImgAlt = 'Provider',
  logoImg,
  logoAlt = 'Provider',
  glowColor = 'white',
  glowColorHover = 'white',
  badge = null,
  overlayImg = null,
  animationPrefix = 'provider',
  onPlayClick = null,
  provider_id = null,
}) {
  const [isHovered, setIsHovered] = useState(false)

  const heroSrc = logoImg ?? characterImg ?? null
  const alt = logoAlt || characterImgAlt

  const glowColorMap = {
    white: 'from-white/[0.06]',
    orange: 'from-orange-500/[0.08]',
    yellow: 'from-yellow-600/[0.08]',
    red: 'from-red-600/[0.08]',
    cyan: 'from-cyan-400/[0.08]',
    purple: 'from-purple-500/[0.08]',
  }

  const glowColorHoverMap = {
    white: 'group-hover:from-white/[0.12]',
    orange: 'group-hover:from-orange-400/[0.14]',
    yellow: 'group-hover:from-yellow-500/[0.14]',
    red: 'group-hover:from-red-500/[0.14]',
    cyan: 'group-hover:from-cyan-400/[0.14]',
    purple: 'group-hover:from-purple-400/[0.14]',
  }

  const outerGlowHoverMap = {
    white: 'group-hover:from-white/[0.03]',
    orange: 'group-hover:from-orange-500/[0.03]',
    yellow: 'group-hover:from-yellow-500/[0.03]',
    red: 'group-hover:from-red-500/[0.03]',
    cyan: 'group-hover:from-cyan-400/[0.03]',
    purple: 'group-hover:from-purple-500/[0.03]',
  }

  return (
    <div className="flex w-full min-w-0 justify-center" style={{ perspective: '800px' }}>
      <div
        className="provider-card group relative w-full max-w-[290px] aspect-[290/180] min-h-[110px] cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-lg p-[1.5px] bg-gradient-to-br from-[#e8e8e8] via-[#808080] to-[#404040] group-hover:from-[#ffffff] group-hover:via-[#c0c0c0] group-hover:to-[#606060] transition-all duration-500">
          <div className="relative w-full h-full rounded-[6.5px] bg-black overflow-hidden">
            {/* Grid halus */}
            <div
              className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(192,192,192,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(192,192,192,0.5) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            <div
              className={`absolute inset-0 z-[0] bg-gradient-radial ${glowColorMap[glowColor] || glowColorMap.white} to-transparent blur-2xl ${glowColorHoverMap[glowColorHover] || glowColorHoverMap.white} transition-all duration-700`}
            />

            {/* Satu gambar full */}
            {heroSrc != null ? (
              <img
                src={publicAssetUrl(heroSrc)}
                alt={alt}
                className={`absolute inset-0 z-[2] h-full w-full object-cover object-center transition-transform duration-500 ease-out ${
                  isHovered ? 'scale-[1.04]' : 'scale-100'
                }`}
              />
            ) : (
              <div className="absolute inset-0 z-[2] flex items-center justify-center text-4xl opacity-25">🎰</div>
            )}

            {/* Overlay efek (mis. petir) — opsional */}
            {overlayImg && heroSrc != null && (
              <img
                src={publicAssetUrl(overlayImg)}
                alt=""
                className={`pointer-events-none absolute inset-0 z-[3] h-full w-full object-cover object-center mix-blend-screen opacity-90 ${
                  isHovered ? `${animationPrefix}-overlay-active` : `${animationPrefix}-overlay-idle`
                }`}
              />
            )}

            {/* Gelap ke bawah agar tombol terbaca */}
            <div className="absolute inset-0 z-[4] bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            {/* Shine */}
            <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
              <div className="absolute -left-[120%] top-0 h-full w-[60%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent provider-shine-sweep" />
            </div>
            <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute -left-full top-0 h-full w-[50%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent provider-shimmer-chrome" />
            </div>

            {/* PLAY NOW */}
            <div className="absolute inset-x-0 bottom-0 z-[6] flex justify-center px-2 pb-2 pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onPlayClick) onPlayClick({ provider_id, characterImg, logoImg, logoAlt })
                }}
                className="provider-btn-chrome relative w-[min(100%,140px)] overflow-hidden rounded-[4px] border-t border-white/40 bg-gradient-to-b from-[#e0e0e0] via-[#c0c0c0] to-[#909090] px-3 py-2 text-center text-[11px] font-black tracking-[0.18em] text-black shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 active:scale-95 touch-manipulation sm:py-[9px] sm:text-[12px] md:text-[13px] lg:py-[10px] lg:text-[14px] group-hover:scale-[1.03] group-hover:from-white group-hover:via-[#d0d0d0] group-hover:to-[#a0a0a0] group-hover:shadow-[0_4px_20px_rgba(192,192,192,0.25),inset_0_1px_0_rgba(255,255,255,0.6)]"
              >
                <span className="pointer-events-none absolute -left-full top-0 h-full w-[60%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent provider-btn-shine" />
                PLAY NOW
              </button>
            </div>

            <div className="absolute top-0 left-0 right-0 z-[6] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            <div className="pointer-events-none absolute inset-0 z-[6] rounded-[6.5px] border border-white/0 transition-all duration-500 group-hover:border-white/[0.08]" />
            <div className="absolute bottom-0 left-0 right-0 z-[6] h-[1px] bg-gradient-to-r from-transparent via-[#808080]/15 to-transparent pointer-events-none" />
          </div>
        </div>

        {badge && badge.type === 'hot' && (
          <div
            className="absolute top-[-28px] left-1/2 z-30 flex -translate-x-1/2 items-center justify-center pointer-events-none"
            style={{
              transform: `translateX(-50%) translateZ(40px) ${isHovered ? 'scale(1.2) translateY(-4px)' : 'scale(1)'}`,
              filter: isHovered
                ? 'drop-shadow(0 8px 16px rgba(255,100,0,0.4))'
                : 'drop-shadow(0 4px 8px rgba(255,100,0,0.3))',
              transition: 'transform 0.5s ease, filter 0.5s ease',
            }}
          >
            <div className="relative">
              <span className="text-[62px] leading-none provider-fire-icon">🔥</span>
              <span
                className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-[30%] text-[9px] font-black tracking-[0.2em] text-white uppercase"
                style={{
                  textShadow:
                    '0 0 6px rgba(255,100,0,0.9), 0 0 14px rgba(255,50,0,0.6), 0 1px 3px rgba(0,0,0,1)',
                }}
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
              transition: 'transform 0.4s ease, filter 0.4s ease',
            }}
          >
            <div className="relative">
              <div
                className="relative px-4 py-[6px] text-[13px] font-black tracking-[0.15em] text-white uppercase"
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
                className="absolute top-0 left-[-4px] h-[8px] w-[4px]"
                style={{
                  background: 'linear-gradient(135deg, #7f0000, #9a0000)',
                  clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)',
                }}
              />
            </div>
          </div>
        )}

        <div
          className={`absolute -inset-2 -z-10 rounded-xl bg-gradient-to-br from-white/0 to-[#c0c0c0]/0 blur-xl transition-all duration-500 ${outerGlowHoverMap[glowColorHover] || outerGlowHoverMap.white} group-hover:to-[#808080]/[0.02]`}
        />
      </div>
    </div>
  )
}
