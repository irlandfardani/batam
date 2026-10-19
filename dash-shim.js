/* ============================================================================
 * dash-shim.js — pengganti runtime "dash" milik claude.ai, agar dashboard ini
 * berjalan sebagai situs statis biasa (GitHub Pages / Netlify / hosting lain).
 *
 * Menyediakan API yang dipakai halaman:
 *   dash.data(id)          -> { status:'ok', data:[...], columns:[...] }
 *   dash.calc(id, def)     -> daftarkan & hitung dataset turunan (fn dipanggil
 *                             dengan array baris dari setiap input)
 *   dash.onData(fn)        -> daftarkan callback, dipanggil saat data siap
 *   dash.setLink(x)        -> set location.hash (navigasi tab)
 *   dash.colors            -> palet warna cadangan (tak dipakai halaman ini)
 *   dash.params/setParams/resetParams/refresh -> no-op (tak ada filter)
 *
 * Data dasar diisi lewat window.__DASH_DATA__ (lihat data.js), yang dimuat
 * SEBELUM skrip kalkulasi dan skrip halaman dijalankan.
 * ========================================================================== */
(function () {
  'use strict';
  var store = Object.create(null);   // id -> { status, data, columns, meta, title, description }
  var cbs = [];                      // onData callbacks
  var fired = false;

  function wrap(rows, extra) {
    var cols = (Array.isArray(rows) && rows.length && rows[0] && typeof rows[0] === 'object')
      ? Object.keys(rows[0]) : [];
    var ds = { status: 'ok', data: rows, columns: cols, meta: null };
    if (extra) { if (extra.title != null) ds.title = extra.title; if (extra.description != null) ds.description = extra.description; }
    return ds;
  }

  function loadBase(obj) {
    if (!obj) return;
    for (var k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        var v = obj[k];
        store[k] = Array.isArray(v) ? wrap(v) : wrap((v && Array.isArray(v.rows)) ? v.rows : [], v);
      }
    }
  }

  var dash = {
    data: function (id) {
      return store[id] || { status: 'missing', data: null, columns: [], meta: null };
    },
    calc: function (id, def) {
      def = def || {};
      try {
        var inputs = def.inputs || [];
        var args = inputs.map(function (i) {
          var d = store[i];
          return d && Array.isArray(d.data) ? d.data : [];
        });
        var res = def.fn.apply(null, args);
        store[id] = wrap(Array.isArray(res) ? res : [], def);
      } catch (e) {
        store[id] = { status: 'error', data: null, columns: [], meta: null, message: String(e && e.message || e) };
        if (window.console) console.error('[dash.calc] ' + id, e);
      }
    },
    onData: function (fn) { if (typeof fn === 'function') cbs.push(fn); if (fired) try { fn(); } catch (e) {} },
    setLink: function (x) { try { if (x) location.hash = String(x); } catch (e) {} },
    params: function () { return {}; },
    setParams: function () {},
    resetParams: function () {},
    refresh: function () {},
    loader: function () {},
    colors: ['#1E73BE', '#E2B95B', '#2E7D32', '#C62828', '#12477D', '#8E24AA', '#E08A00', '#0E7C86', '#6B7A8C', '#B5340C'],
    // internal
    __load: loadBase,
    __fire: function () {
      fired = true;
      for (var i = 0; i < cbs.length; i++) { try { cbs[i](); } catch (e) { if (window.console) console.error('[dash.onData]', e); } }
    }
  };

  window.dash = dash;

  // Muat data dasar bila data.js sudah menaruhnya sebelum shim ini.
  if (window.__DASH_DATA__) loadBase(window.__DASH_DATA__);

  // Setelah DOM + semua skrip halaman selesai, picu onData sekali
  // (halaman juga menggambar sendiri lewat showTab, ini jaring pengaman).
  function go() { dash.__fire(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(go, 0); });
  } else {
    setTimeout(go, 0);
  }
})();
