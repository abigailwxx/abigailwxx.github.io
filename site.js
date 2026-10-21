/* ============================================================
   EDIT THESE LINKS — they are used by every page on the site.
   Leave a value as '' and that button will be hidden.
   ============================================================ */
var LINKS = {
  resume:    'resume.pdf',                          // put your résumé PDF in this folder with this name
  linkedin:  '',                                    // e.g. 'https://www.linkedin.com/in/your-name'
  instagram: '',                                    // e.g. 'https://www.instagram.com/your-handle'
  emojinary: '',                                    // Emojinary website URL
  between:   '',                                    // Between Languages (Readymag) URL
  krakk:     ''                                     // KRAKK mobile site URL (the QR code link)
};

(function () {
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- links from LINKS ---------- */
  doc.querySelectorAll('[data-cfg]').forEach(function (a) {
    var v = LINKS[a.getAttribute('data-cfg')];
    if (v) {
      a.setAttribute('href', v);
      if (!/^(https?:|mailto:)/.test(v) && location.protocol !== 'file:') {   // local file (e.g. resume.pdf): hide if missing
        fetch(v, { method: 'HEAD' }).then(function (r) { if (!r.ok) a.classList.add('nolink'); }).catch(function () {});
      }
    }
    else {
      a.setAttribute('href', '#');
      a.addEventListener('click', function (ev) { ev.preventDefault(); });
      a.setAttribute('title', 'Link coming soon');
      a.classList.add('nolink');
    }
  });

  /* ---------- scale the Figma frame to the window ---------- */
  var wraps = [].slice.call(doc.querySelectorAll('.sv-wrap'));
  function fit() {
    var vw = root.clientWidth;
    var s = Math.min(1, vw / 1440);
    var off = (vw - 1440 * s) / 2;
    wraps.forEach(function (w) {
      var st = w.firstElementChild, h = parseFloat(w.getAttribute('data-h'));
      st.style.transform = 'translate(' + off + 'px,0) scale(' + s + ')';
      w.style.height = (h * s) + 'px';
      // full-width colour bands reach the window edges
      st.querySelectorAll('.band').forEach(function (b) {
        b.style.left = (-off / s) + 'px';
        b.style.width = (vw / s) + 'px';
      });
    });
    // collages in the small-screen layout
    doc.querySelectorAll('.col').forEach(function (c) {
      var w = +c.getAttribute('data-w'), h = +c.getAttribute('data-h');
      var avail = c.parentElement.parentElement ? c.parentElement.parentElement.clientWidth : c.clientWidth;
      var cw = Math.min(w, (c.closest('.frow') || c.parentElement).clientWidth, c.closest('[data-bigdie]') ? 260 : 1e9);
      var k = cw / w;
      c.style.width = cw + 'px'; c.style.height = (h * k) + 'px';
      c.firstElementChild.style.transform = 'scale(' + k + ')';
    });
  }
  fit();
  window.addEventListener('resize', fit);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fit);

  /* ---------- hover groups ---------- */
  doc.querySelectorAll('.hit').forEach(function (h) {
    var g = h.getAttribute('data-g');
    var stage = h.parentElement;
    var mem = stage.querySelectorAll('.g' + g);
    var cls = h.classList.contains('k-card') ? 'hovcard' : (h.classList.contains('k-cat') ? 'hovcat' : 'hov');
    if (h.classList.contains('k-die')) cls = 'hov';
    function on() { mem.forEach(function (m) { m.classList.add(cls); }); }
    function off() { mem.forEach(function (m) { m.classList.remove(cls); }); }
    h.addEventListener('mouseenter', on); h.addEventListener('mouseleave', off);
    h.addEventListener('focus', on); h.addEventListener('blur', off);
  });

  /* ---------- scroll reveal ---------- */
  doc.querySelectorAll('.flow .frow').forEach(function (r, i) {
    if (i > 1) r.querySelectorAll('.fb').forEach(function (b) { b.classList.add('rv'); });
  });
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    doc.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  } else {
    doc.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- videos: play only if the file exists ---------- */
  doc.querySelectorAll('video[data-src]').forEach(function (v) {
    var src = v.getAttribute('data-src');
    if (location.protocol === 'file:') {   // opened by double-click: just try it
      v.addEventListener('error', function () { v.removeAttribute('src'); }, true);
      v.src = src; v.play && v.play().catch(function () {}); return;
    }
    fetch(src, { method: 'HEAD' }).then(function (r) {
      if (r.ok) { v.src = src; v.play && v.play().catch(function () {}); }
    }).catch(function () {});
  });

  /* ---------- dice ---------- */
  function roll(el, done) {
    if (!el) { done && done(); return; }
    if (reduce) { done && done(); return; }
    el.classList.remove('rolling'); void el.offsetWidth; el.classList.add('rolling');
    setTimeout(function () { el.classList.remove('rolling'); done && done(); }, 1000);
  }
  // home: the die under the name bobs, click rolls it then opens Projects
  doc.querySelectorAll('.k-die').forEach(function (h) {
    var g = h.getAttribute('data-g');
    var die = h.parentElement.querySelector('.g' + g + '.sv') || h.querySelector('.sv');
    if (die && !reduce) die.classList.add('bob');
    h.addEventListener('click', function (ev) {
      ev.preventDefault();
      var href = h.getAttribute('href');
      if (die) die.classList.remove('bob');
      roll(die, function () { location.href = href; });
    });
  });

  // projects page: roll the dice → pick a category → filter the gallery
  var NAMES = { 1: 'Branding', 2: 'Editorial', 3: 'Web Design', 4: 'Other Works' };
  function filter(k) {
    var cats = window.CARD_CATS || [];
    doc.querySelectorAll('[data-card]').forEach(function (el) {
      var c = cats[+el.getAttribute('data-card')] || [];
      el.classList.toggle('dim', !!k && c.indexOf(k) < 0);
    });
    doc.querySelectorAll('[data-cat]').forEach(function (el) {
      el.classList.toggle('picked', +el.getAttribute('data-cat') === k);
    });
    try { history.replaceState(null, '', k ? '#' + NAMES[k].toLowerCase().replace(' ', '-') : location.pathname); } catch (e) {}
  }
  function gallery() {
    var t = [].slice.call(doc.querySelectorAll('[data-card]')).filter(function (e) { return e.offsetParent; })[0];
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 160, behavior: reduce ? 'auto' : 'smooth' });
  }
  doc.querySelectorAll('[data-action]').forEach(function (b) {
    var a = b.getAttribute('data-action');
    b.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (a === 'roll') {
        var dies = [].slice.call(doc.querySelectorAll('#bigdie, [data-bigdie] .bigdie'));
        var k = 1 + Math.floor(Math.random() * 4);
        var n = 0;
        dies.forEach(function (d) { roll(d, function () { if (++n === 1) { filter(k); setTimeout(gallery, 450); } }); });
        if (!dies.length) { filter(k); gallery(); }
      } else if (a === 'showall') {
        filter(0);
      } else if (a.indexOf('cat:') === 0) {
        filter(+a.slice(4)); setTimeout(gallery, 200);
      }
    });
  });
  if (doc.body.getAttribute('data-page') === 'projects.html') {
    var hsh = location.hash.slice(1);
    if (hsh === 'all') setTimeout(gallery, 300);
    for (var k in NAMES) if (NAMES[k].toLowerCase().replace(' ', '-') === hsh) filter(+k);
  }
})();
