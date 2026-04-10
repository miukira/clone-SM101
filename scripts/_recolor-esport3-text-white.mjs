/**
 * Teks hitam → putih, latar → transparan.
 * 1) Flatten ke putih (kalau aset sudah transparan / premultiplied).
 * 2) Flood-fill dari tepi untuk piksel latar terang.
 * 3) Piksel teks gelap netral (kanan ikon) → putih opaque.
 *
 * Input: src/assets2/logo-esport3-source.png (master)
 * Output: src/assets2/logo-esport3.png
 *
 * node scripts/_recolor-esport3-text-white.mjs
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assets = path.join(root, 'src', 'assets2');
const sourcePreferred = path.join(assets, 'logo-esport3-source.png');
const sourceFallback = path.join(assets, 'logo-esport3.png');
const output = path.join(assets, 'logo-esport3.png');

function isBgSeed(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (r + g + b < 655) return false;
  if (max - min > 48) return false;
  return true;
}

function isNeutralDark(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max > 200) return false;
  if (max - min > 52) return false;
  if (max < 45 && r + g + b < 150) return true;
  if (max < 135 && max - min < 45) return true;
  return false;
}

function isIconColor(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 18) return false;
  if (r > 95 && r > b + 25) return true;
  return false;
}

async function main() {
  const input = fs.existsSync(sourcePreferred) ? sourcePreferred : sourceFallback;
  if (!fs.existsSync(input)) {
    console.error('Missing input:', input);
    process.exit(1);
  }

  const flattenedBuf = await sharp(input)
    .ensureAlpha()
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const data = Buffer.from(flattenedBuf.data);
  const info = flattenedBuf.info;
  const w = info.width;
  const h = info.height;
  const ch = info.channels;

  const bg = new Uint8Array(w * h);
  const textX0 = Math.floor(w * 0.19);
  const q = [];

  const idx = (x, y) => y * w + x;

  const tryPush = (x, y) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const i = idx(x, y);
    if (bg[i]) return;
    const p = i * ch;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    if (!isBgSeed(r, g, b)) return;
    bg[i] = 1;
    q.push(i);
  };

  for (let x = 0; x < w; x++) {
    tryPush(x, 0);
    tryPush(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    tryPush(0, y);
    tryPush(w - 1, y);
  }

  while (q.length) {
    const i = q.pop();
    const x = i % w;
    const y = (i / w) | 0;
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      tryPush(nx, ny);
    }
  }

  const out = Buffer.from(data);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idx(x, y);
      const p = i * ch;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];

      if (bg[i]) {
        out[p + 3] = 0;
        continue;
      }

      if (x >= textX0 && isNeutralDark(r, g, b) && !isIconColor(r, g, b)) {
        out[p] = 255;
        out[p + 1] = 255;
        out[p + 2] = 255;
        out[p + 3] = 255;
      }
    }
  }

  await sharp(out, { raw: { width: w, height: h, channels: ch } }).png().toFile(output);
  console.log('Wrote', output, 'from', input, '(flattened → flood-fill → text white)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
