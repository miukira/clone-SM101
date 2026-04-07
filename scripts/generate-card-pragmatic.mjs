import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const tmpDir = path.join(root, 'scripts', '_tmp_frames');

const CARD_W = 290;
const CARD_H = 180;
const BORDER = 3;
const INNER_W = CARD_W - BORDER * 2;
const INNER_H = CARD_H - BORDER * 2;

const TOTAL_FRAMES = 24;
const FRAME_DELAY = 130; // ms per frame

function easeInOut(t) {
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

async function generateFrame(frameIdx, characterBuf, logoBuf, logoMeta) {
  const t = frameIdx / TOTAL_FRAMES;

  // Floating: character moves up/down ~6px over cycle
  const floatOffset = Math.round(Math.sin(t * Math.PI * 2) * 6);

  // Glow pulse: opacity varies
  const glowOpacity = 0.06 + 0.04 * Math.sin(t * Math.PI * 2);

  // Shine sweep position: moves left to right across card
  const shineX = Math.round(-INNER_W * 0.4 + (INNER_W * 1.8) * ((t + 0.5) % 1));
  const shineOpacity = 0.12;

  // Inner background with pulsing glow
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

  // Character on canvas with float offset
  const charMeta = await sharp(characterBuf).metadata();
  const charTop = Math.max(0, INNER_H - charMeta.height + 10 + floatOffset);
  const charCanvas = await sharp({
    create: { width: INNER_W, height: INNER_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite([{ input: characterBuf, left: 0, top: charTop }])
    .png()
    .toBuffer();

  // Shine sweep overlay
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

  // Logo position
  const logoLeft = Math.round(INNER_W * 0.48);
  const logoTop = 30;

  // Character glow behind character (pulsing)
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

  // Top edge gleam
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

  // Compose inner
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

  // Clip to rounded rect
  const clipMask = Buffer.from(`
    <svg width="${INNER_W}" height="${INNER_H}">
      <rect width="${INNER_W}" height="${INNER_H}" rx="6" fill="white"/>
    </svg>`);

  const innerClipped = await sharp(innerCard)
    .composite([{ input: clipMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Chrome border
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

  // Final frame
  const framePath = path.join(tmpDir, `frame_${String(frameIdx).padStart(3, '0')}.webp`);
  await sharp(borderSvg)
    .composite([{ input: innerClipped, left: BORDER, top: BORDER }])
    .webp({ quality: 70 })
    .toFile(framePath);

  return framePath;
}

async function main() {
  // Clean & create tmp dir
  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  // Prepare character
  const charTargetW = Math.round(INNER_W * 0.50);
  const characterBuf = await sharp(path.join(root, 'src/assets2/zeus-layers/zeus-body.png'))
    .resize({ width: charTargetW, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Prepare logo
  const logoW = Math.round(INNER_W * 0.45);
  const logoBuf = await sharp(path.join(root, 'src/assets2/pragmatic-play-logo-new.png'))
    .resize({ width: logoW, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const logoMeta = await sharp(logoBuf).metadata();

  console.log(`Generating ${TOTAL_FRAMES} frames...`);
  const framePaths = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const fp = await generateFrame(i, characterBuf, logoBuf, logoMeta);
    framePaths.push(fp);
    process.stdout.write(`\rFrame ${i + 1}/${TOTAL_FRAMES}`);
  }
  console.log('\nCombining into animated WebP...');

  // Build img2webp command
  const outputPath = path.join(root, 'src/assets2/slot-pragmatic-play-card.webp');
  const args = framePaths.map(f => `-d ${FRAME_DELAY} ${f}`).join(' ');
  execSync(`img2webp -loop 0 ${args} -o "${outputPath}"`);

  const stat = fs.statSync(outputPath);
  console.log(`Generated: src/assets2/slot-pragmatic-play-card.webp`);
  console.log(`Size: ${stat.size} bytes (${(stat.size / 1024).toFixed(1)} KB)`);
  console.log(`Frames: ${TOTAL_FRAMES}, Duration: ${TOTAL_FRAMES * FRAME_DELAY}ms, Loop: infinite`);

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true });
}

main().catch(console.error);
