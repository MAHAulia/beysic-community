/** Halaman Home — FR1.1. Gaya komunitas BeySic. */
window.Pages = window.Pages || {};
window.Pages.home = function () {
  UI.loading();
  // Ambil beberapa data untuk preview (home.get wajib; events & leaderboard best-effort).
  return Promise.all([
    Api.get('home.get'),
    Api.get('events.list').catch(function () { return []; }),
    Api.get('leaderboard.get').catch(function () { return []; })
  ]).then(function (res) {
    var data = res[0] || {};
    var events = res[1] || [];
    var leaderboard = res[2] || [];

    var about = data.about || 'Komunitas Beyblade untuk para Blader: tempat berlatih, bertanding, dan bertumbuh bersama.';
    var announcements = (data.announcements || []).slice(0, 4);
    var photos = (data.photos || []);

    UI.render(
      hero() +
      featureStrip() +
      aboutSection(about) +
      twoCol(leaderboardPreview(leaderboard), eventPreview(events)) +
      membershipBanner() +
      announcementsSection(announcements) +
      gallerySection(photos)
    );
  });

  function hero() {
    return '<section class="hero">' +
      '<span class="eyebrow">Beysic Blader Community</span>' +
      '<h1>Where Every Blader is a Champion!</h1>' +
      '<p class="tagline">Let\'s go shoot together — Nonstop Battle!</p>' +
      '<p class="lead">Pusat informasi komunitas, jadwal event, dan leaderboard pemain. ' +
      'Gabung, bertanding, dan ukir prestasimu.</p>' +
      '<div class="cta-row">' +
        '<a class="btn" href="#/membership">Gabung Jadi Member</a>' +
        '<a class="btn btn-ghost" href="#/leaderboard">Lihat Leaderboard</a>' +
      '</div>' +
    '</section>';
  }

  function featureStrip() {
    var items = [
      { ico: '🌀', h: 'Weekly Gathering', p: 'Battle rutin tiap pekan bersama komunitas.' },
      { ico: '🏆', h: 'League Season', p: 'Kumpulkan poin, naik peringkat tiap musim.' },
      { ico: '🐺', h: 'Wolf of Fame', p: 'Penghargaan untuk Blader terbaik (Monarch).' },
      { ico: '📅', h: 'Event Schedule', p: 'Turnamen & casual match terjadwal.' }
    ];
    return '<div class="feature-strip">' + items.map(function (i) {
      return '<div class="feature"><div class="ico">' + i.ico + '</div>' +
        '<h3>' + UI.esc(i.h) + '</h3><p>' + UI.esc(i.p) + '</p></div>';
    }).join('') + '</div>';
  }

  function aboutSection(about) {
    return '<section class="card">' +
      '<div class="section-head"><div><span class="section-eyebrow">About Us</span>' +
      '<h2>Tentang Komunitas</h2></div></div>' +
      '<p>' + UI.esc(about) + '</p></section>';
  }

  function leaderboardPreview(rows) {
    var top = rows.slice(0, 5);
    var body = top.length ? top.map(function (r, i) {
      return '<div class="mini-rank">' +
        '<span class="pos' + (i === 0 ? ' p1' : '') + '">' + (r.rank || i + 1) + '</span>' +
        '<span class="nm">' + UI.esc(r.name) + '</span>' +
        '<span class="pts">' + (Math.round((r.points || 0) * 100) / 100) + '</span></div>';
    }).join('') : '<p class="loading">Belum ada data poin.</p>';
    return '<section class="card">' +
      '<div class="section-head"><div><span class="section-eyebrow">League Season</span>' +
      '<h2>Top Leaderboard</h2></div><a href="#/leaderboard">Lihat semua →</a></div>' +
      body + '</section>';
  }

  function eventPreview(events) {
    var up = events.filter(function (e) { return e.status === 'upcoming' || e.status === 'ongoing'; }).slice(0, 4);
    var body = up.length ? up.map(function (e) {
      var d = new Date(e.date);
      var day = isNaN(d.getTime()) ? '–' : d.getDate();
      var mon = isNaN(d.getTime()) ? '' : d.toLocaleDateString('id-ID', { month: 'short' });
      return '<div class="event-row">' +
        '<div class="date-chip"><div class="d">' + day + '</div><div class="m">' + UI.esc(mon) + '</div></div>' +
        '<div class="ev-name">' + UI.esc(e.name) + '<br><span class="badge">' + UI.esc(e.status) + '</span></div>' +
        '</div>';
    }).join('') : '<p class="loading">Belum ada event terjadwal.</p>';
    return '<section class="card">' +
      '<div class="section-head"><div><span class="section-eyebrow">Event Schedule</span>' +
      '<h2>Jadwal Terdekat</h2></div><a href="#/event">Semua event →</a></div>' +
      body + '</section>';
  }

  function membershipBanner() {
    return '<section class="cta-banner">' +
      '<h2>Join Our Membership!</h2>' +
      '<p>Nikmati semua benefit member dan otomatis masuk Leaderboard.</p>' +
      '<a class="btn" href="#/membership">Daftar Sekarang</a></section>';
  }

  function announcementsSection(announcements) {
    var html = announcements.length ? announcements.map(function (a) {
      return '<li><strong>' + UI.esc(fmtDate(a.published_at)) + '</strong> — ' +
        UI.esc(a.title) + '<br><span class="badge">' + UI.esc(a.body) + '</span></li>';
    }).join('') : '<li>Belum ada pengumuman.</li>';
    return '<section class="card">' +
      '<div class="section-head"><div><span class="section-eyebrow">News</span>' +
      '<h2>Pengumuman Terbaru</h2></div></div><ul>' + html + '</ul></section>';
  }

  function gallerySection(photos) {
    var html = photos.length ? photos.map(function (p) {
      return '<img src="' + UI.esc(p.url) + '" alt="' + UI.esc(p.caption || 'Foto event') + '" loading="lazy" />';
    }).join('') : '<p class="loading">Belum ada foto event.</p>';
    return '<section class="card">' +
      '<div class="section-head"><div><span class="section-eyebrow">Gallery</span>' +
      '<h2>Galeri Foto Event</h2></div></div>' +
      '<div class="grid photo-grid">' + html + '</div></section>';
  }

  function twoCol(a, b) {
    return '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));">' + a + b + '</div>';
  }
};

function fmtDate(v) {
  if (!v) return '';
  var d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}
window.fmtDate = fmtDate;
