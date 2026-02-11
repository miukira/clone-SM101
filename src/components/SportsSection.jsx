import sbobet from '../assets/games/sbobet.png'
import sabaSports from '../assets/games/saba-sports.png'

const sportsGames = [
  { id: 1, name: 'SBO', fullName: 'SBOBET', image: sbobet },
  { id: 2, name: 'SABA SPORTS', fullName: 'SABA SPORTS', image: sabaSports },
]

export default function SportsSection() {
  return (
    <section className="flex rounded-xl overflow-hidden">
      {/* Empty sidebar space to align with game grid */}
      <div className="w-44 bg-[#0d1829] flex-shrink-0"></div>
      
      {/* Content */}
      <div className="flex-1 bg-[#0f1c2e] p-4">
        <div className="grid grid-cols-2 gap-3">
          {sportsGames.map((game) => (
            <div key={game.id} className="group cursor-pointer">
              <div className="relative rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <div className="h-28 md:h-36 relative bg-slate-800">
                  <img 
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <span className="text-white text-xl md:text-2xl font-black">{game.fullName}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] py-2 px-3">
                  <p className="text-white text-xs font-bold">{game.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
