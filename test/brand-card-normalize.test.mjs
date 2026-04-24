import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { normalizeBrandCardToWebp, BRAND_CARD } from '../script/lib/brandCardNormalize.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** PNG buffer, ukuran sembarang — mensimulasikan upload klien */
async function solidPng(width, height, rgb) {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: rgb[0], g: rgb[1], b: rgb[2] },
    },
  })
    .png()
    .toBuffer()
}

async function assertWebpCardDimensions(buf, label) {
  const meta = await sharp(buf).metadata()
  assert.equal(meta.format, 'webp', `${label}: format`)
  assert.equal(meta.width, BRAND_CARD.CARD_W, `${label}: width`)
  assert.equal(meta.height, BRAND_CARD.CARD_H, `${label}: height`)
}

describe('brandCardNormalize — ukuran kartu dari kode (Sharp), bukan dari skrip/aset siap pakai', () => {
  it('simulasi upload klien: input jauh dari 290×180 → keluaran kartu tetap 290×180', async () => {
    const character = await solidPng(80, 3200, [30, 60, 90])
    const logo = await solidPng(3600, 70, [200, 200, 200])
    const cm = await sharp(character).metadata()
    const lm = await sharp(logo).metadata()
    assert.notEqual(cm.width, BRAND_CARD.CARD_W, 'lebar karakter sumber ≠ lebar kartu')
    assert.notEqual(cm.height, BRAND_CARD.CARD_H, 'tinggi karakter sumber ≠ tinggi kartu')
    assert.ok((cm.height ?? 0) > BRAND_CARD.CARD_H * 2, 'karakter sangat tinggi (mentah)')
    assert.ok((lm.width ?? 0) > BRAND_CARD.CARD_W * 2, 'logo sangat lebar (mentah)')
    const webp = await normalizeBrandCardToWebp(character, logo, {})
    await assertWebpCardDimensions(webp, 'rasio aspek ekstrem')
  })

  it('berbagai ukuran input karakter + logo → WebP selalu 290×180', async () => {
    const pairs = [
      { cw: 48, ch: 48, lw: 24, lh: 24 },
      { cw: 800, ch: 1200, lw: 400, lh: 120 },
      { cw: 2400, ch: 1600, lw: 1900, lh: 400 },
    ]

    for (const p of pairs) {
      const charW = p.cw
      const charH = p.ch
      const logoW = p.lw
      const logoH = p.lh
      const character = await solidPng(charW, charH, [40, 80, 160])
      const logo = await solidPng(logoW, logoH, [200, 200, 200])
      const webp = await normalizeBrandCardToWebp(character, logo, {})
      await assertWebpCardDimensions(
        webp,
        `char ${charW}×${charH}, logo ${logoW}×${logoH}`
      )
    }
  })

  it('path file di disk (bukan buffer) juga dinormalisasi ke 290×180', async () => {
    const tmpCharacter = join(__dirname, '.tmp-normalize-test-char.png')
    const tmpLogo = join(__dirname, '.tmp-normalize-test-logo.png')
    const charBuf = await solidPng(333, 777, [10, 100, 50])
    const logoBuf = await solidPng(999, 111, [220, 30, 30])
    await sharp(charBuf).toFile(tmpCharacter)
    await sharp(logoBuf).toFile(tmpLogo)
    try {
      const webp = await normalizeBrandCardToWebp(tmpCharacter, tmpLogo, {
        logoWidthMultiplier: 0.9,
      })
      await assertWebpCardDimensions(webp, 'path inputs')
    } finally {
      for (const f of [tmpCharacter, tmpLogo]) {
        try {
          unlinkSync(f)
        } catch {
          /* ignore */
        }
      }
    }
  })
})
