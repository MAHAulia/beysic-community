/** Halaman Home — FR1.1. */
window.Pages = window.Pages || {};
window.Pages.home = function () {
  UI.loading();
  return Api.get('home.get').then(function (data) {
    var about = data.about || 'Selamat datang di komunitas Beyblade.';
    var announcements = (data.announcements || []).slice(0, 5);
    var photos = data.photos || [];

    var annHtml = announcements.length
      ? announcements.map(function (a) {
          return '<li><strong>' + UI.esc(fmtDate(a.published_at)) + '</strong> — ' +
            UI.esc(a.title) + '<br><span class="badge">' + UI.esc(a.body) + '</span></li>';
        }).join('')
      : '<li>Belum ada pengumuman.</li>';

    var photoHtml = photos.length
      ? photos.map(function (p) {
          return '<img src="' + UI.esc(p.url) + '" alt="' + UI.esc(p.caption || 'Foto event') + '" loading="lazy" />';
        }).join('')
      : '<p class="loading">Belum ada foto event.</p>';

    UI.render(
      '<section class="hero">' +
        '<h1>Beysic — Komunitas Beyblade</h1>' +
        '<p>' + UI.esc(about) + '</p>' +
        '<a class="btn" href="#/membership">Gabung Jadi Member</a>' +
      '</section>' +
      '<section class="card"><h2>Pengumuman Terbaru</h2><ul>' + annHtml + '</ul></section>' +
      '<section class="card"><h2>Galeri Foto Event</h2><div class="grid photo-grid">' + photoHtml + '</div></section>'
    );
  });
};

function fmtDate(v) {
  if (!v) return '';
  var d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}
window.fmtDate = fmtDate;
