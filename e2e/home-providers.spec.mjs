/**
 * Home: kartu provider & pill kategori (mock + Vite dev).
 * Kontrak JSON GET /slot … dijamin oleh test/openapi-mock-api.test.mjs + test/home-provider-mock-flow.test.mjs.
 * Jalankan: npm run test:e2e -- e2e/home-providers.spec.mjs
 */
import { test, expect } from '@playwright/test'

test.describe('Home — provider cards & kategori (UI vs mock)', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('SLOTS: heading + PLAY NOW; FISHING: ganti heading + kartu', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const mainDesktop = page.locator('main').first()
    await expect(mainDesktop.getByRole('heading', { name: 'SLOTS PROVIDERS' })).toBeVisible({
      timeout: 60_000,
    })
    await expect(mainDesktop.getByRole('button', { name: 'PLAY NOW' }).first()).toBeVisible({
      timeout: 30_000,
    })

    await mainDesktop.getByRole('button', { name: 'FISHING', exact: true }).click()

    await expect(mainDesktop.getByRole('heading', { name: 'FISHING PROVIDERS' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(mainDesktop.getByRole('button', { name: 'PLAY NOW' }).first()).toBeVisible()
  })

  test('TOGEL: pill di main mengganti heading', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const mainDesktop = page.locator('main').first()
    await mainDesktop.getByRole('button', { name: 'TOGEL', exact: true }).click()

    await expect(mainDesktop.getByRole('heading', { name: 'TOGEL PROVIDERS' })).toBeVisible({
      timeout: 20_000,
    })
    await expect(mainDesktop.getByRole('button', { name: 'PLAY NOW' }).first()).toBeVisible()
  })
})
