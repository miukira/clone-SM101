/**
 * Home: kartu provider & pill kategori — API lewat Vite proxy ke staging (.env.development).
 * Jalankan: npm run test:e2e -- e2e/home-providers.spec.mjs
 */
import { test, expect } from '@playwright/test'

test.describe('Home — provider cards & kategori', () => {
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

  test('SPORTS: pill di main mengganti heading', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const mainDesktop = page.locator('main').first()
    await mainDesktop.getByRole('button', { name: 'SPORTS', exact: true }).click()

    await expect(mainDesktop.getByRole('heading', { name: 'SPORTS PROVIDERS' })).toBeVisible({
      timeout: 20_000,
    })
    await expect(mainDesktop.getByRole('button', { name: 'PLAY NOW' }).first()).toBeVisible()
  })
})
