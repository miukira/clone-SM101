/**
 * Diskon togel opsional:
 * - Tanpa diskon: bayar penuh (100% nominal), multiplier hadiah = nilai penuh dari pasaran.
 * - Pakai diskon: bayar nominal × (1 - discountPct/100), multiplier hadiah = prize × (1 - discountPct/100).
 */

export function effectivePrizeMultiplier(basePrize, useDiscount, discountPct) {
  const p = Number(basePrize) || 0
  const d = Math.min(100, Math.max(0, Number(discountPct) || 0))
  if (!useDiscount || d === 0) return Math.round(p)
  return Math.round(p * (1 - d / 100))
}

/** Yang dibayar per baris setelah opsi diskon */
export function computePerLinePay(unitAmount, useDiscount, discountPct) {
  const a = Math.max(0, Math.round(Number(unitAmount) || 0))
  const d = Math.min(100, Math.max(0, Number(discountPct) || 0))
  if (!useDiscount || d === 0) return a
  return Math.round(a * (1 - d / 100))
}

export function computeTotalPay(unitAmount, lineCount, useDiscount, discountPct) {
  const lines = Math.max(0, Math.floor(Number(lineCount) || 0))
  const perLine = computePerLinePay(unitAmount, useDiscount, discountPct)
  return perLine * lines
}
