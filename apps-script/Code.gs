/**
 * Beysic — Website Komunitas Beyblade
 * Google Apps Script Web App (API layer + penulis tunggal spreadsheet).
 *
 * Mengacu: functional-design §2 (kontrak API), domain-design §2 (skema),
 * leaderboard-point-distribution (tabel implementasi), nfr-requirements.
 *
 * Deploy: Web App, Execute as = Me, Access = Anyone.
 * Script Properties yang dipakai:
 *   SPREADSHEET_ID   -> id spreadsheet database
 *   GOOGLE_CLIENT_ID -> OAuth Web client id (audience idToken yang diterima)
 */

// ============================================================================
// Konfigurasi & konstanta
// ============================================================================

var SHEETS = {
  MEMBERS: 'Members',
  PROFILES: 'Profiles',
  EVENTS: 'Events',
  REGISTRATIONS: 'Registrations',
  EVENT_RESULTS: 'EventResults',
  ACHIEVEMENTS: 'Achievements',
  ADMIN_WHITELIST: 'AdminWhitelist',
  HOME_CONTENT: 'HomeContent',
  ANNOUNCEMENTS: 'Announcements',
  EVENT_PHOTOS: 'EventPhotos'
};

var HEADERS = {
  Members: ['member_id', 'email', 'display_name', 'status', 'joined_at'],
  Profiles: ['member_id', 'photo_url', 'latest_deck', 'top_blade', 'updated_at'],
  Events: ['event_id', 'name', 'date', 'location', 'status', 'registration_open', 'topcut_size'],
  Registrations: ['registration_id', 'event_id', 'member_id', 'player_name', 'contact', 'created_at'],
  EventResults: ['result_id', 'event_id', 'member_id', 'rank', 'total_participants', 'reached_topcut', 'is_monarch', 'attended', 'points', 'created_at'],
  Achievements: ['achievement_id', 'member_id', 'event_id', 'type', 'label', 'created_at'],
  AdminWhitelist: ['email', 'added_at'],
  HomeContent: ['key', 'value'],
  Announcements: ['announcement_id', 'title', 'body', 'published_at'],
  EventPhotos: ['photo_id', 'event_id', 'url', 'caption']
};

/**
 * Tabel distribusi poin IMPLEMENTASI (leaderboard-point-distribution.md §2).
 * Bracket: A = Up to 30 (<=30), B = 31-59, C = 60-Max (>=60).
 * Nilai diambil dari bagian 60-90 referensi (kolom 60-69 / 70-79 / 80-99).
 */
var POINTS = {
  // podium index 1..8
  podium: {
    A: { 1: 7, 2: 6, 3: 5, 4: 4, 5: 2.5, 6: 2, 7: 1.5, 8: 1 },
    B: { 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1.5 },
    C: { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 4, 7: 3, 8: 2 }
  },
  attendance: { A: 0.55, B: 0.65, C: 0.75 },
  topcut: { A: 1, B: 1.25, C: 1.5 },   // Progress to topcut (dibatalkan jika rank 1..4)
  monarch: { A: 1.3, B: 1.4, C: 1.5 }
};

// ============================================================================
// Entry points
// ============================================================================

function doGet(e) {
  return handleRequest(e, false);
}

function doPost(e) {
  return handleRequest(e, true);
}

function handleRequest(e, isPost) {
  try {
    var params = parseParams(e, isPost);
    var action = params.action;
    if (!action) return jsonOut({ ok: false, error: 'missing_action' });

    var handler = ACTIONS[action];
    if (!handler) return jsonOut({ ok: false, error: 'unknown_action' });

    var result = handler(params);
    return jsonOut({ ok: true, data: result });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function parseParams(e, isPost) {
  var params = {};
  if (e && e.parameter) {
    for (var k in e.parameter) params[k] = e.parameter[k];
  }
  if (isPost && e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      for (var j in body) params[j] = body[j];
    } catch (ignore) { /* body bukan JSON; abaikan */ }
  }
  return params;
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// Akses spreadsheet
// ============================================================================

function ss() {
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('SPREADSHEET_ID belum diset di Script Properties');
  return SpreadsheetApp.openById(id);
}

function sheet(name) {
  var s = ss().getSheetByName(name);
  if (!s) throw new Error('Sheet tidak ditemukan: ' + name);
  return s;
}

/** Baca seluruh baris sebuah sheet sebagai array objek berdasar header. */
function readRows(name) {
  var s = sheet(name);
  var values = s.getDataRange().getValues();
  if (values.length < 2) return [];
  var header = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var c = 0; c < header.length; c++) row[header[c]] = values[i][c];
    row._rowIndex = i + 1; // nomor baris 1-based di sheet
    rows.push(row);
  }
  return rows;
}

/** Tambah satu baris objek sesuai urutan header. */
function appendRow(name, obj) {
  var s = sheet(name);
  var header = HEADERS[name];
  var row = header.map(function (h) { return obj[h] !== undefined ? obj[h] : ''; });
  s.appendRow(row);
}

/** Update baris pada rowIndex dengan objek (hanya kolom yang ada). */
function updateRow(name, rowIndex, obj) {
  var s = sheet(name);
  var header = HEADERS[name];
  var range = s.getRange(rowIndex, 1, 1, header.length);
  var current = range.getValues()[0];
  for (var c = 0; c < header.length; c++) {
    if (obj[header[c]] !== undefined) current[c] = obj[header[c]];
  }
  range.setValues([current]);
}

function nowIso() {
  return new Date().toISOString();
}

function uid(prefix) {
  return (prefix || 'id') + '_' + Utilities.getUuid().replace(/-/g, '').slice(0, 12);
}

// ============================================================================
// Autentikasi & otorisasi
// ============================================================================

/**
 * Verifikasi Google ID token (NFR1.2). Memeriksa signature via tokeninfo,
 * audience == GOOGLE_CLIENT_ID, dan expiry. Mengembalikan { email, name } atau throw.
 */
function verifyIdToken(idToken) {
  if (!idToken) throw new Error('unauthenticated');
  var resp = UrlFetchApp.fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
    { muteHttpExceptions: true }
  );
  if (resp.getResponseCode() !== 200) throw new Error('invalid_token');
  var info = JSON.parse(resp.getContentText());

  var clientId = PropertiesService.getScriptProperties().getProperty('GOOGLE_CLIENT_ID');
  if (clientId && info.aud !== clientId) throw new Error('invalid_audience');
  if (info.exp && (Number(info.exp) * 1000) < Date.now()) throw new Error('token_expired');
  if (!info.email) throw new Error('no_email');

  return { email: String(info.email).toLowerCase(), name: info.name || '' };
}

function isAdmin(email) {
  if (!email) return false;
  var target = String(email).toLowerCase();
  var rows = readRows(SHEETS.ADMIN_WHITELIST);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].email).toLowerCase() === target) return true;
  }
  return false;
}

/** Pastikan pemanggil member valid; kembalikan { email, name }. */
function requireMember(params) {
  return verifyIdToken(params.idToken);
}

/** Pastikan pemanggil admin; kembalikan { email, name } atau throw 'forbidden'. */
function requireAdmin(params) {
  var user = verifyIdToken(params.idToken);
  if (!isAdmin(user.email)) throw new Error('forbidden');
  return user;
}

function findMemberByEmail(email) {
  var target = String(email).toLowerCase();
  var rows = readRows(SHEETS.MEMBERS);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].email).toLowerCase() === target) return rows[i];
  }
  return null;
}

// ============================================================================
// Algoritma poin (functional-design §3, domain-design §4)
// ============================================================================

function bracketOf(total) {
  var t = Number(total) || 0;
  if (t <= 30) return 'A';
  if (t <= 59) return 'B';
  return 'C';
}

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

function truthy(v) {
  return v === true || v === 'true' || v === 1 || v === '1' || v === 'TRUE';
}

// ============================================================================
// Action handlers — Publik
// ============================================================================

function homeGet() {
  var content = {};
  readRows(SHEETS.HOME_CONTENT).forEach(function (r) { content[r.key] = r.value; });
  var announcements = readRows(SHEETS.ANNOUNCEMENTS).sort(function (a, b) {
    return String(b.published_at).localeCompare(String(a.published_at));
  });
  var photos = readRows(SHEETS.EVENT_PHOTOS);
  return { about: content.about || '', content: content, announcements: announcements, photos: photos };
}

function eventsList(params) {
  var rows = readRows(SHEETS.EVENTS);
  if (params.status) rows = rows.filter(function (r) { return r.status === params.status; });
  return rows;
}

function membershipInfo() {
  var content = {};
  readRows(SHEETS.HOME_CONTENT).forEach(function (r) { content[r.key] = r.value; });
  return {
    benefits: (content.membership_benefits || '').split('\n').filter(Boolean),
    howto: content.membership_howto || ''
  };
}

/**
 * Leaderboard: agregasi EventResults per member (D4 = jumlah total).
 * Tidak membocorkan email (NFR6).
 */
function leaderboardGet(params) {
  var results = readRows(SHEETS.EVENT_RESULTS);
  if (params.eventId) results = results.filter(function (r) { return r.event_id === params.eventId; });

  var members = {};
  readRows(SHEETS.MEMBERS).forEach(function (m) { members[m.member_id] = m; });
  var profiles = {};
  readRows(SHEETS.PROFILES).forEach(function (p) { profiles[p.member_id] = p; });

  var agg = {};
  results.forEach(function (r) {
    var id = r.member_id;
    if (!agg[id]) agg[id] = { memberId: id, points: 0, events: 0, podiums: 0, monarchs: 0 };
    agg[id].points += Number(r.points) || 0;
    agg[id].events += 1;
    var rank = Number(r.rank) || 0;
    if (rank >= 1 && rank <= 4) agg[id].podiums += 1;
    if (truthy(r.is_monarch)) agg[id].monarchs += 1;
  });

  var rows = Object.keys(agg).map(function (id) {
    var a = agg[id];
    var m = members[id] || {};
    var pr = profiles[id] || {};
    return {
      memberId: id,
      name: m.display_name || '(unknown)',
      photoUrl: pr.photo_url || '',
      points: Math.round(a.points * 100) / 100,
      events: a.events,
      podiums: a.podiums,
      monarchs: a.monarchs
    };
  });

  rows.sort(function (x, y) { return y.points - x.points; });
  rows.forEach(function (r, i) { r.rank = i + 1; });
  return rows;
}

// ============================================================================
// Action handlers — Member
// ============================================================================

function authLogin(params) {
  var user = verifyIdToken(params.idToken);
  var member = findMemberByEmail(user.email);
  var role = isAdmin(user.email) ? 'admin' : 'member';
  var profile = null;
  if (member) {
    var profiles = readRows(SHEETS.PROFILES).filter(function (p) { return p.member_id === member.member_id; });
    profile = profiles.length ? profiles[0] : null;
  }
  return {
    role: role,
    email: user.email,
    name: user.name,
    member: member ? { memberId: member.member_id, displayName: member.display_name, status: member.status } : null,
    profile: profile
  };
}

function eventRegister(params) {
  requireMember(params);
  if (!params.eventId) throw new Error('missing_eventId');
  var ev = readRows(SHEETS.EVENTS).filter(function (e) { return e.event_id === params.eventId; })[0];
  if (!ev) throw new Error('event_not_found');
  if (!truthy(ev.registration_open)) throw new Error('registration_closed');

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    appendRow(SHEETS.REGISTRATIONS, {
      registration_id: uid('reg'),
      event_id: params.eventId,
      member_id: params.memberId || '',
      player_name: params.playerName || '',
      contact: params.contact || '',
      created_at: nowIso()
    });
  } finally {
    lock.releaseLock();
  }
  return { registered: true };
}

function membershipSignup(params) {
  var user = requireMember(params);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var existing = findMemberByEmail(user.email);
    if (existing) return { memberId: existing.member_id, status: existing.status, existing: true };

    var memberId = uid('mbr');
    appendRow(SHEETS.MEMBERS, {
      member_id: memberId,
      email: user.email,
      display_name: params.displayName || user.name || user.email,
      status: 'pending', // D5: perlu approval admin
      joined_at: nowIso()
    });
    appendRow(SHEETS.PROFILES, {
      member_id: memberId,
      photo_url: params.photoUrl || '',
      latest_deck: params.latestDeck || '',
      top_blade: params.topBlade || '',
      updated_at: nowIso()
    });
    return { memberId: memberId, status: 'pending', existing: false };
  } finally {
    lock.releaseLock();
  }
}

function profileGet(params) {
  var user = requireMember(params);
  var member = findMemberByEmail(user.email);
  if (!member) throw new Error('member_not_found');
  var profile = readRows(SHEETS.PROFILES).filter(function (p) { return p.member_id === member.member_id; })[0] || null;
  var achievements = readRows(SHEETS.ACHIEVEMENTS).filter(function (a) { return a.member_id === member.member_id; });
  return { member: member, profile: profile, achievements: achievements };
}

function profileUpdate(params) {
  var user = requireMember(params);
  var member = findMemberByEmail(user.email); // terikat ke email token (NFR1.3)
  if (!member) throw new Error('member_not_found');

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var rows = readRows(SHEETS.PROFILES).filter(function (p) { return p.member_id === member.member_id; });
    var patch = {
      photo_url: params.photoUrl,
      latest_deck: params.latestDeck,
      top_blade: params.topBlade,
      updated_at: nowIso()
    };
    if (rows.length) {
      updateRow(SHEETS.PROFILES, rows[0]._rowIndex, patch);
    } else {
      appendRow(SHEETS.PROFILES, {
        member_id: member.member_id,
        photo_url: params.photoUrl || '',
        latest_deck: params.latestDeck || '',
        top_blade: params.topBlade || '',
        updated_at: nowIso()
      });
    }
  } finally {
    lock.releaseLock();
  }
  return { updated: true };
}

// ============================================================================
// Action handlers — Admin
// ============================================================================

function adminHomeUpdate(params) {
  requireAdmin(params);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (params.about !== undefined) setHomeContent('about', params.about);
    if (params.membershipBenefits !== undefined) setHomeContent('membership_benefits', params.membershipBenefits);
    if (params.membershipHowto !== undefined) setHomeContent('membership_howto', params.membershipHowto);
    if (params.announcement) {
      appendRow(SHEETS.ANNOUNCEMENTS, {
        announcement_id: uid('ann'),
        title: params.announcement.title || '',
        body: params.announcement.body || '',
        published_at: nowIso()
      });
    }
    if (params.photo) {
      appendRow(SHEETS.EVENT_PHOTOS, {
        photo_id: uid('pho'),
        event_id: params.photo.eventId || '',
        url: params.photo.url || '',
        caption: params.photo.caption || ''
      });
    }
  } finally {
    lock.releaseLock();
  }
  return { updated: true };
}

function setHomeContent(key, value) {
  var rows = readRows(SHEETS.HOME_CONTENT).filter(function (r) { return r.key === key; });
  if (rows.length) updateRow(SHEETS.HOME_CONTENT, rows[0]._rowIndex, { key: key, value: value });
  else appendRow(SHEETS.HOME_CONTENT, { key: key, value: value });
}

function adminEventSave(params) {
  requireAdmin(params);
  var ev = params.event || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (ev.event_id) {
      var rows = readRows(SHEETS.EVENTS).filter(function (r) { return r.event_id === ev.event_id; });
      if (!rows.length) throw new Error('event_not_found');
      updateRow(SHEETS.EVENTS, rows[0]._rowIndex, ev);
      return { eventId: ev.event_id, updated: true };
    }
    var id = uid('evt');
    appendRow(SHEETS.EVENTS, {
      event_id: id,
      name: ev.name || '',
      date: ev.date || '',
      location: ev.location || '',
      status: ev.status || 'upcoming',
      registration_open: ev.registration_open !== undefined ? ev.registration_open : true,
      topcut_size: ev.topcut_size !== undefined ? ev.topcut_size : '' // D2: dinamis, diisi admin
    });
    return { eventId: id, created: true };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Submit hasil event: hitung poin + UPSERT EventResults + UPSERT Achievements.
 * Idempoten by (event_id, member_id) & (member_id, event_id, type). FR9.1/9.2/10.
 */
function adminResultsSubmit(params) {
  requireAdmin(params);
  var eventId = params.eventId;
  var total = Number(params.totalParticipants) || 0;
  var rows = params.rows || [];
  if (!eventId) throw new Error('missing_eventId');
  if (!rows.length) throw new Error('empty_rows');

  // Validasi Monarch tepat satu (D3)
  var monarchCount = rows.filter(function (r) { return truthy(r.isMonarch); }).length;
  if (monarchCount > 1) throw new Error('monarch_must_be_single');

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var existingResults = readRows(SHEETS.EVENT_RESULTS);
    var existingAch = readRows(SHEETS.ACHIEVEMENTS);

    rows.forEach(function (r) {
      var points = computePoints(r, total);
      upsertEventResult(existingResults, {
        event_id: eventId,
        member_id: r.memberId,
        rank: r.rank,
        total_participants: total,
        reached_topcut: truthy(r.reachedTopcut),
        is_monarch: truthy(r.isMonarch),
        attended: truthy(r.attended),
        points: points
      });

      // Achievement otomatis (FR10): podium 1..4 & monarch
      var rank = Number(r.rank) || 0;
      if (rank >= 1 && rank <= 4) {
        upsertAchievement(existingAch, r.memberId, eventId, 'podium' + rank, 'Podium ' + rank);
      }
      if (truthy(r.isMonarch)) {
        upsertAchievement(existingAch, r.memberId, eventId, 'monarch', 'Monarch');
      }
    });
  } finally {
    lock.releaseLock();
  }
  return { submitted: true, count: rows.length };
}

function upsertEventResult(existing, data) {
  var match = existing.filter(function (r) {
    return r.event_id === data.event_id && r.member_id === data.member_id;
  })[0];
  if (match) {
    updateRow(SHEETS.EVENT_RESULTS, match._rowIndex, data);
  } else {
    data.result_id = uid('res');
    data.created_at = nowIso();
    appendRow(SHEETS.EVENT_RESULTS, data);
    // tambahkan ke cache lokal agar duplikasi dalam batch yang sama tetap idempoten
    data._rowIndex = -1;
    existing.push(data);
  }
}

function upsertAchievement(existing, memberId, eventId, type, label) {
  var match = existing.filter(function (a) {
    return a.member_id === memberId && a.event_id === eventId && a.type === type;
  })[0];
  if (match) return; // sudah ada -> idempoten
  var row = {
    achievement_id: uid('ach'),
    member_id: memberId,
    event_id: eventId,
    type: type,
    label: label,
    created_at: nowIso()
  };
  appendRow(SHEETS.ACHIEVEMENTS, row);
  existing.push(row);
}

function adminMemberSetStatus(params) {
  requireAdmin(params);
  if (!params.memberId || !params.status) throw new Error('missing_params');
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var rows = readRows(SHEETS.MEMBERS).filter(function (m) { return m.member_id === params.memberId; });
    if (!rows.length) throw new Error('member_not_found');
    updateRow(SHEETS.MEMBERS, rows[0]._rowIndex, { status: params.status });
  } finally {
    lock.releaseLock();
  }
  return { updated: true };
}

function adminMembersList(params) {
  requireAdmin(params);
  return readRows(SHEETS.MEMBERS);
}

function adminRegistrationsList(params) {
  requireAdmin(params);
  var rows = readRows(SHEETS.REGISTRATIONS);
  if (params.eventId) rows = rows.filter(function (r) { return r.event_id === params.eventId; });
  return rows;
}

// ============================================================================
// Dispatch table
// ============================================================================

var ACTIONS = {
  // publik
  'home.get': homeGet,
  'events.list': eventsList,
  'leaderboard.get': leaderboardGet,
  'membership.info': membershipInfo,
  // member
  'auth.login': authLogin,
  'event.register': eventRegister,
  'membership.signup': membershipSignup,
  'profile.get': profileGet,
  'profile.update': profileUpdate,
  // admin
  'admin.home.update': adminHomeUpdate,
  'admin.event.save': adminEventSave,
  'admin.results.submit': adminResultsSubmit,
  'admin.member.setStatus': adminMemberSetStatus,
  'admin.members.list': adminMembersList,
  'admin.registrations.list': adminRegistrationsList
};

// ============================================================================
// Setup util (jalankan sekali manual dari editor Apps Script)
// ============================================================================

/** Membuat semua sheet + header bila belum ada. Jalankan manual sekali. */
function setupSheets() {
  var spreadsheet = ss();
  Object.keys(HEADERS).forEach(function (name) {
    var s = spreadsheet.getSheetByName(name);
    if (!s) s = spreadsheet.insertSheet(name);
    var header = HEADERS[name];
    s.getRange(1, 1, 1, header.length).setValues([header]);
    s.setFrozenRows(1);
  });
}
