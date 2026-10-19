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

  /**
   * Popup alert modal. type: 'success' | 'error' | 'warning' | 'info'.
   * Mengembalikan Promise yang resolve saat ditutup.
   */
  var ALERT_META = {
    success: { icon: 'fa-circle-check', title: 'Berhasil' },
    error: { icon: 'fa-circle-xmark', title: 'Gagal' },
    warning: { icon: 'fa-triangle-exclamation', title: 'Perhatian' },
    info: { icon: 'fa-circle-info', title: 'Info' }
  };

  function alert(message, type, opts) {
    type = ALERT_META[type] ? type : 'info';
    opts = opts || {};
    var meta = ALERT_META[type];

    // Hapus popup lama bila ada.
    var existing = document.getElementById('beysic-alert');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'beysic-alert';
    overlay.className = 'alert-overlay';
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="alert-box alert-' + type + '" role="document">' +
        '<div class="alert-icon"><i class="fa-solid ' + meta.icon + '"></i></div>' +
        '<p class="alert-title">' + esc(opts.title || meta.title) + '</p>' +
        '<p class="alert-text">' + esc(message) + '</p>' +
        '<button class="btn alert-ok" type="button">' + esc(opts.okLabel || 'OK') + '</button>' +
      '</div>';
    document.body.appendChild(overlay);

    return new Promise(function (resolve) {
      function close() {
        overlay.classList.add('alert-closing');
        setTimeout(function () { if (overlay.parentNode) overlay.remove(); resolve(); }, 180);
        document.removeEventListener('keydown', onKey);
      }
      function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter') close(); }
      overlay.querySelector('.alert-ok').addEventListener('click', close);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
      document.addEventListener('keydown', onKey);
      var okBtn = overlay.querySelector('.alert-ok');
      if (okBtn && okBtn.focus) okBtn.focus();
    });
  }

  /**
   * Set/lepas state loading pada button yang memanggil API.
   * setLoading(btn, true) -> disable + spinner, simpan label asli.
   * setLoading(btn, false) -> kembalikan label asli.
   */
  function buttonLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      if (btn.dataset.loading === '1') return;
      btn.dataset.loading = '1';
      btn.dataset.originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add('is-loading');
      btn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span class="btn-caption">Memproses…</span>';
    } else {
      if (btn.dataset.loading !== '1') return;
      btn.disabled = false;
      btn.classList.remove('is-loading');
      if (btn.dataset.originalHtml !== undefined) btn.innerHTML = btn.dataset.originalHtml;
      delete btn.dataset.loading;
      delete btn.dataset.originalHtml;
    }
  }

  /**
   * Bungkus pemanggilan API dari sebuah button: aktifkan loader, jalankan fn
   * (harus mengembalikan Promise), lepas loader saat selesai. Menampilkan popup
   * error otomatis bila gagal (kecuali opts.silentError).
   */
  function withButton(btn, fn, opts) {
    opts = opts || {};
    buttonLoading(btn, true);
    return Promise.resolve()
      .then(fn)
      .then(function (res) { buttonLoading(btn, false); return res; })
      .catch(function (err) {
        buttonLoading(btn, false);
        if (!opts.silentError) alert((err && err.message) ? err.message : String(err), 'error');
        throw err;
      });
  }

  /** toast lama -> dialihkan ke popup alert agar konsisten. */
  function toast(msg, type) {
    var t = type === 'error' ? 'error' : (type === 'warning' ? 'warning' : (type === 'info' ? 'info' : 'success'));
    alert(msg, t);
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

  return {
    esc: esc, render: render, loading: loading, errorView: errorView,
    toast: toast, alert: alert, buttonLoading: buttonLoading, withButton: withButton,
    formData: formData, app: app
  };
})();
