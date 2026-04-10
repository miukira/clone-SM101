import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import {
  resolveApiBaseUrl,
  trimTrailingSlash,
} from '../src/utils/resolveApiBaseUrl.js'

const FALLBACKS = {
  'mock-direct': null,
  'mock-server': 'http://localhost:4010/api/v1',
  'real': '/api/v1',
}

describe('VITE_API_BASE_URL — resolveApiBaseUrl (.env / Vite)', () => {
  test('mock-direct selalu null walau env di-set', () => {
    assert.equal(
      resolveApiBaseUrl('mock-direct', 'http://api.example/v1', FALLBACKS),
      null,
    )
  })

  test('mock-server: pakai env bila VITE_API_BASE_URL ada', () => {
    assert.equal(
      resolveApiBaseUrl('mock-server', 'http://localhost:9999/api/v1', FALLBACKS),
      'http://localhost:9999/api/v1',
    )
  })

  test('mock-server: fallback bila env kosong / undefined', () => {
    assert.equal(resolveApiBaseUrl('mock-server', undefined, FALLBACKS), FALLBACKS['mock-server'])
    assert.equal(resolveApiBaseUrl('mock-server', '', FALLBACKS), FALLBACKS['mock-server'])
    assert.equal(resolveApiBaseUrl('mock-server', '   ', FALLBACKS), FALLBACKS['mock-server'])
  })

  test('real: pakai env absolut bila di-set', () => {
    assert.equal(
      resolveApiBaseUrl('real', 'http://localhost:8080/api/v1', FALLBACKS),
      'http://localhost:8080/api/v1',
    )
  })

  test('real: fallback path relatif bila env tidak di-set', () => {
    assert.equal(resolveApiBaseUrl('real', undefined, FALLBACKS), '/api/v1')
  })

  test('trim trailing slash dari env (VITE_)', () => {
    assert.equal(
      resolveApiBaseUrl('real', 'http://host/api/v1/', FALLBACKS),
      'http://host/api/v1',
    )
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
