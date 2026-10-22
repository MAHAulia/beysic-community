/** Halaman Leaderboard — FR3.1. Kolom Monarch. Tanpa email (NFR6). */
window.Pages = window.Pages || {};
window.Pages.leaderboard = function () {
  UI.loading();
  return Api.get('leaderboard.get').then(function (rows) {
    var header =
      '<section class="page-hero">' +
        '<span class="eyebrow">League Season</span>' +
        '<h1><i class="fa-solid fa-trophy"></i> <span class="gradient">Leaderboard</span></h1>' +
        '<p class="lead">Peringkat Blader berdasarkan akumulasi poin musim ini.</p>' +
        '<div class="pill-row"><span class="season-pill">Season Aktif</span></div>' +
      '</section>';

    if (!rows.length) {
      UI.render(header + '<p class="loading">Belum ada data poin.</p>');
      return;
    }
    var body = rows.map(function (r) {
      return '<tr>' +
        '<td class="rank-cell">' + r.rank + '</td>' +
        '<td>' + photo(r.photoUrl) + UI.esc(r.name) + '</td>' +
        '<td>' + fmtPoints(r.points) + '</td>' +
        '<td>' + r.events + '</td>' +
        '<td>' + r.podiums + '</td>' +
        '<td>' + r.monarchs + '</td>' +
        '</tr>';
    }).join('');

    UI.render(
      header +
      '<section class="card table-scroll"><table>' +
      '<thead><tr><th>Rank</th><th>Blader</th><th>Poin</th><th>Event</th><th>Podium</th><th>Monarch</th></tr></thead>' +
      '<tbody>' + body + '</tbody></table></section>' +
      '<p class="loading">Poin dihitung sesuai distribusi resmi (bracket partisipan Up to 30 / 31–59 / 60–Max).</p>'
    );
  });

  function photo(url) {
    if (!url) return '';
    return '<img src="' + UI.esc(url) + '" alt="" style="width:28px;height:28px;border-radius:50%;vertical-align:middle;margin-right:0.5rem;object-fit:cover;" loading="lazy" />';
  }
  function fmtPoints(p) { return (Math.round(Number(p) * 100) / 100).toString(); }
};
