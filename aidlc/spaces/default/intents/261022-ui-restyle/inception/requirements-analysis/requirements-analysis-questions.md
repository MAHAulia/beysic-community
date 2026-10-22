# Requirements Analysis — Pertanyaan Klarifikasi

Intent: `261022-ui-restyle` — Improvement UI (penyelarasan tampilan `docs/` ke design token `template/`).

Request sudah sangat jelas soal token inti (palet `#070b12` / `#1676e8` / `#42f3ff`, font Inter, radius 18px, gradient heading, grid background, komponen card/button/eyebrow) dan cakupan (semua halaman, fungsi utuh). Pertanyaan di bawah hanya menutup keputusan desain yang belum ditentukan, agar requirements tidak ambigu.

Isi tag `[Answer]:` dengan huruf pilihan (mis. `A`), atau `X` diikuti penjelasan.

---

## Q1 — Aksen kuning lama (`#ffcc33`)
Tampilan sekarang memakai kuning sebagai warna sekunder (brand-sub "Blader Community", footer-tagline, beberapa highlight). Template referensi tidak memakai kuning — hanya biru + cyan.

- A. Hapus kuning; ganti semua aksen sekunder ke **cyan** (`#42f3ff`) agar 100% selaras template.
- B. Pertahankan kuning sebagai aksen ketiga untuk highlight tertentu (status "juara"/Monarch, badge).
- C. Hapus kuning dari UI umum, tapi simpan untuk penanda khusus leaderboard (Monarch/podium).
- D. Serahkan ke penilaian desain saat eksekusi.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Loader awal (splash "🌀 BEYSIC")
Ada loader splash saat halaman dimuat (ikon berputar + teks "BEYSIC" + titik animasi).

- A. Pertahankan loader, selaraskan warnanya saja (cyan + grid background) ke token baru.
- B. Pertahankan loader apa adanya (tak perlu disentuh).
- C. Hapus loader; langsung tampilkan konten.
- D. Serahkan ke penilaian desain saat eksekusi.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Ikon & emoji brand (Font Awesome, 🐺 header, 🌀 loader)
Situs sekarang memakai Font Awesome (CDN) untuk ikon dan emoji (serigala di brand, pusaran di loader). Template referensi memakai logo gambar (`assets/images/logo.jpg`).

- A. Pertahankan Font Awesome + emoji; hanya sesuaikan warna/gaya.
- B. Pertahankan Font Awesome untuk ikon fungsional, tapi ganti emoji brand dengan elemen bergaya template (mis. teks logo + gradient).
- C. Adopsi aset logo dari `template/assets/images/` untuk brand header + loader.
- D. Serahkan ke penilaian desain saat eksekusi.
- X. Other (please specify)

[Answer]: C

---

## Q4 — Struktur file CSS
Sekarang satu file `docs/styles.css` (token + semua komponen). Template memakai CSS modular (satu file per bagian, dimuat berurutan, `responsive.css` terakhir).

- A. Pertahankan satu file `styles.css` (perubahan paling kecil, risiko minimal).
- B. Pecah menjadi CSS modular per-section mengikuti pola `template/css/` (lebih rapi, perubahan lebih besar).
- C. Tetap satu file, tapi reorganisasi internal (token di atas, section berkomentar jelas).
- D. Serahkan ke penilaian teknis saat eksekusi.
- X. Other (please specify)

[Answer]: B

---

## Q5 — Atribusi template Axio
Footer + `CREDITS.md` saat ini memuat atribusi template "Axio" (ThemeWagon). Jika kita beralih ke token/aset BEYSIC sendiri, aset Axio mungkin tak lagi dipakai.

- A. Pertahankan atribusi Axio apa adanya (aman secara lisensi, tak perlu dipikirkan).
- B. Jika aset Axio tak lagi dipakai setelah re-skin, sederhanakan/hapus atribusi dan perbarui `CREDITS.md`.
- C. Pertahankan atribusi tapi perbarui redaksinya mengikuti gaya baru.
- D. Serahkan ke penilaian saat eksekusi (cek dulu aset mana yang masih terpakai).
- X. Other (please specify)

[Answer]: B

---

## Q6 — Tingkat perubahan markup presentasional
Re-skin bisa murni CSS, atau juga menyentuh markup (menambah class/elemen presentasional seperti `.eyebrow`, `.card`, `.gradient` ala template).

- A. Boleh ubah markup presentasional (tambah class/wrapper) selama fungsi & selector uji penting tetap aman — demi tampilan yang benar-benar selaras.
- B. Seminimal mungkin ubah markup; utamakan perubahan di CSS saja.
- C. Serahkan ke penilaian teknis saat eksekusi (kasus per kasus).
- X. Other (please specify)

[Answer]: A


---

## Consolidated Summary Confirmation

Ringkasan jawaban Anda sebelum saya menyusun artifact requirements:

- Palet & token inti: adopsi penuh dari `template/` — `--bg #070b12`, `--blue #1676e8`, `--cyan #42f3ff`, font Inter, radius 18px, gradient heading, background grid halus, komponen card/button/eyebrow. (dari request)
- Cakupan: semua halaman (home, event, leaderboard, membership, profile, admin); fungsi SPA/router/auth/form/tabel tetap utuh. (dari request)
- Q1: Hapus aksen kuning lama (`#ffcc33`); ganti semua aksen sekunder ke cyan agar 100% selaras template.
- Q2: Pertahankan loader splash, selaraskan warnanya (cyan + grid background) ke token baru.
- Q3: Adopsi aset logo dari `template/assets/images/` untuk brand header + loader (menggantikan emoji 🐺/🌀).
- Q4: Pecah CSS menjadi modular per-section mengikuti pola `template/css/` (base, buttons, header, dst., `responsive.css` terakhir).
- Q5: Jika aset Axio tak lagi dipakai setelah re-skin, sederhanakan/hapus atribusi dan perbarui `CREDITS.md`. (Catatan: bila aset logo di `template/` ternyata milik Axio/ThemeWagon, atribusi yang masih diwajibkan lisensi dipertahankan.)
- Q6: Boleh ubah markup presentasional (tambah class/wrapper) selama fungsi & selector uji penting tetap aman.
- Tanpa framework/dependency build baru; Google Fonts CDN (Inter) boleh.

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
