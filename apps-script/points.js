/**
 * Logika perhitungan poin leaderboard — MODUL MURNI (tanpa dependensi Google).
 * Dipakai oleh Code.gs (Apps Script global scope) dan unit test Node.
 *
 * Sumber nilai: leaderboard-point-distribution.md §2 (tabel implementasi).
 * Bracket: A = Up to 30 (<=30), B = 31-59, C = 60-Max (>=60).
 * Nilai diambil dari bagian 60-90 referensi (kolom 60-69 / 70-79 / 80-99).
 */
var POINTS = {
  podium: {
    A: { 1: 7, 2: 6, 3: 5, 4: 4, 5: 2.5, 6: 2, 7: 1.5, 8: 1 },
    B: { 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1.5 },
    C: { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 4, 7: 3, 8: 2 }
  },
  attendance: { A: 0.55, B: 0.65, C: 0.75 },
  topcut: { A: 1, B: 1.25, C: 1.5 },   // Progress to topcut (dibatalkan jika rank 1..4)
  monarch: { A: 1.3, B: 1.4, C: 1.5 }
};

function truthy(v) {
  return v === true || v === 'true' || v === 1 || v === '1' || v === 'TRUE';
}

function bracketOf(total) {
  var t = Number(total) || 0;
  if (t <= 30) return 'A';
  if (t <= 59) return 'B';
  return 'C';
}

/**
 * Hitung poin satu pemain pada satu event.
 * row: { rank, attended, reachedTopcut, isMonarch }
 * total: jumlah peserta event.
 */
function computePoints(row, total) {
  var b = bracketOf(total);
  var rank = Number(row.rank) || 0;
  var p = 0;
  if (rank >= 1 && rank <= 8) p += POINTS.podium[b][rank];
  if (truthy(row.attended)) p += POINTS.attendance[b];
  if (truthy(row.reachedTopcut) && rank > 4) p += POINTS.topcut[b]; // rank 1..4 => 0 (aturan *)
  if (truthy(row.isMonarch)) p += POINTS.monarch[b];
  return Math.round(p * 100) / 100;
}

// Ekspor untuk Node (unit test). Di Apps Script, `module` tidak ada -> dilewati.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { POINTS: POINTS, truthy: truthy, bracketOf: bracketOf, computePoints: computePoints };
}
