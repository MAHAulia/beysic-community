# Frontend Components — UI Re-skin

Komponen presentasi yang diselaraskan. Perilaku/props/handler TIDAK berubah; yang berubah adalah kelas CSS, markup presentasional, dan token warna/tipografi. File JS tetap script klasik non-module.

## Hierarki Komponen (shell)

```
index.html (shell)
├── loader (splash)                 → components.css .loader* (aksen cyan + grid)
├── header.site-header              → header.css
│   ├── brand (logo <img> dari docs/assets/)   → menggantikan emoji 🐺
│   ├── nav-toggle (mobile)         → gaya .btn-ghost
│   ├── site-nav (link + role)      → state Default/Hover/Active token baru
│   └── auth-area (login/akun)      → auth.js (markup saja)
├── main#app (konten per rute)      → diisi modul pages/*
└── footer.site-footer              → footer.css (tagline cyan, kredit/atribusi)
```

## Komponen Bersama (lintas halaman)

| Komponen | Kelas target | Catatan |
|---|---|---|
| Section wrapper | `.section`, `.section-head`, `.section-alt` | layout.css |
| Heading hero | `.gradient` pada H1/H2 | wajib tiap halaman (BR1.4) |
| Label section | `.eyebrow` | cyan, uppercase (BR1.4) |
| Tombol | `.btn`, `.btn-primary`, `.btn-ghost`, `.full` | buttons.css |
| Kartu | `.card`, `.iconbox` | components.css |
| Tag/badge | `.tag` | cyan (ganti kuning) |
| Catatan kecil | `.muted-note` | components.css |
| Popup alert | `.alert-overlay`, `.alert-box` | diselaraskan ke palet |

## Per Halaman

- **Home** (`home.js`): hero `.gradient` + `.eyebrow`; kartu info komunitas/event `.card` + `.iconbox`; CTA `.btn-primary`.
- **Event** (`event.js`): daftar event sebagai `.card`; status pakai `.tag`; form pendaftaran (input panel, fokus cyan); tombol submit `.btn-primary`.
- **Leaderboard** (`leaderboard.js`): `.leader-controls` untuk pencarian; tabel peringkat gaya panel; highlight podium/Monarch pakai aksen cyan (bukan kuning).
- **Membership** (`membership.js`): kartu paket `.card`; CTA signup `.btn-primary`; form signup selaras.
- **Profile** (`profile.js`): kartu profil `.card` (foto, deck, top blade, achievement sebagai `.tag`); form edit selaras.
- **Admin** (`admin.js`): panel kelola + form input poin/approval; tabel & tombol bergaya baru; aksi destruktif/penting pakai `.btn-primary`/`.btn-ghost`.

## Props / State
Tidak ada perubahan props/state (vanilla JS, render string template). Satu-satunya "state" yang disentuh adalah state VISUAL (Default/Hover/Active link, Loading/Ready loader) — lihat `functional-spec.md §5–6`.

## Integrasi API
Tidak berubah. `api.js`/`auth.js`/`cache.js` tetap. Markup hasil render boleh diberi kelas baru selama selector uji e2e yang menguji perilaku tetap valid (atau diperbarui agar menguji perilaku yang sama — BR1.6/NFR1.2).

## Validasi Form
Aturan validasi form tidak berubah (dibekukan). Hanya tampilan state error/sukses yang diselaraskan ke palet (teks error pakai warna danger yang kontras, bukan logika baru).
