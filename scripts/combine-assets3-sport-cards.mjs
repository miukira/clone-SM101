import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const assetsDir = path.join(root, 'src', 'assets3')

const W = 350
const H = 300
const BRIGHTNESS = 0.8

const LOGO_MAX_W = W - 8
const LOGO_TARGET_H = Math.round(H * 0.26)

const SPORT_TOP_BIAS = {}

/** Geser crop horizontal (px): positif = jendela crop ke kanan di sumber → isi kartu tampak ke kiri (orang ke tengah bila tadinya condong kanan). */
const SPORT_LEFT_SHIFT_PX = {
  3: 50,
}

const sportBgFiles = ['sport01.jpg', 'bola 1.webp', 'sport2.jpg']

const sportLogoFiles = [
  'logo-sport1(1).png',
  'logo-sport2(1).png',
  'logo-sport3(1).png',
]

async function bgToCoverBuffer(bgPath, topBias, leftShiftPx = 0) {
  const meta = await sharp(bgPath).metadata()
  const iw = meta.width
  const ih = meta.height
  if (!iw || !ih) {
    throw new Error(`Ukuran gambar tidak ada: ${bgPath}`)
  }

  const scale = Math.max(W / iw, H / ih)
  const sw = Math.ceil(iw * scale)
  const sh = Math.ceil(ih * scale)
  const maxLeft = Math.max(0, sw - W)
  const leftCenter = Math.max(0, Math.floor((sw - W) / 2))
  const left = Math.min(maxLeft, Math.max(0, leftCenter + leftShiftPx))
  const maxTop = Math.max(0, sh - H)
  const top = Math.min(maxTop, Math.floor(maxTop * topBias))

  return sharp(bgPath)
    .resize(sw, sh)
    .extract({ left, top, width: W, height: H })
    .ensureAlpha()
    .modulate({ brightness: BRIGHTNESS })
    .png()
    .toBuffer()
}

async function sportLogoToLayer(logoPath) {
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
  const bgPath = path.join(assetsDir, sportBgFiles[i])
  const logoPath = path.join(assetsDir, sportLogoFiles[i])
  const outPath = path.join(assetsDir, `sport-combined-${String(index).padStart(2, '0')}.webp`)

  const topBias = SPORT_TOP_BIAS[index] ?? 0
  const leftShiftPx = SPORT_LEFT_SHIFT_PX[index] ?? 0
  const background = await bgToCoverBuffer(bgPath, topBias, leftShiftPx)

  const logoLayer = await sportLogoToLayer(logoPath)

  const { width: mw, height: mh } = await sharp(logoLayer).metadata()
  const top = H - mh
  const left = Math.round((W - mw) / 2)

  await sharp(background)
    .composite([{ input: logoLayer, top, left, blend: 'over' }])
    .webp({ quality: 88, effort: 4 })
    .toFile(outPath)

  console.log(outPath)
}

const n = sportBgFiles.length
for (let index = 1; index <= n; index += 1) {
  await compositeOne(index)
}
console.log('Done:', n, 'sport-combined →', assetsDir)
