## Developer Code Scan Results

### Scan Coverage
- **Analyzed deeply**:
  - `docs/index.html` — shell SPA, urutan `<link>`/`<script>`, markup header/footer/loader
  - `docs/styles.css` — stylesheet tunggal (token `:root`, header/nav, loader, alert, layout, footer)
  - `docs/js/` — modul klien: `cache.js`, `api.js`, `auth.js`, `ui.js`, `router.js`, `app.js`
  - `docs/js/pages/` — modul per-halaman: `home.js`, `event.js`, `leaderboard.js`, `membership.js`, `profile.js`, `admin.js`
  - `docs/config.js` — konfigurasi runtime (GAS URL, Google client id, cache TTL)
  - `template/` — folder referensi design-token (base.css + css per-section, index.html, README.md)
  - `README.md` — dokumentasi arsitektur, struktur, fitur, deployment, testing
  - `package.json`, `playwright.config.js` — skrip & konfigurasi test
- **Skimmed only**:
  - `apps-script/` (`Code.gs`, `points.js`, `appsscript.json`) — backend, dibekukan untuk re-skin
  - `e2e/` (`public.spec.js`, `member.spec.js`, `admin.spec.js`, `fixtures/`) — suite Playwright
  - `test/points.test.js` — unit test logika poin
  - `.github/` workflow CI, `tools/serve.js`, `CREDITS.md`
- **Left out** (tidak dibuka, sesuai "What to Skip"):
  - `node_modules/`
  - `test-results/`
  - `.git/`
  - `.kiro/`, `aidlc/` (install & workspace AI-DLC)
  - `template.html` (artefak snapshot 1.6 MB; bukan kode sumber tangan)

### Packages Found
- beysic-web — aplikasi web statis — JavaScript (vanilla) + HTML + CSS — front-end komunitas Beyblade
- apps-script backend — Google Apps Script (`.gs`) — API/jembatan Sheets, auth, CRUD, logika poin
- template (referensi) — HTML/CSS/JS statis — sumber design-token visual (bukan kode runtime produk)

### Build System
- **Type**: npm (hanya untuk tooling test; front-end tanpa build/bundler)
- **Config Files**: `package.json`, `playwright.config.js`
- **Build Dependencies**: `@playwright/test@^1.52.0` (devDependency) → runner e2e

### APIs Discovered
- HTTP JSON (eksternal) — Google Apps Script Web App (`apps-script/Code.gs` doGet/doPost) — dikonsumsi klien via `docs/js/api.js`
- Hash-router internal (SPA) — `docs/js/router.js` — rute: `#/`, `#/event`, `#/leaderboard`, `#/membership`, `#/profile`, `#/admin`

### Frameworks & Libraries
- Vanilla JS (tanpa framework) — — SPA klasik script non-module
- Google Identity Services (GIS) — CDN `accounts.google.com/gsi/client` — login Google
- Font Awesome — 6.5.2 (CDN) — ikon
- Google Fonts — Oswald + Barlow (CDN) — tipografi saat ini
- Playwright — ^1.52.0 — e2e test (dev)

### Test Coverage
- **Test Directories**: `test/` (unit), `e2e/` (Playwright)
- **Test Frameworks**: Node built-in test runner (`node --test`), Playwright
- **Coverage Config**: absent (tanpa coverage floor; posture e2e-first)

### Code Quality Indicators
- **Linting**: tidak ada config linter (eslint/prettier) di repo
- **CI/CD**: GitHub Actions di `.github/workflows/` (menjalankan unit + e2e)
- **Documentation**: `README.md` komprehensif (arsitektur, deploy, testing); `CREDITS.md` atribusi template

### Technical Debt Signals
- Stylesheet tunggal `docs/styles.css` cukup besar (token + semua komponen dalam satu file) — kebalikan dari `template/css/` yang modular per-section; relevan untuk re-skin
- Dua bahasa visual berbeda hidup berdampingan: `docs/` (tema Axio, font Oswald/Barlow, aksen biru+kuning, radius 12px) vs `template/` (font Inter, aksen biru+cyan, radius 18px, gradient heading) — target penyelarasan
- `template.html` (1.6 MB) di root tampak sebagai snapshot/artefak, bukan sumber tangan

## Handoff Summary
- **Intent-relevant finding**: Permukaan styling yang harus diubah terpusat di `docs/styles.css` (satu file, variabel `:root` di baris 2–15) plus markup presentasional di `docs/index.html` dan string template di `docs/js/pages/*.js`. Design-token target sepenuhnya tersedia di `template/css/base.css` (`:root`: `--bg:#070b12`, `--blue:#1676e8`, `--cyan:#42f3ff`, `--radius:18px`, font Inter, util `.gradient`/`.eyebrow`) dan file css per-section lain. Perubahan terbatas ke lapisan visual; modul JS fungsional (`api.js`, `auth.js`, `router.js`, pages) hanya butuh penyesuaian className/markup presentasional, bukan logika.
- **Risks / follow-up**: Suite e2e Playwright (`e2e/*.spec.js`) menyeleksi elemen lewat selector/role; perubahan markup bisa memutus selector. Build-and-test harus menjalankan e2e untuk membuktikan fungsi tetap utuh. Atribusi template Axio di footer (`CREDITS.md`) harus tetap dipertahankan jika aset Axio masih dipakai.
