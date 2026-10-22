# Dependencies

## External Runtime Dependencies (klien, via CDN)
- **Google Identity Services** — `https://accounts.google.com/gsi/client` — login member.
- **Google Fonts** — Oswald, Barlow (saat ini) — tipografi. Target re-skin: **Inter**.
- **Font Awesome** — 6.5.2 — ikon.

## External Backend Dependencies
- **Google Apps Script runtime** — host backend.
- **Google Spreadsheet API** (lewat Apps Script `SpreadsheetApp`) — datastore.
- **Google Drive** — penyimpanan foto (referensi URL).

## Dev Dependencies (package.json)
- **@playwright/test** — `^1.52.0` — runner e2e. Satu-satunya devDependency.

## Internal Cross-module Dependencies (front-end)
- `router.js` → modul `pages/*`, `auth.js`
- `pages/*` → `api.js`, `ui.js`, `auth.js`
- `api.js` → `config.js`, `cache.js`
- `auth.js` → GIS CDN, `config.js`, `api.js`
- `app.js` → bootstrap semua, loader, nav toggle
- Semua modul mengandalkan urutan `<script>` di `index.html` (script klasik, global scope bersama)

## Internal Dependency — Backend
- `Code.gs` → `points.js` (logika poin; berbagi global scope di Apps Script)
- `test/points.test.js` → `apps-script/points.js` (unit test mengimpor logika murni)

## Catatan untuk re-skin
Perubahan visual tidak menambah dependency baru. Satu-satunya penyesuaian dependency yang mungkin: menamb/menukar keluarga Google Font (Inter) di `<link>` `docs/index.html` — tetap CDN, tanpa build tool.
