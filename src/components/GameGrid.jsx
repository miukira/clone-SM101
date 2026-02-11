import { useState } from 'react'

// Hot/Livegame game images from original site
import baccarat from '../assets/games/hot/baccarat.png'
import dragonTiger from '../assets/games/hot/dragontiger.png'
import spaceman from '../assets/games/hot/spaceman.png'
import sweetBonanza from '../assets/games/hot/sweet-bonanza.png'
import starlightPrincess from '../assets/games/hot/starlight-princess.png'
import sweetBonanza1000 from '../assets/games/hot/sweet-bonanza-1000.png'
import gatesOfOlympus from '../assets/games/hot/gates-of-olympus.png'
import mahjongWins from '../assets/games/hot/mahjong-wins.png'

// Sport images
import sbobet from '../assets/games/sport/sbobet.png'
import sabaSports from '../assets/games/sport/saba-sports.png'

// Togel images
import togelMacau from '../assets/games/togel/toto-macau.png'
import togelSingapore from '../assets/games/togel/singapore.png'
import togelSydney from '../assets/games/togel/sydney.png'
import togelHongkong from '../assets/games/togel/hongkong.png'

// Category icons from original site
import iconHot from '../assets/icons/hot.png'
import iconLivegame from '../assets/icons/livegame.png'
import iconSlot from '../assets/icons/slot.png'
import iconTogel from '../assets/icons/togel.png'
import iconSport from '../assets/icons/sport.png'
import iconFishing from '../assets/icons/fishing.png'
import iconArcade from '../assets/icons/arcade.png'

const categories = [
  { id: 'hot', name: 'Hot', icon: iconHot },
  { id: 'livegame', name: 'Livegame', icon: iconLivegame },
  { id: 'slot', name: 'Slot', icon: iconSlot },
  { id: 'togel', name: 'Togel', icon: iconTogel },
  { id: 'sport', name: 'Sport', icon: iconSport },
  { id: 'tembakikan', name: 'Tembak Ikan', icon: iconFishing },
  { id: 'arcade', name: 'Arcade', icon: iconArcade },
]

const games = [
  // Hot category
  { id: 1, name: 'BACCARAT-21', provider: 'BPNG', image: baccarat, category: ['hot', 'livegame'] },
  { id: 2, name: 'DRAGONTIGER-19', provider: 'BPNG', image: dragonTiger, category: ['hot', 'livegame'] },
  { id: 3, name: 'SPACEMAN', provider: 'PP', image: spaceman, category: ['hot', 'slot'] },
  { id: 4, name: 'SWEET BONANZA CANDYLAND', provider: 'PP', image: sweetBonanza, category: ['hot', 'livegame'] },
  { id: 5, name: 'STARLIGHT PRINCESS 1000', provider: 'PP', image: starlightPrincess, category: ['hot', 'slot'] },
  { id: 6, name: 'SWEET BONANZA 1000', provider: 'PP', image: sweetBonanza1000, category: ['hot', 'slot'] },
  { id: 7, name: 'GATES OF OLYMPUS 1000', provider: 'PP', image: gatesOfOlympus, category: ['hot', 'slot'] },
  { id: 8, name: 'MAHJONG WINS 3 - BLACK SCATTER', provider: 'PG', image: mahjongWins, category: ['hot', 'slot'] },
  
  // Sport category
  { id: 9, name: 'SBOBET', provider: 'SBO', image: sbobet, category: ['sport'] },
  { id: 10, name: 'SABA SPORTS', provider: 'SABA', image: sabaSports, category: ['sport'] },
  
  // Togel category
  { id: 11, name: 'TOTO MACAU MALAM 2', provider: 'TTM', image: togelMacau, category: ['togel'], isTogel: true, periode: '1182', time: '03:24:20', result: '2495' },
  { id: 12, name: 'SINGAPORE', provider: 'SGD', image: togelSingapore, category: ['togel'], isTogel: true, periode: '845', time: '2Day 01:24:20', result: '5878,7907,2758' },
  { id: 13, name: 'SYDNEY LOTTO', provider: 'SYD', image: togelSydney, category: ['togel'], isTogel: true, periode: '449', time: '19:13:20', result: '8396,7689,4846', isLive: true },
  { id: 14, name: 'HONGKONG LOTTO', provider: 'HKG', image: togelHongkong, category: ['togel'], isTogel: true, periode: '448', time: '04:23:19', result: '3626,9921,1057', isLive: true },
  
  // Fishing category (using slot images as placeholder)
  { id: 15, name: 'JILI FISHING', provider: 'JILI', image: spaceman, category: ['tembakikan'] },
  { id: 16, name: 'BG FISHING', provider: 'BG', image: sweetBonanza, category: ['tembakikan'] },
  { id: 17, name: 'JOKER FISHING', provider: 'JOKER', image: starlightPrincess, category: ['tembakikan'] },
  { id: 18, name: 'ASK FISHING', provider: 'ASK', image: gatesOfOlympus, category: ['tembakikan'] },
  
  // Arcade category (using slot images as placeholder)
  { id: 19, name: 'PLINKO CIRCUS', provider: 'PNG', image: sweetBonanza1000, category: ['arcade'] },
  { id: 20, name: 'KENO MATRIX', provider: 'PNG', image: mahjongWins, category: ['arcade'] },
  { id: 21, name: 'BLINGBANGBALL', provider: 'PNG', image: spaceman, category: ['arcade'] },
  { id: 22, name: 'CRYPTO FUTURES', provider: 'PNG', image: gatesOfOlympus, category: ['arcade'] },
]

export default function GameGrid() {
  const [activeCategory, setActiveCategory] = useState('hot')
  const filteredGames = games.filter(game => game.category.includes(activeCategory))

  return (
    <section className="flex rounded-xl overflow-hidden">
      {/* Sidebar - Vertical (both mobile and desktop) */}
      <div className="w-20 sm:w-24 md:w-32 lg:w-44 bg-[#0d1829] flex-shrink-0 py-1 md:py-2 px-0.5 md:px-1 flex flex-col">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full relative transition-all duration-300 rounded-lg md:rounded-xl overflow-hidden
                ${isActive 
                  ? 'opacity-100 scale-100 shadow-lg shadow-yellow-400/30 bg-gradient-to-b from-yellow-500/20 to-transparent' 
                  : 'opacity-60 hover:opacity-90 hover:scale-105 hover:bg-white/5'
                }`}
            >
              {/* Icon container with text inside */}
              <div className="relative w-full aspect-square">
                <img 
                  src={cat.icon} 
                  alt={cat.name}
                  className={`w-full h-full object-contain transition-transform duration-300 ${isActive ? 'scale-105' : ''}`}
                />
                {/* Text inside icon at bottom */}
                <span className={`absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-6 left-0 right-0 text-[8px] sm:text-[9px] md:text-[10px] lg:text-sm font-bold text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300
                  ${isActive ? 'text-yellow-400' : 'text-white'}`}>
                  {cat.name}
                </span>
              </div>
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Games Content */}
      <div className="flex-1 bg-[#0f1c2e] p-1.5 sm:p-2 md:p-3">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3">
          {filteredGames.map((game) => (
            <div key={game.id} className="group cursor-pointer">
              <div className="relative rounded-lg md:rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                {/* Image Container */}
                <div className={`${game.isTogel ? 'aspect-square' : 'aspect-[4/5]'} relative bg-slate-800`}>
                  <img 
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Togel overlay */}
                  {game.isTogel && (
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-800/60 to-slate-900/90 flex flex-col items-center justify-center p-1.5 sm:p-2 md:p-3">
                      {game.isLive && (
                        <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-red-600 text-white text-[6px] sm:text-[8px] md:text-[10px] font-bold px-1 md:px-2 py-0.5 rounded">
                          LIVE RESULT
                        </div>
                      )}
                      <div className="text-white text-[8px] sm:text-[10px] md:text-xs font-medium mb-0.5 md:mb-1">PERIODE: {game.periode}</div>
                      <div className="text-yellow-400 text-xs sm:text-sm md:text-lg font-bold">{game.time}</div>
                      <div className="text-white text-[8px] sm:text-[10px] md:text-sm mt-0.5 md:mt-1">{game.result}</div>
                    </div>
                  )}
                  
                  {/* Provider Badge */}
                  {!game.isTogel && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-3 md:right-3 bg-black/50 text-white text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded flex items-center gap-0.5 md:gap-1">
                      <span className="text-blue-400 text-[4px] sm:text-[6px] md:text-[8px]">●</span>
                      {game.provider}
                    </div>
                  )}
                </div>

                {/* Red Footer */}
                <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] py-1 sm:py-1.5 md:py-2 px-1.5 sm:px-2 md:px-3">
                  <p className="text-white text-[8px] sm:text-[10px] md:text-xs font-bold truncate">{game.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
