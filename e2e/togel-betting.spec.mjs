/**
 * E2E Togel: jalankan `npx playwright install` sekali jika browser belum terunduh.
 * Lalu: npm run test:e2e -- e2e/togel-betting.spec.mjs
 */
import { test, expect } from '@playwright/test'

test.describe('Togel — UI alur /togel', () => {
  test.beforeEach(async ({ context, request }) => {
    const reset = await request.post('http://127.0.0.1:4010/api/v1/__e2e/reset-transactions')
    expect(reset.ok()).toBeTruthy()

    const res = await request.post('http://127.0.0.1:4010/api/v1/login', {
      data: { username: 'user1', password: '1234' },
    })
    expect(res.ok()).toBeTruthy()
    const { token } = await res.json()
    expect(token).toBeTruthy()

    await context.addInitScript((t) => {
      localStorage.setItem('pusattogel-token', t)
      localStorage.setItem('token', t)
    }, token)
  })

  test('pilih pasar, ganti jenis 4D/3D/2D/BBFS — posisi sesuai aturan', async ({ page }) => {
    await page.goto('/togel', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'PILIH PASARAN' })).toBeVisible({ timeout: 30_000 })
    await expect(page.getByRole('heading', { name: 'JENIS TARUHAN' })).toBeVisible()

    await page.getByRole('button', { name: /Cambodia/i }).click()

    await page.getByRole('button', { name: /^4D/i }).click()
    await expect(page.getByRole('heading', { name: 'POSISI' })).not.toBeVisible()

    await page.getByRole('button', { name: /^3D/i }).click()
    await expect(page.getByRole('heading', { name: 'POSISI' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Depan', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Belakang', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Tengah', exact: true })).not.toBeVisible()

    await page.getByRole('button', { name: /^2D/i }).click()
    await expect(page.getByRole('button', { name: 'Depan', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Tengah', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Belakang', exact: true })).toBeVisible()

    await page.getByRole('button', { name: /BBFS/i }).click()
    await expect(page.getByText(/BASIS BBFS/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'POSISI' })).not.toBeVisible()
  })

  test('blok diskon opsional: Tanpa diskon & Pakai diskon', async ({ page }) => {
    await page.goto('/togel', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'DISKON (OPSIONAL)' })).toBeVisible({ timeout: 30_000 })
    await expect(page.getByRole('button', { name: /Tanpa diskon/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Pakai diskon/i })).toBeVisible()
    await page.getByRole('button', { name: /Tanpa diskon/i }).click()
    await expect(page.getByText(/Penuh \(tanpa potongan hadiah\)/i)).toBeVisible()
  })

  test('submit 4D memicu POST /bet dan pesan sukses', async ({ page }) => {
    await page.goto('/togel', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'JENIS TARUHAN' })).toBeVisible({ timeout: 30_000 })

    await page.getByRole('button', { name: /^4D/i }).click()
    await page.locator('input[placeholder="0000"]').fill('5678')
    await page.locator('main input[type="number"]').fill('500')

    const betPost = page.waitForResponse(
      (r) =>
        r.url().includes('/bet') &&
        !r.url().includes('history') &&
        r.request().method() === 'POST'
    )
    await page.getByRole('button', { name: 'PASANG TARUHAN' }).click()
    const postRes = await betPost
    expect(postRes.ok(), `POST /bet status ${postRes.status()}`).toBeTruthy()
    const body = await postRes.json()
    expect(body.message).toBe('success')
    expect(typeof body.new_balance).toBe('number')

    await expect(page.getByText(/Taruhan berhasil/i)).toBeVisible({ timeout: 15_000 })
  })

  test('halaman /togel/rules menampilkan tiap jenis + diskon', async ({ page }) => {
    await page.goto('/togel/rules', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: /ATURAN TOGEL/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Diskon \(opsional\)/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /4D/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /3D/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /2D/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /BBFS/i })).toBeVisible()
  })

  test('link Aturan dari header betting', async ({ page }) => {
    await page.goto('/togel', { waitUntil: 'domcontentloaded' })
    const rulesLink = page.getByRole('link', { name: /Aturan/ })
    await expect(rulesLink).toBeVisible({ timeout: 30_000 })
    await rulesLink.click()
    await expect(page).toHaveURL(/\/togel\/rules/)
  })
})
