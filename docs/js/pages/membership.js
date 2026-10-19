/** Halaman Membership — FR4.1 (info) & FR4.2 (signup, D5 perlu approval admin). */
window.Pages = window.Pages || {};
window.Pages.membership = function () {
  UI.loading();
  return Api.get('membership.info').then(function (info) {
    var benefits = (info.benefits && info.benefits.length)
      ? info.benefits
      : ['Tercatat di leaderboard', 'Punya profil & achievement', 'Ikut event resmi komunitas'];

    UI.render(
      '<section class="page-hero">' +
        '<span class="eyebrow">Membership</span>' +
        '<h1><i class="fa-solid fa-id-card"></i> Jadi Member BeySic</h1>' +
        '<p class="lead">Daftar, tercatat di leaderboard, dan nikmati benefit komunitas.</p>' +
      '</section>' +
      '<section class="cta-banner">' +
        '<h2>Join Our Membership!</h2>' +
        '<p>Jadilah bagian dari komunitas Blader — otomatis masuk Leaderboard & punya profil resmi.</p>' +
      '</section>' +
      '<section class="card">' +
        '<div class="section-head"><div><span class="section-eyebrow">Benefits</span>' +
        '<h2>Kenapa Jadi Member?</h2></div></div>' +
        '<ul class="benefits">' +
        benefits.map(function (b) { return '<li>' + UI.esc(b) + '</li>'; }).join('') +
        '</ul></section>' +
      '<section class="card">' +
        '<div class="section-head"><div><span class="section-eyebrow">Daftar</span>' +
        '<h2>Cara Bergabung</h2></div></div>' +
        '<p>' + UI.esc(info.howto || 'Login dengan Google lalu isi formulir di bawah. Pendaftaran akan ditinjau admin.') + '</p>' +
        '<div id="signupArea"></div>' +
      '</section>'
    );
    renderSignup();
  });

  function renderSignup() {
    var area = document.getElementById('signupArea');
    if (!Auth.isLoggedIn()) {
      area.innerHTML = '<div class="msg msg-error">Silakan login dengan Google (tombol di kanan atas) untuk mendaftar sebagai member.</div>';
      return;
    }
    var user = Auth.getUser();
    if (user.member) {
      area.innerHTML = '<div class="msg msg-ok">Anda sudah terdaftar sebagai member (status: ' + UI.esc(user.member.status) + ').</div>';
      return;
    }
    area.innerHTML =
      '<form id="signupForm">' +
      f('Nama Tampil', 'displayName', user.name || '') +
      f('Foto (URL Drive)', 'photoUrl', '') +
      f('Latest Deck', 'latestDeck', '') +
      f('Top Blade', 'topBlade', '') +
      '<button class="btn" type="submit">Kirim Pendaftaran</button>' +
      '</form>';

    document.getElementById('signupForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var data = UI.formData(ev.target);
      Api.post('membership.signup', data).then(function (res) {
        Cache.clear();
        area.innerHTML = '<div class="msg msg-ok">Pendaftaran terkirim (status: ' + UI.esc(res.status) +
          '). Menunggu persetujuan admin.</div>';
      }).catch(function (err) { UI.toast('Gagal: ' + err.message, 'error'); });
    });
  }

  function f(label, name, value) {
    return '<div class="form-field"><label>' + UI.esc(label) + '</label>' +
      '<input name="' + name + '" value="' + UI.esc(value || '') + '"' + (name === 'displayName' ? ' required' : '') + ' /></div>';
  }
};
