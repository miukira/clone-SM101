/**
 * Smoke UI: GET /info (marquee), routing /promo + GET /promo, login penuh lewat AuthModal.
 * Jalankan: npm run test:e2e -- e2e/smoke.spec.mjs
 */
import { test, expect } from '@playwright/test'

test.describe('Smoke — home, promo, login', () => {
  test('marquee dari /info, halaman promo, login menampilkan USER1', async ({ page }) => {
    const infoRes = page.waitForResponse(
      (r) => r.url().includes('/api/v1/info') && r.request().method() === 'GET'
    )
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const info = await infoRes
    expect(info.ok(), `GET /info status ${info.status()}`).toBeTruthy()

    await expect(page.getByText('Selamat datang di PUSATTOGEL').first()).toBeVisible({ timeout: 30_000 })

    const promoRes = page.waitForResponse(
      (r) => r.url().includes('/api/v1/promo') && r.request().method() === 'GET'
    )
    await page.goto('/promo', { waitUntil: 'domcontentloaded' })
    const promo = await promoRes
    expect(promo.ok(), `GET /promo status ${promo.status()}`).toBeTruthy()

    await expect(page.getByRole('heading', { name: 'PROMOSI' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'BONUS DEPOSIT HARIAN 10%', exact: true }).first()
    ).toBeVisible()

    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await page.locator('header').getByRole('button', { name: 'MASUK', exact: true }).click()

    await expect(page.getByPlaceholder('Masukkan username')).toBeVisible()

    await page.getByPlaceholder('Masukkan username').fill('user1')
    await page.getByPlaceholder('Masukkan password').fill('1234')

    const loginPost = page.waitForResponse(
      (r) => r.url().includes('/api/v1/login') && r.request().method() === 'POST'
    )
    await page
      .locator('form')
      .filter({ has: page.getByPlaceholder('Masukkan username') })
      .getByRole('button', { name: 'MASUK', exact: true })
      .click()
    const login = await loginPost
    expect(login.ok(), `POST /login status ${login.status()}`).toBeTruthy()

    await expect(page).toHaveURL(/\/member/, { timeout: 15_000 })
    await expect(page.getByText('USER1').first()).toBeVisible({ timeout: 15_000 })
  })
})
