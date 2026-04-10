import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { normalizeWebsiteInfoResponse } from '../src/utils/normalizeWebsiteInfo.js'

/**
 * Memastikan respons /info (berbagai bentuk backend) selalu punya config.logo
 * untuk dipakai ChromeSiteBrand / WebsiteContext — sama dengan pipeline getInfo() di api.js.
 */
describe('WebsiteInfo — logo dari API (normalize /info)', () => {
  test('passthrough when config.logo already set', () => {
    const out = normalizeWebsiteInfoResponse({
      notification: [],
      config: { logo: '/api-logo.webp', title: 'SITUS' },
    })
    assert.equal(out.config.logo, '/api-logo.webp')
    assert.equal(out.config.title, 'SITUS')
  })

  test('unwrap single data envelope', () => {
    const out = normalizeWebsiteInfoResponse({
      data: {
        notification: [],
        config: { logo: 'https://cdn.example/x.png' },
      },
    })
    assert.equal(out.config.logo, 'https://cdn.example/x.png')
  })

  test('logo from root when config empty', () => {
    const out = normalizeWebsiteInfoResponse({
      notification: [],
      site_logo: '/brand.webp',
    })
    assert.equal(out.config.logo, '/brand.webp')
  })

  test('config.general.logo fills config.logo', () => {
    const out = normalizeWebsiteInfoResponse({
      config: { general: { logo: '/from-general.png', title: 'T' } },
    })
    assert.equal(out.config.logo, '/from-general.png')
    assert.equal(out.config.title, 'T')
  })

  test('nested data.data when inner has config', () => {
    const out = normalizeWebsiteInfoResponse({
      data: {
        data: { config: { logo: '/nested.png' } },
      },
    })
    assert.equal(out.config.logo, '/nested.png')
  })
})
