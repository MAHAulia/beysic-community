/**
 * API client ke Apps Script Web App (functional-design §2, infrastructure-design §3).
 * - GET untuk read publik (dengan cache TTL).
 * - POST untuk aksi member/admin; body JSON dikirim sebagai text/plain
 *   agar menghindari CORS preflight (infrastructure-design §8).
 */
window.Api = (function () {
  var URL = (window.BEYSIC_CONFIG && window.BEYSIC_CONFIG.GAS_WEBAPP_URL) || '';

  function assertConfigured() {
    if (!URL || URL.indexOf('REPLACE_WITH') === 0) {
      throw new Error('GAS_WEBAPP_URL belum dikonfigurasi di config.js');
    }
  }

  function buildQuery(params) {
    return Object.keys(params)
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); })
      .join('&');
  }

  /** Read publik via GET; memakai cache kecuali opts.noCache. */
  function get(action, params, opts) {
    assertConfigured();
    params = params || {};
    opts = opts || {};
    var cacheKey = action + '?' + buildQuery(params);
    if (!opts.noCache) {
      var cached = Cache.get(cacheKey);
      if (cached !== null) return Promise.resolve(cached);
    }
    var q = buildQuery(Object.assign({ action: action }, params));
    return fetch(URL + '?' + q, { method: 'GET' })
      .then(parseResponse)
      .then(function (data) {
        if (!opts.noCache) Cache.set(cacheKey, data);
        return data;
      });
  }

  /** Aksi tulis via POST (member/admin). Menyertakan idToken bila login. */
  function post(action, params) {
    assertConfigured();
    params = params || {};
    var body = Object.assign({ action: action }, params);
    var token = window.Auth && Auth.getIdToken ? Auth.getIdToken() : null;
    if (token) body.idToken = token;
    return fetch(URL, {
      method: 'POST',
      // text/plain = "simple request" -> tanpa preflight OPTIONS
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    }).then(parseResponse);
  }

  function parseResponse(resp) {
    return resp.text().then(function (txt) {
      var json;
      try { json = JSON.parse(txt); }
      catch (e) { throw new Error('Respons tidak valid dari server'); }
      if (!json.ok) throw new Error(json.error || 'request_failed');
      return json.data;
    });
  }

  return { get: get, post: post };
})();
