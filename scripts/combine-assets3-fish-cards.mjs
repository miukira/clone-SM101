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

const FISH_TOP_BIAS = {}

const fishBgFiles = [
  '6f551d248990a7532cc74ce1b7e35e18_0_1774887154_6887-min.png',
  'b14da608420468a0e164a32ac7ae66c3_0_1774886952_2519-min.png',
  'a8c6c07aa66d0e22854e6b5b9a94b958_0_1774886786_6355-min.png',
]

const fishLogoFiles = ['logofish1.png', 'logofish2.png', 'logofish3.png']

async function bgToCoverBuffer(bgPath, topBias) {
  const meta = await sharp(bgPath).metadata()
  const iw = meta.width
  const ih = meta.height
  if (!iw || !ih) {
    throw new Error(`Ukuran gambar tidak ada: ${bgPath}`)
  }

  const scale = Math.max(W / iw, H / ih)
  const sw = Math.ceil(iw * scale)
  const sh = Math.ceil(ih * scale)
  const left = Math.max(0, Math.floor((sw - W) / 2))
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

async function fishLogoToLayer(logoPath) {
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
  const bgPath = path.join(assetsDir, fishBgFiles[i])
  const logoPath = path.join(assetsDir, fishLogoFiles[i])
  const outPath = path.join(assetsDir, `fish-combined-${String(index).padStart(2, '0')}.webp`)

  const topBias = FISH_TOP_BIAS[index] ?? 0
  const background = await bgToCoverBuffer(bgPath, topBias)

  const logoLayer = await fishLogoToLayer(logoPath)

  const { width: mw, height: mh } = await sharp(logoLayer).metadata()
  const top = H - mh
  const left = Math.round((W - mw) / 2)

  await sharp(background)
    .composite([{ input: logoLayer, top, left, blend: 'over' }])
    .webp({ quality: 88, effort: 4 })
    .toFile(outPath)

  console.log(outPath)
}

const n = fishBgFiles.length
for (let index = 1; index <= n; index += 1) {
  await compositeOne(index)
}
console.log('Done:', n, 'fish-combined →', assetsDir)
