/**
 * Bootstrap aplikasi: inisialisasi auth, nav mobile, dan router.
 */
(function () {
  function applyRoleVisibility(user) {
    var isAdmin = !!(user && user.role === 'admin');
    var isMember = !!user;
    document.querySelectorAll('[data-role="admin"]').forEach(function (el) {
      el.classList.toggle('hidden', !isAdmin);
    });
    document.querySelectorAll('[data-role="member"]').forEach(function (el) {
      el.classList.toggle('hidden', !isMember);
    });
    // Jika sedang di rute terproteksi dan status berubah, render ulang.
    if (['#/admin', '#/profile'].indexOf(location.hash) >= 0) Router.navigate();
  }

  function initNavToggle() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    Auth.onChange(applyRoleVisibility);
    Auth.init(document.getElementById('authArea'));
    Router.start();
  });
})();
