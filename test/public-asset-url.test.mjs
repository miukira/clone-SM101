/**
 * Logika URL gambar: CDN absolut vs path relatif + runtime base (GET /website).
 * Tanpa browser — import.meta.env.VITE_* kosong di Node (sama seperti build tanpa env).
 */
import { describe, it, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  providerAssetUrl,
  publicAssetUrl,
  setRuntimeAssetBaseUrl,
  getRuntimeAssetBaseUrl,
} from '../src/utils/publicAssetUrl.js'

describe('providerAssetUrl — CDN vs relatif + runtime', () => {
  afterEach(() => {
    setRuntimeAssetBaseUrl('')
  })

  it('URL https ke CDN dipakai apa adanya (bukan digabung base staging)', () => {
    const u = 'https://cdn.domain.com/path/to/image.png'
    assert.equal(providerAssetUrl(u), u)
  })

  it('path relatif + setRuntimeAssetBaseUrl (simulasi asset_base_url dari GET /website)', () => {
    assert.equal(getRuntimeAssetBaseUrl(), '')
    setRuntimeAssetBaseUrl('https://cdn.domain.com')
    assert.equal(
      providerAssetUrl('/animated-brand/slot/slot-pragmatic-play.webp'),
      'https://cdn.domain.com/animated-brand/slot/slot-pragmatic-play.webp',
    )
  })

  it('path relatif tanpa runtime: di Node tanpa window → path tetap relatif (di browser nanti + origin)', () => {
    assert.equal(providerAssetUrl('/foo/bar.webp'), '/foo/bar.webp')
  })

  it('null / kosong → null', () => {
    assert.equal(providerAssetUrl(null), null)
    assert.equal(providerAssetUrl(''), null)
    assert.equal(providerAssetUrl('   '), null)
  })
})

describe('publicAssetUrl — banner/logo path relatif', () => {
  it('tanpa env & window: path relatif tetap string path (resolveDynamicAssetBase kosong)', () => {
    const p = '/banners/banner-1.webp'
    assert.equal(publicAssetUrl(p), p)
  })
})
