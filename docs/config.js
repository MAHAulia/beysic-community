/**
 * Konfigurasi front-end (client-side, bukan rahasia — lihat infrastructure-design §6).
 * Ganti nilai di bawah setelah deploy Apps Script & membuat OAuth Client.
 */
window.BEYSIC_CONFIG = {
  // URL Web App Apps Script (akhiran /exec). Contoh:
  // https://script.google.com/macros/s/XXXXXXXX/exec
  GAS_WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbwFaB11JqAXxGZdtl-x9fP1LqOU66Y5FAbHTX2gM9ArIyxPIgPBC0miFfFxt4coHN70hg/exec',

  // OAuth Web client id dari Google Cloud Console (audience idToken).
  GOOGLE_CLIENT_ID: '1077371865096-fj82c6531qoa9fvuqpprgns37ng5um8v.apps.googleusercontent.com',

  // TTL cache read publik dalam milidetik (NFR N3.1 = 60 detik).
  CACHE_TTL_MS: 60 * 1000
};
