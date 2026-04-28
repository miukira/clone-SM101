import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { mapConfigBannersToPromoSlides } from '../src/utils/mapHomePromoBanners.js'

describe('mapConfigBannersToPromoSlides', () => {
  test('array kosong → satu slide default (banner-1)', () => {
    const slides = mapConfigBannersToPromoSlides([], 'SITUS')
    assert.equal(slides.length, 1)
    assert.match(String(slides[0].image), /banner-1/)
    assert.equal(slides[0].link, '/promo')
    const slidesNull = mapConfigBannersToPromoSlides(null, 'X')
    assert.equal(slidesNull.length, 1)
  })

  test('map id, image, link OpenAPI', () => {
    const slides = mapConfigBannersToPromoSlides(
      [{ id: 'b1', image: '/banners/banner-1.webp', link: '/promo' }],
      'SITUS',
    )
    assert.equal(slides.length, 1)
    assert.equal(slides[0].id, 'b1')
    assert.equal(slides[0].link, '/promo')
    assert.match(String(slides[0].image), /banner-1/)
    assert.ok(slides[0].titleLine1)
    assert.ok(slides[0].image)
  })

  test('semua image kosong → satu fallback default', () => {
    const slides = mapConfigBannersToPromoSlides([{ id: 'x', image: '' }], 'T')
    assert.equal(slides.length, 1)
    assert.match(String(slides[0].image), /banner-1/)
  })

  test('field opsional teks', () => {
    const slides = mapConfigBannersToPromoSlides(
      [
        {
          id: '1',
          image: '/x.webp',
          title_line1: 'A',
          title_line2: 'B',
          description: 'Desc',
          tag: '🎁 T',
        },
      ],
      '',
    )
    assert.equal(slides[0].titleLine1, 'A')
    assert.equal(slides[0].titleLine2, 'B')
    assert.equal(slides[0].description, 'Desc')
    assert.equal(slides[0].tag, '🎁 T')
  })

  test('default titleLine2 memakai site name (bukan site title SEO)', () => {
    const slides = mapConfigBannersToPromoSlides([{ id: 'seo-check', image: '/x.webp' }], 'website1')
    assert.equal(slides[0].titleLine2, 'website1')
  })

  test('ganti banner ke gambar lain (path public) — bukan fallback banner-1', () => {
    const slides = mapConfigBannersToPromoSlides(
      [{ id: 'promo-2', image: '/banners/banner-2.webp', link: '/togel' }],
      'SITUS',
    )
    assert.equal(slides.length, 1)
    assert.match(String(slides[0].image), /banner-2/)
    assert.ok(!/banner-1\.webp/.test(String(slides[0].image)))
    assert.equal(slides[0].link, '/togel')
    assert.equal(slides[0].id, 'promo-2')
  })

  test('ganti banner ke URL absolut CDN', () => {
    const url = 'https://cdn.example.com/promo/hot-sale.png'
    const slides = mapConfigBannersToPromoSlides([{ id: 42, image: url, link: '/promo' }], 'X')
    assert.equal(slides.length, 1)
    assert.equal(String(slides[0].image), url)
    assert.ok(!/banner-1/.test(String(slides[0].image)))
  })

  test('simulasi update config: dulu kosong (default), lalu API kirim gambar baru', () => {
    let slides = mapConfigBannersToPromoSlides([], 'BRAND')
    assert.equal(slides.length, 1)
    assert.match(String(slides[0].image), /banner-1/)

    slides = mapConfigBannersToPromoSlides(
      [{ id: 'b-new', image: '/banners/banner-3.webp' }],
      'BRAND',
    )
    assert.equal(slides.length, 1)
    assert.match(String(slides[0].image), /banner-3/)
    assert.ok(!/banner-1/.test(String(slides[0].image)))
    assert.equal(slides[0].id, 'b-new')
  })
})
