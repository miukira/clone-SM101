// Modern SVG Icons for Categories and Menu
// Designed with gradient fills and modern aesthetics

// ============ CATEGORY ICONS ============

export const SlotsIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="slotsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="100%" stopColor="#FFA500"/>
      </linearGradient>
    </defs>
    {/* Slot machine body */}
    <rect x="6" y="8" width="36" height="32" rx="4" fill="url(#slotsGrad)"/>
    <rect x="10" y="14" width="28" height="18" rx="2" fill="#1a1a2e"/>
    {/* Reels */}
    <rect x="12" y="16" width="7" height="14" rx="1" fill="#2d2d44"/>
    <rect x="20.5" y="16" width="7" height="14" rx="1" fill="#2d2d44"/>
    <rect x="29" y="16" width="7" height="14" rx="1" fill="#2d2d44"/>
    {/* 7s on reels */}
    <text x="15.5" y="26" fontSize="10" fill="#ff4757" fontWeight="bold" textAnchor="middle">7</text>
    <text x="24" y="26" fontSize="10" fill="#ff4757" fontWeight="bold" textAnchor="middle">7</text>
    <text x="32.5" y="26" fontSize="10" fill="#ff4757" fontWeight="bold" textAnchor="middle">7</text>
    {/* Lever */}
    <rect x="42" y="16" width="4" height="16" rx="2" fill="#c0392b"/>
    <circle cx="44" cy="14" r="4" fill="#e74c3c"/>
  </svg>
);

export const SportsIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sportsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4aa"/>
        <stop offset="100%" stopColor="#00a67d"/>
      </linearGradient>
    </defs>
    {/* Soccer ball */}
    <circle cx="24" cy="24" r="18" fill="white" stroke="url(#sportsGrad)" strokeWidth="3"/>
    {/* Pentagon pattern */}
    <path d="M24 10 L30 18 L27 26 L21 26 L18 18 Z" fill="url(#sportsGrad)"/>
    <path d="M12 20 L18 18 L21 26 L16 32 L10 28 Z" fill="url(#sportsGrad)"/>
    <path d="M36 20 L38 28 L32 32 L27 26 L30 18 Z" fill="url(#sportsGrad)"/>
    <path d="M16 32 L21 26 L27 26 L32 32 L28 38 L20 38 Z" fill="url(#sportsGrad)"/>
  </svg>
);

export const CasinoIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="casinoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9b59b6"/>
        <stop offset="100%" stopColor="#8e44ad"/>
      </linearGradient>
      <linearGradient id="casinoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e74c3c"/>
        <stop offset="100%" stopColor="#c0392b"/>
      </linearGradient>
    </defs>
    {/* Dice 1 */}
    <rect x="4" y="16" width="20" height="20" rx="3" fill="url(#casinoGrad)" transform="rotate(-15 14 26)"/>
    <circle cx="10" cy="22" r="2" fill="white"/>
    <circle cx="18" cy="22" r="2" fill="white"/>
    <circle cx="14" cy="26" r="2" fill="white"/>
    <circle cx="10" cy="30" r="2" fill="white"/>
    <circle cx="18" cy="30" r="2" fill="white"/>
    {/* Dice 2 */}
    <rect x="24" y="12" width="20" height="20" rx="3" fill="url(#casinoGrad2)" transform="rotate(10 34 22)"/>
    <circle cx="30" cy="18" r="2" fill="white"/>
    <circle cx="38" cy="18" r="2" fill="white"/>
    <circle cx="34" cy="22" r="2" fill="white"/>
    <circle cx="30" cy="26" r="2" fill="white"/>
    <circle cx="38" cy="26" r="2" fill="white"/>
  </svg>
);

export const LotteryIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="lotteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f39c12"/>
        <stop offset="100%" stopColor="#e67e22"/>
      </linearGradient>
      <linearGradient id="ballGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e74c3c"/>
        <stop offset="100%" stopColor="#c0392b"/>
      </linearGradient>
      <linearGradient id="ballGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3498db"/>
        <stop offset="100%" stopColor="#2980b9"/>
      </linearGradient>
    </defs>
    {/* Lottery balls */}
    <circle cx="14" cy="14" r="10" fill="url(#ballGrad1)"/>
    <text x="14" y="18" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">8</text>
    <circle cx="34" cy="14" r="10" fill="url(#ballGrad2)"/>
    <text x="34" y="18" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">21</text>
    <circle cx="24" cy="32" r="10" fill="url(#lotteryGrad)"/>
    <text x="24" y="36" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">7</text>
    {/* Sparkles */}
    <path d="M6 28 L8 32 L6 36 L4 32 Z" fill="#FFD700"/>
    <path d="M42 28 L44 32 L42 36 L40 32 Z" fill="#FFD700"/>
  </svg>
);

export const FishingIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00bcd4"/>
        <stop offset="100%" stopColor="#0097a7"/>
      </linearGradient>
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e88e5"/>
        <stop offset="100%" stopColor="#1565c0"/>
      </linearGradient>
    </defs>
    {/* Water waves */}
    <path d="M4 36 Q12 32 20 36 Q28 40 36 36 Q44 32 48 36 L48 48 L0 48 Z" fill="url(#waterGrad)" opacity="0.5"/>
    {/* Fish */}
    <ellipse cx="28" cy="28" rx="14" ry="8" fill="url(#fishGrad)"/>
    <path d="M42 28 L48 22 L48 34 Z" fill="url(#fishGrad)"/>
    <circle cx="18" cy="26" r="3" fill="white"/>
    <circle cx="18" cy="26" r="1.5" fill="#1a1a2e"/>
    {/* Fishing line */}
    <path d="M8 4 L8 20 L16 28" stroke="#FFD700" strokeWidth="2" fill="none"/>
    <circle cx="8" cy="4" r="3" fill="#8B4513"/>
  </svg>
);

export const ArcadeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="arcadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e91e63"/>
        <stop offset="100%" stopColor="#c2185b"/>
      </linearGradient>
    </defs>
    {/* Game controller */}
    <rect x="4" y="14" width="40" height="24" rx="12" fill="url(#arcadeGrad)"/>
    {/* D-pad */}
    <rect x="10" y="22" width="4" height="12" rx="1" fill="white"/>
    <rect x="8" y="26" width="12" height="4" rx="1" fill="white"/>
    {/* Buttons */}
    <circle cx="34" cy="22" r="4" fill="#FFD700"/>
    <circle cx="40" cy="28" r="4" fill="#00d4aa"/>
    <circle cx="34" cy="34" r="4" fill="#3498db"/>
    <circle cx="28" cy="28" r="4" fill="#e74c3c"/>
    {/* Center buttons */}
    <rect x="20" y="24" width="4" height="2" rx="1" fill="white" opacity="0.7"/>
    <rect x="20" y="28" width="4" height="2" rx="1" fill="white" opacity="0.7"/>
  </svg>
);

export const PokerIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#f0f0f0"/>
      </linearGradient>
      <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a1a2e"/>
        <stop offset="100%" stopColor="#16213e"/>
      </linearGradient>
    </defs>
    {/* Card 1 - back */}
    <rect x="6" y="6" width="22" height="32" rx="3" fill="url(#cardGrad2)" transform="rotate(-10 17 22)"/>
    {/* Card 2 - front */}
    <rect x="16" y="8" width="22" height="32" rx="3" fill="url(#cardGrad1)" stroke="#ddd" strokeWidth="1"/>
    {/* Spade symbol */}
    <path d="M27 16 C27 16 22 22 22 26 C22 28 24 30 27 28 L27 32 L25 32 L29 32 L27 32 L27 28 C30 30 32 28 32 26 C32 22 27 16 27 16" fill="#1a1a2e"/>
    {/* A */}
    <text x="19" y="16" fontSize="8" fill="#e74c3c" fontWeight="bold">A</text>
    <text x="33" y="38" fontSize="8" fill="#e74c3c" fontWeight="bold" transform="rotate(180 33 35)">A</text>
    {/* Chips */}
    <ellipse cx="40" cy="40" rx="6" ry="3" fill="#e74c3c"/>
    <ellipse cx="40" cy="38" rx="6" ry="3" fill="#FFD700"/>
    <ellipse cx="40" cy="36" rx="6" ry="3" fill="#00d4aa"/>
  </svg>
);

export const CockFightingIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e74c3c"/>
        <stop offset="100%" stopColor="#c0392b"/>
      </linearGradient>
      <linearGradient id="featherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f39c12"/>
        <stop offset="100%" stopColor="#e67e22"/>
      </linearGradient>
    </defs>
    {/* Rooster body */}
    <ellipse cx="24" cy="28" rx="12" ry="10" fill="url(#cockGrad)"/>
    {/* Head */}
    <circle cx="32" cy="18" r="8" fill="url(#cockGrad)"/>
    {/* Comb */}
    <path d="M30 10 L32 6 L34 10 L36 6 L38 12 L30 12 Z" fill="#ff6b6b"/>
    {/* Beak */}
    <path d="M40 18 L46 16 L40 20 Z" fill="#f39c12"/>
    {/* Eye */}
    <circle cx="35" cy="16" r="2" fill="white"/>
    <circle cx="35" cy="16" r="1" fill="#1a1a2e"/>
    {/* Tail feathers */}
    <path d="M12 20 Q6 14 8 8" stroke="url(#featherGrad)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M14 22 Q6 18 6 12" stroke="url(#featherGrad)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M14 26 Q4 24 4 18" stroke="url(#featherGrad)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Legs */}
    <path d="M20 38 L18 44 M22 44 L18 44 L14 44" stroke="#f39c12" strokeWidth="2" fill="none"/>
    <path d="M28 38 L30 44 M34 44 L30 44 L26 44" stroke="#f39c12" strokeWidth="2" fill="none"/>
  </svg>
);

export const PromoIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="promoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6b6b"/>
        <stop offset="100%" stopColor="#ee5a5a"/>
      </linearGradient>
    </defs>
    {/* Gift box */}
    <rect x="8" y="20" width="32" height="24" rx="2" fill="url(#promoGrad)"/>
    {/* Ribbon vertical */}
    <rect x="22" y="20" width="4" height="24" fill="#FFD700"/>
    {/* Ribbon horizontal */}
    <rect x="8" y="28" width="32" height="4" fill="#FFD700"/>
    {/* Lid */}
    <rect x="6" y="14" width="36" height="8" rx="2" fill="url(#promoGrad)"/>
    <rect x="22" y="14" width="4" height="8" fill="#FFD700"/>
    {/* Bow */}
    <ellipse cx="18" cy="12" rx="6" ry="4" fill="#FFD700"/>
    <ellipse cx="30" cy="12" rx="6" ry="4" fill="#FFD700"/>
    <circle cx="24" cy="12" r="3" fill="#ff6b6b"/>
    {/* Sparkles */}
    <path d="M6 8 L8 10 L6 12 L4 10 Z" fill="#FFD700"/>
    <path d="M42 8 L44 10 L42 12 L40 10 Z" fill="#FFD700"/>
  </svg>
);

export const ReferralIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="referralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea"/>
        <stop offset="100%" stopColor="#764ba2"/>
      </linearGradient>
    </defs>
    {/* Center person */}
    <circle cx="24" cy="16" r="8" fill="url(#referralGrad)"/>
    <path d="M12 36 Q12 28 24 28 Q36 28 36 36" fill="url(#referralGrad)"/>
    {/* Left person */}
    <circle cx="8" cy="24" r="5" fill="#00d4aa"/>
    <path d="M2 38 Q2 32 8 32 Q14 32 14 38" fill="#00d4aa"/>
    {/* Right person */}
    <circle cx="40" cy="24" r="5" fill="#00d4aa"/>
    <path d="M34 38 Q34 32 40 32 Q46 32 46 38" fill="#00d4aa"/>
    {/* Connection lines */}
    <path d="M16 20 L12 22" stroke="#FFD700" strokeWidth="2"/>
    <path d="M32 20 L36 22" stroke="#FFD700" strokeWidth="2"/>
    {/* Plus signs */}
    <path d="M8 42 L8 46 M6 44 L10 44" stroke="#00d4aa" strokeWidth="2"/>
    <path d="M40 42 L40 46 M38 44 L42 44" stroke="#00d4aa" strokeWidth="2"/>
  </svg>
);

// ============ MENU ICONS ============

export const HomeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="100%" stopColor="#FFA500"/>
      </linearGradient>
    </defs>
    {/* Roof */}
    <path d="M24 6 L4 24 L10 24 L10 42 L38 42 L38 24 L44 24 Z" fill="url(#homeGrad)"/>
    {/* Door */}
    <rect x="20" y="28" width="8" height="14" rx="1" fill="#1a1a2e"/>
    {/* Windows */}
    <rect x="13" y="26" width="6" height="6" rx="1" fill="#87CEEB"/>
    <rect x="29" y="26" width="6" height="6" rx="1" fill="#87CEEB"/>
    {/* Chimney */}
    <rect x="32" y="10" width="6" height="10" fill="url(#homeGrad)"/>
  </svg>
);

export const PromoMenuIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="promoMenuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6b6b"/>
        <stop offset="100%" stopColor="#ee5a5a"/>
      </linearGradient>
    </defs>
    {/* Megaphone */}
    <path d="M8 20 L8 32 L14 32 L14 20 Z" fill="url(#promoMenuGrad)"/>
    <path d="M14 18 L38 8 L38 44 L14 34 Z" fill="url(#promoMenuGrad)"/>
    {/* Handle */}
    <rect x="4" y="22" width="6" height="8" rx="2" fill="#FFD700"/>
    {/* Sound waves */}
    <path d="M40 20 Q44 26 40 32" stroke="#FFD700" strokeWidth="2" fill="none"/>
    <path d="M42 16 Q48 26 42 36" stroke="#FFD700" strokeWidth="2" fill="none"/>
  </svg>
);

export const DepositIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="depositGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4aa"/>
        <stop offset="100%" stopColor="#00a67d"/>
      </linearGradient>
    </defs>
    {/* Wallet */}
    <rect x="4" y="12" width="36" height="28" rx="4" fill="url(#depositGrad)"/>
    <rect x="4" y="12" width="36" height="8" rx="4" fill="#00a67d"/>
    {/* Card slot */}
    <rect x="28" y="24" width="12" height="8" rx="2" fill="#1a1a2e"/>
    <circle cx="34" cy="28" r="2" fill="#FFD700"/>
    {/* Dollar sign */}
    <text x="16" y="34" fontSize="16" fill="white" fontWeight="bold">$</text>
    {/* Arrow down */}
    <path d="M42 6 L42 14 L46 10 M42 14 L38 10" stroke="#FFD700" strokeWidth="2" fill="none"/>
  </svg>
);

export const HelpIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="helpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3498db"/>
        <stop offset="100%" stopColor="#2980b9"/>
      </linearGradient>
    </defs>
    {/* Chat bubble */}
    <path d="M4 8 L44 8 L44 32 L28 32 L20 42 L20 32 L4 32 Z" rx="4" fill="url(#helpGrad)"/>
    {/* Question mark */}
    <text x="24" y="26" fontSize="18" fill="white" fontWeight="bold" textAnchor="middle">?</text>
    {/* Headset detail */}
    <path d="M14 14 Q14 10 18 10" stroke="white" strokeWidth="2" fill="none"/>
    <path d="M34 14 Q34 10 30 10" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
);

export const AccountIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="accountGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9b59b6"/>
        <stop offset="100%" stopColor="#8e44ad"/>
      </linearGradient>
    </defs>
    {/* Head */}
    <circle cx="24" cy="16" r="10" fill="url(#accountGrad)"/>
    {/* Body */}
    <path d="M8 44 Q8 32 24 32 Q40 32 40 44" fill="url(#accountGrad)"/>
    {/* Settings gear overlay */}
    <circle cx="36" cy="36" r="8" fill="#FFD700"/>
    <circle cx="36" cy="36" r="4" fill="#1a1a2e"/>
    <path d="M36 28 L36 30 M36 42 L36 44 M28 36 L30 36 M42 36 L44 36" stroke="#FFD700" strokeWidth="2"/>
  </svg>
);

// ============ ICON BUTTON COMPONENT ============

export const IconButton = ({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick,
  size = 28,
  className = ""
}) => (
  <button 
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl
      transition-all duration-300 ease-out
      ${active 
        ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-105' 
        : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'
      }
      ${className}
    `}
  >
    <Icon size={size} />
    <span className={`text-xs font-medium tracking-wide ${active ? 'text-white' : ''}`}>
      {label}
    </span>
  </button>
);

// ============ MENU BUTTON COMPONENT ============

export const MenuButton = ({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick,
  size = 24,
  className = ""
}) => (
  <button 
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 min-w-[60px]
      transition-all duration-200
      ${active 
        ? 'text-amber-400' 
        : 'text-gray-400 hover:text-white'
      }
      ${className}
    `}
  >
    <Icon size={size} />
    <span className="text-[10px] font-medium uppercase tracking-wider">
      {label}
    </span>
  </button>
);

export default {
  // Categories
  SlotsIcon,
  SportsIcon,
  CasinoIcon,
  LotteryIcon,
  FishingIcon,
  ArcadeIcon,
  PokerIcon,
  CockFightingIcon,
  PromoIcon,
  ReferralIcon,
  // Menu
  HomeIcon,
  PromoMenuIcon,
  DepositIcon,
  HelpIcon,
  AccountIcon,
  // Components
  IconButton,
  MenuButton
};
