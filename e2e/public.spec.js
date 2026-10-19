// @ts-check
const { test, expect } = require('@playwright/test');
const { installApiMock } = require('./fixtures/mockApi');
const { applyMockConfig, stubGis } = require('./fixtures/setup');

// Alur publik (tanpa login). Mengikat FR1.1, FR2.1, FR3.1, FR4.1, NFR6.
test.describe('Publik', () => {
  test.beforeEach(async ({ page }) => {
    await applyMockConfig(page);
    await stubGis(page);
    await installApiMock(page);
  });

  test('Home menampilkan about, pengumuman, dan galeri (FR1.1)', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('.hero h1')).toContainText('Beysic');
    await expect(page.locator('.app-main')).toContainText('Komunitas Beyblade terbesar');
    await expect(page.locator('.app-main')).toContainText('Turnamen Bulanan');
    await expect(page.locator('.photo-grid img')).toHaveCount(1);
  });

  test('Event menampilkan ongoing & upcoming (FR2.1)', async ({ page }) => {
    await page.goto('/#/event');
    await expect(page.locator('.app-main')).toContainText('Beyblade Cup');
    await expect(page.locator('.app-main')).toContainText('Clash Ongoing');
    // event upcoming yang open punya tombol Daftar
    await expect(page.locator('[data-register="evt_1"]')).toBeVisible();
  });

  test('Leaderboard terurut poin desc dan tanpa email (FR3.1, NFR6)', async ({ page }) => {
    await page.goto('/#/leaderboard');
    await expect(page.locator('tbody tr').first()).toContainText('Andi');
    await expect(page.locator('tbody tr').nth(1)).toContainText('Budi');
    // tidak ada email di seluruh halaman
    await expect(page.locator('body')).not.toContainText('@example.com');
  });

  test('Membership menampilkan benefit (FR4.1)', async ({ page }) => {
    await page.goto('/#/membership');
    await expect(page.locator('.app-main')).toContainText('Kenapa Jadi Member?');
    await expect(page.locator('.app-main')).toContainText('Leaderboard');
  });
});
