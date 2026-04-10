// Mock API Service - sesuai OpenAPI spec
// Simulasi delay untuk menyerupai real API
// Struktur data ini siap untuk integrasi MySQL
import providerMockAnimatedImages from '../data/provider-mock-animated-images.json'

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

/** Gambar provider mock: `public/animated-brand` (salinan src/assets2/animated-brand) */
const pImg = (providerId) => providerMockAnimatedImages[String(providerId)]

// Track current logged in user
let currentUserId = null

// ============================================
// MOCK DATA - Sesuai OpenAPI Spec
// Struktur siap untuk MySQL tables
// ============================================

/**
 * USERS TABLE
 * CREATE TABLE users (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   username VARCHAR(100) UNIQUE NOT NULL,
 *   password VARCHAR(255) NOT NULL,
 *   handphone VARCHAR(20) UNIQUE NOT NULL,
 *   bank_name VARCHAR(50) NOT NULL,
 *   bank_account VARCHAR(100) NOT NULL,
 *   bank_number VARCHAR(50) UNIQUE NOT NULL,
 *   balance BIGINT DEFAULT 0,
 *   currency VARCHAR(10) DEFAULT 'IDR',
 *   referral_code VARCHAR(50),
 *   referrer_id INT,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 * );
 */
const mockUsers = [
  {
    id: 1,
    username: 'user1',
    password: '123', // hashed in real DB
    handphone: '081999333444',
    bank_name: 'bca',
    bank_account: 'user1',
    bank_number: '0101000777708808',
    balance: 100000,
    currency: 'IDR',
    referral_code: 'USER1REF',
    referrer_id: null,
    created_at: '2026-01-01 00:00:00',
    updated_at: '2026-03-07 10:00:00'
  },
  {
    id: 2,
    username: 'testuser',
    password: 'test123',
    handphone: '081234567890',
    bank_name: 'mandiri',
    bank_account: 'Test User',
    bank_number: '1234567890123',
    balance: 50000,
    currency: 'IDR',
    referral_code: 'TESTREF',
    referrer_id: 1,
    created_at: '2026-02-01 00:00:00',
    updated_at: '2026-03-07 10:00:00'
  }
]

/**
 * BALANCE_MUTATIONS TABLE
 * CREATE TABLE balance_mutations (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   user_id INT NOT NULL,
 *   type ENUM('bonus roling', 'bonus cashback', 'bonus referral', 'withdraw', 'lottery', 'game', 'deposit') NOT NULL,
 *   reference VARCHAR(100) NOT NULL,
 *   amount BIGINT NOT NULL,
 *   balance_type ENUM('credit', 'debit') NOT NULL,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id)
 * );
 */
// Riwayat transaksi - dimulai kosong, hanya transaksi real yang masuk
let mockBalanceMutations = []

/**
 * BANKS TABLE
 * CREATE TABLE banks (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   type ENUM('e-wallet', 'bank-transfer', 'qris') NOT NULL,
 *   name VARCHAR(50) NOT NULL,
 *   account VARCHAR(100) NOT NULL,
 *   number VARCHAR(50),
 *   min_deposit BIGINT NOT NULL,
 *   active BOOLEAN DEFAULT TRUE,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 */
const mockBanks = [
  {
    id: 1,
    type: 'e-wallet',
    name: 'gopay',
    account: 'PUSATTOGEL',
    number: '081577784445',
    min_deposit: 20000
  },
  {
    id: 2,
    type: 'e-wallet',
    name: 'dana',
    account: 'PUSATTOGEL',
    number: '081577784446',
    min_deposit: 20000
  },
  {
    id: 3,
    type: 'e-wallet',
    name: 'ovo',
    account: 'PUSATTOGEL',
    number: '081577784447',
    min_deposit: 20000
  },
  {
    id: 4,
    type: 'bank-transfer',
    name: 'bca',
    account: 'PUSATTOGEL',
    number: '1234567890',
    min_deposit: 50000
  },
  {
    id: 5,
    type: 'bank-transfer',
    name: 'mandiri',
    account: 'PUSATTOGEL',
    number: '9876543210',
    min_deposit: 50000
  },
  {
    id: 6,
    type: 'bank-transfer',
    name: 'bni',
    account: 'PUSATTOGEL',
    number: '1122334455',
    min_deposit: 50000
  },
  {
    id: 7,
    type: 'bank-transfer',
    name: 'bri',
    account: 'PUSATTOGEL',
    number: '0011223344',
    min_deposit: 50000
  },
  {
    id: 8,
    type: 'bank-transfer',
    name: 'cimb',
    account: 'PUSATTOGEL',
    number: '5566778899',
    min_deposit: 50000
  },
  {
    id: 9,
    type: 'bank-transfer',
    name: 'danamon',
    account: 'PUSATTOGEL',
    number: '9988776655',
    min_deposit: 50000
  },
  {
    id: 10,
    type: 'bank-transfer',
    name: 'permata',
    account: 'PUSATTOGEL',
    number: '1357924680',
    min_deposit: 50000
  },
  {
    id: 11,
    type: 'e-wallet',
    name: 'linkaja',
    account: 'PUSATTOGEL',
    number: '081577784448',
    min_deposit: 20000
  },
  {
    id: 12,
    type: 'qris',
    name: 'QRIS',
    account: 'PUSATTOGEL',
    number: '',
    min_deposit: 10000
  }
]

/**
 * PROMOTIONS TABLE
 * CREATE TABLE promotions (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   title VARCHAR(255) NOT NULL,
 *   image VARCHAR(500),
 *   description TEXT,
 *   active BOOLEAN DEFAULT TRUE,
 *   start_date DATE,
 *   end_date DATE,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 * );
 */
const mockPromotions = [
  {
    id: 1,
    title: 'BONUS DEPOSIT HARIAN 10% KHUSUS SLOT GAME',
    image: null, // null = gunakan fallback di FE
    description: 'Bonus deposit harian 10% khusus untuk permainan slot'
  },
  {
    id: 2,
    title: 'BONUS CASHBACK KEKALAHAN SPORTSBOOK UP TO 5%',
    image: null,
    description: 'Cashback kekalahan sportsbook hingga 5%'
  },
  {
    id: 3,
    title: 'BONUS CASHBACK TURNOVER 0.5% ( SPORTSBOOK )',
    image: null,
    description: 'Cashback turnover 0.5% untuk sportsbook'
  },
  {
    id: 4,
    title: 'BONUS CASHBACK TURNOVER 0.5% ( SLOT GAMES )',
    image: null,
    description: 'Cashback turnover 0.5% untuk slot games'
  },
  {
    id: 5,
    title: 'BONUS CASHBACK TURNOVER LIVE GAME 0.5%',
    image: null,
    description: 'Cashback turnover 0.5% untuk live game'
  },
  {
    id: 6,
    title: 'BONUS CASHBACK KEKALAHAN SLOT GAMES 5%',
    image: null,
    description: 'Cashback kekalahan slot games 5%'
  },
  {
    id: 7,
    title: 'BONUS CASHBACK KEKALAHAN LIVEGAME Up To 5%',
    image: null,
    description: 'Cashback kekalahan livegame hingga 5%'
  },
  {
    id: 8,
    title: 'BONUS REFERRAL',
    image: null,
    description: 'Bonus referral untuk setiap downline yang deposit'
  },
  {
    id: 9,
    title: 'SPECIAL BONUS NEW MEMBER 30%',
    image: null,
    description: 'Bonus khusus member baru hingga 30%'
  },
  {
    id: 10,
    title: 'BONUS EXTRA AJAK TEMAN 10%',
    image: null,
    description: 'Bonus extra 10% untuk ajak teman'
  },
  {
    id: 11,
    title: 'LUCKY WHEEL',
    image: null,
    description: 'Putar roda keberuntungan dan dapatkan hadiah menarik'
  },
  {
    id: 12,
    title: 'EVENT SCATTER MAHJONG WAYS 1 & 2',
    image: null,
    description: 'Event khusus scatter Mahjong Ways 1 & 2'
  }
]

/**
 * PROMO_CODES TABLE
 * CREATE TABLE promo_codes (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   name VARCHAR(100) NOT NULL,
 *   code VARCHAR(50) UNIQUE NOT NULL,
 *   type ENUM('deposit', 'cashback', 'bonus') NOT NULL,
 *   value DECIMAL(10,2) NOT NULL,
 *   min_deposit BIGINT,
 *   max_bonus BIGINT,
 *   turnover_multiplier INT,
 *   active BOOLEAN DEFAULT TRUE,
 *   start_date DATE,
 *   end_date DATE
 * );
 */
const mockPromoCodes = [
  {
    name: 'New Member',
    code: 'newmember'
  },
  {
    name: 'Deposit Bonus 10%',
    code: 'DEPOSIT10'
  },
  {
    name: 'Cashback 5%',
    code: 'CASHBACK5'
  },
  {
    name: 'Turnover 24x',
    code: '24xTO'
  }
]

/**
 * PROVIDERS TABLE
 * CREATE TABLE providers (
 *   provider_id INT PRIMARY KEY,
 *   name VARCHAR(100) NOT NULL,
 *   type ENUM('slot', 'fish', 'casino', 'sportsbook', 'togel', 'arcade', 'poker', 'cockfight') NOT NULL,
 *   active BOOLEAN DEFAULT TRUE,
 *   image VARCHAR(500)
 * );
 *
 * API list response (OpenAPI): { provider_id, name, image }
 *
 * ID Ranges:
 * - Slot: 1xxx (1001-1099)
 * - Fish: 2xxx (2001-2099)
 * - Casino: 3xxx (3001-3099)
 * - Sportsbook: 4xxx (4001-4099)
 * - Togel: 5xxx (5001-5099)
 * - Arcade: 6xxx (6001-6099)
 * - Poker: 7xxx (7001-7099)
 * - Cockfight: 8xxx (8001-8099)
 */

// ============ SLOT PROVIDERS (1xxx) ============
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

/**
 * GAMES TABLE
 * CREATE TABLE games (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   provider_id INT NOT NULL,
 *   name VARCHAR(255) NOT NULL,
 *   image VARCHAR(500),
 *   game_code VARCHAR(100),
 *   rtp DECIMAL(5,2),
 *   active BOOLEAN DEFAULT TRUE,
 *   FOREIGN KEY (provider_id) REFERENCES providers(provider_id)
 * );
 */
const mockGames = {
  // ===== SLOT GAMES (1xxx) =====
  '1001': [ // pragmatic-play
    { game_id: 1, provider_id: 1001, name: 'gate-of-olympus', display_name: 'Gate Of Olympus', image: null, rtp: 96.5 },
    { game_id: 2, provider_id: 1001, name: 'sweet-bonanza', display_name: 'Sweet Bonanza', image: null, rtp: 96.48 },
    { game_id: 3, provider_id: 1001, name: 'starlight-princess', display_name: 'Starlight Princess', image: null, rtp: 96.5 },
    { game_id: 4, provider_id: 1001, name: 'wild-west-gold', display_name: 'Wild West Gold', image: null, rtp: 96.51 },
  ],
  '1002': [ // pg-soft
    { game_id: 10, provider_id: 1002, name: 'mahjong-ways', display_name: 'Mahjong Ways', image: null, rtp: 96.95 },
    { game_id: 11, provider_id: 1002, name: 'mahjong-ways-2', display_name: 'Mahjong Ways 2', image: null, rtp: 96.95 },
    { game_id: 12, provider_id: 1002, name: 'fortune-tiger', display_name: 'Fortune Tiger', image: null, rtp: 96.81 },
  ],
  '1003': [ // nolimit-city
    { game_id: 20, provider_id: 1003, name: 'mental', display_name: 'Mental', image: null, rtp: 96.09 },
    { game_id: 21, provider_id: 1003, name: 'san-quentin', display_name: 'San Quentin', image: null, rtp: 96.03 },
  ],
  '1004': [ // lucky-monaco
    { game_id: 25, provider_id: 1004, name: 'lucky-monaco', display_name: 'Lucky Monaco', image: null, rtp: 96.5 },
  ],
  '1005': [ // joker
    { game_id: 26, provider_id: 1005, name: 'roma', display_name: 'Roma', image: null, rtp: 96.5 },
  ],
  '1006': [ // cq9 (JDB)
    { game_id: 27, provider_id: 1006, name: 'golden-empire', display_name: 'Golden Empire', image: null, rtp: 96.5 },
  ],
  '1007': [ // habanero
    { game_id: 30, provider_id: 1007, name: 'hot-hot-fruit', display_name: 'Hot Hot Fruit', image: null, rtp: 96.70 },
    { game_id: 31, provider_id: 1007, name: 'koi-gate', display_name: 'Koi Gate', image: null, rtp: 96.70 },
  ],
  '1008': [ // yggdrasil
    { game_id: 32, provider_id: 1008, name: 'vikings-go-berzerk', display_name: 'Vikings Go Berzerk', image: null, rtp: 96.1 },
  ],
  '1009': [ // worldmatch
    { game_id: 33, provider_id: 1009, name: 'wild-west', display_name: 'Wild West', image: null, rtp: 96.0 },
  ],
  '1010': [ // sboslot
    { game_id: 34, provider_id: 1010, name: 'golden-dragon', display_name: 'Golden Dragon', image: null, rtp: 96.5 },
  ],
  '1011': [ // funkygames
    { game_id: 35, provider_id: 1011, name: 'funky-fruits', display_name: 'Funky Fruits', image: null, rtp: 96.5 },
  ],
  '1012': [ // microgaming
    { game_id: 40, provider_id: 1012, name: 'immortal-romance', display_name: 'Immortal Romance', image: null, rtp: 96.86 },
    { game_id: 41, provider_id: 1012, name: 'mega-moolah', display_name: 'Mega Moolah', image: null, rtp: 88.12 },
  ],
  '1013': [ // netent
    { game_id: 42, provider_id: 1013, name: 'starburst', display_name: 'Starburst', image: null, rtp: 96.09 },
  ],
  '1014': [ // afb777
    { game_id: 43, provider_id: 1014, name: 'lucky-777', display_name: 'Lucky 777', image: null, rtp: 96.5 },
  ],
  '1015': [ // jili
    { game_id: 50, provider_id: 1015, name: 'super-ace', display_name: 'Super Ace', image: null, rtp: 96.89 },
    { game_id: 51, provider_id: 1015, name: 'money-coming', display_name: 'Money Coming', image: null, rtp: 96.80 },
  ],
  '1016': [ // rich88
    { game_id: 52, provider_id: 1016, name: 'rich-88', display_name: 'Rich 88', image: null, rtp: 96.5 },
  ],
  '1017': [ // advantplay
    { game_id: 53, provider_id: 1017, name: 'lucky-gems', display_name: 'Lucky Gems', image: null, rtp: 96.5 },
  ],
  '1018': [ // kingmaker
    { game_id: 54, provider_id: 1018, name: 'sicbo', display_name: 'Sicbo', image: null, rtp: 97.0 },
  ],
  '1019': [ // ygr
    { game_id: 55, provider_id: 1019, name: 'fishing-god', display_name: 'Fishing God', image: null, rtp: 96.5 },
  ],
  '1020': [ // playstar
    { game_id: 56, provider_id: 1020, name: 'pharaoh-treasure', display_name: 'Pharaoh Treasure', image: null, rtp: 96.5 },
  ],
  '1021': [ // fastspin
    { game_id: 57, provider_id: 1021, name: 'fast-spin', display_name: 'Fast Spin', image: null, rtp: 96.5 },
  ],
  '1022': [ // dragoonsoft
    { game_id: 58, provider_id: 1022, name: 'dragon-gold', display_name: 'Dragon Gold', image: null, rtp: 96.5 },
  ],
  '1023': [ // nagagames
    { game_id: 59, provider_id: 1023, name: 'naga-treasure', display_name: 'Naga Treasure', image: null, rtp: 96.5 },
  ],
  '1024': [ { game_id: 60, provider_id: 1024, name: 'slot-partner-1', display_name: 'Slot Partner 1', image: null, rtp: 96.5 } ],
  '1025': [ { game_id: 61, provider_id: 1025, name: 'slot-partner-2', display_name: 'Slot Partner 2', image: null, rtp: 96.5 } ],
  '1026': [ { game_id: 62, provider_id: 1026, name: 'slot-partner-3', display_name: 'Slot Partner 3', image: null, rtp: 96.5 } ],
  '1027': [ { game_id: 63, provider_id: 1027, name: 'slot-partner-4', display_name: 'Slot Partner 4', image: null, rtp: 96.5 } ],
  '1028': [ { game_id: 64, provider_id: 1028, name: 'slot-partner-5', display_name: 'Slot Partner 5', image: null, rtp: 96.5 } ],
  '1029': [ { game_id: 65, provider_id: 1029, name: 'slot-partner-6', display_name: 'Slot Partner 6', image: null, rtp: 96.5 } ],
  '1030': [ { game_id: 66, provider_id: 1030, name: 'slot-partner-7', display_name: 'Slot Partner 7', image: null, rtp: 96.5 } ],
  '1031': [ { game_id: 67, provider_id: 1031, name: 'slot-partner-8', display_name: 'Slot Partner 8', image: null, rtp: 96.5 } ],
  '1032': [ { game_id: 68, provider_id: 1032, name: 'slot-partner-9', display_name: 'Slot Partner 9', image: null, rtp: 96.5 } ],
  '1033': [ { game_id: 69, provider_id: 1033, name: 'slot-partner-10', display_name: 'Slot Partner 10', image: null, rtp: 96.5 } ],
  '1034': [ { game_id: 70, provider_id: 1034, name: 'slot-partner-11', display_name: 'Slot Partner 11', image: null, rtp: 96.5 } ],
  '1035': [ { game_id: 71, provider_id: 1035, name: 'slot-partner-12', display_name: 'Slot Partner 12', image: null, rtp: 96.5 } ],
  '1036': [ { game_id: 72, provider_id: 1036, name: 'slot-partner-13', display_name: 'Slot Partner 13', image: null, rtp: 96.5 } ],
  '1037': [ { game_id: 73, provider_id: 1037, name: 'slot-partner-14', display_name: 'Slot Partner 14', image: null, rtp: 96.5 } ],
  '1038': [ { game_id: 74, provider_id: 1038, name: 'slot-partner-15', display_name: 'Slot Partner 15', image: null, rtp: 96.5 } ],
  '1039': [ { game_id: 75, provider_id: 1039, name: 'slot-partner-16', display_name: 'Slot Partner 16', image: null, rtp: 96.5 } ],
  '1040': [ { game_id: 76, provider_id: 1040, name: 'slot-partner-17', display_name: 'Slot Partner 17', image: null, rtp: 96.5 } ],
  '1041': [ { game_id: 77, provider_id: 1041, name: 'slot-partner-18', display_name: 'Slot Partner 18', image: null, rtp: 96.5 } ],
  '1042': [ { game_id: 78, provider_id: 1042, name: 'slot-partner-19', display_name: 'Slot Partner 19', image: null, rtp: 96.5 } ],
  '1043': [ { game_id: 79, provider_id: 1043, name: 'slot-partner-20', display_name: 'Slot Partner 20', image: null, rtp: 96.5 } ],
  '1044': [ { game_id: 80, provider_id: 1044, name: 'slot-partner-21', display_name: 'Slot Partner 21', image: null, rtp: 96.5 } ],
  '1045': [ { game_id: 81, provider_id: 1045, name: 'slot-partner-22', display_name: 'Slot Partner 22', image: null, rtp: 96.5 } ],
  '1046': [ { game_id: 82, provider_id: 1046, name: 'slot-partner-23', display_name: 'Slot Partner 23', image: null, rtp: 96.5 } ],
  '1047': [ { game_id: 83, provider_id: 1047, name: 'slot-partner-24', display_name: 'Slot Partner 24', image: null, rtp: 96.5 } ],
  '1048': [ { game_id: 84, provider_id: 1048, name: 'slot-partner-25', display_name: 'Slot Partner 25', image: null, rtp: 96.5 } ],
  '1049': [ { game_id: 85, provider_id: 1049, name: 'slot-partner-26', display_name: 'Slot Partner 26', image: null, rtp: 96.5 } ],
  '1050': [ { game_id: 86, provider_id: 1050, name: 'slot-partner-27', display_name: 'Slot Partner 27', image: null, rtp: 96.5 } ],
  '1051': [ { game_id: 87, provider_id: 1051, name: 'slot-partner-28', display_name: 'Slot Partner 28', image: null, rtp: 96.5 } ],
  '1052': [ { game_id: 88, provider_id: 1052, name: 'slot-partner-29', display_name: 'Slot Partner 29', image: null, rtp: 96.5 } ],
  '1053': [ { game_id: 89, provider_id: 1053, name: 'slot-partner-30', display_name: 'Slot Partner 30', image: null, rtp: 96.5 } ],
  '1054': [ { game_id: 90, provider_id: 1054, name: 'slot-partner-31', display_name: 'Slot Partner 31', image: null, rtp: 96.5 } ],

  // ===== FISH GAMES (2xxx) =====
  '2001': [ // microgaming-fishing
    { game_id: 100, provider_id: 2001, name: 'fish-hunter', display_name: 'Fish Hunter', image: null, rtp: null },
    { game_id: 101, provider_id: 2001, name: 'ocean-king', display_name: 'Ocean King', image: null, rtp: null },
  ],
  '2002': [ // jdb-fishing-1
    { game_id: 102, provider_id: 2002, name: 'fishing-war', display_name: 'Fishing War', image: null, rtp: null },
    { game_id: 103, provider_id: 2002, name: 'dragon-fishing', display_name: 'Dragon Fishing', image: null, rtp: null },
  ],
  '2003': [ // jili-fishing
    { game_id: 110, provider_id: 2003, name: 'jackpot-fishing', display_name: 'Jackpot Fishing', image: null, rtp: null },
    { game_id: 111, provider_id: 2003, name: 'mega-fishing', display_name: 'Mega Fishing', image: null, rtp: null },
  ],
  '2004': [ // funky-fishing
    { game_id: 112, provider_id: 2004, name: 'funky-fishing', display_name: 'Funky Fishing', image: null, rtp: null },
  ],
  '2005': [ // dragoon-fishing
    { game_id: 113, provider_id: 2005, name: 'dragon-fishing', display_name: 'Dragon Fishing', image: null, rtp: null },
  ],
  '2006': [ // cq9-fishing
    { game_id: 114, provider_id: 2006, name: 'paradise-fishing', display_name: 'Paradise Fishing', image: null, rtp: null },
  ],
  '2007': [ // fachai-fishing
    { game_id: 115, provider_id: 2007, name: 'fachai-fishing', display_name: 'FA Chai Fishing', image: null, rtp: null },
  ],
  '2008': [ // brand-bt-gaming
    { game_id: 116, provider_id: 2008, name: 'bt-gaming-fish', display_name: 'BT Gaming Fishing', image: null, rtp: null },
  ],
  '2009': [ // brand-v-plus
    { game_id: 117, provider_id: 2009, name: 'v-plus-fish', display_name: 'V Plus Fishing', image: null, rtp: null },
  ],
  '2010': [ // brand-ka-gaming
    { game_id: 118, provider_id: 2010, name: 'ka-gaming-fish', display_name: 'KA Gaming Fishing', image: null, rtp: null },
  ],

  // ===== CASINO (3xxx) =====
  '3001': [ // 568win
    { game_id: 200, provider_id: 3001, name: 'baccarat', display_name: 'Baccarat', image: null, rtp: null },
  ],
  '3002': [ // wm-casino
    { game_id: 201, provider_id: 3002, name: 'dragon-tiger', display_name: 'Dragon Tiger', image: null, rtp: null },
  ],
  '3003': [ // ion-casino
    { game_id: 202, provider_id: 3003, name: 'roulette', display_name: 'Roulette', image: null, rtp: null },
  ],
  '3004': [ // sa-gaming
    { game_id: 203, provider_id: 3004, name: 'sicbo', display_name: 'Sicbo', image: null, rtp: null },
  ],
  '3005': [ // evolution-gaming
    { game_id: 210, provider_id: 3005, name: 'lightning-roulette', display_name: 'Lightning Roulette', image: null, rtp: null },
    { game_id: 211, provider_id: 3005, name: 'crazy-time', display_name: 'Crazy Time', image: null, rtp: null },
  ],
  '3006': [ // allbet
    { game_id: 212, provider_id: 3006, name: 'baccarat-classic', display_name: 'Baccarat Classic', image: null, rtp: null },
  ],
  '3007': [ // green-dragon
    { game_id: 213, provider_id: 3007, name: 'green-dragon', display_name: 'Green Dragon', image: null, rtp: null },
  ],
  '3008': [ // pragmatic-casino
    { game_id: 214, provider_id: 3008, name: 'mega-wheel', display_name: 'Mega Wheel', image: null, rtp: null },
  ],
  '3009': [ // yb-live
    { game_id: 215, provider_id: 3009, name: 'yb-baccarat', display_name: 'YB Baccarat', image: null, rtp: null },
  ],
  '3010': [ // afb777-casino
    { game_id: 216, provider_id: 3010, name: 'afb-roulette', display_name: 'AFB Roulette', image: null, rtp: null },
  ],
  '3011': [ // playtech
    { game_id: 217, provider_id: 3011, name: 'age-of-gods', display_name: 'Age of Gods', image: null, rtp: null },
  ],
  '3012': [ // asia-gaming
    { game_id: 218, provider_id: 3012, name: 'asia-baccarat', display_name: 'Asia Baccarat', image: null, rtp: null },
  ],
  '3013': [ // wcasino
    { game_id: 219, provider_id: 3013, name: 'wcasino-roulette', display_name: 'WCasino Roulette', image: null, rtp: null },
  ],
  '3014': [ // gameplay-interactive
    { game_id: 220, provider_id: 3014, name: 'gi-baccarat', display_name: 'GI Baccarat', image: null, rtp: null },
  ],
  '3015': [ // ezugi
    { game_id: 221, provider_id: 3015, name: 'ezugi-baccarat', display_name: 'Ezugi Baccarat', image: null, rtp: null },
  ],
  '3016': [ // a-star
    { game_id: 222, provider_id: 3016, name: 'a-star-baccarat', display_name: 'A Star Baccarat', image: null, rtp: null },
  ],
  '3017': [ // grand-live
    { game_id: 223, provider_id: 3017, name: 'grand-live-baccarat', display_name: 'Grand Live Baccarat', image: null, rtp: null },
  ],
  '3018': [ // microgaming-live
    { game_id: 224, provider_id: 3018, name: 'mg-live-roulette', display_name: 'Microgaming Live Roulette', image: null, rtp: null },
  ],
  '3019': [ // lucky-heart-live
    { game_id: 225, provider_id: 3019, name: 'lucky-heart-baccarat', display_name: 'Lucky Heart Baccarat', image: null, rtp: null },
  ],
  '3020': [ // casinogame
    { game_id: 226, provider_id: 3020, name: 'casinogame-baccarat', display_name: 'Casinogame Baccarat', image: null, rtp: null },
  ],
  '3021': [ // dream-gaming
    { game_id: 227, provider_id: 3021, name: 'dream-baccarat', display_name: 'DreamGaming Baccarat', image: null, rtp: null },
  ],
  '3022': [ // mac88
    { game_id: 228, provider_id: 3022, name: 'mac88-baccarat', display_name: 'MAC88 Baccarat', image: null, rtp: null },
  ],
  '3023': [ // sexy-gaming
    { game_id: 229, provider_id: 3023, name: 'sexy-baccarat', display_name: 'Sexy Gaming Baccarat', image: null, rtp: null },
  ],

  // ===== SPORTSBOOK (4xxx) =====
  '4001': [ // sbobet
    { game_id: 300, provider_id: 4001, name: 'sports-betting', display_name: 'Sports Betting', image: null, rtp: null },
  ],
  '4002': [ // saba-sports
    { game_id: 301, provider_id: 4002, name: 'saba-sports', display_name: 'SABA Sports', image: null, rtp: null },
  ],
  '4003': [ // afb777-sports
    { game_id: 302, provider_id: 4003, name: 'afb-sports', display_name: 'AFB Sports', image: null, rtp: null },
  ],
  '4004': [ // bti
    { game_id: 303, provider_id: 4004, name: 'bti-sports', display_name: 'BTi Sports', image: null, rtp: null },
  ],
  '4005': [ // betpanda
    { game_id: 304, provider_id: 4005, name: 'betpanda-sports', display_name: 'Betpanda Sports', image: null, rtp: null },
  ],
  '4006': [ // cmd368
    { game_id: 305, provider_id: 4006, name: 'cmd368-sports', display_name: 'CMD368 Sports', image: null, rtp: null },
  ],
  '4007': [ // lucky-sports-plus
    { game_id: 306, provider_id: 4007, name: 'lucky-sports', display_name: 'Lucky Sports', image: null, rtp: null },
  ],
  '4008': [ // united-gaming
    { game_id: 307, provider_id: 4008, name: 'united-gaming-sports', display_name: 'United Gaming Sports', image: null, rtp: null },
  ],

  // ===== TOGEL (5xxx) =====
  '5001': [ // hongkong-lotto
    { game_id: 500, provider_id: 5001, name: 'hongkong-4d', display_name: 'Hongkong 4D', image: null, rtp: null },
  ],
  '5002': [ // sydney-lotto
    { game_id: 501, provider_id: 5002, name: 'sydney-4d', display_name: 'Sydney 4D', image: null, rtp: null },
  ],
  '5003': [ // singapore-togel
    { game_id: 502, provider_id: 5003, name: 'singapore-4d', display_name: 'Singapore 4D', image: null, rtp: null },
  ],
  '5004': [ // kamboja-togel
    { game_id: 503, provider_id: 5004, name: 'kamboja-4d', display_name: 'Kamboja 4D', image: null, rtp: null },
  ],
  '5005': [ // taiwan-togel
    { game_id: 504, provider_id: 5005, name: 'taiwan-4d', display_name: 'Taiwan 4D', image: null, rtp: null },
  ],
  '5006': [ // hongkong-togel
    { game_id: 505, provider_id: 5006, name: 'hk-pools', display_name: 'HK Pools', image: null, rtp: null },
  ],
  '5007': [ // sidney-togel
    { game_id: 506, provider_id: 5007, name: 'sidney-pools', display_name: 'Sidney Pools', image: null, rtp: null },
  ],

  // ===== ARCADE (6xxx) =====
  '6001': [ // aviatrix-arcade
    { game_id: 600, provider_id: 6001, name: 'aviatrix', display_name: 'Aviatrix', image: null, rtp: 97.0 },
  ],
  '6002': [ // kingmidas-arcade
    { game_id: 601, provider_id: 6002, name: 'king-midas', display_name: 'King Midas', image: null, rtp: 97.0 },
  ],
  '6003': [ // sbobet-arcade
    { game_id: 602, provider_id: 6003, name: 'virtual-sports', display_name: 'Virtual Sports', image: null, rtp: null },
  ],
  '6004': [ // spribe-arcade
    { game_id: 610, provider_id: 6004, name: 'aviator', display_name: 'Aviator', image: null, rtp: 97.0 },
    { game_id: 611, provider_id: 6004, name: 'mines', display_name: 'Mines', image: null, rtp: 97.0 },
    { game_id: 612, provider_id: 6004, name: 'plinko', display_name: 'Plinko', image: null, rtp: 97.0 },
  ],
  '6005': [ // brand-arc-jdb
    { game_id: 613, provider_id: 6005, name: 'jdb-arcade', display_name: 'JDB Arcade', image: null, rtp: null },
  ],
  '6006': [ // brand-arc-cq9
    { game_id: 614, provider_id: 6006, name: 'cq9-arcade', display_name: 'CQ9 Arcade', image: null, rtp: null },
  ],
  '6007': [ // brand-arc-fachai
    { game_id: 615, provider_id: 6007, name: 'fachai-arcade', display_name: 'FA Chai Arcade', image: null, rtp: null },
  ],
  '6008': [ // brand-arc-rich88
    { game_id: 616, provider_id: 6008, name: 'rich88-arcade', display_name: 'Rich88 Arcade', image: null, rtp: null },
  ],
  '6009': [ // brand-arc-askmeslot
    { game_id: 617, provider_id: 6009, name: 'askmeslot-arcade', display_name: 'AskMeSlot Arcade', image: null, rtp: null },
  ],
  '6010': [ // brand-arc-six
    { game_id: 618, provider_id: 6010, name: 'arcade-extra', display_name: 'Arcade', image: null, rtp: null },
  ],

  // ===== CRUSH (9xxx) =====
  '9001': [
    { game_id: 901, provider_id: 9001, name: 'crush-game-1', display_name: 'Crush Game 1', image: null, rtp: null },
  ],
  '9002': [
    { game_id: 902, provider_id: 9002, name: 'crush-game-2', display_name: 'Crush Game 2', image: null, rtp: null },
  ],
  '9003': [
    { game_id: 903, provider_id: 9003, name: 'crush-game-3', display_name: 'Crush Game 3', image: null, rtp: null },
  ],
  '9004': [
    { game_id: 904, provider_id: 9004, name: 'crush-game-4', display_name: 'Crush Game 4', image: null, rtp: null },
  ],
  '9005': [
    { game_id: 905, provider_id: 9005, name: 'crush-game-5', display_name: 'Crush Game 5', image: null, rtp: null },
  ],
  '9006': [
    { game_id: 906, provider_id: 9006, name: 'crush-game-6', display_name: 'Crush Game 6', image: null, rtp: null },
  ],
  '9007': [
    { game_id: 907, provider_id: 9007, name: 'crush-game-7', display_name: 'Crush Game 7', image: null, rtp: null },
  ],
  '9008': [
    { game_id: 908, provider_id: 9008, name: 'crush-game-8', display_name: 'Crush Game 8', image: null, rtp: null },
  ],
  '9009': [
    { game_id: 909, provider_id: 9009, name: 'crush-game-9', display_name: 'Crush Game 9', image: null, rtp: null },
  ],

  // ===== ESPORTS (91xx) =====
  '9101': [
    { game_id: 911, provider_id: 9101, name: 'ia-esports', display_name: 'IA Esports', image: null, rtp: null },
  ],
  '9102': [
    { game_id: 912, provider_id: 9102, name: 'sbobetesports', display_name: 'SBOBET Esports', image: null, rtp: null },
  ],
  '9103': [
    { game_id: 913, provider_id: 9103, name: 'hp-gaming', display_name: '100HP Gaming', image: null, rtp: null },
  ],

  // ===== POKER (7xxx) =====
  '7001': [ // millionaire-poker
    { game_id: 700, provider_id: 7001, name: 'texas-holdem', display_name: 'Texas Hold\'em', image: null, rtp: null },
    { game_id: 701, provider_id: 7001, name: 'omaha', display_name: 'Omaha', image: null, rtp: null },
  ],

  // ===== COCKFIGHT (8xxx) =====
  '8001': [ // ga28-cockfight
    { game_id: 800, provider_id: 8001, name: 'cockfight-live', display_name: 'Cockfight Live', image: null, rtp: null },
  ],
}

/**
 * WEBSITE_INFO - sesuai OpenAPI WebsiteInfo schema
 * lottery_result: { id, market, date, result }
 * withdraw_list: { username, amount }
 */
const mockWebsiteInfo = {
  notification: [
    'Selamat datang di PUSATTOGEL - Platform Togel Terpercaya',
    'Promo bonus deposit 10% setiap hari untuk member setia',
    'Cashback mingguan hingga 5% - Klaim sekarang!',
    'New Member Bonus 30% - Daftar dan deposit sekarang!'
  ],
  // Format sesuai OpenAPI: { id, market, date, result }
  lottery_result: [
    { id: 1, market: 'singapore', date: '2026-03-16 17:30', result: '3927' },
    { id: 2, market: 'sidney', date: '2026-03-16 14:00', result: '4620' },
    { id: 3, market: 'hongkong', date: '2026-03-15 23:00', result: '7300' },
    { id: 4, market: 'cambodia', date: '2026-03-16 19:30', result: '8153' },
    { id: 5, market: 'taiwan', date: '2026-03-15 20:30', result: '2749' },
    { id: 6, market: 'china', date: '2026-03-16 21:00', result: '1234' },
    { id: 7, market: 'japan', date: '2026-03-16 19:00', result: '5678' },
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
      const user = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]
      const masked = user.username.length > 3 
        ? user.username.slice(0, 2) + '***' + user.username.slice(-1)
        : user.username.slice(0, 1) + '***'
      const formatted = w.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      return { username: masked, amount: formatted }
    })
  
  return withdrawals.length > 0 ? withdrawals : mockWebsiteInfo.withdraw_list
}

/**
 * WEBSITE_CONFIG TABLE
 * CREATE TABLE website_config (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   title VARCHAR(255),
 *   about TEXT,
 *   footer_promo JSON, -- { heading, intro, lines[], outro }; token PUSATTOGEL → title di UI
 *   logo VARCHAR(500),
 *   favicon VARCHAR(500),
 *   ... (other config fields)
 * );
 */
const mockWebsiteConfig = {
  title: 'PUSATTOGEL',
  about: 'Platform Alternatif Login Agent Pioneer Resmi Terpercaya',
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
  favicon: '/favicon.ico',
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
  rtp: { icon: '/icons/rtp.png', link: '/rtp' },
  popup: {
    deposit_success: '/popups/deposit-success.svg',
    deposit_fails: '/popups/deposit-fails.svg',
    withdraw_success: '/popups/withdraw-success.svg',
    withdraw_fails: '/popups/withdraw-fails.svg',
    welcome: '/popups/welcome.svg',
    bonus: '/popups/bonus.svg'
  },
  theme: {
    season: 'imlek',
    background_color: '#1a0a0a',
    background_image: '/bg-casino-1.webp',
    border_color: '#DC143C'
  },
  maintenance: {
    status: false,
    message: 'Sistem sedang dalam perbaikan untuk meningkatkan performa dan keamanan. Mohon maaf atas ketidaknyamanannya.',
    expected_end: '2026-03-28T06:00:00Z'
  }
}

/**
 * REFERRAL_INFO - dari config
 */
const mockReferralInfo = {
  image: null,
  description: 'Dapatkan bonus referral 10% dari kekalahan downline, dibayar setiap tanggal 1 tiap bulan.'
}

/**
 * USER_REFERRAL - join dari users + referral transactions
 * Data downline dimulai kosong, terisi saat ada user register dengan referral code
 */
let mockDownlineData = {
  // userId -> array of downline data
  // Contoh: 1: [{ username: 'newuser', first_depo_date: null, ... }]
}

/**
 * BET_HISTORY TABLE
 * CREATE TABLE bet_history (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   user_id INT NOT NULL,
 *   market VARCHAR(50) NOT NULL,
 *   type ENUM('4D', '3D', '2D') NOT NULL,
 *   prize INT NOT NULL,
 *   discount BOOLEAN DEFAULT FALSE,
 *   number VARCHAR(20) NOT NULL,
 *   amount BIGINT NOT NULL,
 *   pay BIGINT NOT NULL,
 *   position ENUM('full', 'depan', 'tengah', 'belakang') NOT NULL,
 *   status ENUM('pending', 'settled', 'won', 'lost') DEFAULT 'pending',
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id)
 * );
 */
const mockBetHistory = {
  singapore: [
    {
      market: 'singapore',
      type: '4D',
      prize: 9000,
      discount: false,
      number: '0,1,2,3',
      amount: 100,
      pay: 100,
      position: 'full',
      status: 'settled',
      created_at: '2026-03-07 13:00:00'
    },
    {
      market: 'singapore',
      type: '3D',
      prize: 900,
      discount: false,
      number: '1,2,3',
      amount: 200,
      pay: 200,
      position: 'full',
      status: 'pending',
      created_at: '2026-03-07 14:00:00'
    },
    {
      market: 'singapore',
      type: '2D',
      prize: 90,
      discount: true,
      number: '2,3',
      amount: 500,
      pay: 300,
      position: 'belakang',
      status: 'won',
      created_at: '2026-03-06 13:00:00'
    }
  ],
  hongkong: [
    {
      market: 'hongkong',
      type: '4D',
      prize: 8500,
      discount: false,
      number: '5,6,7,8',
      amount: 100,
      pay: 100,
      position: 'full',
      status: 'lost',
      created_at: '2026-03-06 20:00:00'
    }
  ]
}

/**
 * MARKET_INFO TABLE
 * CREATE TABLE markets (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   market VARCHAR(50) UNIQUE NOT NULL,
 *   status ENUM('open', 'closed') DEFAULT 'open',
 *   prize_4d INT NOT NULL,
 *   prize_3d INT NOT NULL,
 *   prize_2d INT NOT NULL,
 *   min_bet INT DEFAULT 100,
 *   bet_shortcut JSON,
 *   discount_percentage INT DEFAULT 0,
 *   close_time TIME,
 *   result_time TIME
 * );
 */
const mockMarketInfo = {
  singapore: {
    market: 'singapore',
    status: 'open',
    prize: {
      '4d': 9000,
      '3d': 900,
      '2d': 90
    },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 40
  },
  hongkong: {
    market: 'hongkong',
    status: 'open',
    prize: {
      '4d': 8500,
      '3d': 850,
      '2d': 85
    },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 35
  },
  sydney: {
    market: 'sydney',
    status: 'closed',
    prize: {
      '4d': 8000,
      '3d': 800,
      '2d': 80
    },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 30
  },
  cambodia: {
    market: 'cambodia',
    status: 'open',
    prize: { '4d': 7500, '3d': 750, '2d': 75 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 40
  },
  taiwan: {
    market: 'taiwan',
    status: 'open',
    prize: { '4d': 7200, '3d': 720, '2d': 72 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 40
  },
  china: {
    market: 'china',
    status: 'open',
    prize: { '4d': 7000, '3d': 700, '2d': 70 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 38
  },
  japan: {
    market: 'japan',
    status: 'closed',
    prize: { '4d': 6800, '3d': 680, '2d': 68 },
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
    discount_percentage: 42
  },
  seoul: {
    market: 'seoul',
    status: 'open',
    prize: { '4d': 6500, '3d': 650, '2d': 65 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 33
  },
  bangkok: {
    market: 'bangkok',
    status: 'open',
    prize: { '4d': 6600, '3d': 660, '2d': 66 },
    min_bet: 100,
    bet_shortcut: [100, 200, 500, 1000],
    discount_percentage: 33
  }
}

/**
 * DEPOSITS TABLE - untuk tracking deposit requests
 * CREATE TABLE deposits (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   user_id INT NOT NULL,
 *   bank_id INT NOT NULL,
 *   amount BIGINT NOT NULL,
 *   promo_code VARCHAR(50),
 *   status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
 *   qris_raw TEXT,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id),
 *   FOREIGN KEY (bank_id) REFERENCES banks(id)
 * );
 */
/** Deposit menunggu konfirmasi; saldo naik saat status success (via getDepositStatus) */
let mockDepositRequests = []

/** Withdraw menunggu persetujuan; saldo turun saat status success */
let mockWithdrawRequests = []

/** Setelah ini, polling (5s) biasanya dapat status success */
const TX_AUTO_COMPLETE_MS = 4500

// ============================================
// API FUNCTIONS - Sesuai OpenAPI Spec
// ============================================

// ============ AUTH ============

/**
 * POST /login
 * Response: { username, balance, currency, token }
 */
export const login = async (username, password) => {
  await delay(800)
  const user = mockUsers.find(u => u.username === username && u.password === password)
  if (!user) {
    throw { status: 400, data: { message: 'invalid password' } }
  }
  const token = `mock_jwt_token_${user.id}_${Date.now()}`
  // Store current logged in user id for later use
  currentUserId = user.id
  return {
    username: user.username,
    balance: user.balance,
    currency: user.currency,
    referral_code: user.referral_code,
    token
  }
}

/**
 * POST /register
 * Response: { username, balance, currency, token }
 */
export const register = async (data) => {
  await delay(1000)
  const { username, password, handphone, bank_name, bank_account, bank_number, referral } = data
  
  // Check if username exists
  if (mockUsers.find(u => u.username === username)) {
    throw { status: 400, data: { message: 'username has taken' } }
  }
  
  // Check if phone exists
  if (mockUsers.find(u => u.handphone === handphone)) {
    throw { status: 400, data: { message: 'phone number has taken' } }
  }
  
  // Check if bank number exists
  if (mockUsers.find(u => u.bank_number === bank_number)) {
    throw { status: 400, data: { message: 'bank number has taken' } }
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
    username,
    password,
    handphone,
    bank_name,
    bank_account,
    bank_number,
    balance: 0,
    currency: 'IDR',
    referral_code: `${username.toUpperCase()}REF`,
    referrer_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  mockUsers.push(newUser)
  
  // Jika ada referrer, tambahkan ke downline data
  if (referrer) {
    if (!mockDownlineData[referrer.id]) {
      mockDownlineData[referrer.id] = []
    }
    mockDownlineData[referrer.id].push({
      username: newUser.username,
      first_depo_date: null, // Akan diupdate saat deposit pertama
      first_depo_amount: 0,
      turnover: 0,
      winlose: 0,
      comision: 0
    })
    console.log(`✅ User ${newUser.username} added as downline of ${referrer.username}`)
  }
  
  const token = `mock_jwt_token_${newUser.id}_${Date.now()}`
  currentUserId = newUser.id
  return {
    username: newUser.username,
    balance: newUser.balance,
    currency: newUser.currency,
    token
  }
}

// ============ USER CHECKS ============

/**
 * GET /check-username?username=xxx
 * Response: { available: boolean }
 */
export const checkUsername = async (username) => {
  await delay(300)
  const exists = mockUsers.some(u => u.username === username)
  return { available: !exists }
}

/**
 * GET /check-phone-number?number=xxx
 * Response: { available: boolean }
 */
export const checkPhoneNumber = async (number) => {
  await delay(300)
  const exists = mockUsers.some(u => u.handphone === number)
  return { available: !exists }
}

/**
 * GET /check-bank-number?number=xxx
 * Response: { available: boolean }
 */
export const checkBankNumber = async (number) => {
  await delay(300)
  const exists = mockUsers.some(u => u.bank_number === number)
  return { available: !exists }
}

// ============ USER ============

/**
 * GET /profile (requires auth)
 * Response: { username, balance, bank_name, bank_account, bank_number }
 */
export const getProfile = async (token) => {
  await delay(500)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  
  // Get current logged in user
  const user = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]
  return {
    username: user.username,
    balance: user.balance,
    bank_name: user.bank_name,
    bank_account: user.bank_account,
    bank_number: user.bank_number,
    referral_code: user.referral_code
  }
}

/**
 * GET /balance (requires auth)
 * Response: { balance: number }
 */
export const getBalance = async (token) => {
  await delay(300)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  const user = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]
  return { balance: user.balance }
}

/**
 * GET /balance-mutation (requires auth)
 * Response: BalanceMutation[]
 */
export const getBalanceMutation = async (token) => {
  await delay(500)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  return mockBalanceMutations
}

/**
 * POST /change-password (requires auth)
 * Response: { message: 'success' }
 */
export const changePassword = async (token, password, new_password) => {
  await delay(600)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  const user = mockUsers[0]
  if (user.password !== password) {
    throw { status: 400, data: { message: 'wrong password' } }
  }
  user.password = new_password
  return { message: 'success' }
}

/**
 * POST /deposit (requires auth)
 * Response: DepositEwallet | DepositQris
 */
function findUserPendingDeposit(userId) {
  return mockDepositRequests.find((r) => r.userId === userId && r.status === 'pending')
}

function buildQrisQrRawMock(deposit_id, amount) {
  return `00020101021126570011ID.PUSATTOGEL0215${deposit_id}0303UMI51440014ID.CO.QRIS.WWW0215ID1234567890123030${amount}5802ID5913PUSATTOGEL6007JAKARTA61051234062070703A01`
}

function depositPayloadFromPendingRecord(rec) {
  const bank = mockBanks.find((b) => b.id === rec.bank_id)
  if (!bank) return null
  if (bank.type === 'qris') {
    const qr_raw = buildQrisQrRawMock(rec.deposit_id, rec.amount)
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

function finalizeDepositRequest(rec) {
  if (rec.status !== 'pending') return
  const user = mockUsers.find((u) => u.id === rec.userId)
  if (!user) return
  const now = new Date()
  const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ')
  user.balance += rec.amount
  mockBalanceMutations.unshift({
    id: mockBalanceMutations.length + 1,
    type: 'deposit',
    reference: `deposit_${rec.deposit_id}`,
    amount: rec.amount,
    balance_type: 'credit',
    created_at: formattedDate,
  })
  if (user.referrer_id) {
    const downlineList = mockDownlineData[user.referrer_id]
    if (downlineList) {
      const downlineEntry = downlineList.find((d) => d.username === user.username)
      if (downlineEntry && !downlineEntry.first_depo_date) {
        downlineEntry.first_depo_date = formattedDate
        downlineEntry.first_depo_amount = rec.amount
      }
    }
  }
  rec.status = 'success'
  console.log(`✅ Deposit ${rec.deposit_id} settled! Amount: ${rec.amount}, New balance: ${user.balance}`)
}

export const createDeposit = async (token, bank_id, amount, promo_code = null) => {
  await delay(1000)
  if (!token) throw { status: 401, data: { message: 'please login' } }

  const user = mockUsers.find((u) => u.id === currentUserId) || mockUsers[0]
  const existing = findUserPendingDeposit(user.id)
  if (existing) {
    const again = depositPayloadFromPendingRecord(existing)
    if (again) return again
    throw { status: 400, data: { message: 'have pending deposit' } }
  }

  const bank = mockBanks.find((b) => b.id === bank_id)
  if (!bank) {
    throw { status: 400, data: { message: 'bank not found' } }
  }

  if (amount < bank.min_deposit) {
    throw { status: 400, data: { message: `minimum deposit is ${bank.min_deposit}` } }
  }

  const deposit_id = Math.floor(Math.random() * 1000000)

  mockDepositRequests.push({
    deposit_id,
    userId: user.id,
    amount,
    bank_id,
    promo_code,
    status: 'pending',
    createdAt: Date.now(),
  })

  if (bank.type === 'qris') {
    const qr_raw = buildQrisQrRawMock(deposit_id, amount)
    return {
      deposit_id,
      amount,
      type: 'qris',
      qr_raw,
      raw: qr_raw,
    }
  }
  return {
    deposit_id,
    amount,
    type: 'e-wallet',
    name: bank.name,
    account: bank.account,
    number: bank.number,
  }
}

/**
 * GET /deposit/status?deposit_id=
 */
export const getDepositStatus = async (token, deposit_id) => {
  await delay(250)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  const id = Number(deposit_id)
  const rec = mockDepositRequests.find((r) => r.deposit_id === id)
  const user = mockUsers.find((u) => u.id === currentUserId) || mockUsers[0]
  if (!rec || rec.userId !== user.id) {
    throw { status: 404, data: { message: 'deposit not found' } }
  }
  if (rec.status === 'pending' && Date.now() - rec.createdAt >= TX_AUTO_COMPLETE_MS) {
    finalizeDepositRequest(rec)
  }
  if (rec.status === 'success') {
    return { status: 'success', deposit_id: rec.deposit_id, amount: rec.amount }
  }
  if (rec.status === 'failed') {
    return { status: 'failed', deposit_id: rec.deposit_id, amount: rec.amount }
  }
  return { status: 'pending', deposit_id: rec.deposit_id, amount: rec.amount }
}

/**
 * POST /withdraw (requires auth)
 * Response: WithdrawResponse
 */
function findUserPendingWithdraw(userId) {
  return mockWithdrawRequests.find((r) => r.userId === userId && r.status === 'pending')
}

function finalizeWithdrawRequest(rec) {
  if (rec.status !== 'pending') return
  const user = mockUsers.find((u) => u.id === rec.userId)
  if (!user) return
  if (user.balance < rec.amount) {
    rec.status = 'failed'
    return
  }
  const now = new Date()
  const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ')
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
  console.log(`✅ Withdraw ${rec.withdraw_id} approved! Amount: ${rec.amount}, New balance: ${user.balance}`)
}

export const createWithdraw = async (token, amount) => {
  await delay(1000)
  if (!token) throw { status: 401, data: { message: 'please login' } }

  const user = mockUsers.find((u) => u.id === currentUserId) || mockUsers[0]
  if (findUserPendingWithdraw(user.id)) {
    throw { status: 400, data: { message: 'have pending withdraw' } }
  }
  if (user.balance < amount) {
    throw { status: 400, data: { message: 'insufficient balance' } }
  }

  const withdraw_id = Math.floor(Math.random() * 1000000)

  mockWithdrawRequests.push({
    withdraw_id,
    userId: user.id,
    amount,
    status: 'pending',
    createdAt: Date.now(),
  })

  return {
    withdraw_id,
    amount,
    type: 'e-wallet',
    name: user.bank_name,
    account: user.bank_account,
    number: user.bank_number,
  }
}

/**
 * GET /withdraw/status?withdraw_id=
 */
export const getWithdrawStatus = async (token, withdraw_id) => {
  await delay(250)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  const id = Number(withdraw_id)
  const rec = mockWithdrawRequests.find((r) => r.withdraw_id === id)
  const user = mockUsers.find((u) => u.id === currentUserId) || mockUsers[0]
  if (!rec || rec.userId !== user.id) {
    throw { status: 404, data: { message: 'withdraw not found' } }
  }
  if (rec.status === 'pending' && Date.now() - rec.createdAt >= TX_AUTO_COMPLETE_MS) {
    finalizeWithdrawRequest(rec)
  }
  if (rec.status === 'success') {
    return { status: 'success', withdraw_id: rec.withdraw_id, amount: rec.amount }
  }
  if (rec.status === 'failed') {
    return { status: 'failed', withdraw_id: rec.withdraw_id, amount: rec.amount }
  }
  return { status: 'pending', withdraw_id: rec.withdraw_id, amount: rec.amount }
}

/**
 * GET /user-referral (requires auth)
 * Response: ReferralData
 */
export const getUserReferral = async (token, fromdate = null, todate = null) => {
  await delay(500)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  
  const user = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]
  
  // Get downline for current user
  let downline = mockDownlineData[user.id] || []
  
  // Filter by date if provided
  if (fromdate && todate && downline.length > 0) {
    const from = new Date(fromdate)
    const to = new Date(todate)
    downline = downline.filter(d => {
      if (!d.first_depo_date) return false
      const date = new Date(d.first_depo_date)
      return date >= from && date <= to
    })
  }
  
  return {
    referral: mockReferralInfo,
    downline
  }
}

/**
 * GET /user-promo
 * Response: PromoCode[]
 */
export const getUserPromo = async () => {
  await delay(400)
  return mockPromoCodes
}

// ============ WEBSITE ============

/**
 * GET /info
 * Response: WebsiteInfo (sesuai OpenAPI schema)
 * + Extended dengan config, banks, referral, promotions untuk frontend
 */
export const getInfo = async () => {
  await delay(500)
  return {
    // === WebsiteInfo (OpenAPI) ===
    notification: mockWebsiteInfo.notification,
    lottery_result: mockWebsiteInfo.lottery_result,
    withdraw_list: getRecentWithdrawals(),
    
    // === Extended untuk Frontend ===
    config: mockWebsiteConfig,
    banks: mockBanks,
    referral: mockReferralInfo,
    promotions: mockPromotions
  }
}

/**
 * GET /website
 * Response: WebsiteConfig
 */
export const getWebsite = async () => {
  await delay(600)
  return mockWebsiteConfig
}

/**
 * GET /bank-list
 * Response: Bank[]
 */
export const getBankList = async () => {
  await delay(400)
  return mockBanks
}

/**
 * GET /referral
 * Response: ReferralInfo
 */
export const getReferral = async () => {
  await delay(400)
  return mockReferralInfo
}

/**
 * GET /promo
 * Response: Promotion[]
 */
export const getPromo = async () => {
  await delay(500)
  return mockPromotions
}

// ============ GAME ============

/**
 * GET /slot
 * Response: Provider[]
 */
export const getSlotProviders = async () => {
  await delay(500)
  console.log('📡 GET /slot')
  console.log('✅ Response:', mockSlotProviders)
  return mockSlotProviders
}

/**
 * GET /fish
 * Response: Provider[]
 */
export const getFishProviders = async () => {
  await delay(500)
  console.log('📡 GET /fish')
  console.log('✅ Response:', mockFishProviders)
  return mockFishProviders
}

/**
 * GET /casino
 * Response: Provider[]
 */
export const getCasinoProviders = async () => {
  await delay(500)
  console.log('📡 GET /casino')
  console.log('✅ Response:', mockCasinoProviders)
  return mockCasinoProviders
}

/**
 * GET /sportsbook
 * Response: Provider[]
 */
export const getSportsbookProviders = async () => {
  await delay(500)
  console.log('📡 GET /sportsbook')
  console.log('✅ Response:', mockSportsbookProviders)
  return mockSportsbookProviders
}

/**
 * GET /togel
 * Response: Provider[]
 */
export const getTogelProviders = async () => {
  await delay(500)
  console.log('📡 GET /togel')
  console.log('✅ Response:', mockTogelProviders)
  return mockTogelProviders
}

/**
 * GET /arcade
 * Response: Provider[]
 */
export const getArcadeProviders = async () => {
  await delay(500)
  console.log('📡 GET /arcade')
  console.log('✅ Response:', mockArcadeProviders)
  return mockArcadeProviders
}

/**
 * GET /crush
 * Response: Provider[]
 */
export const getCrushProviders = async () => {
  await delay(500)
  console.log('📡 GET /crush')
  console.log('✅ Response:', mockCrushProviders)
  return mockCrushProviders
}

/**
 * GET /esports
 * Response: Provider[]
 */
export const getEsportsProviders = async () => {
  await delay(500)
  console.log('📡 GET /esports')
  console.log('✅ Response:', mockEsportsProviders)
  return mockEsportsProviders
}

/**
 * GET /poker
 * Response: Provider[]
 */
export const getPokerProviders = async () => {
  await delay(500)
  console.log('📡 GET /poker')
  console.log('✅ Response:', mockPokerProviders)
  return mockPokerProviders
}

/**
 * GET /cockfight
 * Response: Provider[]
 */
export const getCockfightProviders = async () => {
  await delay(500)
  console.log('📡 GET /cockfight')
  console.log('✅ Response:', mockCockfightProviders)
  return mockCockfightProviders
}

/**
 * GET /game-list?provider_id=xxx
 * Response: Game[]
 */
export const getGameList = async (provider_id) => {
  await delay(600)
  console.log(`📡 GET /game-list?provider_id=${provider_id}`)
  const games = mockGames[provider_id]
  if (!games) {
    console.log('❌ Error: provider not found')
    throw { status: 400, data: { message: 'provider not found' } }
  }
  console.log('✅ Response:', games)
  return games
}

/**
 * GET /play?provider_id=xxx&game_id=xxx (requires auth)
 * Response: 302 redirect to game URL
 */
export const playGame = async (token, provider_id, game_id) => {
  await delay(800)
  console.log(`📡 GET /play?provider_id=${provider_id}&game_id=${game_id}`)
  if (!token) {
    console.log('❌ Error: please login')
    throw { status: 400, data: { message: 'please login' } }
  }
  const games = mockGames[provider_id]
  if (!games) {
    console.log('❌ Error: provider not found')
    throw { status: 400, data: { message: 'provider not found' } }
  }
  const game = games.find(g => g.game_id === parseInt(game_id))
  if (!game) {
    console.log('❌ Error: game not found')
    throw { status: 400, data: { message: 'game not found' } }
  }
  // Return redirect URL (in real API this would be a 302 redirect)
  const response = {
    redirect: `https://game.providerdomain.com/play.do?token=mock_game_token_${Date.now()}&provider=${provider_id}&game=${game_id}`
  }
  console.log('✅ Response:', response)
  return response
}

// ============ LOTTERY ============

/**
 * POST /bet (requires auth)
 * Body: BetRequest[] — `prize`/`pay`/`discount` harus selaras dengan kontrak OpenAPI & togelDiscount.js (backend nyata menghitung menang dari itu).
 * Mock: hanya menyimpan array bet dan mengurangi saldo dari jumlah `pay`.
 * Response: { message, new_balance, total_bet }
 */
export const placeBet = async (token, bets) => {
  await delay(1000)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  
  if (!Array.isArray(bets) || bets.length === 0) {
    throw { status: 400, data: { message: 'invalid bet data' } }
  }
  
  // Check market status
  const market = bets[0]?.market
  const marketInfo = mockMarketInfo[market]
  if (!marketInfo) {
    throw { status: 400, data: { message: 'market not found' } }
  }
  if (marketInfo.status === 'closed') {
    throw { status: 400, data: { message: 'market closed' } }
  }
  
  // Calculate total pay
  const totalPay = bets.reduce((sum, bet) => sum + bet.pay, 0)
  
  // Check balance
  const user = mockUsers[0]
  if (user.balance < totalPay) {
    throw { status: 400, data: { message: 'insufficient balance' } }
  }
  
  // Deduct balance
  user.balance -= totalPay
  
  // Add to bet history
  const newBets = bets.map(bet => ({
    ...bet,
    status: 'pending',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  }))
  
  if (!mockBetHistory[market]) {
    mockBetHistory[market] = []
  }
  mockBetHistory[market].push(...newBets)
  
  return { message: 'success', new_balance: user.balance, total_bet: totalPay }
}

/**
 * GET /bet-history?market=xxx (requires auth)
 * Response: BetHistory[]
 */
export const getBetHistory = async (token, market) => {
  await delay(500)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  
  if (!mockMarketInfo[market]) {
    throw { status: 400, data: { message: 'market not found' } }
  }
  
  return mockBetHistory[market] || []
}

/**
 * GET /market-info?market=xxx&type=xxx
 * Response: MarketInfo
 */
export const getMarketInfo = async (market, type) => {
  await delay(400)
  const marketInfo = mockMarketInfo[market]
  if (!marketInfo) {
    throw { status: 400, data: { message: 'market not found' } }
  }
  
  if (!['4d', '3d', '2d', 'bbfs'].includes(type.toLowerCase())) {
    throw { status: 400, data: { message: 'type not found' } }
  }

  return marketInfo
}

// ============ THEME CONFIG ============

/**
 * GET /theme
 * Response: ThemeConfig
 */
export const getTheme = async () => {
  await delay(300)
  return mockWebsiteConfig.theme
}

/**
 * POST /theme (admin only - untuk update theme dari backend)
 * Body: ThemeConfig
 * Response: { message: 'success' }
 */
export const updateTheme = async (token, themeConfig) => {
  await delay(500)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  
  // Update theme config
  if (themeConfig.season !== undefined) {
    mockWebsiteConfig.theme.season = themeConfig.season
  }
  if (themeConfig.background_color !== undefined) {
    mockWebsiteConfig.theme.background_color = themeConfig.background_color
  }
  if (themeConfig.background_image !== undefined) {
    mockWebsiteConfig.theme.background_image = themeConfig.background_image
  }
  if (themeConfig.border_color !== undefined) {
    mockWebsiteConfig.theme.border_color = themeConfig.border_color
  }
  
  return { message: 'success' }
}

// ============ TOKEN HELPERS ============

export const getToken = () => {
  return localStorage.getItem('token')
}

export const setToken = (token) => {
  localStorage.setItem('token', token)
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

// ============ HELPER FOR TESTING ============

/**
 * Reset mock data to initial state (untuk testing)
 */
export const resetMockData = () => {
  mockUsers[0].balance = 100000
  mockUsers[0].password = '123'
  mockDepositRequests = []
  mockWithdrawRequests = []
}

/**
 * Add balance to user (untuk testing)
 */
export const addBalance = (amount) => {
  mockUsers[0].balance += amount
}
