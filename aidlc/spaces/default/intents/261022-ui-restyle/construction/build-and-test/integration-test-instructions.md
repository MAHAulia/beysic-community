# Integration Test Instructions — UI Re-skin

## Status
Strategi test aktif: **Minimal** (scope refactor). Integration test khusus **tidak ditambahkan** untuk re-skin UI-only ini — tidak ada batas/kontrak baru antar komponen.

## Cakupan yang sudah ada
Interaksi lintas-modul front-end (router ↔ page module ↔ api mock ↔ auth) sudah diverifikasi end-to-end oleh suite Playwright `e2e/` (public/member/admin). Itu berperan sebagai uji integrasi de-facto untuk alur utama.

## Cara menjalankan
```
node tools/serve.js
npx playwright test
```

## Catatan
Kontrak backend Apps Script tidak berubah (re-skin visual-only), jadi tidak ada integrasi baru yang perlu diuji terpisah.
