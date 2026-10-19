/**
 * Cache read publik di sessionStorage dengan TTL (NFR N3.1 = 60 detik).
 * Dipakai api.get untuk menghindari panggilan Apps Script berulang.
 */
window.Cache = (function () {
  var TTL = (window.BEYSIC_CONFIG && window.BEYSIC_CONFIG.CACHE_TTL_MS) || 60000;
  var PREFIX = 'beysic:';

  function key(k) { return PREFIX + k; }

  function get(k) {
    try {
      var raw = sessionStorage.getItem(key(k));
      if (!raw) return null;
      var entry = JSON.parse(raw);
      if (Date.now() - entry.t > TTL) {
        sessionStorage.removeItem(key(k));
        return null;
      }
      return entry.v;
    } catch (e) {
      return null;
    }
  }

  function set(k, v) {
    try {
      sessionStorage.setItem(key(k), JSON.stringify({ t: Date.now(), v: v }));
    } catch (e) { /* storage penuh/diblokir: abaikan */ }
  }

  /** Invalidasi: hapus semua entri (dipakai setelah operasi tulis admin, N3.2). */
  function clear() {
    try {
      var toRemove = [];
      for (var i = 0; i < sessionStorage.length; i++) {
        var kk = sessionStorage.key(i);
        if (kk && kk.indexOf(PREFIX) === 0) toRemove.push(kk);
      }
      toRemove.forEach(function (kk) { sessionStorage.removeItem(kk); });
    } catch (e) { /* abaikan */ }
  }

  return { get: get, set: set, clear: clear };
})();
