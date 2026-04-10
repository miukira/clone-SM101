import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { mapConfigBannersToPromoSlides } from '../src/utils/mapHomePromoBanners.js'

describe('mapConfigBannersToPromoSlides', () => {
  test('array kosong → []', () => {
    assert.deepEqual(mapConfigBannersToPromoSlides([]), [])
    assert.deepEqual(mapConfigBannersToPromoSlides(null, 'X'), [])
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

  test('image kosong → fallback path publik', () => {
    const slides = mapConfigBannersToPromoSlides([{ id: 'x', image: '' }], 'T')
    assert.equal(slides.length, 1)
    assert.match(slides[0].image, /banner-1/)
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
})
