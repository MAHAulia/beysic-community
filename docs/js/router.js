/**
 * Router hash-based (infrastructure-design: tanpa server rewrite di Pages).
 * Rute terdaftar di window.Pages oleh modul halaman.
 */
window.Router = (function () {
  var routes = {
    '/': function () { return Pages.home(); },
    '/event': function () { return Pages.event(); },
    '/leaderboard': function () { return Pages.leaderboard(); },
    '/membership': function () { return Pages.membership(); },
    '/profile': function () { return Pages.profile(); },
    '/admin': function () { return Pages.admin(); }
  };

  function current() {
    var h = location.hash.replace(/^#/, '') || '/';
    return h.split('?')[0];
  }

  function navigate() {
    var path = current();
    highlightNav(path);

    // Guard rute terproteksi.
    if (path === '/admin' && !Auth.isAdmin()) {
      UI.render('<div class="msg msg-error">Halaman admin hanya untuk admin. Silakan login dengan akun admin.</div>');
      return;
    }
    if (path === '/profile' && !Auth.isLoggedIn()) {
      UI.render('<div class="msg msg-error">Silakan login untuk melihat profil Anda.</div>');
      return;
    }

    var handler = routes[path];
    if (!handler) {
      UI.render('<div class="msg msg-error">Halaman tidak ditemukan.</div>');
      return;
    }
    try {
      var result = handler();
      if (result && typeof result.catch === 'function') result.catch(UI.errorView);
    } catch (err) {
      UI.errorView(err);
    }
  }

  function highlightNav(path) {
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      var target = a.getAttribute('href').replace(/^#/, '');
      a.classList.toggle('active', target === path);
    });
    // tutup menu mobile setelah navigasi
    var nav = document.getElementById('siteNav');
    if (nav) nav.classList.remove('open');
  }

  function start() {
    window.addEventListener('hashchange', navigate);
    navigate();
  }

  return { start: start, navigate: navigate };
})();
