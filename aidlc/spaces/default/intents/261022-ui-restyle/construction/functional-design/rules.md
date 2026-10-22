# Rules — UI Re-skin (aturan presentasi)

Re-skin tidak menambah business rule domain (otorisasi, poin, validasi data — semua dibekukan di Apps Script). Namun agar penerapan visual dapat diverifikasi, berikut **aturan presentasi** yang mengikat hasil re-skin. Ini kriteria lulus/gagal yang dipakai verifikasi, bukan logika bisnis.

```yaml
rules:
  - id: BR1.1
    statement: "Seluruh variabel :root pada stylesheet docs/ memakai nilai token template/ (bg #070b12, panel #0d1420/#111c2b, blue #1676e8, cyan #42f3ff, white #f4f8ff, muted #9caec4, line rgba(126,178,224,.18), radius 18px)."
    category: constraint
    applies_to: "docs/ stylesheet :root"
    trigger: "Saat stylesheet dibangun ulang"
    logic: "IF token di :root != nilai token template THEN gagal verifikasi"
    violation: "Verifikasi DoD visual gagal; perbaiki token"
    source: FR1.1, FR1.2, FR3.1
  - id: BR1.2
    statement: "Tidak ada sisa token lama pada stylesheet UI: tidak ada warna kuning #ffcc33, dan tidak ada font Oswald/Barlow untuk elemen UI."
    category: constraint
    applies_to: "docs/ stylesheet"
    trigger: "Saat stylesheet final"
    logic: "IF ditemukan #ffcc33 atau Oswald/Barlow di stylesheet UI THEN gagal verifikasi"
    violation: "Hapus/ganti ke cyan dan Inter"
    source: FR3.1, FR3.2, FR1.3
  - id: BR1.3
    statement: "Font Inter termuat dari Google Fonts CDN dan menjadi font-family utama body."
    category: constraint
    applies_to: "docs/index.html, body"
    trigger: "Saat halaman dimuat"
    logic: "IF Inter tidak termuat atau body tidak memakai Inter THEN gagal"
    violation: "Tambahkan <link> Inter; set font-family"
    source: FR1.3, NFR4.2
  - id: BR1.4
    statement: "Heading utama (hero H1/H2) tiap halaman memakai utilitas .gradient; label section utama memakai .eyebrow."
    category: constraint
    applies_to: "markup presentasional tiap halaman"
    trigger: "Saat render halaman"
    logic: "IF hero heading tidak memakai .gradient atau label section tidak memakai .eyebrow THEN belum selaras"
    violation: "Terapkan utilitas pada elemen wajib"
    source: FR1.4, FR1.6
  - id: BR1.5
    statement: "Stylesheet docs/ dipecah menjadi file modular per-bagian mengikuti pola template/css/, dengan responsive.css dimuat paling akhir, dan semua file berada di bawah docs/."
    category: constraint
    applies_to: "docs/css/ dan urutan <link> di index.html"
    trigger: "Saat build CSS modular"
    logic: "IF CSS masih monolitik ATAU responsive bukan link terakhir ATAU ada file CSS di luar docs/ THEN gagal"
    violation: "Pecah file, atur urutan link"
    source: FR6.1, FR6.2, FR6.3
  - id: BR1.6
    statement: "Seluruh fungsi tetap bekerja: suite e2e Playwright dan unit test poin tetap hijau setelah re-skin."
    category: constraint
    applies_to: "e2e/*.spec.js, test/points.test.js"
    trigger: "Saat build-and-test"
    logic: "IF ada test gagal akibat re-skin THEN belum memenuhi DoD"
    violation: "Perbaiki selector/markup agar menguji perilaku yang sama; jangan lemahkan uji"
    source: NFR1.1, NFR1.2, NFR1.3
  - id: BR1.7
    statement: "Kontras teks/background memenuhi WCAG AA sebagai target (4.5:1 teks normal, 3:1 teks besar) pada tema gelap, atau minimal tidak lebih buruk dari versi sekarang."
    category: constraint
    applies_to: "kombinasi warna teks/background docs/"
    trigger: "Saat memilih warna teks di atas panel/bg"
    logic: "IF rasio kontras < target WCAG AA DAN lebih buruk dari baseline sekarang THEN perbaiki"
    violation: "Sesuaikan warna teks/muted agar memenuhi kontras"
    source: NFR3.1
  - id: BR1.8
    statement: "Aset logo yang dipakai brand/loader berada di bawah docs/ (disalin dari template/assets/images/), dan atribusi lisensi yang masih diwajibkan dipertahankan di footer + CREDITS.md."
    category: policy
    applies_to: "docs/assets/, footer, CREDITS.md"
    trigger: "Saat mengadopsi logo & meninjau atribusi"
    logic: "IF aset masih terikat lisensi Axio/ThemeWagon THEN pertahankan atribusi; IF aset Axio tak lagi dipakai THEN sederhanakan/hapus atribusi dan perbarui CREDITS.md"
    violation: "Perbaiki atribusi sesuai aset yang benar-benar dipakai"
    source: FR5.2, FR5.3, FR7.1, FR7.2
  - id: BR1.9
    statement: "Latar halaman memakai lapisan radial-gradient biru+cyan + grid halus mengikuti pola body:before template."
    category: constraint
    applies_to: "docs/ body background (base.css)"
    trigger: "Saat membangun base.css"
    logic: "IF latar tidak memuat radial-gradient + grid halus bergaya template THEN belum selaras"
    violation: "Terapkan latar grid/gradient dari template body:before"
    source: FR1.5
  - id: BR1.10
    statement: "Token dan komponen target diterapkan ke SELURUH halaman (home, event, leaderboard, membership, profile, admin) dan ke shell bersama (header/brand, nav, footer, loader, popup alert), termasuk komponen bersama (card, button, tabel leaderboard, form, tag)."
    category: constraint
    applies_to: "semua halaman docs/js/pages/* dan shell index.html"
    trigger: "Saat verifikasi per-halaman"
    logic: "IF ada halaman atau komponen shell/bersama yang belum memakai token & gaya target THEN belum selaras"
    violation: "Terapkan token/komponen ke halaman/komponen yang terlewat"
    source: FR2.1, FR2.2, FR2.3
  - id: BR1.11
    statement: "Brand header memakai aset logo gambar (dari docs/assets/) menggantikan emoji; ikon fungsional Font Awesome boleh dipertahankan dengan penyesuaian warna/gaya."
    category: constraint
    applies_to: "header brand, docs/index.html"
    trigger: "Saat render header"
    logic: "IF brand header masih memakai emoji alih-alih aset logo THEN belum selaras"
    violation: "Ganti emoji brand dengan aset logo"
    source: FR5.1, FR5.4
  - id: BR1.12
    statement: "Perubahan markup presentasional tidak mengubah perilaku fungsional, rute SPA, atau kontrak data; hanya class/elemen presentasional yang disesuaikan."
    category: constraint
    applies_to: "index.html, docs/js/pages/* (markup saja)"
    trigger: "Saat menyentuh markup"
    logic: "IF perubahan markup mengubah handler/rute/kontrak THEN tolak"
    violation: "Batalkan perubahan yang menyentuh logika; batasi ke presentasi"
    source: FR8.1, FR8.2
  - id: BR1.13
    statement: "Tampilan tetap responsif 360px→desktop setara/lebih baik dari sekarang, dengan paritas breakpoint terhadap template/responsive.css; tidak ada horizontal scroll pada 360px dan nav runtuh ke menu mobile pada layar sempit."
    category: constraint
    applies_to: "responsive.css, semua halaman"
    trigger: "Saat verifikasi responsif"
    logic: "IF ada horizontal scroll di 360px ATAU breakpoint lebih buruk dari sekarang THEN perbaiki"
    violation: "Sesuaikan media query"
    source: NFR2.1
  - id: BR1.14
    statement: "Tidak ada framework, bundler, atau devDependency baru yang ditambahkan; front-end tetap vanilla JS/HTML/CSS statis, dan seluruh aset (CSS, logo, font via CDN) di-serve dari docs/ agar GitHub Pages menyajikannya tanpa konfigurasi tambahan."
    category: constraint
    applies_to: "package.json, docs/"
    trigger: "Saat build/verifikasi"
    logic: "IF ada dependency build baru ATAU aset UI di luar docs/ THEN tolak"
    violation: "Hapus dependency; pindahkan aset ke docs/"
    source: NFR4.1, NFR5.1
```

## Ringkasan Aturan

| ID | Kategori | Inti |
|---|---|---|
| BR1.1 | constraint | `:root` cocok token template |
| BR1.2 | constraint | Tidak ada sisa token lama (kuning, Oswald/Barlow) |
| BR1.3 | constraint | Inter termuat & jadi font body |
| BR1.4 | constraint | `.gradient`/`.eyebrow` pada elemen wajib |
| BR1.5 | constraint | CSS modular, `responsive.css` terakhir, di bawah `docs/` |
| BR1.6 | constraint | e2e + unit test tetap hijau |
| BR1.7 | constraint | Kontras WCAG AA (target) / tak lebih buruk |
| BR1.8 | policy | Logo di `docs/`, atribusi sesuai lisensi |
| BR1.9 | constraint | Latar radial-gradient + grid halus |
| BR1.10 | constraint | Token/komponen di semua halaman + shell |
| BR1.11 | constraint | Logo gambar di brand header (ganti emoji) |
| BR1.12 | constraint | Markup presentasional tak ubah logika/rute |
| BR1.13 | constraint | Responsif 360px→desktop, paritas breakpoint |
| BR1.14 | constraint | Tanpa dependency build baru; aset di `docs/` |
