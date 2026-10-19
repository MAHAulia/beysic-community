// @ts-check
const { test, expect } = require('@playwright/test');
const { installApiMock, injectSession, defaultLogin } = require('./fixtures/mockApi');
const { applyMockConfig, stubGis } = require('./fixtures/setup');

// Alur member dengan sesi ter-inject (bypass login Google). FR2.2, FR4.2, FR6.1/6.2.
test.describe('Member', () => {
  test.beforeEach(async ({ page }) => {
    await applyMockConfig(page);
    await stubGis(page);
  });

  test('Member login terlihat di header & menu Profil muncul', async ({ page }) => {
    await installApiMock(page);
    await injectSession(page, defaultLogin());
    await page.goto('/#/');
    await expect(page.locator('#authArea')).toContainText('Andi');
    // Link Profil ada untuk member (tidak lagi .hidden). Di mobile ada di dalam
    // menu hamburger yang collapse, jadi cek kelas role-visibility, bukan visual.
    await expect(page.locator('.nav-member')).not.toHaveClass(/hidden/);
  });

  test('Pendaftaran event berhasil (FR2.2)', async ({ page }) => {
    const posted = [];
    await installApiMock(page, { record: posted });
    await injectSession(page, defaultLogin());
    await page.goto('/#/event');
    await page.locator('[data-register="evt_1"]').click();
    await page.locator('#regForm button[type="submit"]').click();
    await expect(page.locator('#eventFormArea')).toContainText('Pendaftaran berhasil');
    expect(posted.some(p => p.action === 'event.register' && p.eventId === 'evt_1')).toBeTruthy();
  });

  test('Profil menampilkan deck, blade, achievement (FR6.1)', async ({ page }) => {
    await installApiMock(page);
    await injectSession(page, defaultLogin());
    await page.goto('/#/profile');
    await expect(page.locator('.app-main')).toContainText('Deck A');
    await expect(page.locator('.app-main')).toContainText('Blade X');
    await expect(page.locator('.achievement')).toContainText('Monarch');
  });

  test('Edit profil mengirim profile.update (FR6.2)', async ({ page }) => {
    const posted = [];
    await installApiMock(page, { record: posted });
    await injectSession(page, defaultLogin());
    await page.goto('/#/profile');
    await page.locator('#editProfileBtn').click();
    await page.locator('input[name="latestDeck"]').fill('Deck Baru');
    await page.locator('#editForm button[type="submit"]').click();
    await expect.poll(() => posted.some(p => p.action === 'profile.update' && p.latestDeck === 'Deck Baru')).toBeTruthy();
  });

  test('Guard: tanpa login, /profile menolak akses', async ({ page }) => {
    await installApiMock(page);
    await page.goto('/#/profile');
    await expect(page.locator('.app-main')).toContainText('login');
  });
});
