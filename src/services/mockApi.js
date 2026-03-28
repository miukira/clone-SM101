// Mock API Service - sesuai OpenAPI spec
// Simulasi delay untuk menyerupai real API
// Struktur data ini siap untuk integrasi MySQL
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

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
 *   logo VARCHAR(500)
 * );
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
 *   logo VARCHAR(500),
 *   favicon VARCHAR(500),
 *   ... (other config fields)
 * );
 */
const mockWebsiteConfig = {
  title: 'PUSATTOGEL',
  about: 'Platform Alternatif Login Agent Pioneer Resmi Terpercaya',
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
let mockPendingDeposits = []

/**
 * WITHDRAWS TABLE
 * CREATE TABLE withdraws (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   user_id INT NOT NULL,
 *   amount BIGINT NOT NULL,
 *   status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id)
 * );
 */
let mockPendingWithdraws = []

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
export const createDeposit = async (token, bank_id, amount, promo_code = null) => {
  await delay(1000)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  
  // Auto-clear old pending deposits (no createdAt or older than 5 seconds)
  if (mockPendingDeposits.length > 0) {
    const pending = mockPendingDeposits[0]
    if (!pending.createdAt || Date.now() - pending.createdAt > 5000) {
      console.log('🧹 Auto-clearing old pending deposit')
      mockPendingDeposits = []
    } else {
      throw { status: 400, data: { message: 'have pending deposit' } }
    }
  }
  
  const bank = mockBanks.find(b => b.id === bank_id)
  if (!bank) {
    throw { status: 400, data: { message: 'bank not found' } }
  }
  
  if (amount < bank.min_deposit) {
    throw { status: 400, data: { message: `minimum deposit is ${bank.min_deposit}` } }
  }
  
  const deposit_id = Math.floor(Math.random() * 1000000)
  const now = new Date()
  const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ')
  
  // Get current user dan LANGSUNG update balance + riwayat
  const user = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]
  if (user) {
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
  }
  
  // Track pending untuk mencegah double deposit dalam waktu singkat
  mockPendingDeposits.push({ deposit_id, createdAt: Date.now() })
  setTimeout(() => {
    mockPendingDeposits = mockPendingDeposits.filter(d => d.deposit_id !== deposit_id)
  }, 5000)
  
  if (bank.type === 'qris') {
    return {
      deposit_id,
      type: 'qris',
      raw: `00020101021126570011ID.PUSATTOGEL0215${deposit_id}0303UMI51440014ID.CO.QRIS.WWW0215ID1234567890123030${amount}5802ID5913PUSATTOGEL6007JAKARTA61051234062070703A01`
    }
  } else {
    return {
      deposit_id,
      type: 'e-wallet',
      name: bank.name,
      account: bank.account,
      number: bank.number
    }
  }
}

/**
 * POST /withdraw (requires auth)
 * Response: WithdrawResponse
 */
export const createWithdraw = async (token, amount) => {
  await delay(1000)
  if (!token) throw { status: 401, data: { message: 'please login' } }
  
  // Auto-clear old pending withdraws (no createdAt or older than 5 seconds)
  if (mockPendingWithdraws.length > 0) {
    const pending = mockPendingWithdraws[0]
    if (!pending.createdAt || Date.now() - pending.createdAt > 5000) {
      console.log('🧹 Auto-clearing old pending withdraw')
      mockPendingWithdraws = []
    } else {
      throw { status: 400, data: { message: 'have pending withdraw' } }
    }
  }
  
  const user = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]
  if (user.balance < amount) {
    throw { status: 400, data: { message: 'insufficient balance' } }
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
  mockPendingWithdraws.push({ withdraw_id, createdAt: Date.now() })
  setTimeout(() => {
    mockPendingWithdraws = mockPendingWithdraws.filter(w => w.withdraw_id !== withdraw_id)
  }, 5000)
  
  return {
    withdraw_id,
    type: 'e-wallet',
    name: user.bank_name,
    account: user.bank_account,
    number: user.bank_number
  }
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
 * Body: BetRequest[]
 * Response: { message: 'success' }
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
  
  return { message: 'success' }
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
  
  if (!['4d', '3d', '2d'].includes(type.toLowerCase())) {
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
  mockPendingDeposits = []
  mockPendingWithdraws = []
}

/**
 * Add balance to user (untuk testing)
 */
export const addBalance = (amount) => {
  mockUsers[0].balance += amount
}
