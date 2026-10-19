/**
 * Unit test algoritma poin leaderboard (build-and-test).
 * Memverifikasi computePoints/bracketOf terhadap tabel implementasi di
 * leaderboard-point-distribution.md §2. Mengikat ke FR3.2.
 *
 * Jalankan: npm test  (atau: node --test)
 */
const test = require('node:test');
const assert = require('node:assert');
const { bracketOf, computePoints, POINTS } = require('../apps-script/points.js');

// Nilai referensi (tabel implementasi — bagian 60-90 referensi).
// Kolom: A = Up to 30, B = 31-59, C = 60-Max.
const REF = {
  podium: {
    A: { 1: 7, 2: 6, 3: 5, 4: 4, 5: 2.5, 6: 2, 7: 1.5, 8: 1 },
    B: { 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1.5 },
    C: { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 4, 7: 3, 8: 2 }
  },
  attendance: { A: 0.55, B: 0.65, C: 0.75 },
  topcut: { A: 1, B: 1.25, C: 1.5 },
  monarch: { A: 1.3, B: 1.4, C: 1.5 }
};

test('bracketOf memetakan total peserta ke bracket yang benar', () => {
  assert.equal(bracketOf(1), 'A');
  assert.equal(bracketOf(30), 'A');   // batas atas A
  assert.equal(bracketOf(31), 'B');   // batas bawah B
  assert.equal(bracketOf(59), 'B');   // batas atas B
  assert.equal(bracketOf(60), 'C');   // batas bawah C
  assert.equal(bracketOf(500), 'C');
  assert.equal(bracketOf(0), 'A');    // fallback aman
});

test('tabel POINTS cocok persis dengan referensi', () => {
  assert.deepEqual(POINTS, REF);
});

test('poin podium murni (hadir=false) sesuai tabel tiap bracket', () => {
  const totals = { A: 20, B: 45, C: 80 };
  Object.keys(totals).forEach((b) => {
    for (let rank = 1; rank <= 8; rank++) {
      const p = computePoints({ rank, attended: false, reachedTopcut: false, isMonarch: false }, totals[b]);
      assert.equal(p, REF.podium[b][rank], `podium rank ${rank} bracket ${b}`);
    }
  });
});

test('rank > 8 tidak mendapat poin podium', () => {
  assert.equal(computePoints({ rank: 9, attended: false }, 20), 0);
  assert.equal(computePoints({ rank: 50, attended: false }, 80), 0);
});

test('attendance ditambahkan saat hadir', () => {
  // rank 10 (tanpa podium) + hadir => hanya attendance
  assert.equal(computePoints({ rank: 10, attended: true }, 20), REF.attendance.A);
  assert.equal(computePoints({ rank: 10, attended: true }, 45), REF.attendance.B);
  assert.equal(computePoints({ rank: 10, attended: true }, 80), REF.attendance.C);
});

test('progress to topcut DIBATALKAN untuk rank 1-4 (aturan bintang)', () => {
  // rank 3, topcut true: tidak ada tambahan topcut
  const withTopcut = computePoints({ rank: 3, attended: false, reachedTopcut: true }, 20);
  const noTopcut = computePoints({ rank: 3, attended: false, reachedTopcut: false }, 20);
  assert.equal(withTopcut, noTopcut, 'rank 1-4 tidak dapat bonus topcut');
  assert.equal(withTopcut, REF.podium.A[3]);
});

test('progress to topcut ditambahkan untuk rank > 4', () => {
  // rank 5, topcut true: podium5 + topcut
  const p = computePoints({ rank: 5, attended: false, reachedTopcut: true }, 20);
  assert.equal(p, REF.podium.A[5] + REF.topcut.A);
});

test('monarch ditambahkan di semua bracket', () => {
  // rank 10 (tanpa podium), tidak hadir, monarch => hanya monarch
  assert.equal(computePoints({ rank: 10, isMonarch: true }, 20), REF.monarch.A);
  assert.equal(computePoints({ rank: 10, isMonarch: true }, 45), REF.monarch.B);
  assert.equal(computePoints({ rank: 10, isMonarch: true }, 80), REF.monarch.C);
});

test('skenario gabungan: juara 1 bracket C, hadir, monarch', () => {
  // rank 1: podium 9 + attendance 0.75 + monarch 1.5 (topcut dibatalkan krn rank<=4)
  const p = computePoints({ rank: 1, attended: true, reachedTopcut: true, isMonarch: true }, 80);
  assert.equal(p, REF.podium.C[1] + REF.attendance.C + REF.monarch.C);
  assert.equal(p, 9 + 0.75 + 1.5);
});

test('skenario gabungan: rank 6 bracket B, hadir, lolos topcut', () => {
  // podium6 (3) + attendance (0.65) + topcut (1.25) = 4.9
  const p = computePoints({ rank: 6, attended: true, reachedTopcut: true, isMonarch: false }, 45);
  assert.equal(p, REF.podium.B[6] + REF.attendance.B + REF.topcut.B);
  assert.equal(p, 4.9);
});

test('menerima nilai boolean string/number (truthy fleksibel)', () => {
  const a = computePoints({ rank: 1, attended: 'true', isMonarch: 'TRUE' }, 20);
  const b = computePoints({ rank: 1, attended: true, isMonarch: true }, 20);
  assert.equal(a, b);
});

test('pembulatan 2 desimal tetap akurat', () => {
  // rank 5 bracket A (2.5) + attendance A (0.55) = 3.05
  const p = computePoints({ rank: 5, attended: true }, 20);
  assert.equal(p, 3.05);
});
