/** Halaman Admin — FR9 & FR10. Hanya admin (dicek server-side juga). */
window.Pages = window.Pages || {};
window.Pages.admin = function () {
  if (!Auth.isAdmin()) {
    UI.render('<div class="msg msg-error">Halaman admin hanya untuk admin.</div>');
    return Promise.resolve();
  }
  UI.render(
    '<section class="page-hero">' +
      '<span class="eyebrow">Admin</span>' +
      '<h1><i class="fa-solid fa-gauge-high"></i> <span class="gradient">Admin Panel</span></h1>' +
      '<p class="lead">Kelola konten, event, poin leaderboard, dan member.</p>' +
    '</section>' +
    '<div class="admin-layout">' +
      '<aside class="admin-sidebar">' +
        '<button data-tab="results" class="active"><i class="fa-solid fa-list-ol"></i> Input Poin</button>' +
        '<button data-tab="events"><i class="fa-solid fa-calendar-plus"></i> Kelola Event</button>' +
        '<button data-tab="home"><i class="fa-solid fa-house"></i> Kelola Home</button>' +
        '<button data-tab="members"><i class="fa-solid fa-users"></i> Member</button>' +
      '</aside>' +
      '<div id="adminContent"></div>' +
    '</div>'
  );
  var buttons = document.querySelectorAll('.admin-sidebar button');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      buttons.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      tabs[b.getAttribute('data-tab')]();
    });
  });
  tabs.results();
  return Promise.resolve();
};

var tabs = {};
function adminContent() { return document.getElementById('adminContent'); }

/* ---- Tab: Input Poin (FR9.1/9.2, FR10, D2 topcut dinamis, D3 monarch tunggal) ---- */
tabs.results = function () {
  adminContent().innerHTML = '<div class="loading">Memuat event & member…</div>';
  Promise.all([
    Api.get('events.list', {}, { noCache: true }),
    Api.post('admin.members.list', {})
  ]).then(function (res) {
    var events = res[0], members = res[1].filter(function (m) { return m.status === 'active'; });
    var eventOpts = events.map(function (e) {
      return '<option value="' + UI.esc(e.event_id) + '" data-topcut="' + UI.esc(e.topcut_size) + '">' +
        UI.esc(e.name) + '</option>';
    }).join('');

    adminContent().innerHTML =
      '<section class="card"><h2>Input Poin Leaderboard</h2>' +
      '<div class="form-field"><label>Pilih Event</label><select id="evSel">' + eventOpts + '</select></div>' +
      '<div class="form-field"><label>Total Peserta</label><input type="number" id="totalP" min="1" value="30" /></div>' +
      '<p>Bracket terdeteksi: <span class="badge" id="bracketLabel">—</span> · ' +
      'Topcut event (dinamis): <span class="badge" id="topcutLabel">—</span></p>' +
      '<div class="table-scroll"><table id="resultsTable"><thead><tr>' +
      '<th>Rank</th><th>Member</th><th>Topcut</th><th>Monarch</th><th>Hadir</th>' +
      '</tr></thead><tbody></tbody></table></div>' +
      '<button class="btn btn-secondary" id="addRow">+ Baris</button> ' +
      '<button class="btn" id="submitResults">Hitung &amp; Simpan Poin</button>' +
      '<div id="resultsMsg"></div></section>';

    var memberOpts = members.map(function (m) {
      return '<option value="' + UI.esc(m.member_id) + '">' + UI.esc(m.display_name) + '</option>';
    }).join('');

    function addRow() {
      var tbody = document.querySelector('#resultsTable tbody');
      var tr = document.createElement('tr');
      var rank = tbody.children.length + 1;
      tr.innerHTML =
        '<td><input type="number" class="r-rank" min="1" value="' + rank + '" style="width:70px;" /></td>' +
        '<td><select class="r-member">' + memberOpts + '</select></td>' +
        '<td><input type="checkbox" class="r-topcut" /></td>' +
        '<td><input type="checkbox" class="r-monarch" /></td>' +
        '<td><input type="checkbox" class="r-attended" checked /></td>';
      tbody.appendChild(tr);
    }

    function updateLabels() {
      var total = Number(document.getElementById('totalP').value) || 0;
      document.getElementById('bracketLabel').textContent =
        total <= 30 ? 'Up to 30' : (total <= 59 ? '31–59' : '60–Max');
      var sel = document.getElementById('evSel');
      var opt = sel.options[sel.selectedIndex];
      document.getElementById('topcutLabel').textContent = (opt && opt.getAttribute('data-topcut')) || '—';
    }

    document.getElementById('totalP').addEventListener('input', updateLabels);
    document.getElementById('evSel').addEventListener('change', updateLabels);
    document.getElementById('addRow').addEventListener('click', addRow);
    document.getElementById('submitResults').addEventListener('click', submitResults);
    addRow();
    updateLabels();

    function submitResults() {
      var monarchCount = document.querySelectorAll('.r-monarch:checked').length;
      if (monarchCount > 1) { UI.alert('Monarch hanya boleh satu pemain per event (D3).', 'warning'); return; }
      var rows = Array.prototype.map.call(document.querySelectorAll('#resultsTable tbody tr'), function (tr) {
        return {
          memberId: tr.querySelector('.r-member').value,
          rank: Number(tr.querySelector('.r-rank').value),
          reachedTopcut: tr.querySelector('.r-topcut').checked,
          isMonarch: tr.querySelector('.r-monarch').checked,
          attended: tr.querySelector('.r-attended').checked
        };
      });
      var btn = document.getElementById('submitResults');
      UI.withButton(btn, function () {
        return Api.post('admin.results.submit', {
          eventId: document.getElementById('evSel').value,
          totalParticipants: Number(document.getElementById('totalP').value),
          rows: rows
        });
      }).then(function (res) {
        Cache.clear();
        document.getElementById('resultsMsg').innerHTML =
          '<div class="msg msg-ok">Tersimpan ' + res.count + ' hasil. Poin & achievement ter-update.</div>';
        UI.alert('Poin tersimpan untuk ' + res.count + ' pemain. Leaderboard & achievement ter-update.', 'success');
      }).catch(function () { /* popup error ditangani withButton */ });
    }
  }).catch(function (err) { adminContent().innerHTML = '<div class="msg msg-error">' + UI.esc(err.message) + '</div>'; });
};

/* ---- Tab: Kelola Event (FR2.3, topcut_size dinamis) ---- */
tabs.events = function () {
  adminContent().innerHTML =
    '<section class="card"><h2>Buat / Edit Event</h2><form id="eventForm">' +
    inp('ID Event (kosongkan utk baru)', 'event_id', '') +
    inp('Nama', 'name', '', true) +
    inp('Tanggal (YYYY-MM-DD)', 'date', '') +
    inp('Lokasi', 'location', '') +
    sel('Status', 'status', ['upcoming', 'ongoing', 'finished']) +
    sel('Registrasi Dibuka', 'registration_open', ['true', 'false']) +
    inp('Topcut Size (dinamis per event)', 'topcut_size', '') +
    '<button class="btn" type="submit">Simpan Event</button></form><div id="evMsg"></div></section>';

  document.getElementById('eventForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var data = UI.formData(ev.target);
    var event = {
      name: data.name, date: data.date, location: data.location,
      status: data.status, registration_open: data.registration_open === 'true',
      topcut_size: data.topcut_size
    };
    if (data.event_id) event.event_id = data.event_id;
    var btn = ev.target.querySelector('button[type="submit"]');
    UI.withButton(btn, function () {
      return Api.post('admin.event.save', { event: event });
    }).then(function () {
      Cache.clear();
      document.getElementById('evMsg').innerHTML = '<div class="msg msg-ok">Event tersimpan.</div>';
      UI.alert('Event berhasil disimpan.', 'success');
    }).catch(function () { /* popup error ditangani withButton */ });
  });
};

/* ---- Tab: Kelola Home (FR1.2) ---- */
tabs.home = function () {
  adminContent().innerHTML =
    '<section class="card"><h2>Konten Home</h2><form id="homeForm">' +
    ta('Tentang Komunitas', 'about') +
    '<button class="btn" type="submit">Simpan</button></form></section>' +
    '<section class="card"><h2>Tambah Pengumuman</h2><form id="annForm">' +
    inp('Judul', 'title', '', true) + ta('Isi', 'body') +
    '<button class="btn" type="submit">Tambah</button></form></section>' +
    '<section class="card"><h2>Tambah Foto Event</h2><form id="photoForm">' +
    inp('URL Foto (Drive)', 'url', '', true) + inp('Caption', 'caption', '') +
    '<button class="btn" type="submit">Tambah</button></form></section>' +
    '<div id="homeMsg"></div>';

  bind('homeForm', function (d) { return { about: d.about }; });
  bind('annForm', function (d) { return { announcement: { title: d.title, body: d.body } }; });
  bind('photoForm', function (d) { return { photo: { url: d.url, caption: d.caption } }; });

  function bind(id, mapper) {
    document.getElementById(id).addEventListener('submit', function (ev) {
      ev.preventDefault();
      var form = ev.target;
      var btn = form.querySelector('button[type="submit"]');
      UI.withButton(btn, function () {
        return Api.post('admin.home.update', mapper(UI.formData(form)));
      }).then(function () {
        Cache.clear();
        document.getElementById('homeMsg').innerHTML = '<div class="msg msg-ok">Tersimpan.</div>';
        form.reset();
        UI.alert('Konten berhasil disimpan.', 'success');
      }).catch(function () { /* popup error ditangani withButton */ });
    });
  }
};

/* ---- Tab: Member (D5 approval) ---- */
tabs.members = function () {
  adminContent().innerHTML = '<div class="loading">Memuat member…</div>';
  Api.post('admin.members.list', {}).then(function (members) {
    var body = members.map(function (m) {
      return '<tr><td>' + UI.esc(m.display_name) + '</td><td><span class="badge">' + UI.esc(m.status) + '</span></td>' +
        '<td>' + statusBtns(m) + '</td></tr>';
    }).join('');
    adminContent().innerHTML =
      '<section class="card"><h2>Member</h2><div class="table-scroll"><table>' +
      '<thead><tr><th>Nama</th><th>Status</th><th>Aksi</th></tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<div id="memMsg"></div></section>';
    document.querySelectorAll('[data-set-status]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var newStatus = btn.getAttribute('data-set-status');
        UI.withButton(btn, function () {
          return Api.post('admin.member.setStatus', {
            memberId: btn.getAttribute('data-member'), status: newStatus
          });
        }).then(function () {
          Cache.clear();
          UI.alert('Status member diubah menjadi "' + newStatus + '".', 'success').then(function () { tabs.members(); });
        }).catch(function () { /* popup error ditangani withButton */ });
      });
    });
  }).catch(function (err) { adminContent().innerHTML = '<div class="msg msg-error">' + UI.esc(err.message) + '</div>'; });

  function statusBtns(m) {
    var out = '';
    if (m.status !== 'active') out += '<button class="btn" data-set-status="active" data-member="' + UI.esc(m.member_id) + '">Approve</button> ';
    if (m.status !== 'inactive') out += '<button class="btn btn-ghost" data-set-status="inactive" data-member="' + UI.esc(m.member_id) + '">Nonaktif</button>';
    return out;
  }
};

/* ---- helper input ---- */
function inp(label, name, value, required) {
  return '<div class="form-field"><label>' + UI.esc(label) + '</label>' +
    '<input name="' + name + '" value="' + UI.esc(value || '') + '"' + (required ? ' required' : '') + ' /></div>';
}
function ta(label, name) {
  return '<div class="form-field"><label>' + UI.esc(label) + '</label><textarea name="' + name + '"></textarea></div>';
}
function sel(label, name, options) {
  return '<div class="form-field"><label>' + UI.esc(label) + '</label><select name="' + name + '">' +
    options.map(function (o) { return '<option value="' + o + '">' + o + '</option>'; }).join('') + '</select></div>';
}
