// @ts-check
/**
 * Mock untuk Apps Script Web App.
 * Me-rute semua request ke GAS_WEBAPP_URL (config.js) dan membalas data palsu
 * yang deterministik, sehingga e2e UI/alur tidak bergantung Google.
 *
 * Verifikasi otorisasi server-side (NFR1) TIDAK dapat diuji di mode mock —
 * untuk itu gunakan e2e-manual-checklist.md terhadap deployment nyata.
 */

const MOCK_URL_SUBSTR = 'script.google.com/macros';

// Data contoh.
const DATA = {
  home: {
    about: 'Komunitas Beyblade terbesar se-nusantara.',
    announcements: [
      { announcement_id: 'ann_1', title: 'Turnamen Bulanan', body: 'Daftar sekarang!', published_at: '2026-10-10T00:00:00Z' }
    ],
    photos: [{ photo_id: 'pho_1', url: 'https://example.com/a.jpg', caption: 'Final match' }]
  },
  events: [
    { event_id: 'evt_1', name: 'Beyblade Cup', date: '2026-11-01', location: 'Jakarta', status: 'upcoming', registration_open: true, topcut_size: 8 },
    { event_id: 'evt_2', name: 'Clash Ongoing', date: '2026-10-18', location: 'Bandung', status: 'ongoing', registration_open: false, topcut_size: 4 }
  ],
  leaderboard: [
    { memberId: 'mbr_1', name: 'Andi', photoUrl: '', points: 42.5, events: 6, podiums: 3, monarchs: 2, rank: 1 },
    { memberId: 'mbr_2', name: 'Budi', photoUrl: '', points: 30, events: 5, podiums: 2, monarchs: 1, rank: 2 }
  ],
  membership: { benefits: ['Leaderboard', 'Profil', 'Event resmi'], howto: 'Login lalu isi form.' },
  members: [
    { member_id: 'mbr_1', email: 'andi@example.com', display_name: 'Andi', status: 'active', joined_at: '2026-01-01' },
    { member_id: 'mbr_3', email: 'citra@example.com', display_name: 'Citra', status: 'pending', joined_at: '2026-10-15' }
  ]
};

function ok(data) {
  return { status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data: data }) };
}

/** Tentukan action dari request (GET query atau POST body). */
function actionOf(request) {
  const url = request.url();
  const m = url.match(/[?&]action=([^&]+)/);
  if (m) return decodeURIComponent(m[1]);
  const post = request.postData();
  if (post) {
    try { return JSON.parse(post).action; } catch (e) { /* abaikan */ }
  }
  return null;
}

/**
 * Pasang mock pada page. opts.record (opsional) untuk menangkap body POST.
 */
async function installApiMock(page, opts) {
  opts = opts || {};
  await page.route(function (url) { return url.href.indexOf(MOCK_URL_SUBSTR) >= 0; }, async function (route) {
    const req = route.request();
    const action = actionOf(req);
    if (opts.record && req.method() === 'POST') {
      try { opts.record.push(JSON.parse(req.postData() || '{}')); } catch (e) {}
    }

    let payload;
    switch (action) {
      case 'home.get': payload = ok(DATA.home); break;
      case 'events.list': payload = ok(DATA.events); break;
      case 'leaderboard.get': payload = ok(DATA.leaderboard); break;
      case 'membership.info': payload = ok(DATA.membership); break;
      case 'auth.login': payload = ok(opts.loginResponse || defaultLogin()); break;
      case 'event.register': payload = ok({ registered: true }); break;
      case 'membership.signup': payload = ok({ memberId: 'mbr_new', status: 'pending', existing: false }); break;
      case 'profile.get': payload = ok(defaultProfile()); break;
      case 'profile.update': payload = ok({ updated: true }); break;
      case 'admin.members.list': payload = ok(DATA.members); break;
      case 'admin.results.submit': payload = ok({ submitted: true, count: (req.postData() ? (JSON.parse(req.postData()).rows || []).length : 0) }); break;
      case 'admin.event.save': payload = ok({ eventId: 'evt_new', created: true }); break;
      case 'admin.home.update': payload = ok({ updated: true }); break;
      case 'admin.member.setStatus': payload = ok({ updated: true }); break;
      case 'admin.registrations.list': payload = ok([]); break;
      default: payload = { status: 200, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'unknown_action:' + action }) };
    }
    await route.fulfill(payload);
  });
}

function defaultLogin() {
  return { role: 'member', email: 'andi@example.com', name: 'Andi', member: { memberId: 'mbr_1', displayName: 'Andi', status: 'active' }, profile: defaultProfile().profile };
}
function adminLogin() {
  return { role: 'admin', email: 'admin@example.com', name: 'Admin', member: null, profile: null };
}
function defaultProfile() {
  return {
    member: { member_id: 'mbr_1', display_name: 'Andi', status: 'active' },
    profile: { member_id: 'mbr_1', photo_url: '', latest_deck: 'Deck A', top_blade: 'Blade X', updated_at: '2026-10-01' },
    achievements: [{ achievement_id: 'ach_1', member_id: 'mbr_1', event_id: 'evt_0', type: 'monarch', label: 'Monarch', created_at: '2026-09-01' }]
  };
}

/** Suntik sesi ke sessionStorage sebelum app bootstrap (bypass login Google). */
async function injectSession(page, user) {
  await page.addInitScript(function (u) {
    try {
      sessionStorage.setItem('beysic:session', JSON.stringify({ idToken: 'mock-token', user: u }));
    } catch (e) {}
  }, user);
}

module.exports = {
  installApiMock, injectSession, DATA,
  defaultLogin, adminLogin, defaultProfile
};
