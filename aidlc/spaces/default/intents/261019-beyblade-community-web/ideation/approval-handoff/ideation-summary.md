# Approval Handoff — Ringkasan Fase Ideation

> Fase: Ideation · Stage: Approval Handoff (gate persetujuan)
> Scope `classic` · Plan Approval: ON. Fase Ideation menunggu persetujuan Anda sebelum lanjut ke fase Inception.

## 1. Apa yang Dibangun

Website komunitas Beyblade (statis, GitHub Pages) sebagai pusat informasi komunitas, pendaftaran event, dan leaderboard pemain. Data di Google Spreadsheet, dijembatani Google Apps Script Web App untuk login Google dan baca/tulis data.

## 2. Artefak Ideation (untuk ditinjau)

| Stage | Artefak | Isi |
|---|---|---|
| intent-capture | `intent-capture/intent-statement.md` | Problem, target user, success metrics, trigger, scope signal, referensi poin leaderboard |
| intent-capture | `intent-capture/stakeholder-map.md` | Stakeholder, decision-maker, kebutuhan komunikasi |
| intent-capture | `intent-capture/intent-capture-questions.md` | Q1–Q10 + konfirmasi accept assumptions |
| intent-capture | `intent-capture/leaderboard-point-distribution.md` | Tabel poin asli + tabel implementasi (remap bracket) |
| feasibility | `feasibility/feasibility-assessment.md` | Kelayakan teknis/operasional/biaya + risiko & mitigasi |
| scope-definition | `scope-definition/scope-definition.md` | Lingkup rilis pertama dikunci (in/out scope) |

## 3. Keputusan Kunci yang Dikonfirmasi

- **Target**: publik umum + member + admin/pengurus. [Q2]
- **Pendekatan teknis**: GitHub Pages statis + Google Apps Script Web App + Google Spreadsheet. [Q9]
- **Admin**: whitelist email di spreadsheet, divalidasi server-side. [Q10]
- **Poin leaderboard**: mengikuti papan distribusi poin BeySic (asal label foto "BEYJAXEL"); remap bracket partisipan mulai "Up to 30" dengan nilai bagian 60–90 referensi.
- **Rilis pertama**: 10 fitur inti REQUIREMENT.MD masuk; 4 item ditunda (pembayaran online, mobile native, notifikasi email/WA, chat/forum). [Q8]

## 4. Risiko Utama yang Dibawa ke Inception

- Keamanan endpoint Apps Script (validasi server-side wajib).
- Kuota Google (Apps Script/Sheets) → butuh caching & hemat tulis.
- Sheets non-transaksional → Apps Script penulis tunggal, operasi idempoten (khusus input poin & achievement).

## 5. Open Questions untuk Inception

- Batas atas pasti tiap bracket partisipan leaderboard; definisi topcut; jumlah penerima Monarch per event.
- Skema spreadsheet detail (domain-design).
- Konfigurasi OAuth/Identity untuk situs statis (infrastructure-design).

## 6. Keputusan Gate

- [x] **Approve** — lanjut ke fase Inception (stage pertama: practices-discovery).
- [ ] **Request changes** — sebutkan artefak/keputusan yang perlu direvisi.

[Keputusan Anda]: APPROVED — 2026-10-19. Fase Ideation disetujui pengguna. Lanjut ke fase Inception / practices-discovery.
