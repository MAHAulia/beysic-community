// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Konfigurasi Playwright e2e.
 *
 * Dua mode:
 * 1. MOCK (default): menyajikan docs/ lokal via server statis dan me-rute
 *    panggilan Apps Script dengan mock (lihat e2e/fixtures). Deterministik,
 *    tanpa Google. Cocok untuk CI & verifikasi UI/alur.
 * 2. LIVE: set E2E_BASE_URL ke URL GitHub Pages hasil deploy untuk menguji
 *    front-end nyata (alur publik). Login Google tetap manual.
 */
const PORT = Number(process.env.PORT || 8080);
const liveBaseUrl = process.env.E2E_BASE_URL;

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: liveBaseUrl || ('http://localhost:' + PORT),
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 800 }
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } } // uji responsif N7.1
  ],
  // Jalankan server statis lokal hanya di mode MOCK (tanpa E2E_BASE_URL).
  webServer: liveBaseUrl ? undefined : {
    command: 'node tools/serve.js',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(PORT) }
  }
});
