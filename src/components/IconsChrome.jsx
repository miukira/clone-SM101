// Chrome Silver Icons - LUXURY EDITION
// ALL ICONS ALWAYS LOOK THE SAME - no active/inactive difference
// The `active` prop is kept for API compatibility but has NO visual effect

// Silver color constants - ALWAYS USED
const S = {
  body: '#E0E0E0',      // Main body fill - bright silver
  bodyAlt: '#D0D0D0',   // Secondary body fill
  detail: '#C8C8C8',    // Detail elements
  dark: '#AAAAAA',      // Dark accents (dots, eyes, numbers)
  stroke: '#F0F0F0',    // Stroke color
}

// ============ CATEGORY ICONS - CHROME THEME ============

export const SlotsIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Machine body */}
    <rect x="8" y="6" width="32" height="36" rx="4" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    {/* Screen */}
    <rect x="12" y="14" width="24" height="16" rx="2" fill="#888888"/>
    <rect x="14" y="16" width="6" height="12" rx="1" fill="#999999"/>
    <rect x="21" y="16" width="6" height="12" rx="1" fill="#999999"/>
    <rect x="28" y="16" width="6" height="12" rx="1" fill="#999999"/>
    {/* 7s */}
    <text x="17" y="24" fontSize="8" fill={S.body} fontWeight="bold" textAnchor="middle">7</text>
    <text x="24" y="24" fontSize="8" fill={S.body} fontWeight="bold" textAnchor="middle">7</text>
    <text x="31" y="24" fontSize="8" fill={S.body} fontWeight="bold" textAnchor="middle">7</text>
    {/* Button */}
    <circle cx="24" cy="36" r="4" fill={S.detail}/>
    {/* Lever */}
    <rect x="40" y="14" width="4" height="14" rx="2" fill={S.bodyAlt}/>
    <circle cx="42" cy="12" r="4" fill={S.body}/>
  </svg>
);

export const SportsIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="18" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <path d="M24 8 L30 16 L27 24 L21 24 L18 16 Z" fill={S.dark} stroke={S.detail} strokeWidth="1"/>
    <path d="M10 22 L18 16 L21 24 L15 32 L8 28 Z" fill={S.dark} stroke={S.detail} strokeWidth="1"/>
    <path d="M38 22 L40 28 L33 32 L27 24 L30 16 Z" fill={S.dark} stroke={S.detail} strokeWidth="1"/>
    <path d="M15 32 L21 24 L27 24 L33 32 L28 40 L20 40 Z" fill={S.dark} stroke={S.detail} strokeWidth="1"/>
  </svg>
);

export const CasinoIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Dice 1 */}
    <g transform="rotate(-12 15 27)">
      <rect x="6" y="18" width="18" height="18" rx="3" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
      <circle cx="11" cy="23" r="2" fill={S.dark}/>
      <circle cx="19" cy="23" r="2" fill={S.dark}/>
      <circle cx="15" cy="27" r="2" fill={S.dark}/>
      <circle cx="11" cy="31" r="2" fill={S.dark}/>
      <circle cx="19" cy="31" r="2" fill={S.dark}/>
    </g>
    {/* Dice 2 */}
    <g transform="rotate(10 33 21)">
      <rect x="24" y="12" width="18" height="18" rx="3" fill={S.bodyAlt} stroke={S.stroke} strokeWidth="0.5"/>
      <circle cx="29" cy="17" r="2" fill={S.dark}/>
      <circle cx="37" cy="17" r="2" fill={S.dark}/>
      <circle cx="33" cy="21" r="2" fill={S.dark}/>
      <circle cx="29" cy="25" r="2" fill={S.dark}/>
      <circle cx="37" cy="25" r="2" fill={S.dark}/>
    </g>
  </svg>
);

export const LotteryIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="14" cy="16" r="10" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <text x="14" y="20" fontSize="10" fill={S.dark} fontWeight="bold" textAnchor="middle">8</text>
    <circle cx="34" cy="16" r="10" fill={S.bodyAlt} stroke={S.stroke} strokeWidth="0.5"/>
    <text x="34" y="20" fontSize="9" fill={S.dark} fontWeight="bold" textAnchor="middle">21</text>
    <circle cx="24" cy="34" r="10" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <text x="24" y="38" fontSize="10" fill={S.dark} fontWeight="bold" textAnchor="middle">7</text>
  </svg>
);

export const FishingIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Waves */}
    <path d="M2 40 Q10 36 18 40 Q26 44 34 40 Q42 36 48 40" stroke={S.detail} strokeWidth="2" fill="none"/>
    <path d="M0 44 Q8 40 16 44 Q24 48 32 44 Q40 40 48 44" stroke={S.bodyAlt} strokeWidth="1.5" fill="none"/>
    {/* Fish body */}
    <ellipse cx="26" cy="26" rx="14" ry="8" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <path d="M40 26 L50 18 L50 34 Z" fill={S.bodyAlt}/>
    {/* Eye */}
    <circle cx="16" cy="24" r="4" fill={S.dark}/>
    <circle cx="15" cy="23" r="2" fill={S.body}/>
    {/* Rod */}
    <rect x="5" y="2" width="5" height="8" rx="1" fill={S.bodyAlt}/>
    <path d="M7.5 10 L7.5 20 L14 26" stroke={S.body} strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="14" cy="26" r="2.5" fill={S.body}/>
  </svg>
);

export const ArcadeIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="14" width="40" height="22" rx="11" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    {/* D-pad */}
    <rect x="11" y="21" width="3" height="10" rx="0.5" fill={S.dark}/>
    <rect x="8" y="24" width="10" height="3" rx="0.5" fill={S.dark}/>
    {/* Buttons */}
    <circle cx="33" cy="21" r="4" fill={S.detail}/>
    <circle cx="39" cy="25" r="4" fill={S.bodyAlt}/>
    <circle cx="33" cy="29" r="4" fill={S.detail}/>
    <circle cx="27" cy="25" r="4" fill={S.detail}/>
  </svg>
);

export const PokerIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Card back */}
    <g transform="rotate(-10 18 21)">
      <rect x="8" y="6" width="20" height="30" rx="2" fill={S.bodyAlt} stroke={S.stroke} strokeWidth="0.5"/>
    </g>
    {/* Card front */}
    <rect x="18" y="8" width="20" height="30" rx="2" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    {/* Spade */}
    <path d="M28 18 C28 18 24 22 24 25 C24 27 25.5 28 28 26 L28 30 L26 30 L30 30 L28 30 L28 26 C30.5 28 32 27 32 25 C32 22 28 18 28 18" fill={S.dark}/>
    <text x="21" y="16" fontSize="7" fill={S.dark} fontWeight="bold">A</text>
    <text x="35" y="36" fontSize="7" fill={S.dark} fontWeight="bold" transform="rotate(180 35 33)">A</text>
    {/* Chips */}
    <ellipse cx="40" cy="44" rx="6" ry="2.5" fill={S.detail}/>
    <ellipse cx="40" cy="42" rx="6" ry="2.5" fill={S.bodyAlt}/>
    <ellipse cx="40" cy="40" rx="6" ry="2.5" fill={S.body}/>
  </svg>
);

export const CockFightingIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body */}
    <ellipse cx="24" cy="28" rx="12" ry="9" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    {/* Head */}
    <circle cx="32" cy="18" r="7" fill={S.bodyAlt} stroke={S.stroke} strokeWidth="0.5"/>
    <path d="M30 11 L32 6 L34 11 L36 7 L37 13 L29 13 Z" fill={S.body}/>
    <path d="M39 18 L45 15 L39 21 Z" fill={S.body}/>
    <circle cx="34" cy="16" r="2.5" fill={S.dark}/>
    <circle cx="33.5" cy="15.5" r="1" fill={S.body}/>
    {/* Tail feathers */}
    <path d="M12 22 Q5 15 8 8" stroke={S.body} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M14 24 Q5 19 6 12" stroke={S.bodyAlt} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M14 28 Q3 25 4 18" stroke={S.detail} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M20 37 L18 44 M22 44 L18 44 L14 44" stroke={S.detail} strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M28 37 L30 44 M34 44 L30 44 L26 44" stroke={S.detail} strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

export const PromoIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="20" width="28" height="22" rx="2" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <rect x="22" y="20" width="4" height="22" fill={S.dark}/>
    <rect x="10" y="28" width="28" height="4" fill={S.dark}/>
    <rect x="8" y="14" width="32" height="8" rx="2" fill={S.bodyAlt} stroke={S.stroke} strokeWidth="0.5"/>
    <rect x="22" y="14" width="4" height="8" fill={S.dark}/>
    <ellipse cx="17" cy="12" rx="5" ry="3.5" fill={S.detail}/>
    <ellipse cx="31" cy="12" rx="5" ry="3.5" fill={S.detail}/>
    <circle cx="24" cy="12" r="3.5" fill={S.body}/>
  </svg>
);

export const ReferralIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="14" r="8" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <path d="M12 38 Q12 28 24 28 Q36 28 36 38" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <circle cx="8" cy="24" r="5" fill={S.detail}/>
    <path d="M2 40 Q2 34 8 34 Q14 34 14 40" fill={S.detail}/>
    <circle cx="40" cy="24" r="5" fill={S.detail}/>
    <path d="M34 40 Q34 34 40 34 Q46 34 46 40" fill={S.detail}/>
    <path d="M16 18 L11 22" stroke={S.body} strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 18 L37 22" stroke={S.body} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// ============ MENU ICONS - CHROME THEME ============

export const HomeIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 24 L12 40 L36 40 L36 24" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <path d="M24 6 L6 24 L12 24 L24 12 L36 24 L42 24 Z" fill={S.bodyAlt} stroke={S.stroke} strokeWidth="0.5"/>
    <rect x="20" y="28" width="8" height="12" rx="1" fill={S.dark}/>
    <circle cx="26" cy="34" r="1.2" fill={S.body}/>
    <rect x="14" y="28" width="5" height="5" rx="0.5" fill={S.detail}/>
    <rect x="29" y="28" width="5" height="5" rx="0.5" fill={S.detail}/>
    <rect x="32" y="10" width="5" height="10" fill={S.bodyAlt}/>
  </svg>
);

export const PromoMenuIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 20 L10 30 L16 30 L16 20 Z" fill={S.detail}/>
    <path d="M16 18 L38 8 L38 42 L16 34 Z" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <rect x="4" y="22" width="8" height="6" rx="2" fill={S.bodyAlt}/>
    <path d="M40 18 Q46 25 40 32" stroke={S.body} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M43 14 Q50 25 43 36" stroke={S.bodyAlt} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

export const DepositIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="14" width="32" height="26" rx="3" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <path d="M6 20 L38 20" stroke={S.dark} strokeWidth="2"/>
    <rect x="28" y="26" width="10" height="6" rx="1.5" fill={S.dark}/>
    <circle cx="33" cy="29" r="2.5" fill={S.body}/>
    <text x="16" y="34" fontSize="14" fill={S.dark} fontWeight="bold">$</text>
    <path d="M42 4 L42 14" stroke={S.body} strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M38 10 L42 14 L46 10" stroke={S.body} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HelpIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 8 L42 8 L42 30 L26 30 L18 40 L18 30 L6 30 Z" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <path d="M20 15 Q20 12 24 12 Q28 12 28 16 Q28 19 24 20 L24 23" stroke={S.dark} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <circle cx="24" cy="27" r="2.5" fill={S.dark}/>
  </svg>
);

export const AccountIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="14" r="10" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <path d="M8 44 Q8 32 24 32 Q40 32 40 44" fill={S.body} stroke={S.stroke} strokeWidth="0.5"/>
    <circle cx="36" cy="36" r="8" fill={S.detail}/>
    <circle cx="36" cy="36" r="4" fill={S.dark}/>
    <rect x="34" y="28" width="4" height="3" rx="0.5" fill={S.body}/>
    <rect x="34" y="41" width="4" height="3" rx="0.5" fill={S.body}/>
    <rect x="28" y="34" width="3" height="4" rx="0.5" fill={S.body}/>
    <rect x="41" y="34" width="3" height="4" rx="0.5" fill={S.body}/>
  </svg>
);

// Additional icons used in imports
export const ChevronDownIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 9l6 6 6-6" stroke={S.body} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FlagIDIconChrome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="10" width="40" height="28" rx="3" fill="#FFFFFF" stroke={S.stroke} strokeWidth="0.5"/>
    <rect x="4" y="10" width="40" height="14" rx="3" fill="#FF0000"/>
    <rect x="4" y="24" width="40" height="14" rx="3" fill="#FFFFFF"/>
  </svg>
);

export default {
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
  HomeIconChrome,
  PromoMenuIconChrome,
  DepositIconChrome,
  HelpIconChrome,
  AccountIconChrome,
  ChevronDownIconChrome,
  FlagIDIconChrome,
};
