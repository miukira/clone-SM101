/**
 * Generates animated WebP brand cards (character + logo, no PLAY NOW button)
 * into src/assets2/animated-brand/{category}/{category}-{provider-id}.webp
 *
 * Optional: node scripts/generate-animated-brand-cards.mjs casino-yb-live
 * (single card label = category-id; requires img2webp on PATH)
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assets2 = path.join(root, 'src', 'assets2');
const outDir = path.join(assets2, 'animated-brand');
const tmpDir = path.join(__dirname, '_tmp_frames');

const CARD_W = 290;
const CARD_H = 180;
const BORDER = 3;
const INNER_W = CARD_W - BORDER * 2;
const INNER_H = CARD_H - BORDER * 2;
const TOTAL_FRAMES = 24;
const FRAME_DELAY = 130;
const WEBP_QUALITY = 70;

/** @param {number} n 1..31 */
function slotCarAsset(n) {
  if (n === 1) return 'slotcar1.webp';
  if (n === 14 || n === 16 || n === 19) return `slotcar${n}.webp`;
  return `slotcar${n}.png`;
}

/** @param {number} n 1..31 */
function slotLogoAsset(n) {
  const pad = String(n).padStart(2, '0');
  if (n === 15) return 'logo-slot15.jpeg';
  if (n === 21) return 'logo-slot21.webp';
  return `logo-slot${pad}.png`;
}

/** Indeks 1..31 — logo diperbesar (lebih banyak ruang kanan + multiplier) */
const SLOT_PARTNER_BIG_LOGO = new Set([1, 2, 6, 11, 13, 15, 18, 21, 24, 27]);

/** 31 kartu slot baru (1024–1054): slotcarN + logo-slotNN */
const SLOT_PARTNER_CARDS = Array.from({ length: 31 }, (_, i) => {
  const n = i + 1;
  const base = {
    category: 'slot',
    id: `slot-partner-${n}`,
    character: slotCarAsset(n),
    logo: n === 11 ? 'logoplaytech.png' : slotLogoAsset(n),
    characterTrim: true,
    ...(n === 11 ? { logoTrim: true } : {}),
  };
  if (SLOT_PARTNER_BIG_LOGO.has(n)) {
    return {
      ...base,
      logoLeftFrac: 0.32,
      logoWidthMultiplier: 1.52,
    };
  }
  return base;
});

/**
 * @typedef {object} CardDef
 * @property {string} category
 * @property {string} id
 * @property {string} character
 * @property {string} logo
 * @property {number} [logoWidthMultiplier] — faktor lebar relatif default (0.45 × INNER_W)
 * @property {number} [logoLeftFrac] — fraksi INNER_W untuk `left` logo (default 0.48); lebih kecil = lebih banyak ruas kanan untuk logo lebar
 * @property {number} [logoTopOffset] — geser logo vertikal (px). Mode `center`: negatif = naik. Mode `top`: ditambah ke padding atas.
 * @property {'center'|'top'} [logoVerticalAlign] — `top` = rapat ke atas area dalam kartu (bukan center vertikal)
 * @property {number} [logoTopPad] — jarak dari atas inner card jika `logoVerticalAlign: 'top'` (default sama logoPad)
 * @property {boolean} [logoMacBlackToWhite] — area kiri logo: piksel gelap → putih (MAC88), jaga warna biru/cyan ikon & angka 88
 * @property {boolean} [logoTrim] — potong margin transparan PNG sebelum resize (logo terlihat lebih besar di kotak)
 * @property {'bottom'|'top'|'center'} [characterVerticalAlign] — `bottom` (default); `top` = rapat atas + clamp float; `center` = tengah vertikal + clamp float
 * @property {number} [characterTopPad] — jarak dari atas inner jika `characterVerticalAlign: 'top'` (px, default 0)
 * @property {boolean} [characterTrim] — potong margin transparan PNG/WebP karakter sebelum resize (figur lebih besar, kepala lebih dekat atas)
 * @property {number} [characterWidthMultiplier] — faktor lebar resize karakter relatif default 0.5×INNER_W (default 1); >1 = figur lebih besar
 */

/** @type {CardDef[]} */
const CARDS = [
  // slot
  { category: 'slot', id: 'pragmatic-play', character: 'zeus-layers/zeus-body.png', logo: 'pragmatic-play-logo-new.png' },
  { category: 'slot', id: 'pg-soft', character: 'mariachi-skeleton.png', logo: 'download.png' },
  { category: 'slot', id: 'nolimit-city', character: 'cleopatra-character.png', logo: 'nolimit-city-logo-new.png' },
  { category: 'slot', id: 'lucky-monaco', character: 'chinese-empress.png', logo: 'lucky-monaco-logo.png' },
  { category: 'slot', id: 'joker', character: 'spartan-character.png', logo: 'joker-logo.png' },
  { category: 'slot', id: 'cq9', character: 'panda-character.png', logo: 'cq9-logo.png' },
  { category: 'slot', id: 'habanero', character: 'gangster-character.png', logo: 'habanero-logo.png' },
  { category: 'slot', id: 'yggdrasil', character: 'soldier-character.png', logo: 'yggdrasil-logo-new.png' },
  { category: 'slot', id: 'worldmatch', character: 'cowgirl-character.png', logo: 'worldmatch-logo.png' },
  { category: 'slot', id: 'sboslot', character: 'viking-character.png', logo: 'sboslot-logo.png' },
  { category: 'slot', id: 'funkygames', character: 'king-character.png', logo: 'funkygames-logo.png' },
  { category: 'slot', id: 'microgaming', character: 'skeleton-guitarist.png', logo: 'microgaming-logo-new.png' },
  { category: 'slot', id: 'netent', character: 'aladdin-character.png', logo: 'netent-logo.png' },
  { category: 'slot', id: 'afb777', character: 'boxer-character.png', logo: 'afb777-logo.png' },
  { category: 'slot', id: 'jili', character: 'sultan-character.png', logo: 'jili-logo.png' },
  { category: 'slot', id: 'rich88', character: 'genie-character.png', logo: 'rich88-logo.png' },
  { category: 'slot', id: 'advantplay', character: 'poseidon-character.png', logo: 'advantplay-logo.png' },
  { category: 'slot', id: 'kingmaker', character: 'pirate-character.png', logo: 'kingmaker-logo.png' },
  { category: 'slot', id: 'ygr', character: 'warrior-character.png', logo: 'ygr-logo.png' },
  { category: 'slot', id: 'playstar', character: 'pharaoh-character.png', logo: 'playstar-logo.png' },
  { category: 'slot', id: 'fastspin', character: 'scientist-character.png', logo: 'fastspin-logo.png' },
  { category: 'slot', id: 'dragoonsoft', character: 'dragon-character.png', logo: 'dragoonsoft-logo.png' },
  { category: 'slot', id: 'nagagames', character: 'monopoly-character.png', logo: 'nagagames-logo.png' },
  ...SLOT_PARTNER_CARDS,
  // sport (4001–4003 = kartu lama; cmd368 / lucky-sports-plus / united-gaming = kartu baru isi slot kosong)
  { category: 'sport', id: 'sbobet', character: 'yamal-character-new.png', logo: 'sbobet-logo.png' },
  { category: 'sport', id: 'saba-sports', character: 'mbappe-character.png', logo: 'saba-logo.png' },
  { category: 'sport', id: 'afb777-sports', character: 'haaland-character.png', logo: 'afb777-sports-logo.png' },
  // Karakter: sport01 → cmd368, sport02 → lucky-sports-plus, sport03.webp → united-gaming
  {
    category: 'sport',
    id: 'cmd368',
    character: 'sport01.png',
    logo: 'logo-sport1(1).png',
    characterTrim: true,
  },
  {
    category: 'sport',
    id: 'lucky-sports-plus',
    character: 'sport02.png',
    logo: 'logo-sport2(1).png',
    characterVerticalAlign: 'top',
    characterTopPad: 0,
    characterTrim: true,
  },
  {
    category: 'sport',
    id: 'united-gaming',
    character: 'sport03.webp',
    logo: 'logo-sport3(1).png',
    characterTrim: true,
  },
  // esports
  {
    category: 'esports',
    id: 'ia-esports',
    character: 'esport1.png',
    logo: 'logoIAEsports.png',
    characterTrim: true,
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.34,
    logoLeftFrac: 0.34,
    logoWidthMultiplier: 1.45,
  },
  {
    category: 'esports',
    id: 'sbobetesports',
    character: 'esport2.png',
    logo: 'logo-esport1.png',
    characterTrim: true,
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.34,
    logoLeftFrac: 0.34,
    logoWidthMultiplier: 1.45,
  },
  {
    category: 'esports',
    id: 'hp-gaming',
    character: 'esport3.png',
    logo: 'logo-esport2.png',
    characterTrim: true,
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.34,
    logoLeftFrac: 0.34,
    logoWidthMultiplier: 1.45,
  },
  { category: 'sport', id: 'bti', character: 'messi-character.png', logo: 'bti-logo.png' },
  { category: 'sport', id: 'betpanda', character: 'ronaldo-character.png', logo: 'betpanda-logo.png' },
  // casino
  { category: 'casino', id: '568win', character: 'model1.png', logo: 'kasino1-processed.png' },
  { category: 'casino', id: 'wm-casino', character: 'model2.png', logo: 'kasino2-processed.png' },
  { category: 'casino', id: 'ion-casino', character: 'model3.png', logo: 'kasino3-processed.png' },
  { category: 'casino', id: 'sa-gaming', character: 'model4.png', logo: 'kasino4-processed.png' },
  { category: 'casino', id: 'evolution-gaming', character: 'model5.png', logo: 'kasino5-processed.png' },
  { category: 'casino', id: 'allbet', character: 'model6.png', logo: 'kasino6-processed.png' },
  { category: 'casino', id: 'green-dragon', character: 'model7.png', logo: 'kasino7-processed.png' },
  { category: 'casino', id: 'pragmatic-casino', character: 'model8.png', logo: 'kasino8-processed.png' },
  { category: 'casino', id: 'yb-live', character: 'cewek01.png', logo: 'logo-cewek01.png' },
  { category: 'casino', id: 'afb777-casino', character: 'model10.png', logo: 'kasino10-processed.png' },
  {
    category: 'casino',
    id: 'playtech',
    character: 'model11.png',
    logo: 'logoplaytech.png',
    logoTrim: true,
  },
  { category: 'casino', id: 'asia-gaming', character: 'model12.png', logo: 'kasino12-processed.png' },
  { category: 'casino', id: 'wcasino', character: 'model13.png', logo: 'kasino13-processed.png' },
  { category: 'casino', id: 'gameplay-interactive', character: 'model14.png', logo: 'kasino14-processed.png' },
  { category: 'casino', id: 'ezugi', character: 'cewek03.png', logo: 'logo-cewek03.png' },
  // Kartu ini = cewek04 + logo-cewek04 — posisi/logo mengikuti isi file PNG (bukan label "A Star" di UI).
  { category: 'casino', id: 'a-star', character: 'cewek04.png', logo: 'logo-cewek04.png' },
  { category: 'casino', id: 'grand-live', character: 'cewek05.png', logo: 'logo-cewek05.png', logoTopOffset: -28 },
  { category: 'casino', id: 'lucky-heart-live', character: 'cewek08.png', logo: 'logo-cewek08.png' },
  { category: 'casino', id: 'casinogame', character: 'cewek-dreamgaming.png', logo: 'logo-cewek07.png' },
  { category: 'casino', id: 'dream-gaming', character: 'cewek11.png', logo: 'logo-cewek11.png' },
  { category: 'casino', id: 'mac88', character: 'cewek12.png', logo: 'logomac88.png' },
  { category: 'casino', id: 'sexy-gaming', character: 'cewek13.webp', logo: 'logo-cewek13.png' },
  {
    category: 'casino',
    id: 'microgaming-live',
    character: 'cewek07.png',
    logo: 'logomicrogaming.png',
    logoWidthMultiplier: 1.38,
    logoLeftFrac: 0.28,
    logoTrim: true,
  },
  // togel
  { category: 'togel', id: 'hongkong-lotto', character: 'togel1.png', logo: 'lotog1-processed.png' },
  { category: 'togel', id: 'sydney-lotto', character: 'togel2.png', logo: 'lotog2-processed.png' },
  { category: 'togel', id: 'singapore-togel', character: 'togel3.png', logo: 'singapore-white.png' },
  { category: 'togel', id: 'kamboja-togel', character: 'togel4.png', logo: 'cambodia.png' },
  { category: 'togel', id: 'taiwan-togel', character: 'togel5.png', logo: 'taiwan.png' },
  { category: 'togel', id: 'hongkong-togel', character: 'togel6.png', logo: 'hongkong.png' },
  { category: 'togel', id: 'sidney-togel', character: 'togel7.png', logo: 'sidney.png' },
  // fishing (2001–2003 kartu lama; brand-* = fish01–03 + logo baru, isi slot kosong)
  { category: 'fishing', id: 'microgaming-fishing', character: 'hiu1.png', logo: 'fishing1.jpeg' },
  { category: 'fishing', id: 'jdb-fishing-1', character: 'hiu2.png', logo: 'fishing2.jpeg' },
  { category: 'fishing', id: 'jili-fishing', character: 'hiu3.png', logo: 'jili-logo.png' },
  { category: 'fishing', id: 'funky-fishing', character: 'hiu4.png', logo: 'fishing5.png' },
  { category: 'fishing', id: 'dragoon-fishing', character: 'hiu5.png', logo: 'fishing3.png' },
  { category: 'fishing', id: 'cq9-fishing', character: 'hiu6.png', logo: 'cq9-logo.png' },
  { category: 'fishing', id: 'fachai-fishing', character: 'hiu7.png', logo: 'fishing7.png' },
  {
    category: 'fishing',
    id: 'brand-bt-gaming',
    character: 'fish01.png',
    logo: 'logo-fish1.png',
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.32,
  },
  {
    category: 'fishing',
    id: 'brand-v-plus',
    character: 'fish02.png',
    logo: 'logo-fish2.png',
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.32,
  },
  {
    category: 'fishing',
    id: 'brand-ka-gaming',
    character: 'fish03.png',
    logo: 'logoKAgaming.png',
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.32,
  },
  // arcade
  { category: 'arcade', id: 'aviatrix-arcade', character: 'arcade1.png', logo: 'arclog1-processed.png' },
  { category: 'arcade', id: 'kingmidas-arcade', character: 'arcade2.png', logo: 'arclog2.png' },
  { category: 'arcade', id: 'sbobet-arcade', character: 'arcade3.png', logo: 'sbobet-logo.png' },
  { category: 'arcade', id: 'spribe-arcade', character: 'arcade4.png', logo: 'arclog4.png' },
  // arcade baru (6005–6010; kartu 6001–6004 tetap di atas)
  { category: 'arcade', id: 'brand-arc-jdb', character: 'arcade01.webp', logo: 'logo-arc1.png' },
  {
    category: 'arcade',
    id: 'brand-arc-cq9',
    character: 'arcade02.png',
    logo: 'logo-arc2.png',
    characterWidthMultiplier: 1.34,
  },
  {
    category: 'arcade',
    id: 'brand-arc-fachai',
    character: 'arcade07.png',
    logo: 'logofachai.png',
    logoWidthMultiplier: 1.3,
  },
  {
    category: 'arcade',
    id: 'brand-arc-rich88',
    character: 'arcade04.png',
    logo: 'logo-arc4.png',
    characterWidthMultiplier: 1.34,
    logoWidthMultiplier: 1.3,
  },
  {
    category: 'arcade',
    id: 'brand-arc-askmeslot',
    character: 'arcade06.png',
    logo: 'logoaskmeslot.webp',
    characterWidthMultiplier: 1.34,
    logoLeftFrac: 0.36,
    logoWidthMultiplier: 1.78,
  },
  {
    category: 'arcade',
    id: 'brand-arc-six',
    character: 'arcade05.webp',
    logo: 'logo-arc6.webp',
    characterWidthMultiplier: 1.44,
  },
  // crush (9001–9009; rocket + logo per pasangan)
  {
    category: 'crush',
    id: 'rocket-1',
    character: 'rocket1.webp',
    logo: 'logoinout.png',
    characterTrim: true,
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.34,
  },
  {
    category: 'crush',
    id: 'rocket-2',
    character: 'rocket2.png',
    logo: 'logo-rocket1.png',
    characterTrim: true,
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.34,
  },
  {
    category: 'crush',
    id: 'rocket-3',
    character: 'rocket3.png',
    logo: 'logoveliplay.png',
    characterTrim: true,
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.34,
  },
  {
    category: 'crush',
    id: 'rocket-4',
    character: 'rocket4.png',
    logo: 'logo-rocket4.png',
    characterTrim: true,
    logoLeftFrac: 0.3,
    logoWidthMultiplier: 1.55,
  },
  {
    category: 'crush',
    id: 'rocket-5',
    character: 'rocket5.png',
    logo: 'logo100hpgaming.png',
    characterTrim: true,
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.34,
    logoLeftFrac: 0.3,
    logoWidthMultiplier: 1.55,
  },
  {
    category: 'crush',
    id: 'rocket-6',
    character: 'rocket6.webp',
    logo: 'logoturbogames.webp',
    characterTrim: true,
    logoLeftFrac: 0.3,
    logoWidthMultiplier: 1.55,
  },
  { category: 'crush', id: 'rocket-7', character: 'rocket7.webp', logo: 'logo-rocket7.png', characterTrim: true },
  {
    category: 'crush',
    id: 'rocket-8',
    character: 'rocket8.webp',
    logo: 'logo-rocket8.webp',
    characterTrim: true,
    logoLeftFrac: 0.3,
    logoWidthMultiplier: 1.55,
  },
  {
    category: 'crush',
    id: 'rocket-9',
    character: 'rocket9.png',
    logo: 'logopragmaticplay.png',
    characterTrim: true,
    characterVerticalAlign: 'center',
    characterWidthMultiplier: 1.34,
    logoLeftFrac: 0.3,
    logoWidthMultiplier: 1.55,
  },
  // poker
  { category: 'poker', id: 'millionaire-poker', character: 'poker1.png', logo: 'poklog1.png' },
  // cockfight
  { category: 'cockfight', id: 'ga28-cockfight', character: 'cook1.webp', logo: 'colog1.png' },
];

function resolveAsset(rel) {
  return path.join(assets2, rel);
}

/** Area kiri logo: teks MAC + tagline hitam/abu → putih; jangan sentuh biru terang (sekop) & cyan (88). */
async function recolorMacBlackToWhiteLeft(logoBuf) {
  const { data, info } = await sharp(logoBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const xCut = Math.floor(w * 0.64);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < xCut; x++) {
      const i = (y * w + x) * ch;
      const a = data[i + 3];
      if (a < 35) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sum = r + g + b;
      const vividBlue = b > 105 && b - r > 28 && b - g > 15;
      const vividCyan = g > 130 && b > 145 && b > r + 25;
      if (vividBlue || vividCyan) continue;
      const darkEnough = max < 205 && sum < 560;
      const notTooSaturated = max - min < 95;
      if (darkEnough && notTooSaturated) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
  }
  return sharp(data, { raw: { width: w, height: h, channels: ch } })
    .png()
    .toBuffer();
}

async function generateFrame(
  frameIdx,
  characterBuf,
  charHeight,
  logoBuf,
  logoTop,
  logoLeft,
  characterVerticalAlign = 'bottom',
  characterTopPad = 0
) {
  const t = frameIdx / TOTAL_FRAMES;
  const floatOffset = Math.round(Math.sin(t * Math.PI * 2) * 6);
  const glowOpacity = 0.06 + 0.04 * Math.sin(t * Math.PI * 2);
  const shineX = Math.round(-INNER_W * 0.4 + (INNER_W * 1.8) * ((t + 0.5) % 1));
  const shineOpacity = 0.12;
  const maxTop = Math.max(0, INNER_H - charHeight);
  // top / center: clamp float agar karakter tidak keluar frame vertikal
  const charTop =
    characterVerticalAlign === 'top'
      ? Math.max(0, Math.min(characterTopPad + floatOffset, maxTop))
      : characterVerticalAlign === 'center'
        ? Math.max(0, Math.min(Math.round((INNER_H - charHeight) / 2) + floatOffset, maxTop))
        : Math.max(0, INNER_H - charHeight + 10 + floatOffset);

  const innerBg = Buffer.from(`
    <svg width="${INNER_W}" height="${INNER_H}">
      <defs>
        <radialGradient id="glow" cx="20%" cy="50%" r="65%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:${glowOpacity * 8}"/>
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1"/>
        </radialGradient>
      </defs>
      <rect width="${INNER_W}" height="${INNER_H}" fill="url(#glow)"/>
    </svg>`);

  const charCanvas = await sharp({
    create: { width: INNER_W, height: INNER_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite([{ input: characterBuf, left: 0, top: charTop }])
    .png()
    .toBuffer();

  const shineSvg = Buffer.from(`
    <svg width="${INNER_W}" height="${INNER_H}">
      <defs>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style="stop-color:white;stop-opacity:0"/>
          <stop offset="40%" style="stop-color:white;stop-opacity:0"/>
          <stop offset="50%" style="stop-color:white;stop-opacity:${shineOpacity}"/>
          <stop offset="60%" style="stop-color:white;stop-opacity:0"/>
          <stop offset="100%" style="stop-color:white;stop-opacity:0"/>
        </linearGradient>
      </defs>
      <rect x="${shineX}" y="0" width="${Math.round(INNER_W * 0.5)}" height="${INNER_H}" 
            fill="url(#shine)" transform="skewX(-20)"/>
    </svg>`);

  const charGlowOpacity = 0.15 + 0.1 * Math.sin(t * Math.PI * 2);
  const charGlowSvg = Buffer.from(`
    <svg width="${INNER_W}" height="${INNER_H}">
      <defs>
        <radialGradient id="cg" cx="22%" cy="55%" r="35%">
          <stop offset="0%" style="stop-color:white;stop-opacity:${charGlowOpacity}"/>
          <stop offset="100%" style="stop-color:white;stop-opacity:0"/>
        </radialGradient>
      </defs>
      <rect width="${INNER_W}" height="${INNER_H}" fill="url(#cg)"/>
    </svg>`);

  const gleamSvg = Buffer.from(`
    <svg width="${INNER_W}" height="${INNER_H}">
      <defs>
        <linearGradient id="gleam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0"/>
          <stop offset="50%" style="stop-color:white;stop-opacity:0.15"/>
          <stop offset="100%" style="stop-color:white;stop-opacity:0"/>
        </linearGradient>
      </defs>
      <rect y="0" width="${INNER_W}" height="1" fill="url(#gleam)"/>
    </svg>`);

  const innerCard = await sharp(innerBg)
    .composite([
      { input: charGlowSvg, left: 0, top: 0 },
      { input: charCanvas, left: 0, top: 0 },
      { input: logoBuf, left: logoLeft, top: logoTop },
      { input: shineSvg, left: 0, top: 0 },
      { input: gleamSvg, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  const clipMask = Buffer.from(`
    <svg width="${INNER_W}" height="${INNER_H}">
      <rect width="${INNER_W}" height="${INNER_H}" rx="6" fill="white"/>
    </svg>`);

  const innerClipped = await sharp(innerCard)
    .composite([{ input: clipMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const borderSvg = Buffer.from(`
    <svg width="${CARD_W}" height="${CARD_H}">
      <defs>
        <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e8e8e8"/>
          <stop offset="50%" style="stop-color:#808080"/>
          <stop offset="100%" style="stop-color:#404040"/>
        </linearGradient>
      </defs>
      <rect width="${CARD_W}" height="${CARD_H}" rx="8" fill="url(#chrome)"/>
    </svg>`);

  const framePath = path.join(tmpDir, `frame_${String(frameIdx).padStart(3, '0')}.webp`);
  await sharp(borderSvg)
    .composite([{ input: innerClipped, left: BORDER, top: BORDER }])
    .webp({ quality: WEBP_QUALITY })
    .toFile(framePath);

  return framePath;
}

async function generateOneCard(card) {
  const {
    category,
    id,
    character,
    logo,
    logoWidthMultiplier = 1,
    logoLeftFrac = 0.48,
    logoTopOffset = 0,
    logoVerticalAlign = 'center',
    logoTopPad: logoTopPadOpt,
    logoMacBlackToWhite = false,
    logoTrim = false,
    characterVerticalAlign = 'bottom',
    characterTopPad = 0,
    characterTrim = false,
    characterWidthMultiplier = 1,
  } = card;
  const charPath = resolveAsset(character);
  const logoPath = resolveAsset(logo);
  if (!fs.existsSync(charPath)) throw new Error(`Missing character: ${character}`);
  if (!fs.existsSync(logoPath)) throw new Error(`Missing logo: ${logo}`);

  const charTargetW = Math.round(
    Math.min(INNER_W * 0.5 * characterWidthMultiplier, INNER_W * 0.74)
  );
  // Overlay must fit inside INNER_H×INNER_W canvas (sharp composite rule)
  // Center vertikal: turunkan max tinggi sedikit supaya ada ruang untuk float ±6px (gerak seperti kartu lain).
  const charMaxH = characterVerticalAlign === 'center' ? INNER_H - 14 : INNER_H;
  let charPipeline = sharp(charPath).ensureAlpha();
  if (characterTrim) {
    const trimmed = await charPipeline.trim({ threshold: 20 }).png().toBuffer();
    charPipeline = sharp(trimmed);
  }
  const characterBuf = await charPipeline
    .resize({
      width: charTargetW,
      height: charMaxH,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const charMeta = await sharp(characterBuf).metadata();
  const charHeight = Math.min(charMeta.height ?? INNER_H, INNER_H);

  const logoPad = 4;
  const logoMaxH = INNER_H - logoPad * 2;
  const logoLeft = Math.round(INNER_W * logoLeftFrac);
  const maxLogoW = Math.max(40, INNER_W - logoLeft - logoPad);
  const logoW = Math.min(Math.round(INNER_W * 0.45 * logoWidthMultiplier), maxLogoW);
  let logoPipeline = sharp(logoPath).ensureAlpha();
  if (logoTrim) {
    const trimmed = await logoPipeline.trim({ threshold: 20 }).png().toBuffer();
    logoPipeline = sharp(trimmed);
  }
  if (logoMacBlackToWhite) {
    const pre = await logoPipeline.png().toBuffer();
    logoPipeline = sharp(await recolorMacBlackToWhiteLeft(pre));
  }
  const logoBuf = await logoPipeline
    .resize({
      width: logoW,
      height: logoMaxH,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const logoMeta = await sharp(logoBuf).metadata();
  const logoH = Math.min(logoMeta.height ?? 0, INNER_H);
  const topPadForLogo = logoTopPadOpt ?? logoPad;
  const logoTop =
    logoVerticalAlign === 'top'
      ? Math.max(0, topPadForLogo + logoTopOffset)
      : Math.max(logoPad, Math.round((INNER_H - logoH) / 2) + logoTopOffset);

  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  const framePaths = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    framePaths.push(
      await generateFrame(
        i,
        characterBuf,
        charHeight,
        logoBuf,
        logoTop,
        logoLeft,
        characterVerticalAlign,
        characterTopPad
      )
    );
  }

  const outName = `${category}-${id}.webp`;
  const categoryOutDir = path.join(outDir, category);
  fs.mkdirSync(categoryOutDir, { recursive: true });
  const outputPath = path.join(categoryOutDir, outName);
  const args = framePaths.map((f) => `-d ${FRAME_DELAY} "${f}"`).join(' ');
  execSync(`img2webp -loop 0 ${args} -o "${outputPath}"`, { stdio: 'pipe' });

  fs.rmSync(tmpDir, { recursive: true });
  const stat = fs.statSync(outputPath);
  return { outName, bytes: stat.size };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const onlyArg = process.argv[2] ?? null;
  const cardsToRun = onlyArg
    ? CARDS.filter((c) => `${c.category}-${c.id}` === onlyArg)
    : CARDS;
  if (onlyArg && cardsToRun.length === 0) {
    console.error(`No card matches "${onlyArg}". Use label like casino-yb-live`);
    process.exit(1);
  }
  console.log(`Output: ${outDir}${onlyArg ? ` (only: ${onlyArg})` : ''}\n`);

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < cardsToRun.length; i++) {
    const card = cardsToRun[i];
    const label = `${card.category}-${card.id}`;
    process.stdout.write(`[${i + 1}/${cardsToRun.length}] ${label} ... `);
    try {
      const { bytes } = await generateOneCard(card);
      console.log(`${(bytes / 1024).toFixed(0)} KB`);
      ok++;
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
