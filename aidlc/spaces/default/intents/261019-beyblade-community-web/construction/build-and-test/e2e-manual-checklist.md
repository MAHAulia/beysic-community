# E2E Manual Checklist (pasca-deploy)

> Jalankan setelah menyelesaikan README §Setup (spreadsheet, Apps Script, OAuth, Pages).
> Tandai [x] bila lolos. Tiap item memetakan ke FR/NFR.

## Prasyarat
- [ ] `setupSheets()` sudah dijalankan; sheet + header terbentuk.
- [ ] `AdminWhitelist` berisi minimal 1 email admin.
- [ ] `config.js` terisi `GAS_WEBAPP_URL` & `GOOGLE_CLIENT_ID` yang benar.
- [ ] Origin Pages (dan `http://localhost:PORT` untuk uji lokal) terdaftar di OAuth client.

## A. Publik (tanpa login)
- [ ] A1. Home memuat about, pengumuman, galeri foto. (FR1.1)
- [ ] A2. Event menampilkan upcoming & ongoing. (FR2.1)
- [ ] A3. Leaderboard tampil terurut poin desc; TIDAK ada email member. (FR3.1, NFR6)
- [ ] A4. Membership menampilkan benefit & cara daftar. (FR4.1)

## B. Login & Member
- [ ] B1. Tombol "Sign in with Google" muncul; login berhasil; nama tampil di header. (FR5.1)
- [ ] B2. Non-member yang login dapat signup → status `pending`. (FR4.2, D5)
- [ ] B3. Member dapat mendaftar event → muncul "Pendaftaran berhasil"; baris masuk sheet Registrations. (FR2.2)
- [ ] B4. Profil menampilkan foto, latest deck, top blade, achievement. (FR6.1)
- [ ] B5. Member mengedit deck/blade/foto → tersimpan setelah reload. (FR6.2)
- [ ] B6. Member A TIDAK dapat mengubah data member B (coba manipulasi memberId → ditolak server). (NFR1.3)

## C. Admin (email di whitelist)
- [ ] C1. Menu Admin muncul hanya untuk admin. (FR5.2)
- [ ] C2. Non-admin yang memanggil action `admin.*` langsung ke Web App → `{ok:false,error:'forbidden'}`. (NFR1.1 — uji via DevTools/curl)
- [ ] C3. Buat/edit event dengan `topcut_size` dinamis per event. (FR2.3, D2)
- [ ] C4. Input poin: pilih event, isi total peserta, bracket terdeteksi otomatis, isi baris hasil, simpan. Poin muncul di leaderboard sesuai perhitungan. (FR9.1, FR3.2)
- [ ] C5. Submit hasil event yang SAMA dua kali → jumlah baris EventResults & Achievements tidak bertambah; poin akhir identik. (FR9.2, FR10.2, NFR5)
- [ ] C6. Validasi Monarch: centang 2 pemain sebagai Monarch → ditolak (client & server). (D3)
- [ ] C7. Pemenang (rank 1–4) & Monarch → achievement muncul otomatis di profil pemain. (FR10)
- [ ] C8. Approve member `pending` → status jadi `active`; member muncul sebagai peserta yang bisa dipilih di input poin. (D5)
- [ ] C9. Kelola Home: tambah pengumuman/foto, ubah about → tampil di Home. (FR1.2)

## D. NFR terukur
- [ ] D1. Cache: reload Home/Leaderboard dalam 60 detik → tab Network TIDAK memanggil Apps Script lagi untuk data yang sama. (N3.1)
- [ ] D2. Setelah aksi tulis admin, data segar tampil (cache ter-invalidasi). (N3.2)
- [ ] D3. Responsif: viewport 360px → nav jadi hamburger, tidak ada overflow horizontal; 1280px → layout normal. (N7.1)
- [ ] D4. Error handling: matikan koneksi / URL salah → UI menampilkan pesan "coba lagi", tidak crash. (N8.1)
- [ ] D5. Audit repo: tidak ada secret/client secret di kode front-end. (NFR2)

## Catatan
Isi hasil nyata (lolos/temuan) di sini saat eksekusi:
- …
