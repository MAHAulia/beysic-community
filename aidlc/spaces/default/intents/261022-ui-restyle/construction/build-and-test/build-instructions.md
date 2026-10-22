# Build Instructions — UI Re-skin (Beysic)

Front-end statis vanilla JS/HTML/CSS — **tidak ada langkah compile/bundle/transpile**. "Build" di sini berarti menyajikan `docs/` sebagaimana adanya (sama seperti GitHub Pages).

## Dependency Installation
Hanya untuk tooling test (tidak ada dependency runtime front-end):
```
npm install
```
Prasyarat e2e (sekali): unduh browser Chromium
```
npm run e2e:install
```

## Environment Setup
- Tidak ada env var untuk build front-end.
- E2E mode mock (default) tidak butuh kredensial Google.
- Port server statis lokal: `8080` (override `PORT`).

## Build Commands
Tidak ada. Verifikasi "build" = situs dapat disajikan:
```
node tools/serve.js        # menyajikan docs/ di http://localhost:8080
```

## Build Verification
- Buka `http://localhost:8080` → shell + CSS modular termuat tanpa error 404.
- Konfirmasi `docs/css/*` (15 file) dan `docs/assets/img/logo.jpg` ter-serve.
- Tidak ada referensi ke `docs/styles.css` lama (terhapus).

## Troubleshooting
- **ERR_CONNECTION_REFUSED saat e2e**: server statis belum jalan. Jalankan `node tools/serve.js` dulu, atau andalkan `webServer` di `playwright.config.js` (auto-start saat tanpa `E2E_BASE_URL`).
- **404 CSS**: periksa urutan & path `<link>` di `docs/index.html` (`responsive.css` terakhir).
- **Logo tak tampil**: pastikan `docs/assets/img/logo.jpg` ada.
