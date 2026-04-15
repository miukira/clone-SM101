import { describe, it, before, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import request from 'supertest'

const require = createRequire(import.meta.url)
const { app } = require('../mock-server/server.js')

const WEBSITE_QUERY = { domain: 'localhost' }

describe('PATCH /api/v1/__mock/website-config (about + banner)', () => {
  /** @type {{ about: string, banner: unknown[] }} */
  let baseline

  before(async () => {
    delete process.env.BRAND_CARD_ADMIN_KEY
    const res = await request(app).get('/api/v1/website').query(WEBSITE_QUERY).expect(200)
    baseline = {
      about: res.body.about,
      banner: JSON.parse(JSON.stringify(res.body.banner)),
    }
  })

  afterEach(async () => {
    delete process.env.BRAND_CARD_ADMIN_KEY
    await request(app)
      .patch('/api/v1/__mock/website-config')
      .send({ about: baseline.about, banner: baseline.banner })
      .expect(200)
  })

  it('mengubah about; GET /website mengikuti', async () => {
    const nextAbout = 'Teks about dari PATCH mock __mock/website-config'
    const patch = await request(app)
      .patch('/api/v1/__mock/website-config')
      .send({ about: nextAbout })
      .expect(200)
    assert.equal(patch.body.ok, true)
    assert.equal(patch.body.config.about, nextAbout)

    const site = await request(app).get('/api/v1/website').query(WEBSITE_QUERY).expect(200)
    assert.equal(site.body.about, nextAbout)
  })

  it('mengubah banner; GET /website mengikuti', async () => {
    const newBanner = [
      { id: 't1', image: '/banners/banner-1.webp', link: '/promo', title_line1: 'Satu' },
      { id: 't2', image: '/banners/banner-2.webp', link: '/referral' },
    ]
    await request(app)
      .patch('/api/v1/__mock/website-config')
      .send({ banner: newBanner })
      .expect(200)

    const site = await request(app).get('/api/v1/website').query(WEBSITE_QUERY).expect(200)
    assert.equal(site.body.banner.length, 2)
    assert.equal(site.body.banner[0].id, 't1')
    assert.equal(site.body.banner[0].title_line1, 'Satu')
    assert.equal(site.body.banner[1].link, '/referral')
  })

  it('400 bila body kosong (tanpa about, banner, logo, maupun favicon)', async () => {
    const res = await request(app).patch('/api/v1/__mock/website-config').send({}).expect(400)
    assert.ok(typeof res.body.message === 'string')
  })

  it('400 bila banner bukan array', async () => {
    const res = await request(app)
      .patch('/api/v1/__mock/website-config')
      .send({ banner: 'not-array' })
      .expect(400)
    assert.match(res.body.message, /array/i)
  })

  it('401 bila BRAND_CARD_ADMIN_KEY diset tanpa X-Admin-Key', async () => {
    process.env.BRAND_CARD_ADMIN_KEY = 'mock-site-secret'
    await request(app)
      .patch('/api/v1/__mock/website-config')
      .send({ about: 'should-not-apply' })
      .expect(401)
  })
})
