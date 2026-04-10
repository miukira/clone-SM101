import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import {
  resolveApiBaseUrl,
  trimTrailingSlash,
} from '../src/utils/resolveApiBaseUrl.js'

const DEFAULT_DEV = 'http://localhost:4010/api/v1'

describe('resolveApiBaseUrl — VITE_API_BASE_URL + fallback', () => {
  test('pakai env bila di-set', () => {
    assert.equal(
      resolveApiBaseUrl('http://localhost:9999/api/v1', DEFAULT_DEV),
      'http://localhost:9999/api/v1',
    )
  })

  test('fallback bila env kosong / undefined / whitespace', () => {
    assert.equal(resolveApiBaseUrl(undefined, DEFAULT_DEV), DEFAULT_DEV)
    assert.equal(resolveApiBaseUrl('', DEFAULT_DEV), DEFAULT_DEV)
    assert.equal(resolveApiBaseUrl('   ', DEFAULT_DEV), DEFAULT_DEV)
  })

  test('path relatif sebagai fallback', () => {
    assert.equal(resolveApiBaseUrl(undefined, '/api/v1'), '/api/v1')
  })

  test('trim trailing slash dari env', () => {
    assert.equal(
      resolveApiBaseUrl('http://host/api/v1/', DEFAULT_DEV),
      'http://host/api/v1',
    )
  })

  test('trim trailing slash dari fallback', () => {
    assert.equal(resolveApiBaseUrl('', 'http://x/y//'), 'http://x/y')
  })
})

describe('trimTrailingSlash', () => {
  test('handles null/undefined', () => {
    assert.equal(trimTrailingSlash(null), '')
    assert.equal(trimTrailingSlash(undefined), '')
  })

  test('trims whitespace and slash', () => {
    assert.equal(trimTrailingSlash('  http://x/y/  '), 'http://x/y')
  })
})
