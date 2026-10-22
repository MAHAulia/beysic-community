# Technology Stack

## Languages
- **JavaScript (vanilla, ES5/ES6 klasik non-module)** — front-end `docs/`.
- **Google Apps Script (JavaScript `.gs`)** — backend `apps-script/`.
- **HTML5 + CSS3** — markup & styling.

## Front-end Runtime
- Tanpa framework, tanpa bundler/build step.
- SPA berbasis hash-router buatan sendiri (`docs/js/router.js`).

## External Services / CDN
- **Google Identity Services (GIS)** — `accounts.google.com/gsi/client` — login Google (login member).
- **Google Fonts** — Oswald + Barlow (saat ini di `docs/`); referensi `template/` memakai **Inter**.
- **Font Awesome 6.5.2** — ikon (CDN).
- **Google Apps Script Web App** — backend API.
- **Google Spreadsheet** — datastore. **Google Drive** — penyimpanan foto (via URL).

## Dev / Test Tooling
- **Node.js built-in test runner** (`node --test`) — unit test.
- **Playwright** `^1.52.0` (dipin; mesin dev macOS 12) — e2e test.
- **npm** — manajemen skrip (`test`, `test:e2e`, `serve`).

## Hosting / Deploy
- **GitHub Pages** — serve `docs/` dari branch `main`, folder `/docs`.
- **GitHub Actions** — CI unit + e2e.

## Catatan versi
- Playwright sengaja dipin `1.52.0` (versi lebih baru menghapus build browser untuk macOS 12); di CI (Ubuntu) versi bebas.
- Tidak ada linter/formatter yang dikonfigurasi di repo.
