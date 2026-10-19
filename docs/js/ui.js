/**
 * Utilitas UI: escaping, render pesan, toast, loading, pembuatan elemen.
 */
window.UI = (function () {
  /** Escape HTML untuk mencegah injeksi dari data spreadsheet (untrusted). */
  function esc(v) {
    if (v === null || v === undefined) return '';
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function app() { return document.getElementById('app'); }

  function render(html) { app().innerHTML = html; }

  function loading(msg) { render('<div class="loading">' + esc(msg || 'Memuat…') + '</div>'); }

  function errorView(err) {
    render('<div class="msg msg-error">Terjadi kesalahan: ' + esc(err && err.message ? err.message : err) +
      '</div><button class="btn btn-secondary" onclick="location.reload()">Coba lagi</button>');
  }

  var toastTimer = null;
  function toast(msg, type) {
    var el = document.getElementById('beysic-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'beysic-toast';
      el.style.cssText = 'position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);z-index:50;max-width:90%;';
      document.body.appendChild(el);
    }
    el.className = 'msg ' + (type === 'error' ? 'msg-error' : 'msg-ok');
    el.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.remove(); }, 4000);
  }

  /** Serialisasi form menjadi objek. */
  function formData(form) {
    var out = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      if (el.type === 'checkbox') out[el.name] = el.checked;
      else out[el.name] = el.value;
    });
    return out;
  }

  return { esc: esc, render: render, loading: loading, errorView: errorView, toast: toast, formData: formData, app: app };
})();
