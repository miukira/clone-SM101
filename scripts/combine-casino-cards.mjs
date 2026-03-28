import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const assetsDir = path.join(root, 'src', 'assets2')
const outDir = path.join(root, 'combined-casino')

const W = 350
const H = 300
/** Gelap 20% → brightness 80% */
const BRIGHTNESS = 0.8

async function compositePair(index) {
  const kasinoPath = path.join(assetsDir, `kasino${index}-processed.png`)
  const modelPath = path.join(assetsDir, `model${index}.png`)
  const outPath = path.join(outDir, `casino-combined-${String(index).padStart(2, '0')}.webp`)

  const background = await sharp(kasinoPath)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .ensureAlpha()
    .png()
    .toBuffer()

  const maxModelH = Math.round(H * 0.9)
  const modelLayer = await sharp(modelPath)
    .ensureAlpha()
    .resize({ width: W, height: maxModelH, fit: 'inside' })
    .png()
    .toBuffer()

  const { width: mw, height: mh } = await sharp(modelLayer).metadata()
  const top = H - mh
  const left = Math.round((W - mw) / 2)

  await sharp(background)
    .composite([{ input: modelLayer, top, left, blend: 'over' }])
    .modulate({ brightness: BRIGHTNESS })
    .webp({ quality: 88, effort: 4 })
    .toFile(outPath)

  console.log(outPath)
}

await mkdir(outDir, { recursive: true })
for (let i = 1; i <= 14; i += 1) {
  await compositePair(i)
}
console.log('Done: 14 WebP files →', outDir)
