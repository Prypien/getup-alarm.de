/* ---------- 3D-Wecker (cel-shaded, Tinten-Kontur) ---------- */
(function () {
  if (!window.THREE) return;
  var canvas = document.getElementById('clock'), stage = document.getElementById('heroStage');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true }); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  var scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, .1, 50);
  camera.position.set(0, 0, 9);

  var INK = 0x1b1420;
  var gd = new Uint8Array([95, 175, 255]);
  var grad = new THREE.DataTexture(gd, 3, 1, THREE.LuminanceFormat);
  grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.generateMipmaps = false; grad.needsUpdate = true;
  function toon(c) { return new THREE.MeshToonMaterial({ color: c, gradientMap: grad }); }
  var inkMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
  function part(geo, mat, sx, sy, sz) {
    var m = new THREE.Mesh(geo, typeof mat === 'number' ? toon(mat) : mat);
    if (sx) { var o = new THREE.Mesh(geo, inkMat); o.scale.set(sx, sy, sz); m.add(o); }
    return m;
  }

  scene.add(new THREE.AmbientLight(0xffffff, .5));
  var sun = new THREE.DirectionalLight(0xffffff, .62); sun.position.set(-3, 4, 5); scene.add(sun);

  /* Wecker */
  var clock = new THREE.Group(), body = new THREE.Group(); clock.add(body);
  var cyl = part(new THREE.CylinderGeometry(1, 1, .62, 56), 0xe8344e, 1.06, 1.2, 1.06);
  cyl.rotation.x = Math.PI / 2; body.add(cyl);
  var rim = part(new THREE.TorusGeometry(.9, .085, 14, 56), 0xffd23f, 1.035, 1.035, 1.6);
  rim.position.z = .31; body.add(rim);

  var fc = document.createElement('canvas'); fc.width = fc.height = 512;
  var tex = new THREE.CanvasTexture(fc); tex.anisotropy = 4;
  function drawFace() {
    var g = fc.getContext('2d'); g.clearRect(0, 0, 512, 512);
    g.fillStyle = '#fffaf0'; g.beginPath(); g.arc(256, 256, 256, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(232,52,78,.16)';
    for (var y = 8; y < 512; y += 18) for (var x = 8; x < 512; x += 18) { g.beginPath(); g.arc(x, y, 2.4, 0, 6.3); g.fill(); }
    g.strokeStyle = '#1b1420'; g.lineCap = 'round';
    for (var i = 0; i < 12; i++) {
      var an = i / 12 * Math.PI * 2, big = i % 3 === 0;
      g.lineWidth = big ? 16 : 8;
      g.beginPath(); g.moveTo(256 + Math.sin(an) * (big ? 186 : 200), 256 - Math.cos(an) * (big ? 186 : 200));
      g.lineTo(256 + Math.sin(an) * 226, 256 - Math.cos(an) * 226); g.stroke();
    }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '64px "Luckiest Guy", "Arial Black", sans-serif';
    g.lineWidth = 12; g.lineJoin = 'round';
    g.strokeText('GET', 256, 150); g.fillStyle = '#ffd23f'; g.fillText('GET', 256, 150);
    g.strokeText('UP!', 256, 372); g.fillStyle = '#e8344e'; g.fillText('UP!', 256, 372);
    function hand(deg, len, w) {
      var r = deg * Math.PI / 180; g.lineWidth = w; g.strokeStyle = '#1b1420';
      g.beginPath(); g.moveTo(256, 256); g.lineTo(256 + Math.sin(r) * len, 256 - Math.cos(r) * len); g.stroke();
    }
    hand(280.5, 110, 22); hand(126, 160, 16);
    g.fillStyle = '#1b1420'; g.beginPath(); g.arc(256, 256, 20, 0, 6.3); g.fill();
    tex.needsUpdate = true;
  }
  drawFace();
  if (document.fonts && document.fonts.load) document.fonts.load('64px "Luckiest Guy"').then(drawFace, function () {});
  var face = new THREE.Mesh(new THREE.CircleGeometry(.84, 56), new THREE.MeshBasicMaterial({ map: tex }));
  face.position.z = .312; body.add(face);
  var sec = new THREE.Mesh(new THREE.BoxGeometry(.035, .7, .01), new THREE.MeshBasicMaterial({ color: 0xe8344e }));
  sec.geometry.translate(0, .25, 0); sec.position.z = .33; body.add(sec);
  var pin = new THREE.Mesh(new THREE.CircleGeometry(.06, 20), new THREE.MeshBasicMaterial({ color: 0xe8344e })); pin.position.z = .34; body.add(pin);

  var bellGeo = new THREE.SphereGeometry(.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  var bellMat = new THREE.MeshToonMaterial({ color: 0xffd23f, gradientMap: grad, side: THREE.DoubleSide });
  var bells = [];
  [-1, 1].forEach(function (s) {
    var b = part(bellGeo, bellMat, 1.1, 1.1, 1.1);
    b.position.set(s * .64, .84, -.05); b.rotation.z = -s * .55; body.add(b); bells.push(b);
    var knob = part(new THREE.SphereGeometry(.09, 16, 12), 0x1b1420);
    knob.position.y = .44; b.add(knob);
    var leg = part(new THREE.CylinderGeometry(.075, .06, .42, 16), 0x1b1420);
    leg.position.set(s * .6, -.98, 0); leg.rotation.z = s * .55; body.add(leg);
    var foot = part(new THREE.SphereGeometry(.12, 16, 12), 0xffd23f, 1.25, 1.25, 1.25);
    foot.position.set(s * .72, -1.16, 0); body.add(foot);
  });
  var hammer = new THREE.Group(); hammer.position.set(0, .98, -.05); body.add(hammer);
  var arm = part(new THREE.CylinderGeometry(.045, .045, .42, 10), 0x1b1420); arm.position.y = .2; hammer.add(arm);
  var head = part(new THREE.SphereGeometry(.12, 18, 14), 0xffb3c1, 1.3, 1.3, 1.3); head.position.y = .44; hammer.add(head);
  var handle = part(new THREE.TorusGeometry(.32, .06, 10, 32, Math.PI), 0x1b1420); handle.position.set(0, 1.0, -.25); body.add(handle);

  /* Bewegungsstriche beim Klingeln */
  var dashes = new THREE.Group(); body.add(dashes);
  [-1, 1].forEach(function (s) {
    for (var k = 0; k < 3; k++) {
      var d = new THREE.Mesh(new THREE.BoxGeometry(.06, .3, .02), new THREE.MeshBasicMaterial({ color: INK }));
      var an = (k - 1) * .45 + s * .9;
      d.position.set(s * 1.32 + Math.sin(an) * .1, .95 + (1 - k) * .3 * -s * .0 + (k - 1) * .32, .2);
      d.rotation.z = s * (k - 1) * -.5 - s * .9;
      dashes.add(d);
    }
  });
  scene.add(clock);

  /* Sterne und Punkte drumherum */
  function starShape(o, i) {
    var s = new THREE.Shape();
    for (var k = 0; k < 10; k++) { var r = k % 2 ? i : o, a = k / 10 * Math.PI * 2 + Math.PI / 2; s[k ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
    return s;
  }
  var starGeo = new THREE.ExtrudeGeometry(starShape(.3, .14), { depth: .12, bevelEnabled: true, bevelSize: .025, bevelThickness: .03, bevelSegments: 1 });
  starGeo.center();
  var bits = [], cols = [0xffd23f, 0xfffaf0, 0xffb3c1, 0xffd23f, 0x1f8a8a, 0xff9f1c, 0xffd23f];
  var spots = [[-.86, .78], [.88, .7], [.9, -.15], [-.92, -.05], [.62, -.86], [-.3, .92], [.18, -.95]];
  spots.forEach(function (p, k) {
    var m = k === 4 || k === 6 ? part(new THREE.SphereGeometry(.14, 20, 14), cols[k], 1.22, 1.22, 1.22) : part(starGeo, cols[k], 1.16, 1.16, 1.5);
    m.userData = { p: p, ph: k * 1.7, sp: .5 + (k % 3) * .25, sc: .8 + (k % 2) * .45 };
    scene.add(m); bits.push(m);
  });

  var W = 1, H = 1, halfH = 9 * Math.tan(15 * Math.PI / 180), halfW = halfH;
  function size() {
    var r = canvas.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); halfW = halfH * camera.aspect;
    var s = Math.min(halfH * 1.3 / 2.8, halfW * 1.25 / 2.7);
    clock.scale.setScalar(s);
    clock.userData.home = [0, -.12 * s];
  }
  size(); if ('ResizeObserver' in window) new ResizeObserver(size).observe(canvas); else addEventListener('resize', size);

  var mx = 0, my = 0, jump = 0, jv = 0, spin = 0, visible = true, t0 = performance.now();
  if (matchMedia('(hover: hover)').matches) addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; }, { passive: true });
  stage.addEventListener('click', function () { jv = .16; spin = Math.PI * 2; t0 = performance.now() - 0; });
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) loop(); }).observe(stage);

  var running = false, cy = 0, cx = 0;
  function loop() { if (running) return; running = true; requestAnimationFrame(tick); }
  function tick(now) {
    if (!visible) { running = false; return; }
    var t = now / 1000, cyc = ((now - t0) / 1000) % 4.2, ringing = !reduce && cyc > 2.45 && cyc < 3.3;
    cx += (mx - cx) * .06; cy += (my - cy) * .06;
    var home = clock.userData.home;
    jv -= .012; jump = Math.max(0, jump + jv); if (jump === 0 && jv < 0) jv = 0;
    spin *= .93;
    clock.position.set(home[0] + (ringing ? Math.sin(t * 90) * .03 : 0), home[1] + jump + (reduce ? 0 : Math.sin(t * 1.6) * .05), .4);
    clock.rotation.set(.12 + cy * .25, -.42 + cx * .55 + spin, ringing ? Math.sin(t * 70) * .09 : -.06);
    hammer.rotation.z = ringing ? Math.sin(t * 80) * .55 : 0;
    bells[0].rotation.z = .55 + (ringing ? Math.sin(t * 75) * .05 : 0);
    bells[1].rotation.z = -.55 - (ringing ? Math.sin(t * 75 + 1) * .05 : 0);
    dashes.visible = ringing || jump > .05;
    sec.rotation.z = -(reduce ? 0 : t * Math.PI * 2 / 6);
    bits.forEach(function (m) {
      var u = m.userData, s = (reduce ? 0 : t) * u.sp + u.ph;
      m.position.set(u.p[0] * halfW * .92 + Math.sin(s) * .08, u.p[1] * halfH * .88 + Math.cos(s * 1.3) * .12, Math.sin(s * .7) * .6 - .3);
      m.rotation.set(Math.sin(s) * .5 + cy * .3, s * .8 + cx * .6, Math.cos(s) * .3);
      m.scale.setScalar(u.sc * Math.min(1, halfW / 2) * (1 + (ringing ? .08 * Math.sin(t * 30 + u.ph) : 0)));
    });
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  loop();
})();
