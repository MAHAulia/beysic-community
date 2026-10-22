# Code Structure

## Top-level Organization
```
docs/                 Front-end statis (root GitHub Pages)
  index.html          Shell SPA + nav + footer + loader; urutan <link>/<script> penting
  config.js           GAS_WEBAPP_URL, GOOGLE_CLIENT_ID, cache TTL
  styles.css          Stylesheet tunggal (token :root + semua komponen)
  assets/             Aset gambar front-end
  js/                 Modul inti klien
  js/pages/           Modul per-halaman
apps-script/          Backend Apps Script (dibekukan untuk re-skin)
  Code.gs             API doGet/doPost, verifikasi token, CRUD sheet, idempotensi
  points.js           Logika poin murni (dipakai Code.gs + unit test)
  appsscript.json     Konfigurasi Web App
template/             Referensi design-token (sumber gaya, bukan runtime produk)
  index.html          Markup referensi satu halaman
  css/                base.css + per-section (buttons, header, hero, components, ...)
  assets/images/      Aset referensi
  README.md           Peta file & urutan link/script
test/points.test.js   Unit test algoritma poin (node --test)
e2e/                  Playwright specs (public/member/admin) + fixtures
tools/serve.js        Server statis lokal untuk e2e
.github/workflows/    CI (unit + e2e)
```

## File Classification (front-end docs/ — target re-skin)

### Modul inti (`docs/js/`)
- `cache.js` — cache read sisi klien (TTL dari config).
- `api.js` — pembungkus `fetch` ke Apps Script (GET/POST JSON).
- `auth.js` — integrasi Google Identity Services, render area auth, peran member/admin.
- `ui.js` — helper UI bersama (alert/popup, util render).
- `router.js` — hash-router SPA; memetakan rute ke modul halaman.
- `app.js` — bootstrap aplikasi, loader, pasang nav/toggle.

### Modul halaman (`docs/js/pages/`)
- `home.js`, `event.js`, `leaderboard.js`, `membership.js`, `profile.js`, `admin.js` — masing-masing merender markup halaman (string template) ke `#app` dan memasang handler.

## Styling Surface (relevan untuk intent re-skin)
- **`docs/styles.css`** — satu file: variabel `:root` (baris ~2–15), header/nav, loader, popup alert, layout (`.app-main`, `.site-footer`), komponen per-halaman. Ini permukaan utama yang diubah.
- **`docs/index.html`** — markup presentasional shell (header, brand, nav, footer, loader) + urutan `<link rel="stylesheet">` dan Google Fonts.
- **String template di `docs/js/pages/*.js`** — markup presentasional tiap halaman; className di sini menentukan tampilan.

## Code Patterns
- SPA klasik: modul global non-module, variabel global antar-file tak boleh bentrok.
- Render berbasis string template → innerHTML ke kontainer `#app`.
- Pemisahan config (`config.js`) dari logika.
- Pola referensi `template/`: CSS dipecah **satu file per bagian halaman**, dimuat berurutan dengan `responsive.css` terakhir (lihat `template/README.md`).
