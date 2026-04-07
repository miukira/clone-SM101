import { test, expect } from '@playwright/test'

test.describe('Member deposit — pending QRIS', () => {
  test.beforeEach(async ({ context, request }) => {
    const reset = await request.post('http://127.0.0.1:4010/api/v1/__e2e/reset-transactions')
    expect(reset.ok()).toBeTruthy()

    const res = await request.post('http://127.0.0.1:4010/api/v1/login', {
      data: { username: 'user1', password: '1234' },
    })
    expect(res.ok()).toBeTruthy()
    const { token } = await res.json()
    expect(token).toBeTruthy()

    // Hanya set token — jangan hapus pending di sini: init script dijalankan lagi tiap page.goto()
    await context.addInitScript((t) => {
      localStorage.setItem('pusattogel-token', t)
      localStorage.setItem('token', t)
    }, token)
  })

  test('menampilkan barcode QR dari qr_raw setelah kirim deposit QRIS', async ({ page }) => {
    await page.goto('/member/deposit', { waitUntil: 'domcontentloaded' })

    await expect(page.getByRole('heading', { name: 'Deposit', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Qris Autopay' }).first().click()

    await page.getByPlaceholder('Masukkan jumlah').first().fill('50000')

    const depositPost = page.waitForResponse(
      (r) =>
        r.url().includes('/api/v1/deposit') &&
        r.request().method() === 'POST' &&
        !r.url().includes('status')
    )
    await page.getByRole('button', { name: 'KIRIM' }).first().click()
    const postRes = await depositPost
    expect(postRes.ok(), `POST /deposit gagal: ${postRes.status()}`).toBeTruthy()

    await expect(page.getByText('menunggu pembayaran')).toBeVisible()
    await expect(page.getByText('Scan kode QR')).toBeVisible()

    const qrBox = page.locator('div.bg-white.rounded-xl.border').filter({ has: page.locator('svg') })
    await expect(qrBox).toBeVisible()
    await expect(qrBox.locator('svg')).toBeVisible()

    await expect(page.getByText(/ID deposit:/)).toBeVisible()

    await page.goto('/member/pending-deposit', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('menunggu pembayaran')).toBeVisible()
    await expect(page.getByText('Scan kode QR')).toBeVisible()
  })
})
