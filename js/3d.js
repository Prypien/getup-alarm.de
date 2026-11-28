/* ---------- Handys: Kanten und Rückseite anbauen ---------- */
(function () {
  document.querySelectorAll('.dev').forEach(function (d) {
    var n = 9, frag = document.createDocumentFragment();
    for (var i = 1; i <= n; i++) { var e = document.createElement('i'); e.className = 'edge'; e.style.setProperty('--i', i); frag.appendChild(e); }
    var b = document.createElement('div'); b.className = 'back';
    b.innerHTML = '<img src="img/icon.webp" alt="" width="256" height="256" loading="lazy">';
    frag.appendChild(b);
    d.insertBefore(frag, d.firstChild);
  });
  document.querySelectorAll('.coin').forEach(function (c) {
    var frag = document.createDocumentFragment();
    for (var i = 1; i <= 13; i++) { var e = document.createElement('i'); e.className = 'edge'; e.style.setProperty('--i', i); frag.appendChild(e); }
    c.insertBefore(frag, c.firstChild);
  });
})();

/* ---------- Maus/Neigung und Scroll-Fortschritt ---------- */
(function () {
  var root = document.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tx = 0, ty = 0, cx = 0, cy = 0;
  if (!reduce && matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; }, { passive: true });
  }
  var devs = [].slice.call(document.querySelectorAll('.stage .dev'));
  function frame() {
    cx += (tx - cx) * .08; cy += (ty - cy) * .08;
    root.style.setProperty('--mx', cx.toFixed(3)); root.style.setProperty('--my', cy.toFixed(3));
    if (!reduce) {
      var h = innerHeight;
      devs.forEach(function (d) {
        var r = d.getBoundingClientRect();
        if (r.bottom < -200 || r.top > h + 200) return;
        var p = ((r.top + r.height / 2) - h / 2) / h; // -1 … 1
        d.style.setProperty('--sp', Math.max(-1.2, Math.min(1.2, p)).toFixed(3));
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* Karten: Neigung unter dem Finger/der Maus */
  document.querySelectorAll('.card3').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      if (reduce || e.pointerType === 'touch') return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--ty', (((e.clientX - r.left) / r.width - .5) * 14).toFixed(2) + 'deg');
      c.style.setProperty('--tx', (((e.clientY - r.top) / r.height - .5) * -14).toFixed(2) + 'deg');
    });
    c.addEventListener('pointerleave', function () { c.style.removeProperty('--tx'); c.style.removeProperty('--ty'); });
  });

  /* Aufklappen beim Scrollen */
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .1 });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in'); });

  /* Aufgaben-Auswahl: das Handy zeigt die gewählte Aufgabe */
  var dev = document.getElementById('taskDev'), img = document.getElementById('taskImg');
  if (!dev) return;
  var picks = [].slice.call(document.querySelectorAll('.pick'));
  picks.forEach(function (b) { var i = new Image(); i.src = b.dataset.img; });
  picks.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.classList.contains('on')) return;
      picks.forEach(function (o) { o.classList.toggle('on', o === b); o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      dev.classList.remove('swap'); void dev.offsetWidth; dev.classList.add('swap');
      setTimeout(function () { img.src = b.dataset.img; img.alt = b.dataset.alt; }, reduce ? 0 : 190);
    });
  });
})();

/* Creator-Stufen: neigen sich unter der Maus */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.slab').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--ty', (((e.clientX - r.left) / r.width - .5) * 16).toFixed(2) + 'deg');
      c.style.setProperty('--tx', (((e.clientY - r.top) / r.height - .5) * -16).toFixed(2) + 'deg');
    });
    c.addEventListener('pointerleave', function () { c.style.removeProperty('--tx'); c.style.removeProperty('--ty'); });
  });
})();
