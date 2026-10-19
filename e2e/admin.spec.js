// @ts-check
const { test, expect } = require('@playwright/test');
const { installApiMock, injectSession, adminLogin } = require('./fixtures/mockApi');
const { applyMockConfig, stubGis } = require('./fixtures/setup');

// Alur admin dengan sesi admin ter-inject. FR9, FR10, D2, D3, D5.
// Catatan: verifikasi otorisasi server-side (NFR1) TIDAK diuji di mode mock —
// gunakan e2e-manual-checklist.md (item C2) terhadap deployment nyata.
test.describe('Admin', () => {
  test.beforeEach(async ({ page }) => {
    await applyMockConfig(page);
    await stubGis(page);
  });

  test('Menu admin muncul untuk admin & panel ter-render', async ({ page }) => {
    await installApiMock(page);
    await injectSession(page, adminLogin());
    await page.goto('/#/admin');
    // Link Admin tersedia untuk admin (role-visibility). Di mobile berada di
    // dalam menu hamburger yang collapse, jadi cek kelas, bukan visual.
    await expect(page.locator('.nav-admin')).not.toHaveClass(/hidden/);
    await expect(page.locator('.admin-sidebar')).toContainText('Input Poin');
    await expect(page.locator('#adminContent')).toContainText('Input Poin Leaderboard');
  });

  test('Deteksi bracket mengikuti total peserta (D1)', async ({ page }) => {
    await installApiMock(page);
    await injectSession(page, adminLogin());
    await page.goto('/#/admin');
    await page.locator('#totalP').fill('20');
    await expect(page.locator('#bracketLabel')).toHaveText('Up to 30');
    await page.locator('#totalP').fill('45');
    await expect(page.locator('#bracketLabel')).toHaveText('31–59');
    await page.locator('#totalP').fill('80');
    await expect(page.locator('#bracketLabel')).toHaveText('60–Max');
  });

  test('Validasi Monarch tunggal mencegah submit >1 monarch (D3)', async ({ page }) => {
    await installApiMock(page);
    await injectSession(page, adminLogin());
    await page.goto('/#/admin');
    // tambah baris kedua
    await page.locator('#addRow').click();
    // centang monarch di dua baris
    await page.locator('.r-monarch').nth(0).check();
    await page.locator('.r-monarch').nth(1).check();
    await page.locator('#submitResults').click();
    // popup warning muncul, tidak ada pesan sukses
    await expect(page.locator('#beysic-alert')).toContainText('Monarch');
    await expect(page.locator('#resultsMsg')).not.toContainText('Tersimpan');
  });

  test('Submit hasil valid mengirim admin.results.submit (FR9.1)', async ({ page }) => {
    const posted = [];
    await installApiMock(page, { record: posted });
    await injectSession(page, adminLogin());
    await page.goto('/#/admin');
    await page.locator('#totalP').fill('45');
    await page.locator('#submitResults').click();
    await expect(page.locator('#resultsMsg')).toContainText('Tersimpan');
    const call = posted.find(p => p.action === 'admin.results.submit');
    expect(call).toBeTruthy();
    expect(call.totalParticipants).toBe(45);
    expect(Array.isArray(call.rows)).toBeTruthy();
  });

  test('Tab Member menampilkan daftar & tombol approve (D5)', async ({ page }) => {
    await installApiMock(page);
    await injectSession(page, adminLogin());
    await page.goto('/#/admin');
    await page.locator('.admin-sidebar button[data-tab="members"]').click();
    await expect(page.locator('#adminContent')).toContainText('Citra');
    // Citra pending -> ada tombol Approve
    await expect(page.locator('[data-set-status="active"]')).toBeVisible();
  });
});
