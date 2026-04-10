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
const fs = require('fs')
const multer = require('multer')
const { pathToFileURL } = require('url')

const providerMockAnimatedImages = require(path.join(
  __dirname,
  '../src/data/provider-mock-animated-images.json'
))
const pImg = (providerId) => providerMockAnimatedImages[String(providerId)]

const app = express()
const PORT = 4010

const uploadBrandCard = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
})

function safeBrandSlug(s, maxLen = 96) {
  if (s == null || typeof s !== 'string') return ''
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLen)
}

function requireBrandCardAdmin(req, res, next) {
  const key = process.env.BRAND_CARD_ADMIN_KEY
  if (!key) return next()
  if (req.get('x-admin-key') !== key) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}

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
// OpenAPI: { provider_id, name, image } — gambar dari public/animated-brand
const mockSlotProviders = [
  { provider_id: 1001, name: 'pragmatic-play', image: pImg(1001), badge: { type: 'hot' } },
  { provider_id: 1002, name: 'pg-soft', image: pImg(1002), badge: { type: 'new' } },
  { provider_id: 1003, name: 'nolimit-city', image: pImg(1003) },
  { provider_id: 1004, name: 'lucky-monaco', image: pImg(1004) },
  { provider_id: 1005, name: 'joker', image: pImg(1005) },
  { provider_id: 1006, name: 'cq9', image: pImg(1006) },
  { provider_id: 1007, name: 'habanero', image: pImg(1007) },
  { provider_id: 1008, name: 'yggdrasil', image: pImg(1008) },
  { provider_id: 1009, name: 'worldmatch', image: pImg(1009) },
  { provider_id: 1010, name: 'sboslot', image: pImg(1010) },
  { provider_id: 1011, name: 'funkygames', image: pImg(1011) },
  { provider_id: 1012, name: 'microgaming', image: pImg(1012) },
  { provider_id: 1013, name: 'netent', image: pImg(1013) },
  { provider_id: 1014, name: 'afb777', image: pImg(1014) },
  { provider_id: 1015, name: 'jili', image: pImg(1015) },
  { provider_id: 1016, name: 'rich88', image: pImg(1016) },
  { provider_id: 1017, name: 'advantplay', image: pImg(1017) },
  { provider_id: 1018, name: 'kingmaker', image: pImg(1018) },
  { provider_id: 1019, name: 'ygr', image: pImg(1019) },
  { provider_id: 1020, name: 'playstar', image: pImg(1020) },
  { provider_id: 1021, name: 'fastspin', image: pImg(1021) },
  { provider_id: 1022, name: 'dragoonsoft', image: pImg(1022) },
  { provider_id: 1023, name: 'nagagames', image: pImg(1023) },
  { provider_id: 1024, name: 'slot-partner-1', image: pImg(1024) },
  { provider_id: 1025, name: 'slot-partner-2', image: pImg(1025) },
  { provider_id: 1026, name: 'slot-partner-3', image: pImg(1026) },
  { provider_id: 1027, name: 'slot-partner-4', image: pImg(1027) },
  { provider_id: 1028, name: 'slot-partner-5', image: pImg(1028) },
  { provider_id: 1029, name: 'slot-partner-6', image: pImg(1029) },
  { provider_id: 1030, name: 'slot-partner-7', image: pImg(1030) },
  { provider_id: 1031, name: 'slot-partner-8', image: pImg(1031) },
  { provider_id: 1032, name: 'slot-partner-9', image: pImg(1032) },
  { provider_id: 1033, name: 'slot-partner-10', image: pImg(1033) },
  { provider_id: 1034, name: 'slot-partner-11', image: pImg(1034) },
  { provider_id: 1035, name: 'slot-partner-12', image: pImg(1035) },
  { provider_id: 1036, name: 'slot-partner-13', image: pImg(1036) },
  { provider_id: 1037, name: 'slot-partner-14', image: pImg(1037) },
  { provider_id: 1038, name: 'slot-partner-15', image: pImg(1038) },
  { provider_id: 1039, name: 'slot-partner-16', image: pImg(1039) },
  { provider_id: 1040, name: 'slot-partner-17', image: pImg(1040) },
  { provider_id: 1041, name: 'slot-partner-18', image: pImg(1041) },
  { provider_id: 1042, name: 'slot-partner-19', image: pImg(1042) },
  { provider_id: 1043, name: 'slot-partner-20', image: pImg(1043) },
  { provider_id: 1044, name: 'slot-partner-21', image: pImg(1044) },
  { provider_id: 1045, name: 'slot-partner-22', image: pImg(1045) },
  { provider_id: 1046, name: 'slot-partner-23', image: pImg(1046) },
  { provider_id: 1047, name: 'slot-partner-24', image: pImg(1047) },
  { provider_id: 1048, name: 'slot-partner-25', image: pImg(1048) },
  { provider_id: 1049, name: 'slot-partner-26', image: pImg(1049) },
  { provider_id: 1050, name: 'slot-partner-27', image: pImg(1050) },
  { provider_id: 1051, name: 'slot-partner-28', image: pImg(1051) },
  { provider_id: 1052, name: 'slot-partner-29', image: pImg(1052) },
  { provider_id: 1053, name: 'slot-partner-30', image: pImg(1053) },
  { provider_id: 1054, name: 'slot-partner-31', image: pImg(1054) },
]

// ============ FISH PROVIDERS (2xxx) ============
const mockFishProviders = [
  { provider_id: 2001, name: 'microgaming-fishing', image: pImg(2001) },
  { provider_id: 2002, name: 'jdb-fishing', image: pImg(2002) },
  { provider_id: 2003, name: 'jili-fishing', image: pImg(2003) },
  { provider_id: 2004, name: 'funky-fishing', image: pImg(2004) },
  { provider_id: 2005, name: 'dragoon-fishing', image: pImg(2005) },
  { provider_id: 2006, name: 'cq9-fishing', image: pImg(2006) },
  { provider_id: 2007, name: 'fachai-fishing', image: pImg(2007) },
  { provider_id: 2008, name: 'brand-bt-gaming', image: pImg(2008) },
  { provider_id: 2009, name: 'brand-v-plus', image: pImg(2009) },
  { provider_id: 2010, name: 'brand-ka-gaming', image: pImg(2010) },
]

// ============ CASINO PROVIDERS (3xxx) ============
const mockCasinoProviders = [
  { provider_id: 3001, name: '568win', image: pImg(3001) },
  { provider_id: 3002, name: 'wm-casino', image: pImg(3002) },
  { provider_id: 3003, name: 'ion-casino', image: pImg(3003) },
  { provider_id: 3004, name: 'sa-gaming', image: pImg(3004) },
  { provider_id: 3005, name: 'evolution-gaming', image: pImg(3005) },
  { provider_id: 3006, name: 'allbet', image: pImg(3006) },
  { provider_id: 3007, name: 'green-dragon', image: pImg(3007) },
  { provider_id: 3008, name: 'pragmatic-casino', image: pImg(3008) },
  { provider_id: 3009, name: 'yb-live', image: pImg(3009) },
  { provider_id: 3010, name: 'afb777-casino', image: pImg(3010) },
  { provider_id: 3011, name: 'playtech', image: pImg(3011) },
  { provider_id: 3012, name: 'asia-gaming', image: pImg(3012) },
  { provider_id: 3013, name: 'wcasino', image: pImg(3013) },
  { provider_id: 3014, name: 'gameplay-interactive', image: pImg(3014) },
  { provider_id: 3015, name: 'ezugi', image: pImg(3015) },
  { provider_id: 3016, name: 'a-star', image: pImg(3016) },
  { provider_id: 3017, name: 'grand-live', image: pImg(3017) },
  { provider_id: 3019, name: 'lucky-heart-live', image: pImg(3019) },
  { provider_id: 3020, name: 'casinogame', image: pImg(3020) },
  { provider_id: 3021, name: 'dream-gaming', image: pImg(3021) },
  { provider_id: 3022, name: 'mac88', image: pImg(3022) },
  { provider_id: 3023, name: 'sexy-gaming', image: pImg(3023) },
  { provider_id: 3018, name: 'microgaming-live', image: pImg(3018) },
]

// ============ SPORTSBOOK PROVIDERS (4xxx) ============
const mockSportsbookProviders = [
  { provider_id: 4001, name: 'sbobet', image: pImg(4001) },
  { provider_id: 4002, name: 'saba-sports', image: pImg(4002) },
  { provider_id: 4003, name: 'afb777-sports', image: pImg(4003) },
  { provider_id: 4004, name: 'bti', image: pImg(4004) },
  { provider_id: 4005, name: 'betpanda', image: pImg(4005) },
  { provider_id: 4006, name: 'cmd368', image: pImg(4006) },
  { provider_id: 4007, name: 'lucky-sports-plus', image: pImg(4007) },
  { provider_id: 4008, name: 'united-gaming', image: pImg(4008) },
]

// ============ TOGEL PROVIDERS (5xxx) ============
const mockTogelProviders = [
  { provider_id: 5001, name: 'hongkong-lotto', image: pImg(5001) },
  { provider_id: 5002, name: 'sydney-lotto', image: pImg(5002) },
  { provider_id: 5003, name: 'singapore-togel', image: pImg(5003) },
  { provider_id: 5004, name: 'kamboja-togel', image: pImg(5004) },
  { provider_id: 5005, name: 'taiwan-togel', image: pImg(5005) },
  { provider_id: 5006, name: 'china-togel', image: pImg(5006) },
  { provider_id: 5007, name: 'japan-togel', image: pImg(5007) },
]

// ============ ARCADE PROVIDERS (6xxx) ============
const mockArcadeProviders = [
  { provider_id: 6001, name: 'aviatrix-arcade', image: pImg(6001) },
  { provider_id: 6002, name: 'kingmidas-arcade', image: pImg(6002) },
  { provider_id: 6003, name: 'sbobet-arcade', image: pImg(6003) },
  { provider_id: 6004, name: 'spribe-arcade', image: pImg(6004) },
  { provider_id: 6005, name: 'brand-arc-jdb', image: pImg(6005) },
  { provider_id: 6006, name: 'brand-arc-cq9', image: pImg(6006) },
  { provider_id: 6007, name: 'brand-arc-fachai', image: pImg(6007) },
  { provider_id: 6008, name: 'brand-arc-rich88', image: pImg(6008) },
  { provider_id: 6009, name: 'brand-arc-askmeslot', image: pImg(6009) },
  { provider_id: 6010, name: 'brand-arc-six', image: pImg(6010) },
]

// ============ CRUSH PROVIDERS (9xxx) ============
const mockCrushProviders = [
  { provider_id: 9001, name: 'crush-rocket-1', image: pImg(9001) },
  { provider_id: 9002, name: 'crush-rocket-2', image: pImg(9002) },
  { provider_id: 9003, name: 'crush-rocket-3', image: pImg(9003) },
  { provider_id: 9004, name: 'crush-rocket-4', image: pImg(9004) },
  { provider_id: 9005, name: 'crush-rocket-5', image: pImg(9005) },
  { provider_id: 9006, name: 'crush-rocket-6', image: pImg(9006) },
  { provider_id: 9007, name: 'crush-rocket-7', image: pImg(9007) },
  { provider_id: 9008, name: 'crush-rocket-8', image: pImg(9008) },
  { provider_id: 9009, name: 'crush-rocket-9', image: pImg(9009) },
]

// ============ ESPORTS PROVIDERS (91xx) ============
const mockEsportsProviders = [
  { provider_id: 9101, name: 'ia-esports', image: pImg(9101) },
  { provider_id: 9102, name: 'sbobetesports', image: pImg(9102) },
  { provider_id: 9103, name: 'hp-gaming', image: pImg(9103) },
]

// ============ POKER PROVIDERS (7xxx) ============
const mockPokerProviders = [
  { provider_id: 7001, name: 'millionaire-poker', image: pImg(7001) },
]

// ============ COCKFIGHT PROVIDERS (8xxx) ============
const mockCockfightProviders = [
  { provider_id: 8001, name: 'ga28-cockfight', image: pImg(8001) },
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
  '1024': [{ id: 60, name: 'Slot Partner 1', image: null }],
  '1025': [{ id: 61, name: 'Slot Partner 2', image: null }],
  '1026': [{ id: 62, name: 'Slot Partner 3', image: null }],
  '1027': [{ id: 63, name: 'Slot Partner 4', image: null }],
  '1028': [{ id: 64, name: 'Slot Partner 5', image: null }],
  '1029': [{ id: 65, name: 'Slot Partner 6', image: null }],
  '1030': [{ id: 66, name: 'Slot Partner 7', image: null }],
  '1031': [{ id: 67, name: 'Slot Partner 8', image: null }],
  '1032': [{ id: 68, name: 'Slot Partner 9', image: null }],
  '1033': [{ id: 69, name: 'Slot Partner 10', image: null }],
  '1034': [{ id: 70, name: 'Slot Partner 11', image: null }],
  '1035': [{ id: 71, name: 'Slot Partner 12', image: null }],
  '1036': [{ id: 72, name: 'Slot Partner 13', image: null }],
  '1037': [{ id: 73, name: 'Slot Partner 14', image: null }],
  '1038': [{ id: 74, name: 'Slot Partner 15', image: null }],
  '1039': [{ id: 75, name: 'Slot Partner 16', image: null }],
  '1040': [{ id: 76, name: 'Slot Partner 17', image: null }],
  '1041': [{ id: 77, name: 'Slot Partner 18', image: null }],
  '1042': [{ id: 78, name: 'Slot Partner 19', image: null }],
  '1043': [{ id: 79, name: 'Slot Partner 20', image: null }],
  '1044': [{ id: 80, name: 'Slot Partner 21', image: null }],
  '1045': [{ id: 81, name: 'Slot Partner 22', image: null }],
  '1046': [{ id: 82, name: 'Slot Partner 23', image: null }],
  '1047': [{ id: 83, name: 'Slot Partner 24', image: null }],
  '1048': [{ id: 84, name: 'Slot Partner 25', image: null }],
  '1049': [{ id: 85, name: 'Slot Partner 26', image: null }],
  '1050': [{ id: 86, name: 'Slot Partner 27', image: null }],
  '1051': [{ id: 87, name: 'Slot Partner 28', image: null }],
  '1052': [{ id: 88, name: 'Slot Partner 29', image: null }],
  '1053': [{ id: 89, name: 'Slot Partner 30', image: null }],
  '1054': [{ id: 90, name: 'Slot Partner 31', image: null }],

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
  '2008': [ // brand-bt-gaming
    { id: 116, name: 'BT Gaming Fishing', image: null },
  ],
  '2009': [ // brand-v-plus
    { id: 117, name: 'V Plus Fishing', image: null },
  ],
  '2010': [ // brand-ka-gaming
    { id: 118, name: 'KA Gaming Fishing', image: null },
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
  '3015': [ // ezugi
    { id: 221, name: 'Ezugi Baccarat', image: null },
  ],
  '3016': [ // a-star
    { id: 222, name: 'A Star Baccarat', image: null },
  ],
  '3017': [ // grand-live
    { id: 223, name: 'Grand Live Baccarat', image: null },
  ],
  '3018': [ // microgaming-live
    { id: 224, name: 'Microgaming Live Roulette', image: null },
  ],
  '3019': [ // lucky-heart-live
    { id: 225, name: 'Lucky Heart Baccarat', image: null },
  ],
  '3020': [ // casinogame
    { id: 226, name: 'Casinogame Baccarat', image: null },
  ],
  '3021': [ // dream-gaming
    { id: 227, name: 'DreamGaming Baccarat', image: null },
  ],
  '3022': [ // mac88
    { id: 228, name: 'MAC88 Baccarat', image: null },
  ],
  '3023': [ // sexy-gaming
    { id: 229, name: 'Sexy Gaming Baccarat', image: null },
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
  '4006': [ // cmd368
    { id: 305, name: 'CMD368 Sports', image: null },
  ],
  '4007': [ // lucky-sports-plus
    { id: 306, name: 'Lucky Sports', image: null },
  ],
  '4008': [ // united-gaming
    { id: 307, name: 'United Gaming Sports', image: null },
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
  '6005': [ // brand-arc-jdb
    { id: 613, name: 'JDB Arcade', image: null },
  ],
  '6006': [ // brand-arc-cq9
    { id: 614, name: 'CQ9 Arcade', image: null },
  ],
  '6007': [ // brand-arc-fachai
    { id: 615, name: 'FA Chai Arcade', image: null },
  ],
  '6008': [ // brand-arc-rich88
    { id: 616, name: 'Rich88 Arcade', image: null },
  ],
  '6009': [ // brand-arc-askmeslot
    { id: 617, name: 'AskMeSlot Arcade', image: null },
  ],
  '6010': [ // brand-arc-six
    { id: 618, name: 'Arcade', image: null },
  ],

  // ===== CRUSH (9xxx) =====
  '9001': [{ id: 901, name: 'Crush Game 1', image: null }],
  '9002': [{ id: 902, name: 'Crush Game 2', image: null }],
  '9003': [{ id: 903, name: 'Crush Game 3', image: null }],
  '9004': [{ id: 904, name: 'Crush Game 4', image: null }],
  '9005': [{ id: 905, name: 'Crush Game 5', image: null }],
  '9006': [{ id: 906, name: 'Crush Game 6', image: null }],
  '9007': [{ id: 907, name: 'Crush Game 7', image: null }],
  '9008': [{ id: 908, name: 'Crush Game 8', image: null }],
  '9009': [{ id: 909, name: 'Crush Game 9', image: null }],

  // ===== ESPORTS (91xx) =====
  '9101': [{ id: 911, name: 'IA Esports', image: null }],
  '9102': [{ id: 912, name: 'SBOBET Esports', image: null }],
  '9103': [{ id: 913, name: '100HP Gaming', image: null }],

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
  // Footer promo block — gunakan token PUSATTOGEL; frontend mengganti dengan config.title
  footer_promo: {
    heading: 'DAFTAR UPDATE PROMO & BONUS TERBARU DI SITUS PUSATTOGEL',
    intro:
      'KAMI JUGA AKAN SELALU MEMBERIKAN UPDATE AN PROMO YANG MENARIK UNTUK SEMUA PARA PEMAIN / MEMBER DI PUSATTOGEL DENGAN REWARD HADIAH YANG TENTUNYA SANGAT BESAR DAN BISA DI DAPATKAN OLEH SEMUA PARA MEMBER DI SINI, BERIKUT DAFTAR PROMONYA :',
    lines: [
      'EVENT PROMOSI LOMBA PANJAT TO PUSATTOGEL',
      'PROMO BONUS EXTRA AJAK TEMAN 10% (AWAL DEPOSITO PERTAMA)',
      'PROMO BONUS AKUN LEVEL SULTAN PUSATTOGEL',
      'EVENT PROMOSI SILVER & GOLDEN TICKET LUCKY SPIN',
      'BONUS SALDO GRATIS / FREEBET 30, 50 , 100K',
      'BONUS EXTRA DOWNLOAD APLIKASI DAPAT FREECHIP GRATIS RP.5.000',
      'EVENT PROMO SPACEMAN BONUS BERLIMPAH',
      'PROMO MIX SPORT TARUHAN OLAHRAGA PUSATTOGEL',
      'EVENT PROMO BONUS ULANG TAHUN',
      'BONUS NEW MEMBER 50%',
      'BONUS CASHBACK MINGGUAN 0,5% SETIAP HARI SELASA',
      'BONUS CASHBACK SPORTBET 0.25%',
      'BONUS REFERRAL 0,3%',
      'BONUS DEPOSIT PULSA TANPA POTONGAN',
      'EVENT VIP PRAGMATIC PLAY & PG SOFT',
    ],
    outro:
      'DENGAN REWARD PROMO TERBAIK YANG KAMI BERIKAN TENTU SAJA HAL INI AKAN MENJADI SALAH SATU PILIHAN TERBAIK MENGAPA ANDA MEMILIH PUSATTOGEL SEBAGAI SITUS PENYEDIA GAME ONLINE TERPERCAYA. AYO TUNGGU APALAGI MARI BERGABUNG SEKARANG JUGA BERSAMA PUSATTOGEL.',
  },
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
  // Kosong: FE home memakai banner default (`mapHomePromoBanners` → public/banners/banner-1.webp)
  banner: [],
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
  //   - null                              : Tidak ada
  //   - '/bg-casino-1.webp'               : Casino 1 (local)
  //   - '/bg-casino-2.webp'               : Casino 2 (local)
  //   - 'https://cdn.example.com/bg.webp' : Absolute URL dari CDN (supported)
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

let depositRequests = []
let withdrawRequests = []
const TX_AUTO_COMPLETE_MS = 4500

const findUserPendingDeposit = (userId) =>
  depositRequests.find((r) => r.userId === userId && r.status === 'pending')

const findUserPendingWithdraw = (userId) =>
  withdrawRequests.find((r) => r.userId === userId && r.status === 'pending')

/** Payload QRIS sama seperti POST /deposit baru (untuk resync jika klien kehilangan localStorage). */
const buildQrisQrRaw = (deposit_id, amount) =>
  `00020101021126570011ID.PUSATTOGEL0215${deposit_id}0303UMI51440014ID.CO.QRIS.WWW0215ID1234567890123030${amount}5802ID5913PUSATTOGEL6007JAKARTA61051234062070703A01`

/** Response JSON deposit sesuai rekaman pending (bukan membuat deposit baru). */
const depositJsonFromPendingRecord = (rec) => {
  const bank = mockBanks.find((b) => b.id === rec.bank_id)
  if (!bank) return null
  if (bank.type === 'qris') {
    const qr_raw = buildQrisQrRaw(rec.deposit_id, rec.amount)
    return {
      deposit_id: rec.deposit_id,
      amount: rec.amount,
      type: 'qris',
      qr_raw,
      raw: qr_raw,
    }
  }
  return {
    deposit_id: rec.deposit_id,
    amount: rec.amount,
    type: 'e-wallet',
    name: bank.name,
    account: bank.account,
    number: bank.number,
  }
}

const finalizeDepositRequest = (rec, mockDownlineDataRef) => {
  if (rec.status !== 'pending') return
  const user = mockUsers.find((u) => u.id === rec.userId)
  if (!user) return
  const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
  user.balance += rec.amount
  mockBalanceMutations.unshift({
    id: mockBalanceMutations.length + 1,
    type: 'deposit',
    reference: `deposit_${rec.deposit_id}`,
    amount: rec.amount,
    balance_type: 'credit',
    created_at: formattedDate,
  })
  if (user.referrer_id && mockDownlineDataRef[user.referrer_id]) {
    const downlineEntry = mockDownlineDataRef[user.referrer_id].find((d) => d.username === user.username)
    if (downlineEntry && !downlineEntry.first_depo_date) {
      downlineEntry.first_depo_date = formattedDate
      downlineEntry.first_depo_amount = rec.amount
    }
  }
  rec.status = 'success'
}

const finalizeWithdrawRequest = (rec) => {
  if (rec.status !== 'pending') return
  const user = mockUsers.find((u) => u.id === rec.userId)
  if (!user) return
  if (user.balance < rec.amount) {
    rec.status = 'failed'
    return
  }
  const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
  user.balance -= rec.amount
  mockBalanceMutations.unshift({
    id: mockBalanceMutations.length + 1,
    type: 'withdraw',
    reference: `wd_${rec.withdraw_id}`,
    amount: rec.amount,
    balance_type: 'debit',
    created_at: formattedDate,
  })
  rec.status = 'success'
}

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

// GET /deposit-status (OpenAPI)
router.get('/deposit-status', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  const deposit_id = Number(req.query.deposit_id)
  if (!deposit_id) return res.status(400).json({ message: 'deposit_id required' })
  const rec = depositRequests.find((r) => r.deposit_id === deposit_id)
  if (!rec || rec.userId !== user.id) {
    return res.status(404).json({ message: 'deposit not found' })
  }
  if (rec.status === 'pending' && Date.now() - rec.createdAt >= TX_AUTO_COMPLETE_MS) {
    finalizeDepositRequest(rec, mockDownlineData)
  }
  if (rec.status === 'success') {
    return res.json({ status: 'success', deposit_id: rec.deposit_id, amount: rec.amount })
  }
  if (rec.status === 'failed') {
    return res.json({ status: 'fails', deposit_id: rec.deposit_id, amount: rec.amount })
  }
  return res.json({ status: 'pending', deposit_id: rec.deposit_id, amount: rec.amount })
})

// POST /deposit
router.post('/deposit', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })

  const existingPending = findUserPendingDeposit(user.id)
  if (existingPending) {
    const again = depositJsonFromPendingRecord(existingPending)
    if (again) return res.json(again)
    return res.status(400).json({ message: 'have pending deposit' })
  }

  const { bank_id, amount, promo_code } = req.body
  const bank = mockBanks.find((b) => b.id === bank_id)
  if (!bank) return res.status(400).json({ message: 'bank not found' })
  if (amount < bank.min_deposit) {
    return res.status(400).json({ message: `minimum deposit is ${bank.min_deposit}` })
  }

  const deposit_id = 1 + Math.floor(Math.random() * 999999)

  depositRequests.push({
    deposit_id,
    userId: user.id,
    amount,
    bank_id,
    promo_code: promo_code || null,
    status: 'pending',
    createdAt: Date.now(),
  })

  if (bank.type === 'qris') {
    const qr_raw = buildQrisQrRaw(deposit_id, amount)
    res.json({
      deposit_id,
      amount,
      type: 'qris',
      qr_raw,
      raw: qr_raw,
    })
  } else {
    res.json({
      deposit_id,
      amount,
      type: 'e-wallet',
      name: bank.name,
      account: bank.account,
      number: bank.number,
    })
  }
})

// GET /withdraw-status (OpenAPI)
router.get('/withdraw-status', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
  const withdraw_id = Number(req.query.withdraw_id)
  if (!withdraw_id) return res.status(400).json({ message: 'withdraw_id required' })
  const rec = withdrawRequests.find((r) => r.withdraw_id === withdraw_id)
  if (!rec || rec.userId !== user.id) {
    return res.status(404).json({ message: 'withdraw not found' })
  }
  if (rec.status === 'pending' && Date.now() - rec.createdAt >= TX_AUTO_COMPLETE_MS) {
    finalizeWithdrawRequest(rec)
  }
  if (rec.status === 'success') {
    return res.json({ status: 'success', withdraw_id: rec.withdraw_id, amount: rec.amount })
  }
  if (rec.status === 'failed') {
    return res.json({ status: 'fails', withdraw_id: rec.withdraw_id, amount: rec.amount })
  }
  return res.json({ status: 'pending', withdraw_id: rec.withdraw_id, amount: rec.amount })
})

// POST /withdraw
router.post('/withdraw', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })

  if (findUserPendingWithdraw(user.id)) {
    return res.status(400).json({ message: 'have pending withdraw' })
  }

  const { amount } = req.body
  if (user.balance < amount) {
    return res.status(400).json({ message: 'insufficient balance' })
  }

  const withdraw_id = Math.floor(Math.random() * 1000000)

  withdrawRequests.push({
    withdraw_id,
    userId: user.id,
    amount,
    status: 'pending',
    createdAt: Date.now(),
  })

  res.json({
    withdraw_id,
    amount,
    type: 'e-wallet',
    name: user.bank_name,
    account: user.bank_account,
    number: user.bank_number,
  })
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

// GET /user-promo (OpenAPI: BearerAuth)
router.get('/user-promo', (req, res) => {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ message: 'please login' })
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

// GET /website — OpenAPI: query `domain` wajib
router.get('/website', (req, res) => {
  const domain = req.query.domain != null ? String(req.query.domain).trim() : ''
  if (!domain) {
    return res.status(400).json({ message: 'domain is required' })
  }
  console.log(`📡 GET /website?domain=${domain}`)
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

// GET /crush
router.get('/crush', (req, res) => {
  console.log('📡 GET /crush')
  console.log('✅ Response:', JSON.stringify(mockCrushProviders, null, 2))
  res.json(mockCrushProviders)
})

// GET /esports
router.get('/esports', (req, res) => {
  console.log('📡 GET /esports')
  console.log('✅ Response:', JSON.stringify(mockEsportsProviders, null, 2))
  res.json(mockEsportsProviders)
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

/**
 * POST /bet — body: BetRequest[]
 * Kontrak (selaras frontend TogelBettingPage + backend nyata yang diharapkan):
 * - market: string id pasaran
 * - type: '4D' | '3D' | '2D' (per baris; BBFS mengirim banyak baris dengan type per jenis)
 * - number: string digit dipisah koma, e.g. "1,2,3,4"
 * - amount: nominal taruhan per baris (sebelum potong diskon di UI)
 * - pay: jumlah yang dipotong saldo untuk baris ini (setelah diskon jika dipakai)
 * - prize: multiplier hadiah efektif untuk baris ini (penuh jika discount:false, dikurangi jika discount:true)
 * - discount: boolean — true = pemain memilih mode diskon (bayar & multiplier disesuaikan % pasaran)
 * - position: 'full' | 'depan' | 'tengah' | 'belakang'
 */
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
  if (!['4d', '3d', '2d', 'bbfs'].includes(String(type || '').toLowerCase())) {
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

/** Hapus pending deposit/withdraw di memori — hanya untuk mock lokal / Playwright (jangan expose ke publik). */
router.post('/__e2e/reset-transactions', (req, res) => {
  depositRequests = []
  withdrawRequests = []
  res.json({ ok: true })
})

const BANNER_OPTIONAL_KEYS = [
  'title_line1',
  'title_line2',
  'titleLine1',
  'titleLine2',
  'description',
  'tag',
  'gradient',
]

function sanitizeMockBannerArray(arr) {
  return arr.map((b, i) => {
    if (!b || typeof b !== 'object' || Array.isArray(b)) {
      return { id: `banner-${i + 1}`, image: '', link: '/promo' }
    }
    const item = {
      id: b.id != null ? String(b.id) : `banner-${i + 1}`,
      image: b.image != null ? String(b.image) : '',
      link: b.link != null ? String(b.link) : '/promo',
    }
    for (const k of BANNER_OPTIONAL_KEYS) {
      if (b[k] != null && String(b[k]).trim() !== '') item[k] = String(b[k])
    }
    return item
  })
}

/**
 * PATCH partial `about` + `banner` di memori — GET /info langsung mengikuti.
 * Dev/mock only. Jika BRAND_CARD_ADMIN_KEY diset, kirim header X-Admin-Key.
 */
router.patch('/__mock/website-config', requireBrandCardAdmin, (req, res) => {
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {}
  const { about, banner } = body

  if (about !== undefined) {
    if (typeof about !== 'string') {
      return res.status(400).json({ message: 'about must be a string' })
    }
    mockWebsiteConfig.about = about
  }
  if (banner !== undefined) {
    if (!Array.isArray(banner)) {
      return res.status(400).json({ message: 'banner must be an array' })
    }
    mockWebsiteConfig.banner = sanitizeMockBannerArray(banner)
  }

  if (about === undefined && banner === undefined) {
    return res.status(400).json({ message: 'provide at least one of: about, banner' })
  }

  res.json({
    ok: true,
    config: {
      about: mockWebsiteConfig.about,
      banner: mockWebsiteConfig.banner,
    },
  })
})

/**
 * POST multipart: character, logo (files) + category, id (fields). Optional: options (JSON string).
 * Menulis WebP 290×180 ke public/animated-brand/{category}/{category}-{id}.webp
 * Set BRAND_CARD_ADMIN_KEY + header X-Admin-Key untuk membatasi akses.
 */
router.post(
  '/admin/normalize-brand-card',
  requireBrandCardAdmin,
  uploadBrandCard.fields([
    { name: 'character', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const category = safeBrandSlug(req.body?.category || '')
      const id = safeBrandSlug(req.body?.id || '')
      if (!category || !id) {
        return res.status(400).json({
          message: 'category and id are required (URL-safe slug, e.g. slot + slot-partner-11)',
        })
      }
      const charFile = req.files?.character?.[0]
      const logoFile = req.files?.logo?.[0]
      if (!charFile?.buffer || !logoFile?.buffer) {
        return res.status(400).json({ message: 'multipart files "character" and "logo" are required' })
      }

      let options = {}
      if (req.body?.options && typeof req.body.options === 'string') {
        try {
          options = JSON.parse(req.body.options)
          if (options == null || typeof options !== 'object' || Array.isArray(options)) options = {}
        } catch {
          return res.status(400).json({ message: 'options must be valid JSON object string' })
        }
      }

      const modUrl = pathToFileURL(path.join(__dirname, '../scripts/lib/brandCardNormalize.mjs')).href
      const { normalizeBrandCardToWebp, BRAND_CARD } = await import(modUrl)
      const webp = await normalizeBrandCardToWebp(charFile.buffer, logoFile.buffer, options)

      const projectRoot = path.join(__dirname, '..')
      const outDir = path.join(projectRoot, 'public', 'animated-brand', category)
      const fileName = `${category}-${id}.webp`
      fs.mkdirSync(outDir, { recursive: true })
      const outPath = path.join(outDir, fileName)
      fs.writeFileSync(outPath, webp)

      const relativeUrl = `/animated-brand/${category}/${fileName}`
      return res.json({
        ok: true,
        relativeUrl,
        bytes: webp.length,
        width: BRAND_CARD.CARD_W,
        height: BRAND_CARD.CARD_H,
      })
    } catch (e) {
      console.error('normalize-brand-card:', e)
      return res.status(500).json({ message: e?.message || 'normalize failed' })
    }
  }
)

// Mount router
app.use('/api/v1', router)

// Root redirect to docs
app.get('/', (req, res) => {
  res.redirect('/docs')
})

// Start server hanya saat dijalankan langsung (bukan saat di-import untuk tes)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Mock API Server running!`)
    console.log(`   API:     http://localhost:${PORT}/api/v1`)
    console.log(`   Swagger: http://localhost:${PORT}/docs`)
    console.log(`\n📝 Test Credentials:`)
    console.log(`   Username: user1`)
    console.log(`   Password: 123\n`)
  })
}

module.exports = { app }
