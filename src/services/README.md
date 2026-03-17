# API Service Layer

Service layer untuk integrasi dengan Backend API sesuai OpenAPI spec.

## Struktur Files

- **`mockApi.js`** - Mock data service dengan struktur siap untuk MySQL
- **`api.js`** - Wrapper untuk switch antara mock dan real API

## Konfigurasi

### Mock Mode (Default - Saat ini)
```javascript
// src/services/api.js
const USE_MOCK = true  // Menggunakan mock data
```

### Real API Mode (Ketika BE ready)
```javascript
const USE_MOCK = false  // Menggunakan real API dengan MySQL
const API_BASE_URL = '/api/v1'  // Base URL untuk real API
```

---

## MySQL Database Schema

Mock data sudah disiapkan dengan struktur yang kompatibel dengan MySQL.

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- hashed with bcrypt
  handphone VARCHAR(20) UNIQUE NOT NULL,
  bank_name VARCHAR(50) NOT NULL,
  bank_account VARCHAR(100) NOT NULL,
  bank_number VARCHAR(50) UNIQUE NOT NULL,
  balance BIGINT DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'IDR',
  referral_code VARCHAR(50) UNIQUE,
  referrer_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES users(id)
);
```

### Balance Mutations Table
```sql
CREATE TABLE balance_mutations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('bonus roling', 'bonus cashback', 'bonus referral', 'withdraw', 'lottery', 'game', 'deposit') NOT NULL,
  reference VARCHAR(100) NOT NULL,
  amount BIGINT NOT NULL,
  balance_type ENUM('credit', 'debit') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Banks Table
```sql
CREATE TABLE banks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('e-wallet', 'bank-transfer', 'qris') NOT NULL,
  name VARCHAR(50) NOT NULL,
  account VARCHAR(100) NOT NULL,
  number VARCHAR(50),
  min_deposit BIGINT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Promotions Table
```sql
CREATE TABLE promotions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(500), -- URL atau NULL (FE akan gunakan fallback)
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Promo Codes Table
```sql
CREATE TABLE promo_codes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('deposit', 'cashback', 'bonus') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  min_deposit BIGINT,
  max_bonus BIGINT,
  turnover_multiplier INT DEFAULT 1,
  active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE
);
```

### Providers Table
```sql
CREATE TABLE providers (
  provider_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('slot', 'fish', 'casino', 'sportsbook') NOT NULL,
  logo VARCHAR(500),
  active BOOLEAN DEFAULT TRUE
);
```

### Games Table
```sql
CREATE TABLE games (
  id INT PRIMARY KEY AUTO_INCREMENT,
  provider_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  game_code VARCHAR(100),
  rtp DECIMAL(5,2),
  active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (provider_id) REFERENCES providers(provider_id)
);
```

### Markets Table (Lottery)
```sql
CREATE TABLE markets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  market VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('open', 'closed') DEFAULT 'open',
  prize_4d INT NOT NULL,
  prize_3d INT NOT NULL,
  prize_2d INT NOT NULL,
  min_bet INT DEFAULT 100,
  bet_shortcut JSON, -- [100, 200, 500, 1000]
  discount_percentage INT DEFAULT 0,
  close_time TIME,
  result_time TIME
);
```

### Bet History Table
```sql
CREATE TABLE bet_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  market VARCHAR(50) NOT NULL,
  type ENUM('4D', '3D', '2D') NOT NULL,
  prize INT NOT NULL,
  discount BOOLEAN DEFAULT FALSE,
  number VARCHAR(20) NOT NULL,
  amount BIGINT NOT NULL,
  pay BIGINT NOT NULL,
  position ENUM('full', 'depan', 'tengah', 'belakang') NOT NULL,
  status ENUM('pending', 'settled', 'won', 'lost') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Deposits Table
```sql
CREATE TABLE deposits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  bank_id INT NOT NULL,
  amount BIGINT NOT NULL,
  promo_code VARCHAR(50),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  qris_raw TEXT, -- untuk QRIS type
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (bank_id) REFERENCES banks(id)
);
```

### Withdraws Table
```sql
CREATE TABLE withdraws (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount BIGINT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Website Config Table
```sql
CREATE TABLE website_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Example data:
INSERT INTO website_config (config_key, config_value) VALUES
('general', '{"title": "PUSATTOGEL", "about": "...", "logo": null, "favicon": null}'),
('contact', '{"whatsapp": {"icon": null, "link": "https://wa.me/..."}, "telegram": {...}}'),
('theme', '{"season": "none", "background_color": "#0a0a0a", "background_image": null, "border_color": "#C0C0C0"}'),
('popup', '{"deposit_success": null, "deposit_fails": null, ...}');
```

---

## API Endpoints - Response Format

Semua response mengikuti format dari OpenAPI spec:

### Auth
| Endpoint | Method | Response |
|----------|--------|----------|
| `/login` | POST | `{ username, balance, currency, token }` |
| `/register` | POST | `{ username, balance, currency, token }` |

### User
| Endpoint | Method | Auth | Response |
|----------|--------|------|----------|
| `/check-username` | GET | - | `{ available: boolean }` |
| `/check-phone-number` | GET | - | `{ available: boolean }` |
| `/check-bank-number` | GET | - | `{ available: boolean }` |
| `/profile` | GET | ✓ | `{ username, balance, bank_name, bank_account, bank_number }` |
| `/balance` | GET | ✓ | `{ balance }` |
| `/balance-mutation` | GET | ✓ | `BalanceMutation[]` |
| `/change-password` | POST | ✓ | `{ message }` |
| `/deposit` | POST | ✓ | `DepositEwallet \| DepositQris` |
| `/withdraw` | POST | ✓ | `WithdrawResponse` |
| `/user-referral` | GET | ✓ | `ReferralData` |
| `/user-promo` | GET | - | `PromoCode[]` |

### Website
| Endpoint | Method | Response |
|----------|--------|----------|
| `/info` | GET | `WebsiteInfo` |
| `/website` | GET | `WebsiteConfig` |
| `/bank-list` | GET | `Bank[]` |
| `/referral` | GET | `ReferralInfo` |
| `/promo` | GET | `Promotion[]` |

### Game
| Endpoint | Method | Auth | Response |
|----------|--------|------|----------|
| `/slot` | GET | - | `Provider[]` |
| `/fish` | GET | - | `Provider[]` |
| `/casino` | GET | - | `Provider[]` |
| `/sportsbook` | GET | - | `Provider[]` |
| `/game-list` | GET | - | `Game[]` |
| `/play` | GET | ✓ | 302 Redirect |

### Lottery
| Endpoint | Method | Auth | Response |
|----------|--------|------|----------|
| `/bet` | POST | ✓ | `{ message }` |
| `/bet-history` | GET | ✓ | `BetHistory[]` |
| `/market-info` | GET | - | `MarketInfo` |

---

## Image Handling

- Jika `image` field adalah `null` atau empty dari API/MySQL → FE menggunakan fallback local images
- Jika `image` URL external dan gagal load (404) → FE fallback ke local images via `onError` handler
- Fallback images ada di `src/assets/banners/`

---

## Error Handling

Semua API functions throw error dengan format:
```javascript
{
  status: 400,  // HTTP status code
  data: {
    message: "error description"
  }
}
```

### Common Errors
| Status | Message | Keterangan |
|--------|---------|------------|
| 400 | `invalid password` | Password salah saat login |
| 400 | `username has taken` | Username sudah dipakai |
| 400 | `phone number has taken` | No HP sudah dipakai |
| 400 | `bank number has taken` | No rekening sudah dipakai |
| 400 | `wrong password` | Password salah saat change password |
| 400 | `have pending deposit` | Ada deposit yang belum selesai |
| 400 | `have pending withdraw` | Ada withdraw yang belum selesai |
| 400 | `insufficient balance` | Saldo tidak cukup |
| 400 | `market closed` | Pasaran tutup |
| 400 | `market not found` | Pasaran tidak ditemukan |
| 400 | `provider not found` | Provider game tidak ditemukan |
| 400 | `game not found` | Game tidak ditemukan |
| 401 | `please login` | Token tidak valid/tidak ada |
| 500 | `internal server error` | Error di server |

---

## Token Management

Token JWT disimpan di `localStorage` dengan key `"token"`.

```javascript
import { getToken, setToken, removeToken } from '../services/api'

// Login
const result = await login(username, password)
setToken(result.token)

// Check if logged in
const token = getToken()
if (token) {
  // user logged in
}

// Logout
removeToken()
```

---

## Migration ke Real API

Ketika backend MySQL ready:

1. **Ubah konfigurasi di `api.js`:**
   ```javascript
   const USE_MOCK = false
   const API_BASE_URL = '/api/v1' // atau URL backend
   ```

2. **Pastikan CORS di backend mengizinkan frontend domain**

3. **Response format dari backend harus sesuai dengan OpenAPI spec**

4. **Image fields:**
   - Jika menyimpan URL → return URL
   - Jika menyimpan path → return full URL dengan CDN/base URL
   - Jika tidak ada → return `null` (FE akan handle fallback)

5. **Test semua endpoint satu per satu**

Mock data structure sudah kompatibel dengan MySQL, seharusnya tidak perlu perubahan besar di FE.

---

## Testing Helper

Mock API menyediakan helper untuk testing:

```javascript
import { resetMockData, addBalance } from '../services/mockApi'

// Reset ke initial state
resetMockData()

// Add balance untuk testing
addBalance(100000)
```
