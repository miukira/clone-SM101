// Black & Silver Chrome Icons - The Sleek Minimalist
// Filled design with metallic chrome effect
// Colors: Deep Black (#000000) + Silver Chrome Gradient

// ============ CATEGORY ICONS - CHROME THEME ============

export const SlotsIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeMetalSlots" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5F5F5"/>
        <stop offset="25%" stopColor="#E0E0E0"/>
        <stop offset="50%" stopColor="#A8A8A8"/>
        <stop offset="75%" stopColor="#C0C0C0"/>
        <stop offset="100%" stopColor="#909090"/>
      </linearGradient>
      <linearGradient id="chromeShineSlots" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF"/>
        <stop offset="40%" stopColor="#D0D0D0"/>
        <stop offset="60%" stopColor="#A0A0A0"/>
        <stop offset="100%" stopColor="#707070"/>
      </linearGradient>
      <linearGradient id="chromeDarkSlots" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3a3a3a"/>
        <stop offset="100%" stopColor="#1a1a1a"/>
      </linearGradient>
      <filter id="chromeShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.5"/>
      </filter>
    </defs>
    {/* Machine body */}
    <rect x="8" y="6" width="32" height="36" rx="4" fill={active ? "url(#chromeMetalSlots)" : "#404040"} filter={active ? "url(#chromeShadow)" : ""}/>
    {/* Top shine */}
    {active && <rect x="10" y="8" width="28" height="4" rx="2" fill="url(#chromeShineSlots)" opacity="0.6"/>}
    {/* Screen area */}
    <rect x="12" y="14" width="24" height="16" rx="2" fill={active ? "#0a0a0a" : "#252525"}/>
    {/* Reels */}
    <rect x="14" y="16" width="6" height="12" rx="1" fill={active ? "#1a1a1a" : "#303030"}/>
    <rect x="21" y="16" width="6" height="12" rx="1" fill={active ? "#1a1a1a" : "#303030"}/>
    <rect x="28" y="16" width="6" height="12" rx="1" fill={active ? "#1a1a1a" : "#303030"}/>
    {/* 7s */}
    <text x="17" y="24" fontSize="8" fill={active ? "#E0E0E0" : "#505050"} fontWeight="bold" textAnchor="middle">7</text>
    <text x="24" y="24" fontSize="8" fill={active ? "#E0E0E0" : "#505050"} fontWeight="bold" textAnchor="middle">7</text>
    <text x="31" y="24" fontSize="8" fill={active ? "#E0E0E0" : "#505050"} fontWeight="bold" textAnchor="middle">7</text>
    {/* Button */}
    <circle cx="24" cy="36" r="4" fill={active ? "url(#chromeShineSlots)" : "#505050"}/>
    {/* Lever */}
    <rect x="40" y="14" width="4" height="14" rx="2" fill={active ? "url(#chromeMetalSlots)" : "#404040"}/>
    <circle cx="42" cy="12" r="3.5" fill={active ? "url(#chromeShineSlots)" : "#505050"}/>
  </svg>
);

export const SportsIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeMetalSports" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5F5F5"/>
        <stop offset="25%" stopColor="#E0E0E0"/>
        <stop offset="50%" stopColor="#A8A8A8"/>
        <stop offset="75%" stopColor="#C0C0C0"/>
        <stop offset="100%" stopColor="#909090"/>
      </linearGradient>
      <radialGradient id="chromeBallSports" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF"/>
        <stop offset="30%" stopColor="#E0E0E0"/>
        <stop offset="70%" stopColor="#A0A0A0"/>
        <stop offset="100%" stopColor="#606060"/>
      </radialGradient>
      <filter id="chromeShadowSports" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Ball */}
    <circle cx="24" cy="24" r="18" fill={active ? "url(#chromeBallSports)" : "#353535"} filter={active ? "url(#chromeShadowSports)" : ""}/>
    {/* Pentagon patterns */}
    <path d="M24 8 L30 16 L27 24 L21 24 L18 16 Z" fill={active ? "#404040" : "#252525"} stroke={active ? "#606060" : "#404040"} strokeWidth="0.5"/>
    <path d="M10 22 L18 16 L21 24 L15 32 L8 28 Z" fill={active ? "#404040" : "#252525"} stroke={active ? "#606060" : "#404040"} strokeWidth="0.5"/>
    <path d="M38 22 L40 28 L33 32 L27 24 L30 16 Z" fill={active ? "#404040" : "#252525"} stroke={active ? "#606060" : "#404040"} strokeWidth="0.5"/>
    <path d="M15 32 L21 24 L27 24 L33 32 L28 40 L20 40 Z" fill={active ? "#404040" : "#252525"} stroke={active ? "#606060" : "#404040"} strokeWidth="0.5"/>
    {/* Highlight shine */}
    {active && <ellipse cx="18" cy="16" rx="6" ry="4" fill="white" opacity="0.3"/>}
  </svg>
);

export const CasinoIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeMetalCasino1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F0F0F0"/>
        <stop offset="30%" stopColor="#D0D0D0"/>
        <stop offset="60%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#707070"/>
      </linearGradient>
      <linearGradient id="chromeMetalCasino2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8E8E8"/>
        <stop offset="40%" stopColor="#B8B8B8"/>
        <stop offset="70%" stopColor="#888888"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <filter id="chromeShadowCasino" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/>
      </filter>
    </defs>
    {/* Dice 1 */}
    <g transform="rotate(-12 15 27)">
      <rect x="6" y="18" width="18" height="18" rx="3" fill={active ? "url(#chromeMetalCasino1)" : "#404040"} filter={active ? "url(#chromeShadowCasino)" : ""}/>
      {active && <rect x="7" y="19" width="16" height="3" rx="1" fill="white" opacity="0.4"/>}
      <circle cx="11" cy="23" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
      <circle cx="19" cy="23" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
      <circle cx="15" cy="27" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
      <circle cx="11" cy="31" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
      <circle cx="19" cy="31" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
    </g>
    {/* Dice 2 */}
    <g transform="rotate(10 33 21)">
      <rect x="24" y="12" width="18" height="18" rx="3" fill={active ? "url(#chromeMetalCasino2)" : "#353535"} filter={active ? "url(#chromeShadowCasino)" : ""}/>
      {active && <rect x="25" y="13" width="16" height="3" rx="1" fill="white" opacity="0.4"/>}
      <circle cx="29" cy="17" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
      <circle cx="37" cy="17" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
      <circle cx="33" cy="21" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
      <circle cx="29" cy="25" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
      <circle cx="37" cy="25" r="1.8" fill={active ? "#1a1a1a" : "#252525"}/>
    </g>
  </svg>
);

export const LotteryIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="chromeBall1" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF"/>
        <stop offset="20%" stopColor="#E8E8E8"/>
        <stop offset="50%" stopColor="#B0B0B0"/>
        <stop offset="100%" stopColor="#606060"/>
      </radialGradient>
      <radialGradient id="chromeBall2" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#F0F0F0"/>
        <stop offset="30%" stopColor="#D0D0D0"/>
        <stop offset="60%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#505050"/>
      </radialGradient>
      <radialGradient id="chromeBall3" cx="40%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#FFFFFF"/>
        <stop offset="25%" stopColor="#E0E0E0"/>
        <stop offset="55%" stopColor="#A8A8A8"/>
        <stop offset="100%" stopColor="#585858"/>
      </radialGradient>
      <filter id="chromeShadowLottery" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Ball 1 */}
    <circle cx="14" cy="16" r="10" fill={active ? "url(#chromeBall1)" : "#404040"} filter={active ? "url(#chromeShadowLottery)" : ""}/>
    <text x="14" y="20" fontSize="10" fill={active ? "#1a1a1a" : "#606060"} fontWeight="bold" textAnchor="middle">8</text>
    {/* Ball 2 */}
    <circle cx="34" cy="16" r="10" fill={active ? "url(#chromeBall2)" : "#353535"} filter={active ? "url(#chromeShadowLottery)" : ""}/>
    <text x="34" y="20" fontSize="9" fill={active ? "#1a1a1a" : "#606060"} fontWeight="bold" textAnchor="middle">21</text>
    {/* Ball 3 */}
    <circle cx="24" cy="34" r="10" fill={active ? "url(#chromeBall3)" : "#3a3a3a"} filter={active ? "url(#chromeShadowLottery)" : ""}/>
    <text x="24" y="38" fontSize="10" fill={active ? "#1a1a1a" : "#606060"} fontWeight="bold" textAnchor="middle">7</text>
    {/* Sparkles */}
    {active && (
      <>
        <path d="M5 28 L6.5 31 L5 34 L3.5 31 Z" fill="#C0C0C0"/>
        <path d="M43 28 L44.5 31 L43 34 L41.5 31 Z" fill="#C0C0C0"/>
        <circle cx="8" cy="8" r="1.5" fill="#E0E0E0"/>
        <circle cx="40" cy="42" r="1" fill="#B0B0B0"/>
      </>
    )}
  </svg>
);

export const FishingIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeFishBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8E8E8"/>
        <stop offset="30%" stopColor="#C8C8C8"/>
        <stop offset="60%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <linearGradient id="chromeFishTail" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A0A0A0"/>
        <stop offset="100%" stopColor="#707070"/>
      </linearGradient>
      <linearGradient id="chromeRod" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D0D0D0"/>
        <stop offset="50%" stopColor="#A0A0A0"/>
        <stop offset="100%" stopColor="#707070"/>
      </linearGradient>
      <filter id="chromeShadowFish" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Water waves */}
    <path d="M2 40 Q10 36 18 40 Q26 44 34 40 Q42 36 48 40" stroke={active ? "#505050" : "#303030"} strokeWidth="2" fill="none"/>
    <path d="M0 44 Q8 40 16 44 Q24 48 32 44 Q40 40 48 44" stroke={active ? "#404040" : "#252525"} strokeWidth="1.5" fill="none"/>
    {/* Fish body */}
    <ellipse cx="26" cy="26" rx="14" ry="8" fill={active ? "url(#chromeFishBody)" : "#404040"} filter={active ? "url(#chromeShadowFish)" : ""}/>
    {/* Fish tail */}
    <path d="M40 26 L50 18 L50 34 Z" fill={active ? "url(#chromeFishTail)" : "#353535"}/>
    {/* Fish scales pattern */}
    {active && (
      <>
        <ellipse cx="22" cy="24" rx="3" ry="2" fill="none" stroke="#808080" strokeWidth="0.5" opacity="0.5"/>
        <ellipse cx="28" cy="24" rx="3" ry="2" fill="none" stroke="#808080" strokeWidth="0.5" opacity="0.5"/>
        <ellipse cx="25" cy="28" rx="3" ry="2" fill="none" stroke="#808080" strokeWidth="0.5" opacity="0.5"/>
      </>
    )}
    {/* Fish eye */}
    <circle cx="16" cy="24" r="3.5" fill={active ? "#1a1a1a" : "#252525"}/>
    <circle cx="15" cy="23" r="1.5" fill={active ? "#E0E0E0" : "#404040"}/>
    {/* Fishing rod */}
    <rect x="5" y="2" width="5" height="8" rx="1" fill={active ? "url(#chromeRod)" : "#404040"}/>
    <path d="M7.5 10 L7.5 20 L14 26" stroke={active ? "#C0C0C0" : "#505050"} strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Hook */}
    <circle cx="14" cy="26" r="2" fill={active ? "#E0E0E0" : "#505050"}/>
  </svg>
);

export const ArcadeIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeControllerBody" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E0E0E0"/>
        <stop offset="30%" stopColor="#C0C0C0"/>
        <stop offset="70%" stopColor="#808080"/>
        <stop offset="100%" stopColor="#505050"/>
      </linearGradient>
      <linearGradient id="chromeButton" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F0F0F0"/>
        <stop offset="50%" stopColor="#B0B0B0"/>
        <stop offset="100%" stopColor="#707070"/>
      </linearGradient>
      <filter id="chromeShadowArcade" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/>
      </filter>
    </defs>
    {/* Controller body */}
    <rect x="4" y="14" width="40" height="22" rx="11" fill={active ? "url(#chromeControllerBody)" : "#404040"} filter={active ? "url(#chromeShadowArcade)" : ""}/>
    {/* Shine */}
    {active && <rect x="8" y="16" width="32" height="4" rx="2" fill="white" opacity="0.3"/>}
    {/* D-pad */}
    <rect x="11" y="21" width="3" height="10" rx="0.5" fill={active ? "#1a1a1a" : "#252525"}/>
    <rect x="8" y="24" width="10" height="3" rx="0.5" fill={active ? "#1a1a1a" : "#252525"}/>
    {/* Buttons with chrome effect */}
    <circle cx="33" cy="21" r="4" fill={active ? "url(#chromeButton)" : "#353535"}/>
    <circle cx="39" cy="25" r="4" fill={active ? "url(#chromeButton)" : "#303030"}/>
    <circle cx="33" cy="29" r="4" fill={active ? "url(#chromeButton)" : "#383838"}/>
    <circle cx="27" cy="25" r="4" fill={active ? "url(#chromeButton)" : "#3a3a3a"}/>
    {/* Button highlights */}
    {active && (
      <>
        <circle cx="32" cy="20" r="1.5" fill="white" opacity="0.5"/>
        <circle cx="38" cy="24" r="1.5" fill="white" opacity="0.5"/>
        <circle cx="32" cy="28" r="1.5" fill="white" opacity="0.5"/>
        <circle cx="26" cy="24" r="1.5" fill="white" opacity="0.5"/>
      </>
    )}
    {/* Center details */}
    <rect x="20" y="23" width="3" height="2" rx="0.5" fill={active ? "#606060" : "#303030"}/>
    <rect x="20" y="27" width="3" height="2" rx="0.5" fill={active ? "#606060" : "#303030"}/>
  </svg>
);

export const PokerIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeCardFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5F5F5"/>
        <stop offset="30%" stopColor="#E0E0E0"/>
        <stop offset="70%" stopColor="#B0B0B0"/>
        <stop offset="100%" stopColor="#808080"/>
      </linearGradient>
      <linearGradient id="chromeCardBack" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#606060"/>
        <stop offset="50%" stopColor="#404040"/>
        <stop offset="100%" stopColor="#252525"/>
      </linearGradient>
      <linearGradient id="chromeChip" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E0E0E0"/>
        <stop offset="50%" stopColor="#A0A0A0"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <filter id="chromeShadowPoker" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Card back */}
    <g transform="rotate(-10 18 21)">
      <rect x="8" y="6" width="20" height="30" rx="2" fill={active ? "url(#chromeCardBack)" : "#353535"} filter={active ? "url(#chromeShadowPoker)" : ""}/>
      {/* Pattern on back */}
      {active && (
        <g opacity="0.3">
          <line x1="10" y1="10" x2="26" y2="10" stroke="#808080" strokeWidth="0.5"/>
          <line x1="10" y1="14" x2="26" y2="14" stroke="#808080" strokeWidth="0.5"/>
          <line x1="10" y1="18" x2="26" y2="18" stroke="#808080" strokeWidth="0.5"/>
          <line x1="10" y1="22" x2="26" y2="22" stroke="#808080" strokeWidth="0.5"/>
          <line x1="10" y1="26" x2="26" y2="26" stroke="#808080" strokeWidth="0.5"/>
          <line x1="10" y1="30" x2="26" y2="30" stroke="#808080" strokeWidth="0.5"/>
        </g>
      )}
    </g>
    {/* Card front */}
    <rect x="18" y="8" width="20" height="30" rx="2" fill={active ? "url(#chromeCardFront)" : "#404040"} filter={active ? "url(#chromeShadowPoker)" : ""}/>
    {/* Shine on card */}
    {active && <rect x="19" y="9" width="18" height="4" rx="1" fill="white" opacity="0.4"/>}
    {/* Spade symbol */}
    <path d="M28 18 C28 18 24 22 24 25 C24 27 25.5 28 28 26 L28 30 L26 30 L30 30 L28 30 L28 26 C30.5 28 32 27 32 25 C32 22 28 18 28 18" fill={active ? "#1a1a1a" : "#505050"}/>
    {/* A corners */}
    <text x="21" y="16" fontSize="7" fill={active ? "#1a1a1a" : "#505050"} fontWeight="bold">A</text>
    <text x="35" y="36" fontSize="7" fill={active ? "#1a1a1a" : "#505050"} fontWeight="bold" transform="rotate(180 35 33)">A</text>
    {/* Chips stack */}
    <ellipse cx="40" cy="44" rx="6" ry="2.5" fill={active ? "#505050" : "#303030"}/>
    <ellipse cx="40" cy="42" rx="6" ry="2.5" fill={active ? "url(#chromeChip)" : "#353535"}/>
    <ellipse cx="40" cy="40" rx="6" ry="2.5" fill={active ? "url(#chromeChip)" : "#404040"}/>
    {active && <ellipse cx="39" cy="39" rx="2" ry="1" fill="white" opacity="0.4"/>}
  </svg>
);

export const CockFightingIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeCockBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0E0E0"/>
        <stop offset="30%" stopColor="#C0C0C0"/>
        <stop offset="60%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <linearGradient id="chromeCockHead" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F0F0F0"/>
        <stop offset="40%" stopColor="#D0D0D0"/>
        <stop offset="100%" stopColor="#808080"/>
      </linearGradient>
      <linearGradient id="chromeComb" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#909090"/>
        <stop offset="50%" stopColor="#C0C0C0"/>
        <stop offset="100%" stopColor="#E0E0E0"/>
      </linearGradient>
      <linearGradient id="chromeFeather" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B0B0B0"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <filter id="chromeShadowCock" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Body */}
    <ellipse cx="24" cy="28" rx="12" ry="9" fill={active ? "url(#chromeCockBody)" : "#404040"} filter={active ? "url(#chromeShadowCock)" : ""}/>
    {/* Body shine */}
    {active && <ellipse cx="20" cy="24" rx="6" ry="3" fill="white" opacity="0.2"/>}
    {/* Head */}
    <circle cx="32" cy="18" r="7" fill={active ? "url(#chromeCockHead)" : "#353535"} filter={active ? "url(#chromeShadowCock)" : ""}/>
    {/* Head shine */}
    {active && <circle cx="30" cy="15" r="3" fill="white" opacity="0.3"/>}
    {/* Comb */}
    <path d="M30 11 L32 6 L34 11 L36 7 L37 13 L29 13 Z" fill={active ? "url(#chromeComb)" : "#505050"}/>
    {/* Beak */}
    <path d="M39 18 L45 15 L39 21 Z" fill={active ? "#D0D0D0" : "#505050"}/>
    {/* Eye */}
    <circle cx="34" cy="16" r="2.5" fill={active ? "#0a0a0a" : "#252525"}/>
    <circle cx="33.5" cy="15.5" r="1" fill={active ? "#E0E0E0" : "#404040"}/>
    {/* Tail feathers */}
    <path d="M12 22 Q5 15 8 8" stroke={active ? "url(#chromeFeather)" : "#505050"} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M14 24 Q5 19 6 12" stroke={active ? "url(#chromeFeather)" : "#454545"} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M14 28 Q3 25 4 18" stroke={active ? "url(#chromeFeather)" : "#404040"} strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Legs */}
    <path d="M20 37 L18 44 M22 44 L18 44 L14 44" stroke={active ? "#C0C0C0" : "#505050"} strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M28 37 L30 44 M34 44 L30 44 L26 44" stroke={active ? "#C0C0C0" : "#505050"} strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

export const PromoIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeGiftBox" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E0E0E0"/>
        <stop offset="30%" stopColor="#C0C0C0"/>
        <stop offset="70%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <linearGradient id="chromeRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5F5F5"/>
        <stop offset="50%" stopColor="#D0D0D0"/>
        <stop offset="100%" stopColor="#A0A0A0"/>
      </linearGradient>
      <filter id="chromeShadowPromo" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Gift box */}
    <rect x="10" y="20" width="28" height="22" rx="2" fill={active ? "url(#chromeGiftBox)" : "#404040"} filter={active ? "url(#chromeShadowPromo)" : ""}/>
    {/* Ribbon vertical */}
    <rect x="22" y="20" width="4" height="22" fill={active ? "url(#chromeRibbon)" : "#505050"}/>
    {/* Ribbon horizontal */}
    <rect x="10" y="28" width="28" height="4" fill={active ? "url(#chromeRibbon)" : "#505050"}/>
    {/* Lid */}
    <rect x="8" y="14" width="32" height="8" rx="2" fill={active ? "url(#chromeGiftBox)" : "#353535"} filter={active ? "url(#chromeShadowPromo)" : ""}/>
    {/* Lid shine */}
    {active && <rect x="10" y="15" width="28" height="2" rx="1" fill="white" opacity="0.4"/>}
    <rect x="22" y="14" width="4" height="8" fill={active ? "url(#chromeRibbon)" : "#505050"}/>
    {/* Bow */}
    <ellipse cx="17" cy="12" rx="5" ry="3.5" fill={active ? "url(#chromeRibbon)" : "#454545"}/>
    <ellipse cx="31" cy="12" rx="5" ry="3.5" fill={active ? "url(#chromeRibbon)" : "#454545"}/>
    <circle cx="24" cy="12" r="3" fill={active ? "#909090" : "#404040"}/>
    {active && <circle cx="23" cy="11" r="1" fill="white" opacity="0.5"/>}
    {/* Sparkles */}
    {active && (
      <>
        <path d="M6 8 L7.5 11 L6 14 L4.5 11 Z" fill="#C0C0C0"/>
        <path d="M42 8 L43.5 11 L42 14 L40.5 11 Z" fill="#C0C0C0"/>
      </>
    )}
  </svg>
);

export const ReferralIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromePerson" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8E8E8"/>
        <stop offset="40%" stopColor="#C0C0C0"/>
        <stop offset="100%" stopColor="#808080"/>
      </linearGradient>
      <linearGradient id="chromePersonSmall" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D0D0D0"/>
        <stop offset="50%" stopColor="#A0A0A0"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <filter id="chromeShadowRef" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.3"/>
      </filter>
    </defs>
    {/* Center person - larger */}
    <circle cx="24" cy="14" r="8" fill={active ? "url(#chromePerson)" : "#404040"} filter={active ? "url(#chromeShadowRef)" : ""}/>
    {active && <circle cx="22" cy="12" r="3" fill="white" opacity="0.3"/>}
    <path d="M12 38 Q12 28 24 28 Q36 28 36 38" fill={active ? "url(#chromePerson)" : "#404040"} filter={active ? "url(#chromeShadowRef)" : ""}/>
    {/* Left person */}
    <circle cx="8" cy="24" r="5" fill={active ? "url(#chromePersonSmall)" : "#353535"}/>
    {active && <circle cx="7" cy="23" r="1.5" fill="white" opacity="0.3"/>}
    <path d="M2 40 Q2 34 8 34 Q14 34 14 40" fill={active ? "url(#chromePersonSmall)" : "#353535"}/>
    {/* Right person */}
    <circle cx="40" cy="24" r="5" fill={active ? "url(#chromePersonSmall)" : "#353535"}/>
    {active && <circle cx="39" cy="23" r="1.5" fill="white" opacity="0.3"/>}
    <path d="M34 40 Q34 34 40 34 Q46 34 46 40" fill={active ? "url(#chromePersonSmall)" : "#353535"}/>
    {/* Connection lines */}
    <path d="M16 18 L11 22" stroke={active ? "#A0A0A0" : "#505050"} strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 18 L37 22" stroke={active ? "#A0A0A0" : "#505050"} strokeWidth="2" strokeLinecap="round"/>
    {/* Plus signs */}
    {active && (
      <>
        <path d="M8 44 L8 48 M6 46 L10 46" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 44 L40 48 M38 46 L42 46" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round"/>
      </>
    )}
  </svg>
);

// ============ MENU ICONS - CHROME THEME ============

export const HomeIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeHouse" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8E8E8"/>
        <stop offset="30%" stopColor="#C8C8C8"/>
        <stop offset="70%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <linearGradient id="chromeRoof" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#808080"/>
        <stop offset="50%" stopColor="#B0B0B0"/>
        <stop offset="100%" stopColor="#D0D0D0"/>
      </linearGradient>
      <filter id="chromeShadowHome" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* House body */}
    <path d="M12 24 L12 40 L36 40 L36 24" fill={active ? "url(#chromeHouse)" : "#404040"} filter={active ? "url(#chromeShadowHome)" : ""}/>
    {/* Roof */}
    <path d="M24 6 L6 24 L12 24 L24 12 L36 24 L42 24 Z" fill={active ? "url(#chromeRoof)" : "#353535"} filter={active ? "url(#chromeShadowHome)" : ""}/>
    {/* Roof shine */}
    {active && <path d="M24 8 L14 18 L16 18 L24 10 L32 18 L34 18 Z" fill="white" opacity="0.3"/>}
    {/* Door */}
    <rect x="20" y="28" width="8" height="12" rx="1" fill={active ? "#1a1a1a" : "#252525"}/>
    <circle cx="26" cy="34" r="1" fill={active ? "#C0C0C0" : "#404040"}/>
    {/* Windows */}
    <rect x="14" y="28" width="5" height="5" rx="0.5" fill={active ? "#404040" : "#303030"}/>
    {active && <rect x="14.5" y="28.5" width="2" height="2" fill="#606060" opacity="0.5"/>}
    <rect x="29" y="28" width="5" height="5" rx="0.5" fill={active ? "#404040" : "#303030"}/>
    {active && <rect x="29.5" y="28.5" width="2" height="2" fill="#606060" opacity="0.5"/>}
    {/* Chimney */}
    <rect x="32" y="10" width="5" height="10" fill={active ? "url(#chromeHouse)" : "#3a3a3a"}/>
  </svg>
);

export const PromoMenuIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeMegaphone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8E8E8"/>
        <stop offset="30%" stopColor="#C8C8C8"/>
        <stop offset="70%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <filter id="chromeShadowMega" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Megaphone body */}
    <path d="M10 20 L10 30 L16 30 L16 20 Z" fill={active ? "url(#chromeMegaphone)" : "#404040"}/>
    <path d="M16 18 L38 8 L38 42 L16 34 Z" fill={active ? "url(#chromeMegaphone)" : "#404040"} filter={active ? "url(#chromeShadowMega)" : ""}/>
    {/* Shine */}
    {active && <path d="M17 19 L36 10 L36 14 L17 22 Z" fill="white" opacity="0.3"/>}
    {/* Handle */}
    <rect x="4" y="22" width="8" height="6" rx="2" fill={active ? "#909090" : "#353535"}/>
    {/* Sound waves */}
    <path d="M40 18 Q46 25 40 32" stroke={active ? "#A0A0A0" : "#505050"} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M43 14 Q50 25 43 36" stroke={active ? "#808080" : "#404040"} strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

export const DepositIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeWallet" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8E8E8"/>
        <stop offset="30%" stopColor="#C8C8C8"/>
        <stop offset="70%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <linearGradient id="chromeArrow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F0F0F0"/>
        <stop offset="100%" stopColor="#A0A0A0"/>
      </linearGradient>
      <filter id="chromeShadowWallet" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Wallet */}
    <rect x="6" y="14" width="32" height="26" rx="3" fill={active ? "url(#chromeWallet)" : "#404040"} filter={active ? "url(#chromeShadowWallet)" : ""}/>
    {/* Shine */}
    {active && <rect x="8" y="16" width="28" height="4" rx="1" fill="white" opacity="0.3"/>}
    {/* Flap */}
    <path d="M6 20 L38 20" stroke={active ? "#707070" : "#353535"} strokeWidth="2"/>
    {/* Card slot */}
    <rect x="28" y="26" width="10" height="6" rx="1.5" fill={active ? "#1a1a1a" : "#252525"}/>
    <circle cx="33" cy="29" r="2" fill={active ? "#C0C0C0" : "#404040"}/>
    {/* Dollar sign */}
    <text x="16" y="34" fontSize="14" fill={active ? "#1a1a1a" : "#505050"} fontWeight="bold">$</text>
    {/* Arrow down */}
    <path d="M42 4 L42 14" stroke={active ? "url(#chromeArrow)" : "#505050"} strokeWidth="3" strokeLinecap="round"/>
    <path d="M38 10 L42 14 L46 10" stroke={active ? "url(#chromeArrow)" : "#505050"} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HelpIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeBubble" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8E8E8"/>
        <stop offset="30%" stopColor="#C8C8C8"/>
        <stop offset="70%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <filter id="chromeShadowHelp" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Chat bubble */}
    <path d="M6 8 L42 8 L42 30 L26 30 L18 40 L18 30 L6 30 Z" fill={active ? "url(#chromeBubble)" : "#404040"} filter={active ? "url(#chromeShadowHelp)" : ""}/>
    {/* Shine */}
    {active && <rect x="8" y="10" width="32" height="4" rx="1" fill="white" opacity="0.3"/>}
    {/* Question mark */}
    <path d="M20 15 Q20 12 24 12 Q28 12 28 16 Q28 19 24 20 L24 23" stroke={active ? "#1a1a1a" : "#505050"} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <circle cx="24" cy="27" r="2" fill={active ? "#1a1a1a" : "#505050"}/>
  </svg>
);

export const AccountIconChrome = ({ size = 24, className = "", active = false }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chromeAvatar" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8E8E8"/>
        <stop offset="30%" stopColor="#C8C8C8"/>
        <stop offset="70%" stopColor="#909090"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <linearGradient id="chromeGear" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D0D0D0"/>
        <stop offset="50%" stopColor="#A0A0A0"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <filter id="chromeShadowAccount" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Head */}
    <circle cx="24" cy="14" r="10" fill={active ? "url(#chromeAvatar)" : "#404040"} filter={active ? "url(#chromeShadowAccount)" : ""}/>
    {active && <circle cx="21" cy="11" r="4" fill="white" opacity="0.3"/>}
    {/* Body */}
    <path d="M8 44 Q8 32 24 32 Q40 32 40 44" fill={active ? "url(#chromeAvatar)" : "#404040"} filter={active ? "url(#chromeShadowAccount)" : ""}/>
    {/* Settings gear */}
    <circle cx="36" cy="36" r="8" fill={active ? "url(#chromeGear)" : "#353535"}/>
    <circle cx="36" cy="36" r="4" fill={active ? "#1a1a1a" : "#252525"}/>
    {/* Gear teeth */}
    <rect x="34" y="28" width="4" height="3" rx="0.5" fill={active ? "url(#chromeGear)" : "#353535"}/>
    <rect x="34" y="41" width="4" height="3" rx="0.5" fill={active ? "url(#chromeGear)" : "#353535"}/>
    <rect x="28" y="34" width="3" height="4" rx="0.5" fill={active ? "url(#chromeGear)" : "#353535"}/>
    <rect x="41" y="34" width="3" height="4" rx="0.5" fill={active ? "url(#chromeGear)" : "#353535"}/>
    {active && <circle cx="35" cy="35" r="2" fill="white" opacity="0.3"/>}
  </svg>
);

export default {
  // Categories - Chrome
  SlotsIconChrome,
  SportsIconChrome,
  CasinoIconChrome,
  LotteryIconChrome,
  FishingIconChrome,
  ArcadeIconChrome,
  PokerIconChrome,
  CockFightingIconChrome,
  PromoIconChrome,
  ReferralIconChrome,
  // Menu - Chrome
  HomeIconChrome,
  PromoMenuIconChrome,
  DepositIconChrome,
  HelpIconChrome,
  AccountIconChrome
};
