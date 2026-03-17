// Halaman Betting Togel - Menggunakan Lottery API Endpoints
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTogelBetting, MARKET_DISPLAY_NAMES } from '../hooks/useLottery'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'

// Available markets
const MARKETS = [
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', color: 'from-blue-600 to-blue-800' },
  { id: 'hongkong', name: 'Hong Kong', flag: '🇭🇰', color: 'from-purple-600 to-purple-800' },
  { id: 'sydney', name: 'Sydney', flag: '🇦🇺', color: 'from-amber-600 to-amber-800' },
  { id: 'cambodia', name: 'Cambodia', flag: '🇰🇭', color: 'from-red-600 to-red-800' },
  { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', color: 'from-green-600 to-green-800' },
  { id: 'china', name: 'China', flag: '🇨🇳', color: 'from-red-700 to-red-900' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', color: 'from-pink-600 to-pink-800' },
  { id: 'macau', name: 'Macau', flag: '🇲🇴', color: 'from-yellow-600 to-yellow-800' },
  { id: 'seoul', name: 'Seoul', flag: '🇰🇷', color: 'from-sky-600 to-sky-800' },
  { id: 'bangkok', name: 'Bangkok', flag: '🇹🇭', color: 'from-orange-600 to-orange-800' },
]

// Bet types
const BET_TYPES = [
  { id: '4D', digits: 4, label: '4D', desc: '4 Angka' },
  { id: '3D', digits: 3, label: '3D', desc: '3 Angka' },
  { id: '2D', digits: 2, label: '2D', desc: '2 Angka' },
]

// Position options for 2D/3D
const POSITIONS = [
  { id: 'full', label: 'Full', desc: 'Semua posisi' },
  { id: 'depan', label: 'Depan', desc: 'Posisi depan' },
  { id: 'tengah', label: 'Tengah', desc: 'Posisi tengah' },
  { id: 'belakang', label: 'Belakang', desc: 'Posisi belakang' },
]

// Loading Spinner
function LoadingSpinner({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
  return (
    <div className={`${sizeClass} border-2 border-[#333] border-t-[#C0C0C0] rounded-full animate-spin`}></div>
  )
}

// Market Selector Card
function MarketCard({ market, isSelected, onClick, marketInfo }) {
  const status = marketInfo?.status || 'unknown'
  const isOpen = status === 'open'
  
  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300
        ${isSelected 
          ? 'border-[#C0C0C0] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] scale-105' 
          : 'border-[#333] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] hover:border-[#505050]'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{market.flag}</span>
        <div className="text-left">
          <h3 className="font-bold text-white">{market.name}</h3>
          <span className={`text-xs font-semibold ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
            {isOpen ? '● OPEN' : '● CLOSED'}
          </span>
        </div>
      </div>
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C0C0C0] rounded-full flex items-center justify-center">
          <span className="text-black text-sm">✓</span>
        </div>
      )}
    </button>
  )
}

// Number Input Component
function NumberInput({ value, onChange, digits, disabled }) {
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, digits)
    onChange(val)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={'0'.repeat(digits)}
        maxLength={digits}
        className={`
          w-full text-center text-4xl font-mono font-bold tracking-[0.5em] py-4 px-6
          bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]
          border-2 border-[#333] rounded-xl
          text-[#C0C0C0] placeholder-[#333]
          focus:border-[#C0C0C0] focus:outline-none
          disabled:opacity-50
          transition-all
        `}
      />
      <div className="absolute bottom-1 right-3 text-xs text-[#505050]">
        {value.length}/{digits} digit
      </div>
    </div>
  )
}

// Amount Quick Buttons
function AmountButtons({ shortcuts, onSelect, disabled }) {
  const formatAmount = (amount) => {
    return amount >= 1000 ? `${amount/1000}K` : amount.toString()
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {shortcuts.map((amount) => (
        <button
          key={amount}
          onClick={() => onSelect(amount)}
          disabled={disabled}
          className="
            px-4 py-2 rounded-lg
            bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]
            border border-[#333] hover:border-[#505050]
            text-[#C0C0C0] text-sm font-bold
            disabled:opacity-50
            transition-all hover:scale-105
          "
        >
          {formatAmount(amount)}
        </button>
      ))}
    </div>
  )
}

// Prize Info Display
function PrizeInfo({ marketInfo, betType }) {
  if (!marketInfo?.prize) return null
  
  const prizeKey = betType.toLowerCase()
  const prize = marketInfo.prize[prizeKey]
  const discount = marketInfo.discount_percentage || 0

  return (
    <div className="bg-gradient-to-r from-[#1a1a1a] via-[#252525] to-[#1a1a1a] rounded-xl p-4 border border-[#333]">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-[#505050] text-xs">HADIAH</p>
          <p className="text-[#C0C0C0] text-xl font-bold">{prize?.toLocaleString()}x</p>
        </div>
        <div>
          <p className="text-[#505050] text-xs">DISKON</p>
          <p className="text-green-400 text-xl font-bold">{discount}%</p>
        </div>
        <div>
          <p className="text-[#505050] text-xs">MIN BET</p>
          <p className="text-[#C0C0C0] text-xl font-bold">{marketInfo.min_bet?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

// Bet History Item
function BetHistoryItem({ bet }) {
  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    won: 'text-green-400 bg-green-400/10',
    lost: 'text-red-400 bg-red-400/10',
    settled: 'text-blue-400 bg-blue-400/10',
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] rounded-lg border border-[#2a2a2a]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#333] rounded-lg flex items-center justify-center">
          <span className="text-[#C0C0C0] font-bold text-sm">{bet.type}</span>
        </div>
        <div>
          <p className="text-white font-mono font-bold tracking-wider">{bet.number?.replace(/,/g, ' ')}</p>
          <p className="text-[#505050] text-xs">{bet.market?.toUpperCase()} • {bet.position}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[#C0C0C0] font-bold">Rp {bet.amount?.toLocaleString()}</p>
        <span className={`text-xs px-2 py-0.5 rounded ${statusColors[bet.status] || 'text-gray-400'}`}>
          {bet.status?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

// Main Betting Page Component
export default function TogelBettingPage() {
  const { market: urlMarket } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user, loginSuccess, updateBalance } = useAuth()
  
  // State
  const [selectedMarket, setSelectedMarket] = useState(urlMarket || 'singapore')
  const [betType, setBetType] = useState('4D')
  const [position, setPosition] = useState('full')
  const [numbers, setNumbers] = useState('')
  const [amount, setAmount] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  // API Hooks - This triggers the lottery endpoints!
  const {
    marketInfo,
    marketLoading,
    history,
    historyLoading,
    refetchHistory,
    placeBet,
    betLoading,
    betError,
    betSuccess,
    lastResult,
    resetBet,
  } = useTogelBetting(selectedMarket)

  // Get digits based on bet type
  const digits = BET_TYPES.find(t => t.id === betType)?.digits || 4

  // Calculate pay amount with discount
  const calculatePay = () => {
    if (!amount || !marketInfo) return 0
    const discount = marketInfo.discount_percentage || 0
    return Math.round(parseInt(amount) * (1 - discount / 100))
  }

  // Handle bet submission
  const handlePlaceBet = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true)
      return
    }

    if (numbers.length !== digits) {
      alert(`Masukkan ${digits} digit angka`)
      return
    }

    if (!amount || parseInt(amount) < (marketInfo?.min_bet || 100)) {
      alert(`Minimum bet: Rp ${marketInfo?.min_bet?.toLocaleString() || '100'}`)
      return
    }

    const betData = [{
      market: selectedMarket,
      type: betType,
      prize: marketInfo?.prize?.[betType.toLowerCase()] || 0,
      discount: (marketInfo?.discount_percentage || 0) > 0,
      number: numbers.split('').join(','),
      amount: parseInt(amount),
      pay: calculatePay(),
      position: position,
    }]

    console.log('📤 Placing bet:', betData)
    const result = await placeBet(betData)
    
    if (result) {
      // Update balance di AuthContext
      if (result.new_balance !== undefined) {
        updateBalance(result.new_balance)
      }
      
      setSuccessMessage(`Taruhan berhasil! Saldo baru: Rp ${result.new_balance?.toLocaleString()}`)
      setNumbers('')
      setAmount('')
      
      // Refresh history
      refetchHistory()
      
      setTimeout(() => {
        setSuccessMessage('')
        resetBet()
      }, 3000)
    }
  }

  // Update market from URL
  useEffect(() => {
    if (urlMarket) {
      // Check if market exists in our list, otherwise default to singapore
      const marketExists = MARKETS.find(m => m.id === urlMarket)
      if (marketExists) {
        setSelectedMarket(urlMarket)
      } else {
        // Unknown market from URL, just use it anyway (API will validate)
        setSelectedMarket(urlMarket)
      }
    }
  }, [urlMarket])

  // Log API calls for debugging
  useEffect(() => {
    if (marketInfo) {
      console.log('📊 Market Info loaded:', marketInfo)
    }
  }, [marketInfo])

  useEffect(() => {
    if (history.length > 0) {
      console.log('📜 Bet History loaded:', history)
    }
  }, [history])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab="login"
        onLoginSuccess={loginSuccess}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-black to-transparent">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#C0C0C0] hover:text-white transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="font-bold">KEMBALI</span>
          </button>
          
          <h1 className="text-xl font-black tracking-wider">
            <span className="text-[#C0C0C0]">TOGEL</span>
            <span className="text-white"> BETTING</span>
          </h1>

          {isAuthenticated ? (
            <div className="text-right">
              <p className="text-xs text-[#505050]">Saldo</p>
              <p className="text-[#C0C0C0] font-bold">Rp {user?.balance?.toLocaleString() || '0'}</p>
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-b from-[#C0C0C0] to-[#909090] text-black font-bold rounded-lg"
            >
              MASUK
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-20 space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-xl text-center font-bold animate-pulse">
            ✓ {successMessage}
          </div>
        )}

        {/* Error Message */}
        {betError && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-center">
            ✗ {betError.data?.message || 'Terjadi kesalahan'}
          </div>
        )}

        {/* Market Selection */}
        <section>
          <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">PILIH PASARAN</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {MARKETS.map((market) => (
              <MarketCard
                key={market.id}
                market={market}
                isSelected={selectedMarket === market.id}
                onClick={() => setSelectedMarket(market.id)}
                marketInfo={selectedMarket === market.id ? marketInfo : null}
              />
            ))}
          </div>
        </section>

        {/* Market Info Loading */}
        {marketLoading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}

        {/* Prize Info */}
        {marketInfo && !marketLoading && (
          <PrizeInfo marketInfo={marketInfo} betType={betType} />
        )}

        {/* Bet Type Selection */}
        <section>
          <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">JENIS TARUHAN</h2>
          <div className="flex gap-2">
            {BET_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setBetType(type.id)
                  setNumbers('')
                }}
                className={`
                  flex-1 py-3 px-4 rounded-xl border-2 transition-all
                  ${betType === type.id
                    ? 'border-[#C0C0C0] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]'
                    : 'border-[#333] bg-[#0d0d0d] hover:border-[#505050]'
                  }
                `}
              >
                <span className="text-2xl font-black text-[#C0C0C0]">{type.label}</span>
                <p className="text-xs text-[#505050]">{type.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Position Selection (for 2D/3D) */}
        {betType !== '4D' && (
          <section>
            <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">POSISI</h2>
            <div className="flex gap-2 flex-wrap">
              {POSITIONS.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setPosition(pos.id)}
                  className={`
                    py-2 px-4 rounded-lg border transition-all
                    ${position === pos.id
                      ? 'border-[#C0C0C0] bg-[#2a2a2a] text-white'
                      : 'border-[#333] bg-[#1a1a1a] text-[#505050] hover:border-[#505050]'
                    }
                  `}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Number Input */}
        <section>
          <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">MASUKKAN ANGKA</h2>
          <NumberInput
            value={numbers}
            onChange={setNumbers}
            digits={digits}
            disabled={marketInfo?.status === 'closed'}
          />
        </section>

        {/* Amount Input */}
        <section>
          <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">JUMLAH TARUHAN</h2>
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#505050] font-bold">Rp</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min={marketInfo?.min_bet || 100}
                disabled={marketInfo?.status === 'closed'}
                className="
                  w-full py-4 px-12 text-2xl font-bold
                  bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]
                  border-2 border-[#333] rounded-xl
                  text-[#C0C0C0] placeholder-[#333]
                  focus:border-[#C0C0C0] focus:outline-none
                  disabled:opacity-50
                "
              />
            </div>
            
            {/* Quick Amount Buttons */}
            {marketInfo?.bet_shortcut && (
              <AmountButtons
                shortcuts={marketInfo.bet_shortcut}
                onSelect={setAmount}
                disabled={marketInfo?.status === 'closed'}
              />
            )}
          </div>
        </section>

        {/* Summary & Submit */}
        <section className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl p-4 border border-[#333]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#505050]">Pasaran</span>
              <span className="text-white font-bold">{MARKETS.find(m => m.id === selectedMarket)?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#505050]">Tipe</span>
              <span className="text-white font-bold">{betType} {position !== 'full' ? `(${position})` : ''}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#505050]">Angka</span>
              <span className="text-white font-mono font-bold tracking-widest">{numbers || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#505050]">Taruhan</span>
              <span className="text-white font-bold">Rp {parseInt(amount || 0).toLocaleString()}</span>
            </div>
            {marketInfo?.discount_percentage > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#505050]">Diskon ({marketInfo.discount_percentage}%)</span>
                <span className="text-green-400 font-bold">- Rp {(parseInt(amount || 0) - calculatePay()).toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-[#333] pt-2 flex justify-between">
              <span className="text-[#505050] font-bold">BAYAR</span>
              <span className="text-[#C0C0C0] text-xl font-black">Rp {calculatePay().toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceBet}
            disabled={betLoading || marketInfo?.status === 'closed' || !numbers || !amount}
            className={`
              w-full py-4 rounded-xl font-black text-lg tracking-widest
              transition-all duration-300
              ${marketInfo?.status === 'closed'
                ? 'bg-[#333] text-[#505050] cursor-not-allowed'
                : 'bg-gradient-to-b from-[#C0C0C0] via-[#a0a0a0] to-[#808080] text-black hover:from-white hover:via-[#d0d0d0] hover:to-[#a0a0a0] hover:scale-[1.02]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {betLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                MEMPROSES...
              </span>
            ) : marketInfo?.status === 'closed' ? (
              'PASARAN TUTUP'
            ) : (
              'PASANG TARUHAN'
            )}
          </button>
        </section>

        {/* Bet History */}
        {isAuthenticated && (
          <section>
            <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">RIWAYAT TARUHAN</h2>
            
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-2">
                {history.map((bet, i) => (
                  <BetHistoryItem key={i} bet={bet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#505050]">
                <p>Belum ada riwayat taruhan</p>
              </div>
            )}
          </section>
        )}

        {/* API Debug Info (for development) */}
        <section className="mt-8 p-4 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a]">
          <h3 className="text-xs font-bold text-[#333] mb-2">🔧 API Debug</h3>
          <div className="text-xs text-[#505050] space-y-1 font-mono">
            <p>Market: {selectedMarket}</p>
            <p>GET /market-info: {marketLoading ? '⏳ Loading...' : marketInfo ? '✅ Loaded' : '❌ Not loaded'}</p>
            <p>GET /bet-history: {historyLoading ? '⏳ Loading...' : history.length > 0 ? `✅ ${history.length} items` : '📭 Empty'}</p>
            <p>POST /bet: {betLoading ? '⏳ Sending...' : betSuccess ? '✅ Success' : betError ? '❌ Error' : '⏸️ Idle'}</p>
          </div>
        </section>
      </main>
    </div>
  )
}
