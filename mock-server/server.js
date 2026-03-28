/**
 * Mock API Server - Express.js
 * Untuk testing via Swagger UI atau Postman
 * Jalankan: node mock-server/server.js
 */

const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const path = require('path')

const app = express()
const PORT = 4010

// Middleware
app.use(cors())
app.use(express.json())

// Load OpenAPI spec
const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'))
// Update server URL for local testing
swaggerDocument.servers = [{ url: `http://localhost:${PORT}/api/v1`, description: 'Mock Server' }]

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// ============================================
// MOCK DATA
// ============================================

let mockUsers = [
  {
    id: 1,
    username: 'user1',
    password: '1234',
    handphone: '081999333444',
    bank_name: 'bri',
    bank_account: 'USER ONE',
    bank_number: '01010007777088081',
    balance: 9000000,
    currency: 'IDR',
    referral_code: 'USER1REF',
  },
  {
    id: 2,
    username: 'testuser',
    password: 'test123',
    handphone: '081234567890',
    bank_name: 'mandiri',
    bank_account: 'TEST USER',
    bank_number: '1234567890123',
    balance: 50000,
    currency: 'IDR',
    referral_code: 'TESTREF',
  }
]

// Riwayat transaksi - dimulai kosong, hanya transaksi real yang masuk
let mockBalanceMutations = []

const mockBanks = [
  { id: 1, type: 'e-wallet', name: 'gopay', account: 'PUSATTOGEL', number: '081577784445', min_deposit: 20000 },
  { id: 2, type: 'e-wallet', name: 'dana', account: 'PUSATTOGEL', number: '081577784446', min_deposit: 20000 },
  { id: 3, type: 'e-wallet', name: 'ovo', account: 'PUSATTOGEL', number: '081577784447', min_deposit: 20000 },
  { id: 4, type: 'bank-transfer', name: 'bca', account: 'PUSATTOGEL', number: '1234567890', min_deposit: 50000 },
  { id: 5, type: 'bank-transfer', name: 'mandiri', account: 'PUSATTOGEL', number: '9876543210', min_deposit: 50000 },
  { id: 6, type: 'bank-transfer', name: 'bni', account: 'PUSATTOGEL', number: '1122334455', min_deposit: 50000 },
  { id: 7, type: 'bank-transfer', name: 'bri', account: 'PUSATTOGEL', number: '0011223344', min_deposit: 50000 },
  { id: 8, type: 'qris', name: 'QRIS', account: 'PUSATTOGEL', number: '', min_deposit: 10000 },
]

const mockPromotions = [
  { id: 1, title: 'BONUS DEPOSIT HARIAN 10%', image: '/banners/banner-1.webp', description: 'Bonus deposit harian 10% khusus slot', start_date: '2026-01-01', end_date: '2026-12-31', tag: 'DAILY' },
  { id: 2, title: 'CASHBACK SPORTSBOOK 5%', image: '/banners/banner-2.webp', description: 'Cashback kekalahan sportsbook hingga 5%', start_date: '2026-01-01', end_date: '2026-12-31', tag: 'WEEKLY' },
  { id: 3, title: 'BONUS NEW MEMBER 30%', image: '/banners/banner-3.webp', description: 'Bonus khusus member baru hingga 30%', start_date: '2026-01-01', end_date: '2026-12-31', tag: 'HOT' },
  { id: 4, title: 'BONUS REFERRAL 10%', image: '/banners/banner-1.webp', description: 'Bonus referral untuk setiap downline', start_date: '2026-01-01', end_date: '2026-12-31', tag: 'REFERRAL' },
]

const mockPromoCodes = [
  { name: 'New Member', code: 'newmember' },
  { name: 'Deposit Bonus 10%', code: 'DEPOSIT10' },
  { name: 'Cashback 5%', code: 'CASHBACK5' },
]

// ============ SLOT PROVIDERS (1xxx) ============
// Provider schema: { provider_id, name, logo, character }
const mockSlotProviders = [
  { provider_id: 1001, name: 'pragmatic-play', logo: '/providers/logos/pragmatic-play-logo-new.png', character: '/providers/characters/zeus-character.png' },
  { provider_id: 1002, name: 'pg-soft', logo: '/providers/logos/pg-soft-logo.png', character: '/providers/characters/chinese-empress.png' },
  { provider_id: 1003, name: 'nolimit-city', logo: '/providers/logos/nolimit-city-logo-new.png', character: '/providers/characters/mariachi-skeleton.png' },
  { provider_id: 1004, name: 'lucky-monaco', logo: '/providers/logos/lucky-monaco-logo.png', character: '/providers/characters/cleopatra-character.png' },
  { provider_id: 1005, name: 'joker', logo: '/providers/logos/joker-logo.png', character: '/providers/characters/spartan-character.png' },
  { provider_id: 1006, name: 'cq9', logo: '/providers/logos/cq9-logo.png', character: '/providers/characters/panda-character.png' },
  { provider_id: 1007, name: 'habanero', logo: '/providers/logos/habanero-logo.png', character: '/providers/characters/gangster-character.png' },
  { provider_id: 1008, name: 'yggdrasil', logo: '/providers/logos/yggdrasil-logo-new.png', character: '/providers/characters/soldier-character.png' },
  { provider_id: 1009, name: 'worldmatch', logo: '/providers/logos/worldmatch-logo.png', character: '/providers/characters/cowgirl-character.png' },
  { provider_id: 1010, name: 'sboslot', logo: '/providers/logos/sboslot-logo.png', character: '/providers/characters/viking-character.png' },
  { provider_id: 1011, name: 'funkygames', logo: '/providers/logos/funkygames-logo.png', character: '/providers/characters/king-character.png' },
  { provider_id: 1012, name: 'microgaming', logo: '/providers/logos/microgaming-logo-new.png', character: '/providers/characters/aladdin-character.png' },
  { provider_id: 1013, name: 'netent', logo: '/providers/logos/netent-logo.png', character: '/providers/characters/boxer-character.png' },
  { provider_id: 1014, name: 'afb777', logo: '/providers/logos/afb777-logo.png', character: '/providers/characters/sultan-character.png' },
  { provider_id: 1015, name: 'jili', logo: '/providers/logos/jili-logo.png', character: '/providers/characters/genie-character.png' },
  { provider_id: 1016, name: 'rich88', logo: '/providers/logos/rich88-logo.png', character: '/providers/characters/poseidon-character.png' },
  { provider_id: 1017, name: 'advantplay', logo: '/providers/logos/advantplay-logo.png', character: '/providers/characters/pirate-character.png' },
  { provider_id: 1018, name: 'kingmaker', logo: '/providers/logos/kingmaker-logo.png', character: '/providers/characters/warrior-character.png' },
  { provider_id: 1019, name: 'ygr', logo: '/providers/logos/ygr-logo.png', character: '/providers/characters/pharaoh-character.png' },
  { provider_id: 1020, name: 'playstar', logo: '/providers/logos/playstar-logo.png', character: '/providers/characters/scientist-character.png' },
  { provider_id: 1021, name: 'fastspin', logo: '/providers/logos/fastspin-logo.png', character: '/providers/characters/dragon-character.png' },
  { provider_id: 1022, name: 'dragoonsoft', logo: '/providers/logos/dragoonsoft-logo.png', character: '/providers/characters/monopoly-character.png' },
  { provider_id: 1023, name: 'nagagames', logo: '/providers/logos/nagagames-logo.png', character: '/providers/characters/zeus-character.png' },
]

// ============ FISH PROVIDERS (2xxx) ============
// Fishing uses shark characters (hiu1-7.png) and fishing logos
const mockFishProviders = [
  { provider_id: 2001, name: 'microgaming-fishing', logo: '/providers/fishing/fishing1.jpeg', character: '/providers/fishing/hiu1.png' },
  { provider_id: 2002, name: 'jdb-fishing', logo: '/providers/fishing/fishing2.jpeg', character: '/providers/fishing/hiu2.png' },
  { provider_id: 2003, name: 'jili-fishing', logo: '/providers/logos/jili-logo.png', character: '/providers/fishing/hiu3.png' },
  { provider_id: 2004, name: 'funky-fishing', logo: '/providers/fishing/fishing5.png', character: '/providers/fishing/hiu4.png' },
  { provider_id: 2005, name: 'dragoon-fishing', logo: '/providers/fishing/fishing3.png', character: '/providers/fishing/hiu5.png' },
  { provider_id: 2006, name: 'cq9-fishing', logo: '/providers/logos/cq9-logo.png', character: '/providers/fishing/hiu6.png' },
  { provider_id: 2007, name: 'fachai-fishing', logo: '/providers/fishing/fishing7.png', character: '/providers/fishing/hiu7.png' },
]

// ============ CASINO PROVIDERS (3xxx) ============
// Casino uses real women models (model1-14.png)
const mockCasinoProviders = [
  { provider_id: 3001, name: '568win', logo: '/providers/logos/kasino1-processed.png', character: '/providers/casino/model1.png' },
  { provider_id: 3002, name: 'wm-casino', logo: '/providers/logos/kasino2-processed.png', character: '/providers/casino/model2.png' },
  { provider_id: 3003, name: 'ion-casino', logo: '/providers/logos/kasino3-processed.png', character: '/providers/casino/model3.png' },
  { provider_id: 3004, name: 'sa-gaming', logo: '/providers/logos/kasino4-processed.png', character: '/providers/casino/model4.png' },
  { provider_id: 3005, name: 'evolution-gaming', logo: '/providers/logos/kasino5-processed.png', character: '/providers/casino/model5.png' },
  { provider_id: 3006, name: 'allbet', logo: '/providers/logos/kasino6-processed.png', character: '/providers/casino/model6.png' },
  { provider_id: 3007, name: 'green-dragon', logo: '/providers/logos/kasino7-processed.png', character: '/providers/casino/model7.png' },
  { provider_id: 3008, name: 'pragmatic-casino', logo: '/providers/logos/kasino8-processed.png', character: '/providers/casino/model8.png' },
  { provider_id: 3009, name: 'yb-live', logo: '/providers/logos/kasino9-processed.png', character: '/providers/casino/model9.png' },
  { provider_id: 3010, name: 'afb777-casino', logo: '/providers/logos/kasino10-processed.png', character: '/providers/casino/model10.png' },
  { provider_id: 3011, name: 'playtech', logo: '/providers/logos/kasino11-processed.png', character: '/providers/casino/model11.png' },
  { provider_id: 3012, name: 'asia-gaming', logo: '/providers/logos/kasino12-processed.png', character: '/providers/casino/model12.png' },
  { provider_id: 3013, name: 'wcasino', logo: '/providers/logos/kasino13-processed.png', character: '/providers/casino/model13.png' },
  { provider_id: 3014, name: 'gameplay-interactive', logo: '/providers/logos/kasino14-processed.png', character: '/providers/casino/model14.png' },
]

// ============ SPORTSBOOK PROVIDERS (4xxx) ============
const mockSportsbookProviders = [
  { provider_id: 4001, name: 'sbobet', logo: '/providers/logos/sbobet-logo.png', character: '/providers/characters/yamal-character-new.png' },
  { provider_id: 4002, name: 'saba-sports', logo: '/providers/logos/saba-logo.png', character: '/providers/characters/mbappe-character.png' },
  { provider_id: 4003, name: 'afb777-sports', logo: '/providers/logos/afb777-sports-logo.png', character: '/providers/characters/haaland-character.png' },
  { provider_id: 4004, name: 'bti', logo: '/providers/logos/bti-logo.png', character: '/providers/characters/messi-character.png' },
  { provider_id: 4005, name: 'betpanda', logo: '/providers/logos/betpanda-logo.png', character: '/providers/characters/ronaldo-character.png' },
]

// ============ TOGEL PROVIDERS (5xxx) ============
// Togel uses togel-specific logos and characters
const mockTogelProviders = [
  { provider_id: 5001, name: 'hongkong-lotto', logo: '/providers/togel/hongkong.png', character: '/providers/togel/togel1.png' },
  { provider_id: 5002, name: 'sydney-lotto', logo: '/providers/togel/sidney.png', character: '/providers/togel/togel2.png' },
  { provider_id: 5003, name: 'singapore-togel', logo: '/providers/togel/singapore-white.png', character: '/providers/togel/togel3.png' },
  { provider_id: 5004, name: 'kamboja-togel', logo: '/providers/togel/cambodia.png', character: '/providers/togel/togel4.png' },
  { provider_id: 5005, name: 'taiwan-togel', logo: '/providers/togel/taiwan.png', character: '/providers/togel/togel5.png' },
  { provider_id: 5006, name: 'china-togel', logo: '/providers/togel/lotog1-processed.png', character: '/providers/togel/togel6.png' },
  { provider_id: 5007, name: 'japan-togel', logo: '/providers/togel/lotog2-processed.png', character: '/providers/togel/togel7.png' },
]

// ============ ARCADE PROVIDERS (6xxx) ============
// Arcade uses arcade-specific characters and logos
const mockArcadeProviders = [
  { provider_id: 6001, name: 'aviatrix-arcade', logo: '/providers/arcade/arclog1-processed.png', character: '/providers/arcade/arcade1.png' },
  { provider_id: 6002, name: 'kingmidas-arcade', logo: '/providers/arcade/arclog2.png', character: '/providers/arcade/arcade2.png' },
  { provider_id: 6003, name: 'sbobet-arcade', logo: '/providers/logos/sbobet-logo.png', character: '/providers/arcade/arcade3.png' },
  { provider_id: 6004, name: 'spribe-arcade', logo: '/providers/arcade/arclog4.png', character: '/providers/arcade/arcade4.png' },
]

// ============ POKER PROVIDERS (7xxx) ============
// Poker uses poker-specific character and logo
const mockPokerProviders = [
  { provider_id: 7001, name: 'millionaire-poker', logo: '/providers/poker/poklog1.png', character: '/providers/poker/poker1.png' },
]

// ============ COCKFIGHT PROVIDERS (8xxx) ============
// Cockfight uses rooster character
const mockCockfightProviders = [
  { provider_id: 8001, name: 'ga28-cockfight', logo: '/providers/sabung/colog1.png', character: '/providers/sabung/cook1.webp' },
]

// Game schema sesuai Swagger: { id, name, image }
const mockGames = {
  // ===== SLOT GAMES (1xxx) =====
  '1001': [ // pragmatic-play
    { id: 1, name: 'Gate Of Olympus', image: null },
    { id: 2, name: 'Sweet Bonanza', image: null },
    { id: 3, name: 'Starlight Princess', image: null },
    { id: 4, name: 'Wild West Gold', image: null },
  ],
  '1002': [ // pg-soft
    { id: 10, name: 'Mahjong Ways', image: null },
    { id: 11, name: 'Mahjong Ways 2', image: null },
    { id: 12, name: 'Fortune Tiger', image: null },
  ],
  '1003': [ // nolimit-city
    { id: 20, name: 'Mental', image: null },
    { id: 21, name: 'San Quentin', image: null },
  ],
  '1004': [ // lucky-monaco
    { id: 25, name: 'Lucky Monaco', image: null },
  ],
  '1005': [ // joker
    { id: 26, name: 'Roma', image: null },
  ],
  '1006': [ // cq9 (JDB)
    { id: 27, name: 'Golden Empire', image: null },
  ],
  '1007': [ // habanero
    { id: 30, name: 'Hot Hot Fruit', image: null },
    { id: 31, name: 'Koi Gate', image: null },
  ],
  '1008': [ // yggdrasil
    { id: 32, name: 'Vikings Go Berzerk', image: null },
  ],
  '1009': [ // worldmatch
    { id: 33, name: 'Wild West', image: null },
  ],
  '1010': [ // sboslot
    { id: 34, name: 'Golden Dragon', image: null },
  ],
  '1011': [ // funkygames
    { id: 35, name: 'Funky Fruits', image: null },
  ],
  '1012': [ // microgaming
    { id: 40, name: 'Immortal Romance', image: null },
    { id: 41, name: 'Mega Moolah', image: null },
  ],
  '1013': [ // netent
    { id: 42, name: 'Starburst', image: null },
  ],
  '1014': [ // afb777
    { id: 43, name: 'Lucky 777', image: null },
  ],
  '1015': [ // jili
    { id: 50, name: 'Super Ace', image: null },
    { id: 51, name: 'Money Coming', image: null },
  ],
  '1016': [ // rich88
    { id: 52, name: 'Rich 88', image: null },
  ],
  '1017': [ // advantplay
    { id: 53, name: 'Lucky Gems', image: null },
  ],
  '1018': [ // kingmaker
    { id: 54, name: 'Sicbo', image: null },
  ],
  '1019': [ // ygr
    { id: 55, name: 'Fishing God', image: null },
  ],
  '1020': [ // playstar
    { id: 56, name: 'Pharaoh Treasure', image: null },
  ],
  '1021': [ // fastspin
    { id: 57, name: 'Fast Spin', image: null },
  ],
  '1022': [ // dragoonsoft
    { id: 58, name: 'Dragon Gold', image: null },
  ],
  '1023': [ // nagagames
    { id: 59, name: 'Naga Treasure', image: null },
  ],

  // ===== FISH GAMES (2xxx) =====
  '2001': [ // microgaming-fishing
    { id: 100, name: 'Fish Hunter', image: null },
    { id: 101, name: 'Ocean King', image: null },
  ],
  '2002': [ // jdb-fishing-1
    { id: 102, name: 'Fishing War', image: null },
    { id: 103, name: 'Dragon Fishing', image: null },
  ],
  '2003': [ // jili-fishing
    { id: 110, name: 'Jackpot Fishing', image: null },
    { id: 111, name: 'Mega Fishing', image: null },
  ],
  '2004': [ // funky-fishing
    { id: 112, name: 'Funky Fishing', image: null },
  ],
  '2005': [ // dragoon-fishing
    { id: 113, name: 'Dragon Fishing', image: null },
  ],
  '2006': [ // cq9-fishing
    { id: 114, name: 'Paradise Fishing', image: null },
  ],
  '2007': [ // fachai-fishing
    { id: 115, name: 'FA Chai Fishing', image: null },
  ],

  // ===== CASINO (3xxx) =====
  '3001': [ // 568win
    { id: 200, name: 'Baccarat', image: null },
  ],
  '3002': [ // wm-casino
    { id: 201, name: 'Dragon Tiger', image: null },
  ],
  '3003': [ // ion-casino
    { id: 202, name: 'Roulette', image: null },
  ],
  '3004': [ // sa-gaming
    { id: 203, name: 'Sicbo', image: null },
  ],
  '3005': [ // evolution-gaming
    { id: 210, name: 'Lightning Roulette', image: null },
    { id: 211, name: 'Crazy Time', image: null },
  ],
  '3006': [ // allbet
    { id: 212, name: 'Baccarat Classic', image: null },
  ],
  '3007': [ // green-dragon
    { id: 213, name: 'Green Dragon', image: null },
  ],
  '3008': [ // pragmatic-casino
    { id: 214, name: 'Mega Wheel', image: null },
  ],
  '3009': [ // yb-live
    { id: 215, name: 'YB Baccarat', image: null },
  ],
  '3010': [ // afb777-casino
    { id: 216, name: 'AFB Roulette', image: null },
  ],
  '3011': [ // playtech
    { id: 217, name: 'Age of Gods', image: null },
  ],
  '3012': [ // asia-gaming
    { id: 218, name: 'Asia Baccarat', image: null },
  ],
  '3013': [ // wcasino
    { id: 219, name: 'WCasino Roulette', image: null },
  ],
  '3014': [ // gameplay-interactive
    { id: 220, name: 'GI Baccarat', image: null },
  ],

  // ===== SPORTSBOOK (4xxx) =====
  '4001': [ // sbobet
    { id: 300, name: 'Sports Betting', image: null },
  ],
  '4002': [ // saba-sports
    { id: 301, name: 'SABA Sports', image: null },
  ],
  '4003': [ // afb777-sports
    { id: 302, name: 'AFB Sports', image: null },
  ],
  '4004': [ // bti
    { id: 303, name: 'BTi Sports', image: null },
  ],
  '4005': [ // betpanda
    { id: 304, name: 'Betpanda Sports', image: null },
  ],

  // ===== TOGEL (5xxx) =====
  '5001': [ // hongkong-lotto
    { id: 500, name: 'Hongkong 4D', image: null },
  ],
  '5002': [ // sydney-lotto
    { id: 501, name: 'Sydney 4D', image: null },
  ],
  '5003': [ // singapore-togel
    { id: 502, name: 'Singapore 4D', image: null },
  ],
  '5004': [ // kamboja-togel
    { id: 503, name: 'Kamboja 4D', image: null },
  ],
  '5005': [ // taiwan-togel
    { id: 504, name: 'Taiwan 4D', image: null },
  ],
  '5006': [ // hongkong-togel
    { id: 505, name: 'HK Pools', image: null },
  ],
  '5007': [ // sidney-togel
    { id: 506, name: 'Sidney Pools', image: null },
  ],

  // ===== ARCADE (6xxx) =====
  '6001': [ // aviatrix-arcade
    { id: 600, name: 'Aviatrix', image: null },
  ],
  '6002': [ // kingmidas-arcade
    { id: 601, name: 'King Midas', image: null },
  ],
  '6003': [ // sbobet-arcade
    { id: 602, name: 'Virtual Sports', image: null },
  ],
  '6004': [ // spribe-arcade
    { id: 610, name: 'Aviator', image: null },
    { id: 611, name: 'Mines', image: null },
    { id: 612, name: 'Plinko', image: null },
  ],

  // ===== POKER (7xxx) =====
  '7001': [ // millionaire-poker
    { id: 700, name: 'Texas Hold\'em', image: null },
    { id: 701, name: 'Omaha', image: null },
  ],

  // ===== COCKFIGHT (8xxx) =====
  '8001': [ // ga28-cockfight
    { id: 800, name: 'Cockfight Live', image: null },
  ],
}

// WebsiteInfo - sesuai OpenAPI schema
const mockWebsiteInfo = {
  notification: [
    'Selamat datang di PUSATTOGEL - Platform Togel Terpercaya',
    'Promo bonus deposit 10% setiap hari untuk member setia',
    'Cashback mingguan hingga 5% - Klaim sekarang!',
    'New Member Bonus 30% - Daftar dan deposit sekarang!'
  ],
  // Format sesuai OpenAPI: { id, market, date, result }
  lottery_result: [
    { id: 1, market: 'singapore', date: '2026-03-28 17:30', result: '3927' },
    { id: 2, market: 'sidney', date: '2026-03-28 14:00', result: '4620' },
    { id: 3, market: 'hongkong', date: '2026-03-28 23:00', result: '7300' },
    { id: 4, market: 'cambodia', date: '2026-03-28 19:30', result: '8153' },
    { id: 5, market: 'taiwan', date: '2026-03-28 20:30', result: '2749' },
  ],
  // withdraw_list sesuai OpenAPI: { username, amount }
  withdraw_list: [
    { username: 'us***1', amount: '1.000.000' },
    { username: 'te***r', amount: '500.000' },
    { username: 'pl***x', amount: '2.500.000' },
    { username: 'wi***r', amount: '750.000' },
    { username: 'ja***i', amount: '300.000' }
  ]
}

// Helper: Generate dynamic withdraw_list dari transaksi real
const getRecentWithdrawals = () => {
  const withdrawals = mockBalanceMutations
    .filter(m => m.type === 'withdraw')
    .slice(0, 10)
    .map(w => {
      const user = mockUsers[0]
      const masked = user.username.length > 3 
        ? user.username.slice(0, 2) + '***' + user.username.slice(-1)
        : user.username.slice(0, 1) + '***'
      const formatted = w.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      return { username: masked, amount: formatted }
    })
  
  return withdrawals.length > 0 ? withdrawals : mockWebsiteInfo.withdraw_list
}

const mockWebsiteConfig = {
  title: 'PUSATTOGEL',
  about: 'Platform Alternatif Login Agent Pioneer Resmi Terpercaya',
  logo: '/logo.png',
  favicon: '/favicon.svg',
  external_script: [
    'console.log("External script loaded from API!");',
    'console.log("PUSATTOGEL - Platform Togel Terpercaya");'
  ],
  google_verification: 'google-site-verification-abc123',
  meta_tag: [
    "<meta name='description' content='PUSATTOGEL - Platform Togel Terpercaya'>",
    "<meta name='keywords' content='togel, slot, casino, sportsbook'>",
    "<meta name='author' content='PUSATTOGEL'>"
  ],
  contact: {
    whatsapp: { icon: '/icons/whatsapp.svg', link: 'https://wa.me/6281234567890' },
    telegram: { icon: '/icons/telegram.svg', link: 'https://t.me/pusattogel' },
    testimoni: { icon: '/icons/testimoni.svg', link: 'https://t.me/pusattogel_testimoni' },
    livechat: { icon: '/icons/livechat.svg', link: '#livechat' }
  },
  banner: [
    { id: 'banner-1', image: '/banners/banner-1.webp', link: '/promo' },
    { id: 'banner-2', image: '/banners/banner-2.webp', link: '/promo' },
    { id: 'banner-3', image: '/banners/banner-3.webp', link: '/promo' }
  ],
  rtp: { icon: '/icons/rtp.svg', link: '/rtp' },
  popup: {
    deposit_success: '/popups/deposit-success.svg',
    deposit_fails: '/popups/deposit-fails.svg',
    withdraw_success: '/popups/withdraw-success.svg',
    withdraw_fails: '/popups/withdraw-fails.svg',
    welcome: '/popups/welcome.svg',
    bonus: '/popups/bonus.svg'
  },
  // ============================================
  // THEME CONFIG
  // ============================================
  // 
  // season options:
  //   - 'none'       : Tidak ada efek
  //   - 'imlek'      : Angpao jatuh (/angpao.svg)
  //   - 'lebaran'    : Ketupat jatuh (/ketupat.png)
  //   - 'halloween'  : Labu jatuh (/pumpkin.svg)
  //   - 'christmas'  : Salju jatuh (/snow.svg)
  //   - 'jackpot'    : Koin jatuh (/coin.svg)
  //
  // background_color options:
  //   - '#0a0a0a'    : Default (Gelap)
  //   - '#0a1628'    : Biru Gelap (darkBlue)
  //   - '#1a0a28'    : Ungu Gelap (darkPurple)
  //   - '#0a1a0f'    : Hijau Gelap (darkGreen)
  //   - '#1a0a0a'    : Merah Gelap (darkRed)
  //   - '#0d1b2a'    : Navy
  //   - '#1a1a2e'    : Charcoal
  //
  // background_image options:
  //   - null                 : Tidak ada
  //   - '/bg-casino-1.webp'  : Casino 1
  //   - '/bg-casino-2.webp'  : Casino 2
  //
  // border_color options (UI accent color):
  //   - '#C0C0C0'    : Silver (default)
  //   - '#FFD700'    : Gold
  //   - '#DC143C'    : Merah (Red)
  //   - '#1E90FF'    : Biru (Blue)
  //   - '#50C878'    : Hijau (Green)
  //   - '#9966CC'    : Ungu (Purple)
  //   - '#FF69B4'    : Pink
  //
  theme: {
    season: 'christmas',
    background_color: '#0a1628',
    background_image: '/bg-casino-2.webp',
    border_color: '#1E90FF'
  },
  // MaintenanceConfig sesuai Swagger
  maintenance: {
    status: false,
    message: 'Sistem sedang dalam perbaikan',
    expected_end: '2026-03-28T10:00:00Z'
  }
}

const mockReferralInfo = {
  image: '/banners/banner-1.webp',
  description: 'Dapatkan bonus referral 10% dari kekalahan downline, dibayar setiap tanggal 1 tiap bulan.'
}

// Downline data - dimulai kosong, terisi saat ada user register dengan referral
let mockDownlineData = {
  // userId -> array of downline data
}

const mockMarketInfo = {
  singapore: {
    market: 'singapore',
    status: 'open',
    prize: { '4d': 9000, '3d': 900, '2d': 90 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 40
  },
  hongkong: {
    market: 'hongkong',
    status: 'closed',
    prize: { '4d': 8500, '3d': 850, '2d': 85 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 35
  },
  sydney: {
    market: 'sydney',
    status: 'closed',
    prize: { '4d': 8000, '3d': 800, '2d': 80 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 30
  },
  cambodia: {
    market: 'cambodia',
    status: 'open',
    prize: { '4d': 7500, '3d': 750, '2d': 75 },
    min_bet: 50,
    bet_shortcut: [50, 100, 200, 500],
    discount_percentage: 25
  },
  taiwan: {
    market: 'taiwan',
    status: 'open',
    prize: { '4d': 8000, '3d': 800, '2d': 80 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 30
  },
  china: {
    market: 'china',
    status: 'open',
    prize: { '4d': 9500, '3d': 950, '2d': 95 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 45
  },
  japan: {
    market: 'japan',
    status: 'closed',
    prize: { '4d': 8800, '3d': 880, '2d': 88 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 35
  },
  macau: {
    market: 'macau',
    status: 'open',
    prize: { '4d': 9200, '3d': 920, '2d': 92 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 38
  },
  seoul: {
    market: 'seoul',
    status: 'open',
    prize: { '4d': 8600, '3d': 860, '2d': 86 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 32
  },
  bangkok: {
    market: 'bangkok',
    status: 'open',
    prize: { '4d': 7800, '3d': 780, '2d': 78 },
    min_bet: 50,
    bet_shortcut: [50, 100, 200, 500],
    discount_percentage: 28
  },
  sidney: {
    market: 'sidney',
    status: 'closed',
    prize: { '4d': 8000, '3d': 800, '2d': 80 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 30
  }
}

let mockBetHistory = {
  singapore: [
    { market: 'singapore', type: '4D', prize: 9000, discount: false, number: '0,1,2,3', amount: 100, pay: 100, position: 'full', status: 'settled', created_at: '2026-03-07 13:00:00' }
  ],
  hongkong: [],
  sydney: [],
  cambodia: [],
  taiwan: [],
  china: [],
  japan: [],
  macau: [],
  seoul: [],
  bangkok: [],
  sidney: []
}

let pendingDeposits = []
let pendingWithdraws = []

// Token storage (simple in-memory)
const tokens = new Map()

// Helper: Generate token
const generateToken = (userId) => {
  const token = `token_${userId}_${Date.now()}`
  tokens.set(token, userId)
  return token
}

// Helper: Verify token
const verifyToken = (req) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return null
  const token = auth.substring(7)
  const userId = tokens.get(token)
  return userId ? mockUsers.find(u => u.id === userId) : null
}

// ============================================
// API ROUTES
// ============================================

const router = express.Router()

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = mockUsers.find(u => u.username === username && u.password === password)
  if (!user) {
    return res.status(400).json({ message: 'invalid password' })
  }
  const token = generateToken(user.id)
  res.json({ 
    username: user.username, 
    balance: user.balance, 
    currency: user.currency, 
    referral_code: user.referral_code,
    token 
  })
})

// POST /register
router.post('/register', (req, res) => {
  const { username, password, handphone, bank_name, bank_account, bank_number, referral } = req.body
  
  if (mockUsers.find(u => u.username === username)) {
    return res.status(400).json({ message: 'username has taken' })
  }
  if (mockUsers.find(u => u.handphone === handphone)) {
    return res.status(400).json({ message: 'phone number has taken' })
  }
  
  // Find referrer
  let referrer_id = null
  let referrer = null
  if (referral) {
    referrer = mockUsers.find(u => u.referral_code === referral || u.username === referral)
    if (referrer) {
      referrer_id = referrer.id
    }
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    username, password, handphone, bank_name, bank_account, bank_number,
    balance: 0, currency: 'IDR', referral_code: `${username.toUpperCase()}REF`,
    referrer_id
  }
  mockUsers.push(newUser)
  
  // Jika ada referrer, tambahkan ke downline data
  if (referrer) {
    if (!mockDownlineData[referrer.id]) {
      mockDownlineData[referrer.id] = []
    }
    mockDownlineData[referrer.id].push({
      username: newUser.username,
      first_depo_date: null,
      first_depo_amount: 0,
      turnover: 0,
      winlose: 0,
      comision: 0
    })
    console.log(`✅ User ${newUser.username} added as downline of ${referrer.username}`)
  }
  
  const token = generateToken(newUser.id)
  res.json({ username: newUser.username, balance: newUser.balance, currency: newUser.currency, token })
})

// GET /check-username
router.get('/check-username', (req, res) => {
  const { username } = req.query
  const exists = mockUsers.some(u => u.username === username)
  res.json({ available: !exists })
})

// GET /check-phone-number
router.get('/check-phone-number', (req, res) => {
  const { number } = req.query
  const exists = mockUsers.some(u => u.handphone === number)
  res.json({ available: !exists })
})

// GET /check-bank-number
router.get('/check-bank-number', (req, res) => {
  const { number } = req.query
  const exists = mockUsers.some(u => u.bank_number === number)
  res.json({ available: !exists })
})

// GET /profile
router.get('/profile', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  res.json({
    username: user.username,
    balance: user.balance,
    bank_name: user.bank_name,
    bank_account: user.bank_account,
    bank_number: user.bank_number
  })
})

// GET /balance
router.get('/balance', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  res.json({ balance: user.balance })
})

// GET /balance-mutation
router.get('/balance-mutation', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  res.json(mockBalanceMutations)
})

// POST /change-password
router.post('/change-password', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  
  const { password, new_password } = req.body
  if (user.password !== password) {
    return res.status(400).json({ message: 'wrong password' })
  }
  user.password = new_password
  res.json({ message: 'success' })
})

// POST /deposit
router.post('/deposit', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  
  // Auto-clear old pending deposits (no createdAt or older than 5 seconds)
  if (pendingDeposits.length > 0) {
    const pending = pendingDeposits[0]
    if (!pending.createdAt || Date.now() - pending.createdAt > 5000) {
      console.log('🧹 Auto-clearing old pending deposit')
      pendingDeposits = []
    } else {
      return res.status(400).json({ message: 'have pending deposit' })
    }
  }
  
  const { bank_id, amount, promo_code } = req.body
  const bank = mockBanks.find(b => b.id === bank_id)
  if (!bank) return res.status(400).json({ message: 'bank not found' })
  
  const deposit_id = Math.floor(Math.random() * 1000000)
  const now = new Date()
  const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ')
  
  // LANGSUNG tambahkan ke riwayat dan update balance
  user.balance += amount
  mockBalanceMutations.unshift({
    id: mockBalanceMutations.length + 1,
    type: 'deposit',
    reference: `deposit_${deposit_id}`,
    amount: amount,
    balance_type: 'credit',
    created_at: formattedDate
  })
  
  console.log(`✅ Deposit ${deposit_id} completed! Amount: ${amount}, New balance: ${user.balance}`)
  
  // Update first deposit untuk referral tracking (jika user punya referrer)
  if (user.referrer_id) {
    const downlineList = mockDownlineData[user.referrer_id]
    if (downlineList) {
      const downlineEntry = downlineList.find(d => d.username === user.username)
      if (downlineEntry && !downlineEntry.first_depo_date) {
        downlineEntry.first_depo_date = formattedDate
        downlineEntry.first_depo_amount = amount
        console.log(`📊 First deposit tracked for referral: ${user.username}`)
      }
    }
  }
  
  // Track pending untuk mencegah double deposit dalam waktu singkat
  pendingDeposits.push({ deposit_id, createdAt: Date.now() })
  setTimeout(() => {
    pendingDeposits = pendingDeposits.filter(d => d.deposit_id !== deposit_id)
  }, 5000)
  
  // Response sesuai Swagger - tambahkan amount
  if (bank.type === 'qris') {
    res.json({ deposit_id, amount, type: 'qris', raw: `QRIS_RAW_DATA_${deposit_id}` })
  } else {
    res.json({ deposit_id, amount, type: 'e-wallet', name: bank.name, account: bank.account, number: bank.number })
  }
})

// POST /withdraw
router.post('/withdraw', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  
  // Auto-clear old pending withdraws (no createdAt or older than 5 seconds)
  if (pendingWithdraws.length > 0) {
    const pending = pendingWithdraws[0]
    if (!pending.createdAt || Date.now() - pending.createdAt > 5000) {
      console.log('🧹 Auto-clearing old pending withdraw')
      pendingWithdraws = []
    } else {
      return res.status(400).json({ message: 'have pending withdraw' })
    }
  }
  
  const { amount } = req.body
  if (user.balance < amount) {
    return res.status(400).json({ message: 'insufficient balance' })
  }
  
  const withdraw_id = Math.floor(Math.random() * 1000000)
  const now = new Date()
  const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ')
  
  // LANGSUNG kurangi balance dan tambahkan ke riwayat
  user.balance -= amount
  mockBalanceMutations.unshift({
    id: mockBalanceMutations.length + 1,
    type: 'withdraw',
    reference: `wd_${withdraw_id}`,
    amount: amount,
    balance_type: 'debit',
    created_at: formattedDate
  })
  
  console.log(`✅ Withdraw ${withdraw_id} completed! Amount: ${amount}, New balance: ${user.balance}`)
  
  // Track pending untuk mencegah double withdraw dalam waktu singkat
  pendingWithdraws.push({ withdraw_id, createdAt: Date.now() })
  setTimeout(() => {
    pendingWithdraws = pendingWithdraws.filter(w => w.withdraw_id !== withdraw_id)
  }, 5000)
  
  // Response sesuai Swagger - tambahkan amount
  res.json({ withdraw_id, amount, type: 'e-wallet', name: user.bank_name, account: user.bank_account, number: user.bank_number })
})

// GET /user-referral
router.get('/user-referral', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  
  // Get downline for current user (real data)
  const downline = mockDownlineData[user.id] || []
  
  res.json({
    referral: mockReferralInfo,
    downline
  })
})

// GET /user-promo
router.get('/user-promo', (req, res) => {
  res.json(mockPromoCodes)
})

// GET /info - WebsiteInfo (OpenAPI) + Extended data
router.get('/info', (req, res) => {
  res.json({
    // === WebsiteInfo (OpenAPI) ===
    notification: mockWebsiteInfo.notification,
    lottery_result: mockWebsiteInfo.lottery_result,
    withdraw_list: getRecentWithdrawals(),
    
    // === Extended untuk Frontend ===
    config: mockWebsiteConfig,
    banks: mockBanks,
    referral: mockReferralInfo,
    promotions: mockPromotions
  })
})

// GET /website - sesuai Swagger (dengan domain query param)
router.get('/website', (req, res) => {
  const { domain } = req.query
  console.log(`📡 GET /website${domain ? `?domain=${domain}` : ''}`)
  console.log('✅ Response:', JSON.stringify(mockWebsiteConfig, null, 2))
  res.json(mockWebsiteConfig)
})

// GET /bank-list
router.get('/bank-list', (req, res) => {
  res.json(mockBanks)
})

// GET /referral
router.get('/referral', (req, res) => {
  res.json(mockReferralInfo)
})

// GET /promo
router.get('/promo', (req, res) => {
  res.json(mockPromotions)
})

// GET /slot
router.get('/slot', (req, res) => {
  console.log('📡 GET /slot')
  console.log('✅ Response:', JSON.stringify(mockSlotProviders, null, 2))
  res.json(mockSlotProviders)
})

// GET /fish
router.get('/fish', (req, res) => {
  console.log('📡 GET /fish')
  console.log('✅ Response:', JSON.stringify(mockFishProviders, null, 2))
  res.json(mockFishProviders)
})

// GET /casino
router.get('/casino', (req, res) => {
  console.log('📡 GET /casino')
  console.log('✅ Response:', JSON.stringify(mockCasinoProviders, null, 2))
  res.json(mockCasinoProviders)
})

// GET /sportsbook
router.get('/sportsbook', (req, res) => {
  console.log('📡 GET /sportsbook')
  console.log('✅ Response:', JSON.stringify(mockSportsbookProviders, null, 2))
  res.json(mockSportsbookProviders)
})

// GET /togel
router.get('/togel', (req, res) => {
  console.log('📡 GET /togel')
  console.log('✅ Response:', JSON.stringify(mockTogelProviders, null, 2))
  res.json(mockTogelProviders)
})

// GET /arcade
router.get('/arcade', (req, res) => {
  console.log('📡 GET /arcade')
  console.log('✅ Response:', JSON.stringify(mockArcadeProviders, null, 2))
  res.json(mockArcadeProviders)
})

// GET /poker
router.get('/poker', (req, res) => {
  console.log('📡 GET /poker')
  console.log('✅ Response:', JSON.stringify(mockPokerProviders, null, 2))
  res.json(mockPokerProviders)
})

// GET /cockfight
router.get('/cockfight', (req, res) => {
  console.log('📡 GET /cockfight')
  console.log('✅ Response:', JSON.stringify(mockCockfightProviders, null, 2))
  res.json(mockCockfightProviders)
})

// GET /game-list
router.get('/game-list', (req, res) => {
  const { provider_id } = req.query
  console.log(`📡 GET /game-list?provider_id=${provider_id}`)
  const games = mockGames[provider_id]
  if (!games) {
    console.log('❌ Error: provider not found')
    return res.status(400).json({ message: 'provider not found' })
  }
  console.log('✅ Response:', JSON.stringify(games, null, 2))
  res.json(games)
})

// GET /play - sesuai Swagger: returns { game_url }
router.get('/play', (req, res) => {
  const { provider_id, game_id } = req.query
  console.log(`📡 GET /play?provider_id=${provider_id}&game_id=${game_id}`)
  
  const user = verifyToken(req)
  if (!user) {
    console.log('❌ Error: please login')
    return res.status(400).json({ message: 'please login' })
  }
  
  const games = mockGames[provider_id]
  if (!games) {
    console.log('❌ Error: provider not found')
    return res.status(400).json({ message: 'provider not found' })
  }
  
  // Game schema now uses 'id' instead of 'game_id'
  const game = games.find(g => g.id === parseInt(game_id))
  if (!game) {
    console.log('❌ Error: game not found')
    return res.status(400).json({ message: 'game not found' })
  }
  
  // Return JSON dengan game_url sesuai Swagger
  const response = {
    game_url: `https://game.example.com/play?token=mock_${Date.now()}`
  }
  console.log('✅ Response:', JSON.stringify(response, null, 2))
  res.json(response)
})

// POST /bet
router.post('/bet', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  
  const bets = req.body
  console.log('📥 Bet request:', JSON.stringify(bets, null, 2))
  
  if (!Array.isArray(bets) || bets.length === 0) {
    return res.status(400).json({ message: 'invalid bet data' })
  }
  
  const market = bets[0]?.market
  const marketInfo = mockMarketInfo[market]
  if (!marketInfo) return res.status(400).json({ message: 'market not found' })
  if (marketInfo.status === 'closed') return res.status(400).json({ message: 'market closed' })
  
  const totalPay = bets.reduce((sum, bet) => sum + bet.pay, 0)
  if (user.balance < totalPay) {
    return res.status(400).json({ message: 'insufficient balance' })
  }
  
  // Kurangi saldo
  user.balance -= totalPay
  console.log(`💰 Balance updated: ${user.username} -> Rp ${user.balance.toLocaleString()}`)
  
  // Simpan ke bet history
  bets.forEach(bet => {
    const historyEntry = {
      ...bet,
      status: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
    if (!mockBetHistory[market]) {
      mockBetHistory[market] = []
    }
    mockBetHistory[market].unshift(historyEntry) // Add to beginning
  })
  
  console.log(`✅ Bet placed successfully. Total: Rp ${totalPay.toLocaleString()}`)
  res.json({ 
    message: 'success',
    new_balance: user.balance,
    total_bet: totalPay
  })
})

// GET /bet-history
router.get('/bet-history', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  
  const { market } = req.query
  if (!mockMarketInfo[market]) {
    return res.status(400).json({ message: 'market not found' })
  }
  
  res.json(mockBetHistory[market] || [])
})

// GET /market-info
router.get('/market-info', (req, res) => {
  const { market, type } = req.query
  console.log(`📊 Market info request: ${market} (${type})`)
  const info = mockMarketInfo[market]
  if (!info) return res.status(400).json({ message: 'market not found' })
  if (!['4d', '3d', '2d'].includes(type?.toLowerCase())) {
    return res.status(400).json({ message: 'type not found' })
  }
  // Response sesuai Swagger MarketInfo schema
  const response = {
    market: market,
    status: info.status,
    prize: info.prize,
    min_bet: info.min_bet,
    bet_shortcut: info.bet_shortcut,
    discount_percentage: info.discount_percentage
  }
  console.log(`   → Response:`, JSON.stringify(response))
  res.json(response)
})

// GET /theme
router.get('/theme', (req, res) => {
  res.json(mockWebsiteConfig.theme)
})

// POST /theme
router.post('/theme', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  
  const { season, background_color, background_image, border_color } = req.body
  if (season !== undefined) mockWebsiteConfig.theme.season = season
  if (background_color !== undefined) mockWebsiteConfig.theme.background_color = background_color
  if (background_image !== undefined) mockWebsiteConfig.theme.background_image = background_image
  if (border_color !== undefined) mockWebsiteConfig.theme.border_color = border_color
  
  res.json({ message: 'success' })
})

// Mount router
app.use('/api/v1', router)

// Root redirect to docs
app.get('/', (req, res) => {
  res.redirect('/docs')
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock API Server running!`)
  console.log(`   API:     http://localhost:${PORT}/api/v1`)
  console.log(`   Swagger: http://localhost:${PORT}/docs`)
  console.log(`\n📝 Test Credentials:`)
  console.log(`   Username: user1`)
  console.log(`   Password: 123\n`)
})
