import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  effectivePrizeMultiplier,
  computePerLinePay,
  computeTotalPay,
} from '../src/utils/togelDiscount.js'

describe('togelDiscount', () => {
  it('tanpa diskon: prize dan bayar penuh', () => {
    assert.equal(effectivePrizeMultiplier(9000, false, 40), 9000)
    assert.equal(computePerLinePay(1000, false, 40), 1000)
    assert.equal(computeTotalPay(1000, 3, false, 40), 3000)
  })

  it('pakai diskon 40%: bayar 60%, prize 60% dari basis', () => {
    assert.equal(computePerLinePay(1000, true, 40), 600)
    assert.equal(effectivePrizeMultiplier(9000, true, 40), 5400)
    assert.equal(computeTotalPay(1000, 5, true, 40), 3000)
  })

  it('diskon 0% dari API: sama saja mode diskon', () => {
    assert.equal(computePerLinePay(500, true, 0), 500)
    assert.equal(effectivePrizeMultiplier(100, true, 0), 100)
  })
})
