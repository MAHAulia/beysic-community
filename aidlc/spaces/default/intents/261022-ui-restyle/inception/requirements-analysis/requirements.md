# Requirements — Improvement UI (Beysic Re-skin)

Intent: `261022-ui-restyle` · Scope: refactor · Depth: Minimal · Project type: Brownfield

## Sources
- [desc] Initial description: deskripsi proyek otoritatif dari `project-description.json` (penyelarasan tampilan `docs/` ke design token `template/`).
- [scope] Workflow-selected scope: refactor.
- [Q1]–[Q6] Jawaban klarifikasi di `requirements-analysis-questions.md` (summary confirmed 2026-10-22).
- CodeKB brownfield: `business-overview.md`, `architecture.md`, `code-structure.md` (`aidlc/spaces/default/codekb/web/`).

## Intent Analysis
Tujuan: menyatukan bahasa visual situs Beysic (`docs/`) agar mengikuti design token referensi di `template/`, sehingga tampilan konsisten dan lebih matang di seluruh halaman — tanpa mengubah perilaku fungsional, arsitektur, atau tumpukan teknologi. Ini pekerjaan lapisan presentasi (CSS + markup presentasional), bukan logika.

Yang TIDAK menjadi tujuan: mengubah alur SPA, autentikasi, kontrak API Apps Script, logika poin/leaderboard, atau menambah fitur baru.

## Functional Requirements

### FR1 — Adopsi design token dari `template/`
- FR1.1 — Variabel warna di `:root` diselaraskan ke token template: background `#070b12`, panel `#0d1420`/`#111c2b`, biru `#1676e8`, cyan `#42f3ff`, teks `#f4f8ff`, muted `#9caec4`, garis `rgba(126,178,224,.18)`.
- FR1.2 — Radius sudut global memakai `18px` (dari `--radius` template).
- FR1.3 — Tipografi memakai **Inter** (Google Fonts CDN) menggantikan Oswald/Barlow.
- FR1.4 — Heading utama memakai utilitas gradient teks (`.gradient`) bergaya template.
- FR1.5 — Background halaman memakai lapisan radial-gradient + grid halus seperti `body:before` template.
- FR1.6 — Elemen aksen/eyebrow memakai gaya `.eyebrow` (cyan, uppercase, letter-spacing) di tempat yang sesuai.

### FR2 — Penerapan di semua halaman
- FR2.1 — Token & komponen diterapkan ke seluruh halaman: home, event, leaderboard, membership, profile, admin.
- FR2.2 — Header/brand, navigasi, footer, loader, dan popup alert ikut diselaraskan.
- FR2.3 — Komponen bersama diselaraskan ke gaya template: card, button (`.btn`, `.btn-primary`, `.btn-ghost`), tabel leaderboard, form (event/membership/profil/admin), badge/tag.

### FR3 — Aksen warna sekunder (Q1)
- FR3.1 — Aksen kuning lama (`#ffcc33`) dihapus dari UI; seluruh aksen sekunder (brand-sub, footer-tagline, highlight) memakai cyan `#42f3ff`.
- FR3.2 — Tidak ada sisa referensi warna kuning di stylesheet final untuk elemen UI umum.

### FR4 — Loader splash (Q2)
- FR4.1 — Loader splash tetap ada; warnanya diselaraskan ke token baru (cyan + background grid), bukan kuning.

### FR5 — Logo & ikon brand (Q3)
- FR5.1 — Brand header memakai aset logo dari `template/assets/images/` (menggantikan emoji 🐺).
- FR5.2 — Loader splash memakai aset logo yang sama (menggantikan emoji 🌀).
- FR5.3 — Aset logo disalin ke lokasi yang disajikan GitHub Pages (`docs/assets/`), bukan direferensikan lintas folder di luar `docs/`.
- FR5.4 — Ikon fungsional (Font Awesome) boleh dipertahankan; hanya penyesuaian warna/gaya bila perlu.

### FR6 — Struktur CSS modular (Q4)
- FR6.1 — `docs/styles.css` dipecah menjadi beberapa file CSS per-bagian mengikuti pola `template/css/` (mis. base, buttons, layout, header, hero, components, footer, responsive, plus file per halaman bila perlu).
- FR6.2 — Urutan muat `<link>` di `docs/index.html` mengikuti dependensi; `responsive.css` dimuat paling akhir.
- FR6.3 — Semua file CSS berada di bawah `docs/` agar ter-serve GitHub Pages tanpa build step.

### FR7 — Atribusi template (Q5)
- FR7.1 — Setelah re-skin, verifikasi aset mana yang masih dipakai. Jika aset Axio/ThemeWagon tak lagi dipakai, sederhanakan/hapus atribusi Axio di footer dan perbarui `CREDITS.md`.
- FR7.2 — Jika ada aset (mis. logo `template/`) yang masih terikat lisensi Axio/ThemeWagon, atribusi yang diwajibkan lisensi tetap dipertahankan dan dicatat akurat di `CREDITS.md`.

### FR8 — Perubahan markup presentasional (Q6)
- FR8.1 — Boleh menambah/menyesuaikan class dan elemen wrapper presentasional (mis. `.card`, `.eyebrow`, `.gradient`, `.section`) untuk mencapai keselarasan visual.
- FR8.2 — Perubahan markup tidak boleh mengubah perilaku fungsional, rute, atau kontrak data.

## Non-Functional Requirements

### NFR1 — Fungsi tetap utuh (regression-free)
- NFR1.1 — Setelah re-skin, seluruh alur fungsional tetap bekerja: login Google, navigasi SPA, pendaftaran event, tabel/pencarian leaderboard, signup membership, profil & edit, panel admin (input poin, approval member).
- NFR1.2 — Suite e2e Playwright (`e2e/public|member|admin.spec.js`) tetap hijau. Jika perubahan markup memutus selector, selector uji diperbarui agar tetap menguji perilaku yang sama (bukan melemahkan uji).
- NFR1.3 — Unit test logika poin (`test/points.test.js`) tetap hijau (tidak disentuh oleh re-skin).

### NFR2 — Responsif
- NFR2.1 — Tampilan tetap responsif dari mobile (~360px) hingga desktop, setara atau lebih baik dari perilaku responsif saat ini (media query setara `template/responsive.css`).

### NFR3 — Aksesibilitas kontras
- NFR3.1 — Kombinasi warna teks/background memenuhi kontras yang memadai pada tema gelap (tidak menurunkan keterbacaan dibanding versi sekarang). *(Validasi WCAG penuh butuh pengujian manual dengan alat bantu & tinjauan ahli aksesibilitas.)*

### NFR4 — Tanpa build step / dependency baru
- NFR4.1 — Tidak menambah framework, bundler, atau devDependency baru. Front-end tetap vanilla JS/HTML/CSS statis.
- NFR4.2 — Font Inter dimuat via Google Fonts CDN (pola yang sudah dipakai situs).

### NFR5 — Kesesuaian hosting
- NFR5.1 — Semua aset (CSS, logo) di-serve dari `docs/` agar GitHub Pages (`main` + `/docs`) menyajikannya tanpa konfigurasi tambahan.

## Constraints
- Teknologi dikunci (memory project): vanilla JS + HTML + CSS, GitHub Pages, Apps Script, Spreadsheet, auth Google.
- Backend (`apps-script/`) dan logika poin dibekukan untuk intent ini.
- Apps Script tetap penulis tunggal; otorisasi admin server-side tidak disentuh.

## Assumptions
- A1 — Aset logo yang dimaksud ada di `template/assets/images/` dan boleh dipakai untuk brand Beysic. (Jika ternyata milik Axio/ThemeWagon, berlaku FR7.2 — atribusi dipertahankan.) Rasional: Q3:C + Q5:B perlu diselaraskan dengan kenyataan lisensi aset.
- A2 — Palet gelap tema tunggal (tanpa mode terang) — konsisten dengan situs sekarang dan template. Rasional: tak ada permintaan mode terang.
- A3 — Konten teks dan struktur data halaman tidak berubah; hanya presentasi. Rasional: ruang lingkup visual-only.

## Out of Scope
- Perubahan fitur, alur, atau kontrak API.
- Perubahan logika perhitungan poin/leaderboard.
- Mode terang / theming dinamis.
- Optimasi performa di luar yang muncul alami dari perubahan CSS.
- Penggantian menyeluruh ikon fungsional (kecuali penyesuaian warna/gaya).

## Open Questions
- OQ1 — Asal-usul lisensi aset `template/assets/images/` (milik komunitas vs Axio/ThemeWagon) akan diverifikasi saat eksekusi; hasilnya menentukan penerapan FR7.1 vs FR7.2.

## Assumptions & Open Questions
Lihat bagian Assumptions (A1–A3) dan Open Questions (OQ1) di atas.
