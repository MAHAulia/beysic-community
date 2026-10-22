# Component Inventory

> Komponen front-end `docs/` (target re-skin) didaftar lebih rinci; backend & test diringkas (dibekukan untuk intent ini).

## Shell & Core (docs/)

### App Shell
- **File**: `docs/index.html`
- **Tanggung jawab**: struktur halaman (header/brand/nav, `#app`, footer, loader), muat stylesheet & font, muat urutan script.
- **Dependensi**: `styles.css`, `config.js`, semua modul `js/`.

### Router
- **File**: `docs/js/router.js`
- **Tanggung jawab**: memetakan rute hash ke modul halaman, guard peran.
- **Dependensi**: modul `js/pages/*`, `auth.js`.

### Auth
- **File**: `docs/js/auth.js`
- **Tanggung jawab**: login Google (GIS), sesi, peran, render area auth & nav role.
- **Dependensi**: GIS CDN, `api.js`, `config.js`.

### API Client
- **File**: `docs/js/api.js`
- **Tanggung jawab**: pembungkus `fetch` GET/POST ke Apps Script.
- **Dependensi**: `config.js`, `cache.js`.

### Cache
- **File**: `docs/js/cache.js`
- **Tanggung jawab**: cache read sisi klien dengan TTL.

### UI Helpers
- **File**: `docs/js/ui.js`
- **Tanggung jawab**: popup alert (info/error/warning/success), util render bersama.

### App Bootstrap
- **File**: `docs/js/app.js`
- **Tanggung jawab**: inisialisasi, loader, toggle nav mobile.

## Page Modules (docs/js/pages/)
- **Home** — `home.js` — render konten komunitas & event unggulan.
- **Event** — `event.js` — daftar event + form pendaftaran.
- **Leaderboard** — `leaderboard.js` — tabel peringkat + pencarian.
- **Membership** — `membership.js` — info paket + form signup.
- **Profile** — `profile.js` — foto, deck, top blade, achievement; edit profil.
- **Admin** — `admin.js` — kelola home/event, input poin, approval member.

## Styling Assets
- **Stylesheet aplikasi** — `docs/styles.css` — token + semua komponen (akan diselaraskan ke token `template/`).
- **Design-token referensi** — `template/css/*` (`base.css`, `buttons.css`, `header.css`, `hero.css`, `components.css`, `layout.css`, `ticker.css`, `about.css`, `leaderboard.css`, `events.css`, `membership.css`, `more.css`, `contact.css`, `footer.css`, `responsive.css`) — SUMBER gaya, bukan runtime produk.

## Backend (apps-script/) — diringkas, dibekukan
- **Code.gs** — API, verifikasi token, CRUD sheet, idempotensi, LockService.
- **points.js** — logika perhitungan poin murni.
- **appsscript.json** — konfigurasi Web App.

## Testing — diringkas
- **test/points.test.js** — unit test logika poin.
- **e2e/public.spec.js, member.spec.js, admin.spec.js** — Playwright, menyeleksi elemen UI (sensitif terhadap perubahan markup).
