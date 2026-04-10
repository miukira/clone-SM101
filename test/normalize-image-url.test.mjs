import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { normalizeImageUrl } from '../src/utils/normalizeImageUrl.js'

describe('normalizeImageUrl', () => {
  test('null / undefined → null', () => {
    assert.equal(normalizeImageUrl(null), null)
    assert.equal(normalizeImageUrl(undefined), null)
  })

  test('"" dan whitespace → null', () => {
    assert.equal(normalizeImageUrl(''), null)
    assert.equal(normalizeImageUrl('   '), null)
  })

  test('path valid tetap string', () => {
    assert.equal(normalizeImageUrl('/x.webp'), '/x.webp')
    assert.equal(normalizeImageUrl('  /y.png  '), '/y.png')
  })
})
