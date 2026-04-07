/**
 * Generates animated WebP brand cards (character + logo, no PLAY NOW button)
 * into src/assets2/animated-brand/{category}-{provider-id}.webp
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

/** @type {{ category: string, id: string, character: string, logo: string }[]} */
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
  // sport
  { category: 'sport', id: 'sbobet', character: 'yamal-character-new.png', logo: 'sbobet-logo.png' },
  { category: 'sport', id: 'saba-sports', character: 'mbappe-character.png', logo: 'saba-logo.png' },
  { category: 'sport', id: 'afb777-sports', character: 'haaland-character.png', logo: 'afb777-sports-logo.png' },
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
  { category: 'casino', id: 'yb-live', character: 'model9.png', logo: 'kasino9-processed.png' },
  { category: 'casino', id: 'afb777-casino', character: 'model10.png', logo: 'kasino10-processed.png' },
  { category: 'casino', id: 'playtech', character: 'model11.png', logo: 'kasino11-processed.png' },
  { category: 'casino', id: 'asia-gaming', character: 'model12.png', logo: 'kasino12-processed.png' },
  { category: 'casino', id: 'wcasino', character: 'model13.png', logo: 'kasino13-processed.png' },
  { category: 'casino', id: 'gameplay-interactive', character: 'model14.png', logo: 'kasino14-processed.png' },
  // togel
  { category: 'togel', id: 'hongkong-lotto', character: 'togel1.png', logo: 'lotog1-processed.png' },
  { category: 'togel', id: 'sydney-lotto', character: 'togel2.png', logo: 'lotog2-processed.png' },
  { category: 'togel', id: 'singapore-togel', character: 'togel3.png', logo: 'singapore-white.png' },
  { category: 'togel', id: 'kamboja-togel', character: 'togel4.png', logo: 'cambodia.png' },
  { category: 'togel', id: 'taiwan-togel', character: 'togel5.png', logo: 'taiwan.png' },
  { category: 'togel', id: 'hongkong-togel', character: 'togel6.png', logo: 'hongkong.png' },
  { category: 'togel', id: 'sidney-togel', character: 'togel7.png', logo: 'sidney.png' },
  // fishing
  { category: 'fishing', id: 'microgaming-fishing', character: 'hiu1.png', logo: 'fishing1.jpeg' },
  { category: 'fishing', id: 'jdb-fishing-1', character: 'hiu2.png', logo: 'fishing2.jpeg' },
  { category: 'fishing', id: 'jili-fishing', character: 'hiu3.png', logo: 'jili-logo.png' },
  { category: 'fishing', id: 'funky-fishing', character: 'hiu4.png', logo: 'fishing5.png' },
  { category: 'fishing', id: 'dragoon-fishing', character: 'hiu5.png', logo: 'fishing3.png' },
  { category: 'fishing', id: 'cq9-fishing', character: 'hiu6.png', logo: 'cq9-logo.png' },
  { category: 'fishing', id: 'fachai-fishing', character: 'hiu7.png', logo: 'fishing7.png' },
  // arcade
  { category: 'arcade', id: 'aviatrix-arcade', character: 'arcade1.png', logo: 'arclog1-processed.png' },
  { category: 'arcade', id: 'kingmidas-arcade', character: 'arcade2.png', logo: 'arclog2.png' },
  { category: 'arcade', id: 'sbobet-arcade', character: 'arcade3.png', logo: 'sbobet-logo.png' },
  { category: 'arcade', id: 'spribe-arcade', character: 'arcade4.png', logo: 'arclog4.png' },
  // poker
  { category: 'poker', id: 'millionaire-poker', character: 'poker1.png', logo: 'poklog1.png' },
  // cockfight
  { category: 'cockfight', id: 'ga28-cockfight', character: 'cook1.webp', logo: 'colog1.png' },
];

function resolveAsset(rel) {
  return path.join(assets2, rel);
}

async function generateFrame(
  frameIdx,
  characterBuf,
  charHeight,
  logoBuf,
  logoMeta
) {
  const t = frameIdx / TOTAL_FRAMES;
  const floatOffset = Math.round(Math.sin(t * Math.PI * 2) * 6);
  const glowOpacity = 0.06 + 0.04 * Math.sin(t * Math.PI * 2);
  const shineX = Math.round(-INNER_W * 0.4 + (INNER_W * 1.8) * ((t + 0.5) % 1));
  const shineOpacity = 0.12;
  const charTop = Math.max(0, INNER_H - charHeight + 10 + floatOffset);

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

  const logoLeft = Math.round(INNER_W * 0.48);
  const logoTop = 30;

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

async function generateOneCard({ category, id, character, logo }) {
  const charPath = resolveAsset(character);
  const logoPath = resolveAsset(logo);
  if (!fs.existsSync(charPath)) throw new Error(`Missing character: ${character}`);
  if (!fs.existsSync(logoPath)) throw new Error(`Missing logo: ${logo}`);

  const charTargetW = Math.round(INNER_W * 0.5);
  // Overlay must fit inside INNER_H×INNER_W canvas (sharp composite rule)
  const charMaxH = INNER_H;
  const characterBuf = await sharp(charPath)
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

  const logoW = Math.round(INNER_W * 0.45);
  const logoTop = 30;
  const logoMaxH = INNER_H - logoTop - 6;
  const logoBuf = await sharp(logoPath)
    .resize({
      width: logoW,
      height: logoMaxH,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const logoMeta = await sharp(logoBuf).metadata();

  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  const framePaths = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    framePaths.push(await generateFrame(i, characterBuf, charHeight, logoBuf, logoMeta));
  }

  const outName = `${category}-${id}.webp`;
  const outputPath = path.join(outDir, outName);
  const args = framePaths.map((f) => `-d ${FRAME_DELAY} "${f}"`).join(' ');
  execSync(`img2webp -loop 0 ${args} -o "${outputPath}"`, { stdio: 'pipe' });

  fs.rmSync(tmpDir, { recursive: true });
  const stat = fs.statSync(outputPath);
  return { outName, bytes: stat.size };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`Output: ${outDir}\n`);

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < CARDS.length; i++) {
    const card = CARDS[i];
    const label = `${card.category}-${card.id}`;
    process.stdout.write(`[${i + 1}/${CARDS.length}] ${label} ... `);
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
