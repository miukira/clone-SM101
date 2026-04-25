import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  dedupeFooterProvidersByBrandAndImage,
  footerProviderBrandKey,
} from '../src/utils/footerProviderDedupe.js'

describe('footerProviderDedupe', () => {
  it('slug jili + jili-fishing → satu kunci', () => {
    assert.equal(
      footerProviderBrandKey({ id: 'jili', name: 'JILI', provider_id: 1015 }),
      'jili',
    )
    assert.equal(
      footerProviderBrandKey({ id: 'jili-fishing', name: 'Jili Fishing', provider_id: 2003 }),
      'jili',
    )
  })

  it('pragmatic-play + pragmatic-casino → satu kunci', () => {
    assert.equal(
      footerProviderBrandKey({ id: 'pragmatic-play', name: 'Pragmatic Play', provider_id: 1001 }),
      'pragmatic',
    )
    assert.equal(
      footerProviderBrandKey({ id: 'pragmatic-casino', name: 'Pragmatic Play', provider_id: 3008 }),
      'pragmatic',
    )
  })

  it('merge map values: dua baris jili, satu hasil + urut nama', () => {
    const out = dedupeFooterProvidersByBrandAndImage([
      { id: 'jili', name: 'JILI', provider_id: 1015, logoImg: '/a/1015.webp' },
      { id: 'jili-fishing', name: 'Jili Fishing', provider_id: 2003, logoImg: '/a/2003.webp' },
    ])
    assert.equal(out.length, 1)
    assert.equal(out[0].provider_id, 1015)
  })

  it('tanpa id string, pakai label (slug tidak dipakai)', () => {
    const k = footerProviderBrandKey({
      id: 9001,
      name: 'Some Co',
      provider_id: 9001,
    })
    assert.equal(k, 'some co')
  })
})
