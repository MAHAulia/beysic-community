# Project-Level Rules

> Project-specific specialisation and corrections. Loaded after `org.md` and
> `team.md` as strict-additive guidance; contradictions with broader policy
> are rejected. Populated by practices-discovery and the self-learning loop.
>
> Use sparingly: most teams don't need a project layer. Reach for it
> only when this specific project needs stable, durable guidance beyond the
> team practice (for example, package-specific release checks or an additional
> regression suite for a legacy component).

## Way of Working

<!-- Project-specific specialisation. Example: -->
<!-- This monorepo requires package-scoped branch names and a package owner -->
<!-- review in addition to the team's normal merge policy. -->

## Walking Skeleton

<!-- Project-specific specialisation. Example: -->
<!-- The walking skeleton must exercise the legacy service adapter as well -->
<!-- as the new service boundary. -->

## Testing Posture

- Test Strategy: Standard, fokus pada **end-to-end (e2e)** untuk alur utama: login Google, pendaftaran event, input poin leaderboard oleh admin, pencatatan achievement otomatis. (affirmed 2026-10-19)
- Logika perhitungan poin leaderboard tetap diverifikasi (kritis & rawan error) sebagai bagian cakupan e2e / verifikasi perhitungan. (affirmed 2026-10-19)

## Guard Policy

<!-- Project-specific. Mode: strict, relaxed, or off. Strict here holds for every intent, whatever one person asks in chat; relaxed or off here applies to every intent whose policy came from its scope, unless the person sets another; changing this line changes it. A section under the retired Change Control heading, written by an earlier release, is still read. -->

## Deployment

<!-- Project-specific specialisation. -->

## Code Style

<!-- Project-specific specialisation. -->

## Tech Stack

Dikunci (affirmed 2026-10-19):
- Front-end: **Vanilla JavaScript** + HTML + CSS (tanpa framework), di-build/di-serve statis.
- Hosting: **GitHub Pages**.
- Backend/API: **Google Apps Script Web App** (jembatan ke Sheets + login Google).
- Datastore: **Google Spreadsheet**.
- Auth: **Google (OAuth/Identity)** via Apps Script.

## Decided

<!-- Decisions made in earlier stages that should not be re-asked. -->
<!-- Format: DECIDED: [decision] (Stage [slug], [date]) -->
- DECIDED: Front-end memakai vanilla JS (tanpa framework) (Stage practices-discovery, 2026-10-19)
- DECIDED: Testing fokus end-to-end (e2e) untuk alur utama (Stage practices-discovery, 2026-10-19)
- DECIDED: GitHub Pages + Apps Script + Google Spreadsheet sebagai arsitektur dasar (Stage practices-discovery, 2026-10-19)
- DECIDED: Bracket partisipan leaderboard = Up to 30 / 31–59 / 60–Max, nilai poin dari bagian 60–90 referensi (Stage domain-design, 2026-10-19)
- DECIDED: topcut_size dinamis per event, diisi admin, tanpa default tetap (Stage domain-design, 2026-10-19)
- DECIDED: Monarch tepat satu pemain per event (Stage domain-design, 2026-10-19)
- DECIDED: Poin leaderboard = jumlah total seluruh EventResult member (Stage domain-design, 2026-10-19)
- DECIDED: Signup member baru perlu approval admin (pending → active) (Stage domain-design, 2026-10-19)

## Scope Overrides

<!-- Custom scope rules for this project. -->

## Forbidden

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: NEVER [behavior] (affirmed [date]) -->
- NEVER mempercayai input/klaim front-end untuk otorisasi — validasi admin & kepemilikan data wajib di Apps Script (affirmed 2026-10-19)
- NEVER menyimpan secret/kredensial (OAuth client secret, token) di repo publik atau kode front-end (affirmed 2026-10-19)
- NEVER menulis ke Spreadsheet dari banyak jalur — Apps Script adalah penulis tunggal (affirmed 2026-10-19)
- NEVER menampilkan email/data pribadi member ke publik tanpa izin (affirmed 2026-10-19)

## Mandated

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: ALWAYS [behavior] (affirmed [date]) -->
- ALWAYS validasi whitelist email admin di server-side (Apps Script) sebelum operasi admin (affirmed 2026-10-19)
- ALWAYS buat operasi tulis poin & achievement idempoten (hindari double-count saat retry) (affirmed 2026-10-19)
- ALWAYS cache data read di sisi klien untuk menghemat kuota Apps Script/Sheets (affirmed 2026-10-19)
- ALWAYS simpan foto sebagai URL (Drive) di spreadsheet, bukan biner di repo (affirmed 2026-10-19)

## Corrections

<!-- Project-specific corrections from human feedback. -->
<!-- Format: NEVER/ALWAYS [behavior] (learned [date]) -->
