# API Documentation

## External API — Google Apps Script Web App
- **Lokasi**: `apps-script/Code.gs` (`doGet`, `doPost`).
- **Endpoint**: satu URL Web App (`GAS_WEBAPP_URL` di `docs/config.js`), `/exec`.
- **Transport**: HTTP, body/response JSON.
- **Konsumen**: klien lewat `docs/js/api.js`.
- **Auth**: ID token Google (GIS) dikirim dari klien; Apps Script memverifikasi token dan mencocokkan whitelist admin server-side.
- **Operasi (konseptual, dari README + struktur)**:
  - Read: konten home, daftar event, leaderboard, profil member.
  - Write (POST): pendaftaran event, signup member (pending), input poin hasil turnamen (idempoten), approval member, update profil.
- **Invariant**: Apps Script adalah penulis tunggal; operasi tulis poin/achievement idempoten dan dibungkus LockService.

> Detail kontrak field spesifik tidak dibedah dalam scan ber-depth Minimal ini (backend dibekukan untuk re-skin). Lihat `apps-script/Code.gs` untuk payload persisnya.

## Internal API — Hash Router (SPA)
- **Lokasi**: `docs/js/router.js`.
- **Rute**:
  - `#/` → home (`pages/home.js`)
  - `#/event` → event (`pages/event.js`)
  - `#/leaderboard` → leaderboard (`pages/leaderboard.js`)
  - `#/membership` → membership (`pages/membership.js`)
  - `#/profile` → profil (`pages/profile.js`, guard: member)
  - `#/admin` → admin (`pages/admin.js`, guard: admin)
- **Kontrak render**: tiap modul halaman mengekspor fungsi render yang mengisi kontainer `#app` dan memasang handler.

## Client Auth Surface
- **Lokasi**: `docs/js/auth.js` + script GIS CDN di `index.html`.
- **Fungsi**: tombol login Google, menyimpan sesi, menentukan peran (member/admin), menampilkan/ menyembunyikan link nav `data-role`.
