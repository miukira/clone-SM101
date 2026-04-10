import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { unlinkSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import request from 'supertest'

const require = createRequire(import.meta.url)
const { app } = require('../mock-server/server.js')

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

async function pngBuffer(width, height, rgb = [50, 100, 200]) {
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

describe('POST /api/v1/admin/normalize-brand-card — resize di server (upload klien beda ukuran OK)', () => {
  const category = 'test-normalize'
  const id = `run-${Date.now()}`
  /** @type {string | undefined} */
  let outFile

  before(() => {
    outFile = join(projectRoot, 'public', 'animated-brand', category, `${category}-${id}.webp`)
  })

  after(() => {
    if (outFile && existsSync(outFile)) {
      try {
        unlinkSync(outFile)
      } catch {
        /* ignore */
      }
    }
    delete process.env.BRAND_CARD_ADMIN_KEY
  })

  it('multipart: PNG besar (bukan ukuran kartu jadi) → server resize → WebP 290×180 di public', async () => {
    const char = await pngBuffer(720, 1280)
    const logo = await pngBuffer(512, 256)
    const res = await request(app)
      .post('/api/v1/admin/normalize-brand-card')
      .field('category', category)
      .field('id', id)
      .attach('character', char, 'character.png')
      .attach('logo', logo, 'logo.png')
      .expect(200)
      .expect('Content-Type', /json/)

    assert.equal(res.body.ok, true)
    assert.equal(res.body.width, 290)
    assert.equal(res.body.height, 180)
    assert.equal(res.body.relativeUrl, `/animated-brand/${category}/${category}-${id}.webp`)
    assert.ok(Number.isFinite(res.body.bytes) && res.body.bytes > 0)
    assert.ok(existsSync(outFile), 'file tertulis ke public/animated-brand')
    const meta = await sharp(outFile).metadata()
    assert.equal(meta.width, 290, 'file di disk 290px')
    assert.equal(meta.height, 180, 'file di disk 180px')
  })

  it('400 bila category / id kosong', async () => {
    const char = await pngBuffer(12, 12)
    const logo = await pngBuffer(12, 12)
    const res = await request(app)
      .post('/api/v1/admin/normalize-brand-card')
      .field('id', 'only-id')
      .attach('character', char, 'c.png')
      .attach('logo', logo, 'l.png')
      .expect(400)
    assert.ok(typeof res.body.message === 'string')
  })

  it('400 bila options bukan JSON objek valid', async () => {
    const char = await pngBuffer(12, 12)
    const logo = await pngBuffer(12, 12)
    const res = await request(app)
      .post('/api/v1/admin/normalize-brand-card')
      .field('category', category)
      .field('id', 'bad-options')
      .field('options', 'not-json{')
      .attach('character', char, 'c.png')
      .attach('logo', logo, 'l.png')
      .expect(400)
    assert.match(res.body.message, /json/i)
  })

  it('401 bila BRAND_CARD_ADMIN_KEY diset tanpa X-Admin-Key', async () => {
    process.env.BRAND_CARD_ADMIN_KEY = 'test-secret-key'
    const char = await pngBuffer(24, 24)
    const logo = await pngBuffer(24, 24)
    await request(app)
      .post('/api/v1/admin/normalize-brand-card')
      .field('category', category)
      .field('id', 'denied')
      .attach('character', char, 'c.png')
      .attach('logo', logo, 'l.png')
      .expect(401)
  })

  it('200 bila X-Admin-Key cocok dengan env', async () => {
    process.env.BRAND_CARD_ADMIN_KEY = 'test-secret-key'
    const char = await pngBuffer(64, 64)
    const logo = await pngBuffer(64, 64)
    const authId = 'auth-ok'
    const outPath = join(projectRoot, 'public', 'animated-brand', category, `${category}-${authId}.webp`)
    try {
      const res = await request(app)
        .post('/api/v1/admin/normalize-brand-card')
        .set('X-Admin-Key', 'test-secret-key')
        .field('category', category)
        .field('id', authId)
        .attach('character', char, 'c.png')
        .attach('logo', logo, 'l.png')
        .expect(200)
      assert.equal(res.body.width, 290)
      assert.equal(res.body.height, 180)
      assert.ok(existsSync(outPath))
    } finally {
      if (existsSync(outPath)) {
        try {
          unlinkSync(outPath)
        } catch {
          /* ignore */
        }
      }
    }
  })
})
