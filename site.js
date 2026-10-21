/* ============================================================
   EDIT THESE LINKS — they are used by every page on the site.
   Leave a value as '' and that button will be hidden.
   ============================================================ */
var LINKS = {
  resume:    'resume.pdf',                          // put your résumé PDF in this folder with this name
  linkedin:  'https://www.linkedin.com/in/abigailxwang',  // e.g. 'https://www.linkedin.com/in/your-name'
  instagram: 'https://www.instagram.com/abigailwxx/',     // e.g. 'https://www.instagram.com/your-handle'
  emojinary: 'https://emojidictionary.cargo.site/',  // Emojinary website URL
  between:   'https://readymag.website/u550970229/6202052/',  // Between Languages (Readymag) URL
  krakk:     'https://krakkbeer.cargo.site/'        // KRAKK mobile site URL (the QR code link; made for phones)
};

(function () {
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- links from LINKS ---------- */
  doc.querySelectorAll('[data-cfg]').forEach(function (a) {
    var v = LINKS[a.getAttribute('data-cfg')];
    if (v) {
      a.setAttribute('href', v);
      // "Download Resume" saves the file; the other résumé links open it in a new tab
      if (/^download/i.test(a.getAttribute('aria-label') || a.textContent.trim())) a.setAttribute('download', 'Abigail-Wang-Resume.pdf');
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
    // things at the very bottom (footer links) can never scroll up past the margin: show them at the end of the page
    var atEnd = function () {
      if (innerHeight + scrollY >= root.scrollHeight - 120)
        doc.querySelectorAll('.rv:not(.in)').forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('in'); io.unobserve(el); } });
    };
    window.addEventListener('scroll', atEnd, { passive: true }); atEnd();
  } else {
    doc.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- videos: play only if the file exists ---------- */
  doc.querySelectorAll('video[data-src]').forEach(function (v) {
    var src = v.getAttribute('data-src');
    fetch(src, { method: 'HEAD' }).then(function (r) {
      if (!r.ok) return;
      var rate = +v.getAttribute('data-rate') || 1;   // e.g. Between Languages plays at 2x
      v.addEventListener('loadedmetadata', function () { v.defaultPlaybackRate = v.playbackRate = rate; });
      v.src = src; v.play && v.play().catch(function () {});
    }).catch(function () {});
  });

  /* ---------- dice ---------- */
  function roll(el, done) {
    if (!el) { done && done(); return; }
    if (reduce) { done && done(); return; }
    el.classList.remove('rolling'); void el.offsetWidth; el.classList.add('rolling');
    setTimeout(function () { el.classList.remove('rolling'); done && done(); }, 1000);
  }
  /* ---------- projects page: the big die as a real 3D cube ----------
     Drawn to match the Figma illustration (pink body, rounded corners, inset face plates, hot-pink pips);
     each plate is shaded from a light at the upper left, so at rest top = cream, front = blush, right = rose. */
  var PIPS = { 1: [[50, 50]], 2: [[25, 25], [75, 75]], 3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]], 5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 22], [75, 22], [25, 50], [75, 50], [25, 78], [75, 78]] };
  // value → where that face sits on the cube (opposite faces add up to 7). At rest 3 faces front, 2 right, 1 up.
  var FACES = { 3: '', 4: 'rotateY(180deg)', 2: 'rotateY(90deg)', 5: 'rotateY(-90deg)', 1: 'rotateX(90deg)', 6: 'rotateX(-90deg)' };
  var VIEW = 'rotateZ(-4deg) rotateX(-17deg) rotateY(-33deg)';   // the illustration's three-quarter view
  var LIGHT = (function (v) { var l = Math.hypot(v[0], v[1], v[2]); return v.map(function (c) { return c / l; }); })([-0.35, -0.8, 0.5]);
  function hex(c) { return [1, 3, 5].map(function (i) { return parseInt(c.substr(i, 2), 16); }); }
  function dirOf(m, v) { var a = m.transformPoint(new DOMPoint(v[0], v[1], v[2], 0)); return [a.x, a.y, a.z]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  var NORMALS = {}; for (var f in FACES) NORMALS[f] = dirOf(new DOMMatrix(FACES[f] || 'none'), [0, 0, 1]);
  function rot(a, b) { return VIEW + ' rotateX(' + a + 'deg) rotateY(' + b + 'deg)'; }
  // brightness of the three visible faces at rest anchors the colour ramp
  var REST = (function () { var m = new DOMMatrix(rot(0, 0)); return [-1, dot(dirOf(m, NORMALS[2]), LIGHT), dot(dirOf(m, NORMALS[3]), LIGHT), dot(dirOf(m, NORMALS[1]), LIGHT)]; })();
  function shader(cols) {   // colour ramp for one die: [facing away, right, front, top] at rest
    var C = cols.map(hex);
    return function (d) {
      var i = 0; while (i < 2 && d > REST[i + 1]) i++;
      var t = Math.max(0, Math.min(1, (d - REST[i]) / (REST[i + 1] - REST[i])));
      return 'rgb(' + C[i].map(function (x, j) { return Math.round(x + (C[i + 1][j] - x) * t); }).join(',') + ')';
    };
  }
  var LOOKS = {   // matched to each Figma die illustration
    projects: { shades: ['#E8C3D2', '#F2D4E0', '#FEF1FA', '#FFF8F4'], body: '#FFCDE4', pip: '#E96A9F', rim: 9, size: 0.64 },
    home: { shades: ['#B8436F', '#CF4F86', '#E96A9F', '#FFCDE4'], body: '#F28CB8', pip: '#FFF8F4', rim: 4, size: 0.5 }
  };
  // the (a, b) turn that brings each value to the front, found by trying quarter turns
  var TARGET = {};
  [0, 90, 180, 270].forEach(function (a) { [0, 90, 180, 270].forEach(function (b) {
    var m = new DOMMatrix('rotateX(' + a + 'deg) rotateY(' + b + 'deg)');
    for (var f in FACES) if (!TARGET[f] && dirOf(m, NORMALS[f])[2] > 0.99) TARGET[f] = [a, b];
  }); });
  function bez(x1, y1, x2, y2) {   // CSS-style cubic-bezier easing
    return function (x) {
      var t = x; for (var i = 0; i < 6; i++) {
        var cx = 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t - x;
        var dx = 3 * x1 * (1 - t) * (1 - 3 * t) + 3 * x2 * t * (2 - 3 * t) + 3 * t * t;
        if (Math.abs(dx) < 1e-6) break; t = Math.max(0, Math.min(1, t - cx / dx));
      }
      return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t;
    };
  }
  var momentum = bez(0.32, 0, 0.12, 1);
  function Die(host, look) {
    look = look || LOOKS.projects;
    var shade = shader(look.shades);
    var w = parseFloat(host.style.width) || host.offsetWidth, s = Math.round(w * look.size), h = s / 2;
    var wrap = doc.createElement('div'); wrap.className = 'die3d';
    wrap.style.cssText = '--body:' + look.body + ';--pip:' + look.pip + ';--rim:' + look.rim + 'px';
    var cube = doc.createElement('div'); cube.className = 'cube';
    cube.style.cssText = 'width:' + s + 'px;height:' + s + 'px;margin:' + (-h) + 'px 0 0 ' + (-h) + 'px';
    var plates = {};
    ['', 'rotateY(180deg)', 'rotateY(90deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'].forEach(function (t) {
      var c = doc.createElement('div'); c.className = 'core';     // solid inside, so the rounded corners never show a gap
      c.style.transform = t + ' translateZ(' + (h * 0.97) + 'px)'; cube.appendChild(c);
    });
    Object.keys(FACES).forEach(function (f) {
      var face = doc.createElement('div'); face.className = 'face';
      face.style.transform = FACES[f] + ' translateZ(' + h + 'px)';
      var plate = doc.createElement('div'); plate.className = 'plate';
      PIPS[f].forEach(function (p) { var d = doc.createElement('i'); d.style.left = p[0] + '%'; d.style.top = p[1] + '%'; plate.appendChild(d); });
      face.appendChild(plate); cube.appendChild(face); plates[f] = plate;
    });
    wrap.appendChild(cube); host.appendChild(wrap); host.classList.add('has3d');
    var A = 0, B = 0, busy = false;
    function pose(a, b, y) {
      var r = rot(a, b), m = new DOMMatrix(r);
      cube.style.transform = 'translateY(' + (y || 0) + 'px) ' + r;
      for (var f in plates) plates[f].style.background = shade(dot(dirOf(m, NORMALS[f]), LIGHT));
    }
    pose(0, 0);
    return {
      face: function (k) { A = TARGET[k][0]; B = TARGET[k][1]; pose(A, B); },
      roll: function (k, done) {
        if (busy) return; busy = true;
        var tA = TARGET[k][0], tB = TARGET[k][1];
        // land on the target with 1–2 full turns forward on X and a different amount on Y, so it tumbles
        var eA = tA + 360 * Math.ceil((A + 360 - tA) / 360); if (Math.random() < .5) eA += 360;
        var eB = tB + 360 * Math.ceil((B + 180 - tB) / 360);
        if (reduce) { A = tA; B = tB; pose(A, B); busy = false; done && done(); return; }
        var a0 = A, b0 = B, OA = 7, OB = 9, T1 = 220, T2 = 1000, T3 = 460, lift = s * 0.06, hop = s * 0.22, t0 = performance.now();
        (function frame(now) {
          var t = now - t0, a, b, y;
          if (t < T1) {                                   // anticipation: lean back and lift
            var p = t / T1, e = 1 - Math.pow(1 - p, 3);
            a = a0 - 12 * e; b = b0 - 4 * e; y = -lift * e;
          } else if (t < T1 + T2) {                       // tumble: quick start, fluid middle, ease out past the target
            var p = (t - T1) / T2, e = momentum(p);
            a = a0 - 12 + (eA + OA - a0 + 12) * e; b = b0 - 4 + (eB + OB - b0 + 4) * e;
            y = -lift * (1 - p) - hop * Math.sin(Math.PI * Math.min(1, p * 1.08));
          } else if (t < T1 + T2 + T3) {                  // landing: soft bounce, rotation settles back from the overshoot
            var q = (t - T1 - T2) / T3, off = Math.exp(-4.2 * q) * Math.cos(5.4 * q);
            a = eA + OA * off; b = eB + OB * off;
            y = -s * 0.035 * Math.sin(Math.PI * Math.min(1, q * 1.6)) * (1 - q);
          } else {
            A = eA % 360; B = eB % 360; pose(A, B); busy = false; done && done(); return;
          }
          pose(a, b, y);
          requestAnimationFrame(frame);
        })(t0);
      }
    };
  }
  var dice = [].slice.call(doc.querySelectorAll('.bigdie')).map(function (el) { return Die(el); });
  var cur = 0;

  // home: the die under the name bobs; click rolls it (same 3D roll as Projects) then opens Projects
  doc.querySelectorAll('.k-die').forEach(function (h) {
    var g = h.getAttribute('data-g');
    var el = h.parentElement.querySelector('.g' + g + '.sv') || h.querySelector('.sv');
    var die3 = el ? Die(el, LOOKS.home) : null, face = 3;
    if (el && !reduce) el.classList.add('bob');
    h.addEventListener('click', function (ev) {
      ev.preventDefault();
      var href = h.getAttribute('href');
      if (el) el.classList.remove('bob');
      var k; do { k = 1 + Math.floor(Math.random() * 6); } while (k === face);
      face = k;
      if (die3) die3.roll(k, function () { setTimeout(function () { location.href = href; }, 250); });
      else location.href = href;
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
    arrange(k);
    try { history.replaceState(null, '', k ? '#' + NAMES[k].toLowerCase().replace(' ', '-') : location.pathname); } catch (e) {}
  }
  // move the picked category's projects to the top of the gallery (the rest follow, dimmed); 0 = original order
  var deskCards = [], slots = [], flowCards = [], flowRows = [];
  (function () {
    var byCard = {};
    doc.querySelectorAll('.main-stage [data-card]').forEach(function (el) {
      var c = +el.getAttribute('data-card'); (byCard[c] = byCard[c] || []).push(el);
      var g = /\bg(\d+)\b/.exec(el.className), hit = g && doc.querySelector('.main-stage .hit[data-g="' + g[1] + '"]');
      if (hit && byCard[c].indexOf(hit) < 0) byCard[c].push(hit);
    });
    Object.keys(byCard).sort(function (a, b) { return a - b; }).forEach(function (c) {
      var els = byCard[c];
      deskCards.push({ c: +c, els: els,
        x: Math.min.apply(null, els.map(function (e) { return e.offsetLeft; })),
        y: Math.min.apply(null, els.map(function (e) { return e.offsetTop; })) });
    });
    slots = deskCards.map(function (d) { return [d.x, d.y]; }).sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; });
    doc.querySelectorAll('.flow .fcard[data-card]').forEach(function (el) {
      flowCards.push(el);
      var row = el.parentElement, r = flowRows.filter(function (x) { return x.row === row; })[0];
      if (r) r.n++; else flowRows.push({ row: row, n: 1 });
    });
  })();
  function arrange(k) {
    var cats = window.CARD_CATS || [];
    var has = function (c) { return (cats[c] || []).indexOf(k) >= 0; };
    var order = deskCards.slice().sort(function (a, b) { return k ? (has(b.c) - has(a.c)) || (a.c - b.c) : a.c - b.c; });
    order.forEach(function (d, j) {
      var dx = slots[j][0] - d.x, dy = slots[j][1] - d.y;
      d.els.forEach(function (e) { e.style.translate = dx || dy ? dx + 'px ' + dy + 'px' : ''; });
    });
    var fo = flowCards.slice().sort(function (a, b) {
      var ca = +a.getAttribute('data-card'), cb = +b.getAttribute('data-card');
      return k ? (has(cb) - has(ca)) || (ca - cb) : ca - cb;
    });
    var i = 0;
    flowRows.forEach(function (r) { for (var n = 0; n < r.n; n++) r.row.appendChild(fo[i++]); });
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
        rollTo();
      } else if (a === 'showall') {
        filter(0);
      } else if (a.indexOf('cat:') === 0) {
        var k = +a.slice(4);
        filter(k); setTimeout(gallery, 200);
        if (k !== cur) { cur = k; dice.forEach(function (d) { d.roll(k); }); }
      }
    });
  });
  // roll to a new category (never the same one twice in a row), then filter when it lands
  function rollTo() {
    var k; do { k = 1 + Math.floor(Math.random() * 4); } while (k === cur);
    cur = k;
    var n = 0;
    dice.forEach(function (d) { d.roll(k, function () { if (++n === 1) { filter(k); setTimeout(gallery, 450); } }); });
    if (!dice.length) { filter(k); gallery(); }
  }
  dice.length && doc.querySelectorAll('.bigdie').forEach(function (el) {   // clicking the die itself rolls too
    el.addEventListener('click', function (ev) { ev.preventDefault(); rollTo(); });
  });
  if (doc.body.getAttribute('data-page') === 'projects.html') {
    var hsh = location.hash.slice(1);
    if (hsh === 'all') setTimeout(gallery, 300);
    for (var k in NAMES) if (NAMES[k].toLowerCase().replace(' ', '-') === hsh) { filter(+k); cur = +k; dice.forEach(function (d) { d.face(+k); }); }
  }
})();
