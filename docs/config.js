/**
 * Konfigurasi front-end (client-side, bukan rahasia — lihat infrastructure-design §6).
 * Ganti nilai di bawah setelah deploy Apps Script & membuat OAuth Client.
 */
window.BEYSIC_CONFIG = {
  // URL Web App Apps Script (akhiran /exec). Contoh:
  // https://script.google.com/macros/s/XXXXXXXX/exec
  GAS_WEBAPP_URL: 'REPLACE_WITH_YOUR_APPS_SCRIPT_WEBAPP_URL',

  // OAuth Web client id dari Google Cloud Console (audience idToken).
  GOOGLE_CLIENT_ID: 'REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',

  // TTL cache read publik dalam milidetik (NFR N3.1 = 60 detik).
  CACHE_TTL_MS: 60 * 1000
};
