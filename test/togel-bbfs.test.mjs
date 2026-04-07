import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { expandBbfsLines, countBbfsByKind } from '../src/utils/bbfsExpand.js'

describe('expandBbfsLines', () => {
  it('input bukan 4 digit: kosong', () => {
    assert.deepEqual(expandBbfsLines(''), { lines: [], lineCount: 0 })
    assert.deepEqual(expandBbfsLines('12'), { lines: [], lineCount: 0 })
  })

  it('1234: 108 baris unik, pembagian 4D/3D/2D', () => {
    const { lines, lineCount } = expandBbfsLines('1234')
    assert.equal(lineCount, 108)
    assert.deepEqual(countBbfsByKind(lines), { '4D': 24, '3D': 48, '2D': 36 })
  })

  it('1122: multiset, lebih sedikit permutasi', () => {
    const { lineCount, lines } = expandBbfsLines('1122')
    assert.equal(lineCount, 30)
    assert.deepEqual(countBbfsByKind(lines), { '4D': 6, '3D': 12, '2D': 12 })
  })

  it('setiap baris punya type, number (koma), position yang valid', () => {
    const { lines } = expandBbfsLines('1234')
    for (const row of lines) {
      assert.match(row.type, /^(4D|3D|2D)$/)
      assert.match(row.number, /^\d(,\d)+$/)
      if (row.type === '4D') assert.equal(row.position, 'full')
      if (row.type === '3D') assert.match(row.position, /^(depan|belakang)$/)
      if (row.type === '2D') assert.match(row.position, /^(depan|tengah|belakang)$/)
    }
  })
})
