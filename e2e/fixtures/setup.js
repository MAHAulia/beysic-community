// @ts-check
/**
 * Setup bersama untuk e2e mode MOCK.
 *
 * Menimpa config.js lewat network interception: saat halaman meminta
 * /config.js, kita balas konfigurasi mock yang valid (URL Apps Script palsu
 * + client id palsu). Deterministik dan tidak bergantung urutan skrip.
 *
 * URL mengandung 'script.google.com/macros' agar cocok dengan route mockApi.
 */
const MOCK_GAS_URL = 'https://script.google.com/macros/s/MOCK/exec';
const MOCK_CLIENT_ID = 'mock-client-id.apps.googleusercontent.com';

const MOCK_CONFIG_JS =
  'window.BEYSIC_CONFIG = {' +
  '  GAS_WEBAPP_URL: ' + JSON.stringify(MOCK_GAS_URL) + ',' +
  '  GOOGLE_CLIENT_ID: ' + JSON.stringify(MOCK_CLIENT_ID) + ',' +
  '  CACHE_TTL_MS: 60000' +
  '};';

/** Pasang override config.js. Panggil sebelum page.goto(). */
async function applyMockConfig(page) {
  await page.route(function (url) { return /\/config\.js(\?.*)?$/.test(url.pathname); }, async function (route) {
    await route.fulfill({ status: 200, contentType: 'text/javascript; charset=utf-8', body: MOCK_CONFIG_JS });
  });
}

/**
 * Blokir pemuatan Google Identity Services agar tidak memanggil Google asli.
 * Kembalikan stub minimal `google.accounts.id`.
 */
async function stubGis(page) {
  await page.route(function (url) { return url.href.indexOf('accounts.google.com/gsi/client') >= 0; }, async function (route) {
    await route.fulfill({
      status: 200,
      contentType: 'text/javascript; charset=utf-8',
      body:
        'window.google = window.google || {};' +
        'window.google.accounts = { id: {' +
        '  initialize: function(){},' +
        '  renderButton: function(el){ el.innerHTML = "<button id=\\"mock-gsi\\">Sign in</button>"; },' +
        '  disableAutoSelect: function(){}' +
        '} };'
    });
  });
}

module.exports = { applyMockConfig, stubGis, MOCK_GAS_URL, MOCK_CLIENT_ID };
