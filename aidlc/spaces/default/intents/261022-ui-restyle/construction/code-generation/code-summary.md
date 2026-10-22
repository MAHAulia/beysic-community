# Code Summary — UI Re-skin (Beysic)

## Files Created (CSS modular — `docs/css/`)
Dipecah dari `docs/styles.css` lama, diselaraskan ke token `template/`:
`base.css` (token `:root` cocok template, reset, tipografi Inter, `.container`, `.eyebrow`, `.gradient`, latar radial-gradient + grid), `buttons.css`, `layout.css`, `header.css`, `hero.css` (hero + page-hero), `footer.css`, `components.css` (card, iconbox, tag, muted-note, leader-controls, loader, popup alert, form, tabel, status msg, badge, achievement, btn-loading), `home.css` (feature strip, mini-rank, event-row, wof, cta-banner), `events.css`, `leaderboard.css`, `membership.css`, `profile.css`, `admin.css`, `responsive.css` (dimuat terakhir).

## Files Modified (in-place)
- `docs/index.html` — Google Fonts Oswald+Barlow → **Inter**; Font Awesome & GIS script + urutan `<script>` tidak berubah; satu `<link> styles.css` → daftar `css/*` terurut (`responsive.css` terakhir); brand emoji 🐺 → `<img>` logo; loader emoji 🌀 → logo (tema cyan + grid); atribusi Axio di footer DIPERTAHANKAN.
- `docs/js/pages/{home,event,leaderboard,membership,profile,admin}.js` — `.gradient` pada heading hero/page-hero tiap halaman; label `.eyebrow`; penyesuaian class presentasional. Tanpa perubahan handler/rute/ID/`data-*`/`data-testid`. `profile.js` inline `--accent-2/--surface-2` → `--cyan/--panel2`, placeholder 🐺→🌀.
- `CREDITS.md` — baris Google Fonts "Oswald, Barlow" → "Inter"; tambah `docs/assets/img/logo.jpg` ke daftar aset; atribusi Axio TIDAK dihapus.

## Files Deleted
- `docs/styles.css` — dihapus setelah set modular mencapai paritas dan `<link>`-nya diganti.

## Assets
- `template/assets/images/logo.jpg` → disalin ke `docs/assets/img/logo.jpg` (dipakai brand header + loader).

## Key Implementation Decisions
- **Alias kompatibilitas** di `base.css`: `--accent→--blue`, `--accent-2→--cyan`, `--surface→--panel`, `--surface-2→--panel2`, `--text→--white`, `--maxw→--max`, plus `--ok`/`--danger` dipertahankan. Ini membuat aturan lama yang dimigrasikan otomatis resolve ke palet baru tanpa menyentuh logika — meminimalkan risiko. Tidak ada nilai `#ffcc33` aktif (hanya komentar penjelas alias).
- **Markup aman**: semua ID/`data-register`/`data-set-status`/`data-tab`/`data-role`/`#beysic-alert`/`.hero h1`/`.brand-name`/`.admin-sidebar` dipertahankan, sehingga selector e2e tidak ada yang putus (BR1.12).
- **Atribusi (BR1.8)**: aset Axio (hero-bg, section-bg, ikon features, logo-loader) dan `logo.jpg` berasal dari distribusi Axio/ThemeWagon → atribusi WAJIB dipertahankan (kasus FR7.2), bukan dihapus. `CREDITS.md` diperbarui akurat.

## Test Coverage Summary
Tidak ada test baru (scope refactor, strategi minimal). Suite eksisting tetap **hijau**:
- Unit: `node --test test/points.test.js` → **12/12 pass** (logika poin tidak berubah).
- E2E Playwright (desktop-chromium + mobile Pixel 5): **28/28 pass** (public/member/admin), 0 fail. Tidak ada selector yang perlu diubah.

## Deviations from Plan
- Tidak ada deviasi material. Step layer data-model/repository/business-logic/API ditandai N/A sesuai rencana (re-skin UI-only). Verifikasi e2e sempat gagal `ERR_CONNECTION_REFUSED` saat server statis belum aktif; setelah `node tools/serve.js` dijalankan, 28/28 lulus — bukan akibat perubahan re-skin.
