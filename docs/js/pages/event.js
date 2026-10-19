/** Halaman Event — FR2.1 (daftar) & FR2.2 (pendaftaran). */
window.Pages = window.Pages || {};
window.Pages.event = function () {
  UI.loading();
  return Api.get('events.list').then(function (events) {
    var ongoing = events.filter(function (e) { return e.status === 'ongoing'; });
    var upcoming = events.filter(function (e) { return e.status === 'upcoming'; });

    UI.render(
      '<div class="section-head"><div><span class="section-eyebrow">Event Schedule</span>' +
      '<h1 style="margin:0;">Event</h1></div></div>' +
      '<p class="lead" style="margin:0 0 1rem;color:var(--muted);">Let\'s go shoot together — ikuti turnamen & casual match komunitas.</p>' +
      section('Sedang Berlangsung', ongoing) +
      section('Akan Datang', upcoming) +
      '<div id="eventFormArea"></div>'
    );
    bindRegisterButtons(events);
  });

  function section(title, list) {
    var cards = list.length
      ? '<div class="grid grid-cards">' + list.map(card).join('') + '</div>'
      : '<p class="loading">Tidak ada event.</p>';
    return '<section class="card"><h2>' + UI.esc(title) + '</h2>' + cards + '</section>';
  }

  function card(e) {
    var canRegister = e.registration_open === true || e.registration_open === 'true' || e.registration_open === 'TRUE';
    return '<div class="card">' +
      '<h3>' + UI.esc(e.name) + '</h3>' +
      '<p>' + UI.esc(fmtDate(e.date)) + ' · ' + UI.esc(e.location || '-') + '</p>' +
      '<p><span class="badge">' + UI.esc(e.status) + '</span></p>' +
      (canRegister
        ? '<button class="btn" data-register="' + UI.esc(e.event_id) + '" data-name="' + UI.esc(e.name) + '">Daftar</button>'
        : '<span class="badge">Pendaftaran ditutup</span>') +
      '</div>';
  }

  function bindRegisterButtons() {
    document.querySelectorAll('[data-register]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showForm(btn.getAttribute('data-register'), btn.getAttribute('data-name'));
      });
    });
  }

  function showForm(eventId, eventName) {
    var area = document.getElementById('eventFormArea');
    var user = Auth.getUser();
    area.innerHTML =
      '<section class="card"><h2>Pendaftaran: ' + UI.esc(eventName) + '</h2>' +
      '<form id="regForm">' +
      field('Nama Pemain', 'playerName', user && user.name ? user.name : '') +
      field('Kontak (WA/email)', 'contact', user && user.email ? user.email : '') +
      '<button class="btn" type="submit">Kirim Pendaftaran</button> ' +
      '<button class="btn btn-secondary" type="button" id="regCancel">Batal</button>' +
      '</form></section>';
    area.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('regCancel').addEventListener('click', function () { area.innerHTML = ''; });
    document.getElementById('regForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!Auth.isLoggedIn()) { UI.toast('Silakan login terlebih dahulu.', 'error'); return; }
      var data = UI.formData(ev.target);
      var user2 = Auth.getUser();
      Api.post('event.register', {
        eventId: eventId,
        memberId: user2 && user2.member ? user2.member.memberId : '',
        playerName: data.playerName,
        contact: data.contact
      }).then(function () {
        Cache.clear();
        area.innerHTML = '<div class="msg msg-ok">Pendaftaran berhasil!</div>';
        UI.toast('Pendaftaran berhasil', 'ok');
      }).catch(function (err) { UI.toast('Gagal: ' + err.message, 'error'); });
    });
  }

  function field(label, name, value) {
    return '<div class="form-field"><label>' + UI.esc(label) + '</label>' +
      '<input name="' + name + '" value="' + UI.esc(value || '') + '" required /></div>';
  }
};
