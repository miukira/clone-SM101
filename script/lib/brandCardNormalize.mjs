/**
 * Normalisasi kartu provider (karakter + logo) ke ukuran tetap 290×180 via Sharp.
 * Input boleh Buffer atau path file — ukuran sumber bebas; output selalu sama.
 * Dipakai unit test atau backend (impor modul ini).
 */
import sharp from 'sharp';
import fs from 'fs';

export const BRAND_CARD = {
  CARD_W: 290,
  CARD_H: 180,
  BORDER: 3,
  get INNER_W() {
    return this.CARD_W - this.BORDER * 2;
  },
  get INNER_H() {
    return this.CARD_H - this.BORDER * 2;
  },
  WEBP_QUALITY: 70,
  /** Frame untuk komposisi statis (sama seperti frame 0 generator animasi) */
  ANIM_TOTAL_FRAMES: 24,
};

/** @param {Buffer|string} input */
function openSharp(input) {
  if (Buffer.isBuffer(input)) return sharp(input);
  return sharp(input);
}

/** @param {Buffer|string} input */
async function readIfPath(input) {
  if (Buffer.isBuffer(input)) return input;
  return fs.readFileSync(input);
}

/** MAC88 kiri gelap → putih (recolor agar logo terbaca di background gelap) */
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

/**
 * @typedef {object} NormalizeBrandCardOptions
 * @property {number} [logoWidthMultiplier]
 * @property {number} [logoLeftFrac]
 * @property {number} [logoTopOffset]
 * @property {'center'|'top'} [logoVerticalAlign]
 * @property {number} [logoTopPad]
 * @property {boolean} [logoMacBlackToWhite]
 * @property {boolean} [logoTrim]
 * @property {'bottom'|'top'|'center'} [characterVerticalAlign]
 * @property {number} [characterTopPad]
 * @property {boolean} [characterTrim]
 * @property {number} [characterWidthMultiplier]
 * @property {number} [frameIdx] — indeks frame “animasi” untuk efek (default 0 = statis)
 */

/**
 * Resize + composite satu frame penuh (border chrome) → WebP Buffer.
 * @param {Buffer} characterBuf
 * @param {number} charHeight
 * @param {Buffer} logoBuf
 * @param {number} logoTop
 * @param {number} logoLeft
 * @param {'bottom'|'top'|'center'} characterVerticalAlign
 * @param {number} characterTopPad
 * @param {number} frameIdx
 */
async function renderFullCardWebpBuffer(
  characterBuf,
  charHeight,
  logoBuf,
  logoTop,
  logoLeft,
  characterVerticalAlign = 'bottom',
  characterTopPad = 0,
  frameIdx = 0
) {
  const { CARD_W, CARD_H, BORDER, INNER_W, INNER_H, WEBP_QUALITY, ANIM_TOTAL_FRAMES } = BRAND_CARD;
  const TOTAL_FRAMES = ANIM_TOTAL_FRAMES;
  const t = frameIdx / TOTAL_FRAMES;
  const floatOffset = Math.round(Math.sin(t * Math.PI * 2) * 6);
  const glowOpacity = 0.06 + 0.04 * Math.sin(t * Math.PI * 2);
  const shineX = Math.round(-INNER_W * 0.4 + INNER_W * 1.8 * ((t + 0.5) % 1));
  const shineOpacity = 0.12;
  const maxTop = Math.max(0, INNER_H - charHeight);
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
    create: { width: INNER_W, height: INNER_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
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

  return sharp(borderSvg)
    .composite([{ input: innerClipped, left: BORDER, top: BORDER }])
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

/**
 * Pipeline resize karakter + logo (sama logika dengan generateOneCard).
 * @param {Buffer|string} characterInput
 * @param {Buffer|string} logoInput
 * @param {NormalizeBrandCardOptions} [options]
 */
export async function buildCharacterAndLogoBuffers(characterInput, logoInput, options = {}) {
  const { INNER_W, INNER_H } = BRAND_CARD;
  const {
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
  } = options;

  const charTargetW = Math.round(Math.min(INNER_W * 0.5 * characterWidthMultiplier, INNER_W * 0.74));
  const charMaxH = characterVerticalAlign === 'center' ? INNER_H - 14 : INNER_H;

  let charPipeline = openSharp(await readIfPath(characterInput)).ensureAlpha();
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

  let logoPipeline = openSharp(await readIfPath(logoInput)).ensureAlpha();
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

  return {
    characterBuf,
    charHeight,
    logoBuf,
    logoTop,
    logoLeft,
    characterVerticalAlign,
    characterTopPad,
  };
}

/**
 * Satu kartu WebP 290×180 — ukuran file karakter/logo bebas.
 * @param {Buffer|string} characterInput
 * @param {Buffer|string} logoInput
 * @param {NormalizeBrandCardOptions} [options]
 * @returns {Promise<Buffer>}
 */
export async function normalizeBrandCardToWebp(characterInput, logoInput, options = {}) {
  const frameIdx = options.frameIdx ?? 0;
  const built = await buildCharacterAndLogoBuffers(characterInput, logoInput, options);
  return renderFullCardWebpBuffer(
    built.characterBuf,
    built.charHeight,
    built.logoBuf,
    built.logoTop,
    built.logoLeft,
    built.characterVerticalAlign,
    built.characterTopPad,
    frameIdx
  );
}
