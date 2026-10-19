/**
 * Autentikasi via Google Identity Services (ID token flow).
 * Token diverifikasi server-side di Apps Script (infrastructure-design §4, NFR1.2).
 * Menyimpan sesi ringan di memori + sessionStorage.
 */
window.Auth = (function () {
  var CLIENT_ID = (window.BEYSIC_CONFIG && window.BEYSIC_CONFIG.GOOGLE_CLIENT_ID) || '';
  var SESSION_KEY = 'beysic:session';
  var state = { idToken: null, user: null }; // user = { role, email, name, member, profile }
  var listeners = [];

  function loadSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) state = JSON.parse(raw);
    } catch (e) { /* abaikan */ }
  }

  function saveSession() {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state)); }
    catch (e) { /* abaikan */ }
  }

  function onChange(fn) { listeners.push(fn); }
  function notify() { listeners.forEach(function (fn) { fn(state.user); }); }

  function getIdToken() { return state.idToken; }
  function getUser() { return state.user; }
  function isLoggedIn() { return !!state.user; }
  function isAdmin() { return !!(state.user && state.user.role === 'admin'); }
  function isMember() { return !!state.user; }

  /** Callback dari GIS saat kredensial diterima. */
  function handleCredential(response) {
    state.idToken = response.credential;
    // Verifikasi + ambil role/profil dari server.
    Api.post('auth.login', { idToken: state.idToken })
      .then(function (data) {
        state.user = data;
        saveSession();
        notify();
      })
      .catch(function (err) {
        state.idToken = null;
        state.user = null;
        notify();
        UI.toast('Login gagal: ' + err.message, 'error');
      });
  }

  /** Inisialisasi GIS; render tombol ke dalam container. */
  function init(buttonContainer) {
    loadSession();
    notify();
    if (!window.google || !google.accounts || !google.accounts.id) {
      // GIS belum termuat; coba lagi sebentar.
      return setTimeout(function () { init(buttonContainer); }, 300);
    }
    if (!CLIENT_ID || CLIENT_ID.indexOf('REPLACE_WITH') === 0) {
      buttonContainer.innerHTML = '<span class="badge">OAuth belum dikonfigurasi</span>';
      return;
    }
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredential
    });
    renderAuthArea(buttonContainer);
  }

  function renderAuthArea(container) {
    container.innerHTML = '';
    if (state.user) {
      var name = state.user.name || state.user.email;
      var wrap = document.createElement('div');
      wrap.innerHTML =
        '<span class="badge">' + UI.esc(name) +
        (state.user.role === 'admin' ? ' · admin' : '') + '</span> ' +
        '<button class="btn btn-ghost" id="logoutBtn">Logout</button>';
      container.appendChild(wrap);
      wrap.querySelector('#logoutBtn').addEventListener('click', logout);
    } else {
      var btn = document.createElement('div');
      btn.id = 'gsiButton';
      container.appendChild(btn);
      google.accounts.id.renderButton(btn, { theme: 'filled_blue', size: 'medium', text: 'signin_with' });
    }
  }

  function logout() {
    state = { idToken: null, user: null };
    saveSession();
    try { google.accounts.id.disableAutoSelect(); } catch (e) {}
    notify();
    if (location.hash === '#/profile' || location.hash === '#/admin') location.hash = '#/';
  }

  // Render ulang area auth saat status berubah.
  onChange(function () {
    var container = document.getElementById('authArea');
    if (container && window.google && google.accounts && google.accounts.id) renderAuthArea(container);
  });

  return {
    init: init, onChange: onChange, getIdToken: getIdToken, getUser: getUser,
    isLoggedIn: isLoggedIn, isAdmin: isAdmin, isMember: isMember, logout: logout
  };
})();
