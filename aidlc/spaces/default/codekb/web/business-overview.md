# Business Overview

## Domain
Website komunitas **Beyblade** ("Beysic"): pusat informasi komunitas, pendaftaran event/turnamen, dan leaderboard pemain. Pengguna adalah anggota komunitas (blader) dan admin pengelola.

## Purpose
Menyediakan satu tempat publik untuk mengenal komunitas, mendaftar event, melihat peringkat pemain, serta bergabung sebagai member. Admin mengelola konten home, event, input poin dari hasil turnamen, dan approval pendaftaran member baru. Semua data tersimpan di Google Spreadsheet.

## Key Functionality
- **Home** — informasi komunitas & event (konten dikelola admin).
- **Event** — daftar event upcoming/ongoing + form pendaftaran.
- **Leaderboard** — peringkat pemain berdasarkan total poin EventResult.
- **Membership** — info keanggotaan + signup (pending → active lewat approval admin).
- **Login Google** — autentikasi member via Google Identity Services.
- **Profil member** — foto, deck terbaru, top blade, achievement.
- **Admin panel** — kelola home, event, input poin leaderboard dari hasil turnamen, approval member.
- **Achievement otomatis** — pemenang turnamen tercatat achievement ke profil.

## Actors
- **Pengunjung publik** — baca home, event, leaderboard (tanpa data pribadi), membership.
- **Member** — login Google, daftar event, lihat/edit profil.
- **Admin** — semua kemampuan member + pengelolaan konten dan poin (whitelist email server-side).

## Intent Context (this run)
Intent aktif `261022-ui-restyle` adalah **improvement UI**: menyelaraskan tampilan front-end `docs/` dengan design-token referensi di `template/`. Fungsi bisnis di atas tidak berubah; hanya lapisan visual.
