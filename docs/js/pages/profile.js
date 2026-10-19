/** Halaman Profil Member — FR6.1 (tampil) & FR6.2 (edit). */
window.Pages = window.Pages || {};
window.Pages.profile = function () {
  if (!Auth.isLoggedIn()) {
    UI.render('<div class="msg msg-error">Silakan login untuk melihat profil.</div>');
    return Promise.resolve();
  }
  UI.loading();
  return Api.post('profile.get', {}).then(function (data) {
    var m = data.member || {};
    var p = data.profile || {};
    var achievements = data.achievements || [];

    var achHtml = achievements.length
      ? achievements.map(function (a) {
          return '<div class="achievement">🏆 <span>' + UI.esc(a.label || a.type) +
            '</span> <span class="badge">' + UI.esc(fmtDate(a.created_at)) + '</span></div>';
        }).join('')
      : '<p class="loading">Belum ada achievement.</p>';

    UI.render(
      '<section class="page-hero">' +
        '<span class="eyebrow">Blader Profile</span>' +
        '<h1><i class="fa-solid fa-user-ninja"></i> Profil Saya</h1>' +
      '</section>' +
      '<section class="card">' +
        '<div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">' +
          (p.photo_url ? '<img src="' + UI.esc(p.photo_url) + '" alt="Foto profil" style="width:84px;height:84px;border-radius:50%;object-fit:cover;border:2px solid var(--accent-2);" />' : '<div style="width:84px;height:84px;border-radius:50%;background:var(--surface-2);display:grid;place-items:center;font-size:2rem;">🐺</div>') +
          '<div><h2 style="margin:0;">' + UI.esc(m.display_name || '') + '</h2>' +
          '<span class="badge">status: ' + UI.esc(m.status || '-') + '</span></div>' +
        '</div>' +
        '<p><strong>Latest Deck:</strong> ' + UI.esc(p.latest_deck || '-') + '</p>' +
        '<p><strong>Top Blade:</strong> ' + UI.esc(p.top_blade || '-') + '</p>' +
        '<button class="btn btn-secondary" id="editProfileBtn">Edit Profil</button>' +
      '</section>' +
      '<section class="card">' +
        '<div class="section-head"><div><span class="section-eyebrow">Wolf of Fame</span>' +
        '<h2>Achievements</h2></div></div>' + achHtml + '</section>' +
      '<div id="editArea"></div>'
    );

    document.getElementById('editProfileBtn').addEventListener('click', function () { renderEdit(p); });
  });

  function renderEdit(p) {
    var area = document.getElementById('editArea');
    area.innerHTML =
      '<section class="card"><h2>Edit Profil</h2><form id="editForm">' +
      f('Foto (URL Drive)', 'photoUrl', p.photo_url || '') +
      f('Latest Deck', 'latestDeck', p.latest_deck || '') +
      f('Top Blade', 'topBlade', p.top_blade || '') +
      '<button class="btn" type="submit">Simpan</button></form></section>';
    area.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('editForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var data = UI.formData(ev.target);
      var submitBtn = ev.target.querySelector('button[type="submit"]');
      UI.withButton(submitBtn, function () {
        return Api.post('profile.update', data);
      }).then(function () {
        Cache.clear();
        UI.alert('Profil berhasil disimpan.', 'success').then(function () { Router.navigate(); });
      }).catch(function () { /* popup error ditangani withButton */ });
    });
  }

  function f(label, name, value) {
    return '<div class="form-field"><label>' + UI.esc(label) + '</label>' +
      '<input name="' + name + '" value="' + UI.esc(value || '') + '" /></div>';
  }
};
