import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const assetsDir = path.join(root, 'src', 'assets3')

const W = 350
const H = 300
/** Latar ~20% lebih gelap */
const BRIGHTNESS = 0.8

/** Logo: tinggi tetap untuk semua logo, lebar proporsional (maks lebar kartu - 8) */
const LOGO_MAX_W = W - 8
const LOGO_TARGET_H = Math.round(H * 0.26)

/**
 * Bias vertikal untuk cover manual: 0 = anchor atas (north), mendekati 1 = crop bergeser ke bawah
 * pada sumber. Nilai terlalu besar bisa memotong rambut/kepala; turunkan jika kepala kepotong.
 */
const CEWE_TOP_BIAS = {
  2: 0.06,
  4: 0.12,
  7: 0.12,
  8: 0.32,
}

const casinoLogoFiles = [
  'logo1.png',
  'logo2.png',
  'logo3.png',
  'logo4.png',
  'logo5.png',
  'logo6.png',
  'logo7.png',
  'logo8png.png',
  'logo9.png',
  'logo10.png',
  'logo11.png',
  'logo12.png',
  'logo13.png',
]

const casinoCeweFiles = [
  'cewe1.jpeg',
  'cewe2.jpeg',
  'cewe3.jpeg',
  'cewe4.jpg',
  'cewe5.jpg',
  'cewe6.jpeg',
  'cewe7.jpeg',
  'cewe8.jpg',
  'cewe9.avif',
  'cewe14.webp',
  'cewe11(1).jpg',
  'cewe12.avif',
  'cewe13.webp',
]

async function ceweToCoverBuffer(cewePath, topBias) {
  const meta = await sharp(cewePath).metadata()
  const iw = meta.width
  const ih = meta.height
  if (!iw || !ih) {
    throw new Error(`Ukuran gambar tidak ada: ${cewePath}`)
  }

  const scale = Math.max(W / iw, H / ih)
  const sw = Math.ceil(iw * scale)
  const sh = Math.ceil(ih * scale)
  const left = Math.max(0, Math.floor((sw - W) / 2))
  const maxTop = Math.max(0, sh - H)
  const top = Math.min(maxTop, Math.floor(maxTop * topBias))

  return sharp(cewePath)
    .resize(sw, sh)
    .extract({ left, top, width: W, height: H })
    .ensureAlpha()
    .modulate({ brightness: BRIGHTNESS })
    .png()
    .toBuffer()
}

async function casinoLogoToLayer(logoPath) {
  const trimmed = await sharp(logoPath).ensureAlpha().trim().png().toBuffer()
  const meta = await sharp(trimmed).metadata()
  const iw = meta.width
  const ih = meta.height
  if (!iw || !ih) {
    throw new Error(`Ukuran logo tidak ada: ${logoPath}`)
  }

  const scaleH = LOGO_TARGET_H / ih
  const scaleW = LOGO_MAX_W / iw
  const scale = Math.min(scaleH, scaleW)

  const rw = Math.max(1, Math.round(iw * scale))
  const rh = Math.max(1, Math.round(ih * scale))

  return sharp(trimmed).resize(rw, rh).png().toBuffer()
}

async function compositeOne(index) {
  const i = index - 1
  const cewePath = path.join(assetsDir, casinoCeweFiles[i])
  const logoPath = path.join(assetsDir, casinoLogoFiles[i])
  const outPath = path.join(assetsDir, `card-combined-${String(index).padStart(2, '0')}.webp`)

  const topBias = CEWE_TOP_BIAS[index] ?? 0
  const background = await ceweToCoverBuffer(cewePath, topBias)

  const logoLayer = await casinoLogoToLayer(logoPath)

  const { width: mw, height: mh } = await sharp(logoLayer).metadata()
  const top = H - mh
  const left = Math.round((W - mw) / 2)

  await sharp(background)
    .composite([{ input: logoLayer, top, left, blend: 'over' }])
    .webp({ quality: 88, effort: 4 })
    .toFile(outPath)

  console.log(outPath)
}

for (let index = 1; index <= 13; index += 1) {
  await compositeOne(index)
}
console.log('Done: 13 card-combined →', assetsDir)
