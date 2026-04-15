/** localStorage: data deposit menunggu pembayaran / konfirmasi */
export const LS_PENDING_DEPOSIT = 'pusattogel-pending-deposit'

/** localStorage: data withdraw menunggu persetujuan */
export const LS_PENDING_WITHDRAW = 'pusattogel-pending-withdraw'

/** Interval polling status (ms) */
export const PENDING_STATUS_POLL_MS = 5000

const TERMINAL_FAIL_NORMALIZED = new Set([
  'fails',
  'fail',
  'failed',
  'rejected',
  'reject',
  'cancelled',
  'canceled',
  'cancel',
])

/**
 * Status transaksi dari API yang harus mengakhiri layar "menunggu"
 * (selain success / pending).
 */
export function isTerminalTransactionFailure(status) {
  if (status == null) return false
  const key = String(status).trim().toLowerCase()
  return TERMINAL_FAIL_NORMALIZED.has(key)
}
