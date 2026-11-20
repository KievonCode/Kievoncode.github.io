/* Dotted 3D F1 car behind the home page (front view).
   A fixed, full-screen dot grid stays behind the whole home page. A simple 3D car model
   (shape only, no livery) is projected head-on onto the same grid, centred on screen.
   Scrolling drives it:
     1. At the top the name is visible and the car is dark gray.
     2. Scrolling through the hero fades the name, brightens the car and lowers the camera.
        The scroll space under the title is sized to the car's height on this screen.
     3. When the content below arrives, the whole layer (car and grid) fades to black.
   Each grid dot keeps the nearest surface behind it and is shaded by how that surface faces
   the light; part outlines are drawn brighter so the shape reads on a coarse grid.
   Vanilla JS, no libraries. Loaded only by index.html, after main.js has rendered #hero. */
(function () {
  "use strict";
  var hero = document.getElementById("hero");
  if (!hero) return;
  // A fixed layer holding two canvases: the resting grid (drawn once) and the car (redrawn only
  // when the camera angle steps). Brightness and the fade to black are CSS opacity on these
  // layers, which the browser applies while compositing, so scrolling repaints nothing.
  var box = document.createElement("div");
  var gridCanvas = document.createElement("canvas"), carCanvas = document.createElement("canvas");
  var ctx = gridCanvas.getContext && gridCanvas.getContext("2d");
  if (!ctx) return;

  // The car is drawn on a background thread when the browser supports it (OffscreenCanvas in a
  // Web Worker), so a redraw never holds up scrolling. Otherwise it is drawn on the page.
  var worker = null, local = null;
  try {
    if (window.Worker && window.OffscreenCanvas && carCanvas.transferControlToOffscreen && window.Blob && window.URL) {
      var src = "var P = (" + painter.toString() + ")(), want = null, busy = false;\n" +
        "onmessage = function (e) { var d = e.data;\n" +
        "  if (d.setup) { want = null; P.setup(d.setup, d.canvas); return; }\n" +
        "  want = d; if (!busy) { busy = true; setTimeout(run, 0); } };\n" +
        "function run() { busy = false; var w = want; want = null; if (w) P.draw(w.cells, w.lv); }";
      var w = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
      var off = carCanvas.transferControlToOffscreen();
      worker = w;
      worker.postMessage({ setup: { Wd: 1, Hd: 1, cols: 1, colX: [], colP: [], rowY: [], rowP: [], stamps: {}, LUTp: [], off: 1 }, canvas: off }, [off]);
    }
  } catch (e) { worker = null; }
  if (!worker) local = painter();

  /* ---------- Tunables ---------- */
  var BG_GRAY = 27;                    // faint background grid on #0f1012
  var CAR_DARK = 62, CAR_LIGHT = 212;  // car dot brightness, shadowed to lit
  var OUTLINE = 205;                   // brightness of dots on a part outline
  var EDGE = 28;                       // depth step (model units) that draws a dark gap
  var START_LEVEL = 0.3;               // car brightness with the name showing (dark gray)
  var MAX_CAR_DOTS = 30000;            // spacing opens up only if the car would need more dots than this
  var PITCH_HIGH = 15, PITCH_LOW = 3;  // camera elevation in degrees, top of page to revealed
  var DIST = 5000;                     // camera distance in model units (mild perspective)
  var LIGHT = unit([-0.55, -0.35, 0.76]);

  box.className = "hero-car";
  box.setAttribute("aria-hidden", "true");
  box.appendChild(gridCanvas); box.appendChild(carCanvas);
  document.body.insertBefore(box, document.body.firstChild);
  document.body.classList.add("has-hero-car");
  var reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var copy = hero.querySelector(".wrap");

  /* ---------- Helpers ---------- */
  function unit(v) { var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(t) { t = clamp(t); return t * t * (3 - 2 * t); }
  function table(t, x) {
    if (x <= t[0][0]) return t[0][1];
    for (var i = 1; i < t.length; i++) {
      if (x <= t[i][0]) { var a = t[i - 1], b = t[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); }
    }
    return t[t.length - 1][1];
  }
  function inPoly(p, x, y) {
    var c = false;
    for (var i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
      var xi = p[i], yi = p[i + 1], xj = p[j], yj = p[j + 1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  // Shapes are described for one side of the car (h = distance from the centreline) and mirrored.
  function sym(fn) { return function (x, y) { return fn(x, Math.abs(y)); }; }
  function poly(pts) { return sym(function (x, h) { return inPoly(pts, x, h); }); }
  function rect(x0, x1, h0, h1) { return sym(function (x, h) { return x >= x0 && x <= x1 && h >= h0 && h <= h1; }); }
  function seg(ax, ah, bx, bh, w) {
    return sym(function (x, h) {
      var dx = bx - ax, dh = bh - ah, t = ((x - ax) * dx + (h - ah) * dh) / (dx * dx + dh * dh);
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      var ex = ax + dx * t - x, eh = ah + dh * t - h;
      return ex * ex + eh * eh <= w * w / 4;
    });
  }
  function flat(z) { return function () { return z; }; }
  function part(inside, top, bot, x0, x1, hMax, tone) { return { inside: inside, top: top, bot: bot, x0: x0, x1: x1, h: hMax, tone: tone || 1 }; }
  // A suspension member from the chassis (ah, z0) out to the wheel (bh, z1), drawn as a thin sloped bar.
  function arm(ax, ah, bx, bh, z0, z1) {
    var top = sym(function (x, h) { return z0 + (z1 - z0) * clamp((h - ah) / (bh - ah)); });
    var p = part(seg(ax, ah, bx, bh, 12), top, 0, Math.min(ax, bx) - 6, Math.max(ax, bx) + 6, Math.max(ah, bh) + 6, 0.8);
    p.thick = 10;
    return p;
  }
  // Tyres are real cylinders (axis across the car) so they read from the front.
  function tyre(x0, x1, h0, h1) { return { cyl: true, cx: (x0 + x1) / 2, r: (x1 - x0) / 2, h0: h0, h1: h1, tone: 0.32 }; }

  /* ---------- Model ----------
     Units: x runs nose (158) to rear wing (1905) along the car, y is lateral (0 = centreline),
     z is height above the ground. Roughly 3 mm per unit. Plan shape traced from a top-down
     reference; heights follow a front-on reference. */
  var NOSE_W = [[158, 8], [200, 26], [260, 36], [480, 46], [660, 56], [780, 72]];
  var NOSE_Z = [[158, 40], [480, 105], [780, 165]], NOSE_H = [[158, 14], [480, 45], [780, 55]];
  var BODY_W = [[650, 56], [780, 72], [850, 150], [930, 212], [1040, 232], [1180, 234], [1350, 202], [1480, 142], [1560, 82], [1640, 32], [1665, 0]];
  var SPINE = [[650, 0], [780, 20], [870, 35], [1000, 80], [1090, 145], [1160, 110], [1400, 30], [1640, 0]];
  var CX = 1031, CZ = 150;

  var parts = [
    // floor and diffuser
    part(rect(975, 1560, 0, 229), flat(24), 10, 975, 1560, 229, 0.38),
    part(rect(1560, 1690, 0, 165), function (x) { return 24 + (x - 1560) * 0.35; }, 10, 1560, 1690, 165, 0.45),
    // front wing (flaps rise toward the tips), endplates, pylons under the nose
    part(poly([180, 0, 185, 114, 215, 325, 240, 356, 422, 360, 425, 248, 340, 238, 268, 56, 262, 0]),
      sym(function (x, h) { return 40 + 28 * (h / 360) * (h / 360); }), 20, 180, 425, 360, 0.85),
    part(rect(240, 425, 346, 362), flat(100), 20, 240, 425, 362),
    part(rect(250, 300, 22, 30), flat(70), 40, 250, 300, 30, 0.8),
    // nose
    part(sym(function (x, h) { return x >= 158 && x <= 780 && h <= table(NOSE_W, x); }),
      sym(function (x, h) { var w = table(NOSE_W, x), q = 1 - (h / w) * (h / w); return table(NOSE_Z, x) + table(NOSE_H, x) * Math.sqrt(Math.max(0, q)); }),
      30, 158, 780, 72),
    // chassis, boxy sidepods and engine cover, with a lowered cockpit
    part(sym(function (x, h) { return x >= 650 && x <= 1665 && h <= table(BODY_W, x); }),
      sym(function (x, h) {
        if (x > 870 && x < 1095 && h < 52) return 150;
        var w = table(BODY_W, x), q = 1 - (h / w) * (h / w), s = 1 - (h / 70) * (h / 70);
        return 30 + 170 * Math.pow(Math.max(0, q), 0.3) + (s > 0 ? table(SPINE, x) * Math.sqrt(s) : 0);
      }), 22, 650, 1665, 234),
    // dark openings: sidepod inlets and the airbox above the driver
    part(rect(842, 856, 160, 226), flat(175), 80, 842, 856, 226, 0.12),
    part(rect(1030, 1044, 0, 28), flat(318), 282, 1030, 1044, 28, 0.12),
    // T-camera on top of the airbox
    part(rect(1075, 1100, 0, 48), flat(380), 370, 1075, 1100, 48),
    part(rect(1082, 1094, 0, 5), flat(370), 330, 1082, 1094, 5),
    // floor fences ahead of the sidepods, mirrors on stalks
    part(poly([772, 282, 800, 287, 975, 240, 975, 212, 780, 232]), flat(100), 24, 772, 975, 287, 0.7),
    part(poly([860, 185, 900, 185, 905, 135, 868, 135]), flat(270), 252, 860, 905, 185),
    part(seg(880, 135, 880, 70, 8), flat(255), 245, 874, 886, 137, 0.8),
    // halo: hoop around the cockpit plus the front pillar
    part(sym(function (x, h) { var d = ((x - 955) / 98) * ((x - 955) / 98) + (h / 98) * (h / 98); return (d >= 0.74 && d <= 1) || (x >= 800 && x <= 862 && h <= 7); }),
      function (x) { return x < 860 ? 225 + (x - 800) * 1.25 : 300; }, 262, 800, 1053, 98, 1.15),
    // tyres
    tyre(435, 665, 205, 333),
    tyre(1545, 1775, 190, 340),
    // front suspension: upper and lower wishbones, pushrod
    arm(612, 57, 520, 205, 200, 165),
    arm(652, 57, 600, 205, 200, 165),
    arm(600, 57, 530, 205, 150, 120),
    arm(640, 57, 590, 205, 150, 120),
    arm(585, 60, 565, 195, 210, 90),
    // rear suspension
    arm(1700, 42, 1600, 190, 190, 170),
    arm(1735, 32, 1690, 190, 190, 170),
    arm(1700, 42, 1610, 190, 100, 85),
    // rear crash structure, rear wing, endplates, beam wing, wing pillar
    part(rect(1640, 1770, 0, 30), flat(135), 95, 1640, 1770, 30),
    part(rect(1725, 1905, 0, 196), flat(330), 308, 1725, 1905, 196),
    part(rect(1725, 1905, 183, 196), flat(330), 130, 1725, 1905, 196),
    part(rect(1760, 1880, 0, 160), flat(160), 150, 1760, 1880, 160),
    part(rect(1820, 1842, 0, 8), flat(308), 135, 1820, 1842, 8)
  ];

  // Surface points with normals: tops of every part, vertical faces down each outline,
  // and full cylinders for the tyres. Every point carries its part index for outlines.
  function samples(st) {
    var X = [], Y = [], Z = [], NX = [], NY = [], NZ = [], SH = [], PID = [], tone = 1, pid = 0;
    function add(x, y, z, n) {
      var lum = 0.12 + 0.88 * Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      lum = Math.min(1, lum * tone * (0.75 + 0.25 * Math.min(1, z / 140)));
      X.push(x - CX); Y.push(y); Z.push(z - CZ); NX.push(n[0]); NY.push(n[1]); NZ.push(n[2]); PID.push(pid);
      SH.push(CAR_DARK + (CAR_LIGHT - CAR_DARK) * lum);
    }
    var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]], e = st / 2;
    parts.forEach(function (p, index) {
      tone = p.tone; pid = index;
      if (p.cyl) {
        var steps = Math.max(24, Math.ceil(2 * Math.PI * p.r / st));
        for (var side = -1; side <= 1; side += 2) {
          for (var y = p.h0; y <= p.h1; y += st) {
            for (var k = 0; k < steps; k++) {
              var a = k / steps * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
              add(p.cx + p.r * c, side * y, p.r + p.r * s, [c, 0, s]);
            }
          }
          for (var rr = st; rr < p.r; rr += st) { // sidewalls
            var ring = Math.max(8, Math.ceil(2 * Math.PI * rr / st));
            for (var q = 0; q < ring; q++) {
              var b = q / ring * Math.PI * 2;
              add(p.cx + rr * Math.cos(b), side * p.h1, p.r + rr * Math.sin(b), [0, side, 0]);
              add(p.cx + rr * Math.cos(b), side * p.h0, p.r + rr * Math.sin(b), [0, -side, 0]);
            }
          }
        }
        return;
      }
      var y0 = -Math.ceil(p.h / st) * st;
      for (var x = p.x0; x <= p.x1; x += st) {
        for (var yy = y0; yy <= p.h; yy += st) {
          if (!p.inside(x, yy)) continue;
          var z = p.top(x, yy), bot = p.thick ? z - p.thick : p.bot;
          var gx = (p.top(x + e, yy) - p.top(x - e, yy)) / st, gy = (p.top(x, yy + e) - p.top(x, yy - e)) / st;
          add(x, yy, z, unit([-gx, -gy, 1]));
          for (var d = 0; d < 4; d++) {
            var dx = dirs[d][0], dy = dirs[d][1];
            if (p.inside(x + dx * st, yy + dy * st)) continue;
            for (var zz = bot; zz < z; zz += st) add(x + dx * e, yy + dy * e, zz, [dx, dy, 0]);
          }
        }
      }
    });
    return { n: X.length, x: new Float32Array(X), y: new Float32Array(Y), z: new Float32Array(Z),
      nx: new Float32Array(NX), ny: new Float32Array(NY), nz: new Float32Array(NZ),
      sh: new Float32Array(SH), pid: new Uint8Array(PID) };
  }

  /* ---------- State ---------- */
  var W = 0, H = 0, dpr = 1, sp = 9, dotR = 1.6, cols = 0, rows = 0, gox = 0, goy = 0;
  var model = null, scale = 1, ox = 0, oy = 0, carTop = 0, carBot = 0, gapMargin = 24, spaceTop = 0;
  var carV = new Float32Array(0), zb = new Float32Array(0), cellPart = new Uint8Array(0), carList = [];
  var cache = {}, layerStep = null, pending = 0, lastCopy = "", lastFade = "", lastLevel = "", buildToken = 0;
  var PITCH_STEP = 0.25;                              // camera angle is quantized to this (degrees)
  var LEVELS = 64;                                    // brightness levels for car dots (colour lookup table)
  var coarsePointer = window.matchMedia ? window.matchMedia("(pointer: coarse)").matches : false;

  /* ---------- Projection onto the dot grid ----------
     The camera looks at the nose head-on (car axis pointing at the viewer), raised by `pitch`. */
  function project(m, pitchD, s, x0, y0, fn) {
    var b = pitchD * Math.PI / 180, cp = Math.cos(b), spch = Math.sin(b);
    for (var i = 0; i < m.n; i++) {
      // facing test: normal against the direction toward the camera (-x, 0, up)
      if (-m.nx[i] * cp + m.nz[i] * spch < -0.02) continue;
      var X = m.x[i], Y = m.y[i], Z = m.z[i];
      var depth = -X, t = depth * cp + Z * spch, k = DIST / (DIST - t);
      fn(i, x0 + s * k * Y, y0 + s * k * (depth * spch - Z * cp), t);
    }
  }
  // Same projection as project(), inlined into the hot loop (runs once per camera step, then cached).
  function placeCar(pitchD) {
    for (var j = 0; j < carList.length; j++) { carV[carList[j]] = -1; zb[carList[j]] = -1e9; }
    carList.length = 0;
    var b = pitchD * Math.PI / 180, cp = Math.cos(b), spch = Math.sin(b), m = model;
    var mx = m.x, my = m.y, mz = m.z, mnx = m.nx, mnz = m.nz, inv = 1 / sp;
    for (var i = 0; i < m.n; i++) {
      if (-mnx[i] * cp + mnz[i] * spch < -0.02) continue;
      var depth = -mx[i], Z = mz[i], t = depth * cp + Z * spch, k = scale * DIST / (DIST - t);
      var gx = Math.round((ox + k * my[i] - gox) * inv), gy = Math.round((oy + k * (depth * spch - Z * cp) - goy) * inv);
      if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) continue;
      var c = gy * cols + gx;
      if (t > zb[c]) { if (carV[c] < 0) carList.push(c); zb[c] = t; carV[c] = m.sh[i]; cellPart[c] = m.pid[i]; }
    }
  }

  // Drops points that face away from (or edge-on to) the camera across the whole camera move.
  function cull(m) {
    var a = PITCH_LOW * Math.PI / 180, b = PITCH_HIGH * Math.PI / 180, keep = [];
    var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    for (var i = 0; i < m.n; i++) {
      if (-m.nx[i] * ca + m.nz[i] * sa > 0.02 || -m.nx[i] * cb + m.nz[i] * sb > 0.02) keep.push(i);
    }
    function pick(arr) { var o = new arr.constructor(keep.length); for (var j = 0; j < keep.length; j++) o[j] = arr[keep[j]]; return o; }
    return { n: keep.length, x: pick(m.x), y: pick(m.y), z: pick(m.z), nx: pick(m.nx), ny: pick(m.ny), nz: pick(m.nz), sh: pick(m.sh), pid: pick(m.pid) };
  }

  // Adds one dot to the current path (grid cell -> CSS pixels; the context is scaled by dpr).
  function dot(c2d, cellIndex) {
    var x = gox + (cellIndex % cols) * sp, y = goy + Math.floor(cellIndex / cols) * sp;
    c2d.moveTo(x + dotR, y); c2d.arc(x, y, dotR, 0, Math.PI * 2);
  }

  // Projection for one camera step: which grid cells the car covers and each dot's brightness
  // level (shading plus outline/gap treatment), cached so scrolling back and forth costs nothing.
  function projection(step) {
    if (cache[step]) return cache[step];
    placeCar(step * PITCH_STEP);
    var cells = new Int32Array(carList.length), lv = new Uint8Array(carList.length), n = 0;
    for (var j = 0; j < carList.length; j++) {
      var c = carList[j], kind = edgeKind(c), v = carV[c];
      v = kind < 0 ? BG_GRAY + (v - BG_GRAY) * 0.25 : kind > 0 ? Math.max(v, OUTLINE) : BG_GRAY + (v - BG_GRAY) * 0.62;
      var level = Math.round((v - BG_GRAY) / (255 - BG_GRAY) * (LEVELS - 1));
      if (level <= 0) continue; // same as the background dot underneath
      cells[n] = c; lv[n] = level; n++;
    }
    return (cache[step] = { cells: cells.slice(0, n), lv: lv.slice(0, n) });
  }
  // Fill the projection cache for every camera step in idle time after load.
  function prefill(token) {
    var lo = Math.round(PITCH_LOW / PITCH_STEP), hi = Math.round(PITCH_HIGH / PITCH_STEP), step = lo;
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 40); };
    (function next(deadline) {
      if (token !== buildToken || reduce.matches) return;
      do {
        while (step <= hi && cache[step]) step++;
        if (step > hi) return;
        projection(step);
      } while (deadline && deadline.timeRemaining && deadline.timeRemaining() > 10);
      idle(next);
    })();
  }

  function build() {
    var rect = box.getBoundingClientRect();            // CSS sizes it to the large viewport (stable on iOS)
    W = Math.round(rect.width) || window.innerWidth; H = Math.round(rect.height) || window.innerHeight;
    if (!W || !H) return;
    buildToken++;
    var mobile = coarsePointer || W < 640;
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    gridCanvas.width = Math.round(W * dpr);
    gridCanvas.height = Math.round(H * dpr);
    var narrow = W < 640, header = document.querySelector("header.site"), headerH = header ? header.offsetHeight : 0;

    // size the car once, from its revealed (low) view; the scale never changes while scrolling
    var coarse = samples(24);
    function extent(p) {
      var e = { w: 0, top: 1e9, bot: -1e9 };
      project(coarse, p, 1, 0, 0, function (i, px, py) {
        if (Math.abs(px) > e.w) e.w = Math.abs(px); if (py < e.top) e.top = py; if (py > e.bot) e.bot = py;
      });
      return e;
    }
    var low = extent(PITCH_LOW), high = extent(PITCH_HIGH);
    // full width of the page; only a very wide, short window caps it by height
    scale = Math.min(W * 0.98 / (2 * low.w), (H - headerH) * 0.9 / (low.bot - low.top));
    ox = W / 2;
    oy = headerH + (H - headerH) / 2 - scale * (low.top + low.bot) / 2;
    carTop = oy + scale * low.top; carBot = oy + scale * low.bot;
    gapMargin = Math.max(24, (H - headerH) * 0.04);
    layoutGap();

    sp = narrow ? 5 : 6;
    var area = (2 * low.w * scale) * ((low.bot - low.top) * scale) * 0.55;
    while (area / (sp * sp) > MAX_CAR_DOTS) sp += 1;
    dotR = sp * 0.18;
    cols = Math.floor(W / sp) + 1; rows = Math.floor(H / sp) + 1;
    gox = (W - (cols - 1) * sp) / 2; goy = (H - (rows - 1) * sp) / 2;
    var cells = cols * rows;
    carV = new Float32Array(cells).fill(-1); zb = new Float32Array(cells).fill(-1e9); cellPart = new Uint8Array(cells); carList = [];
    model = cull(samples(sp / scale / 1.2));
    cache = {}; layerStep = null; lastLevel = "";

    // pixel buffer and colour lookup table for the car, then the resting grid (drawn once)
    setupPixels();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = gray(BG_GRAY);
    ctx.beginPath();
    for (var c = 0; c < cells; c++) dot(ctx, c);
    ctx.fill();

    measure();
    update();
    prefill(buildToken);
  }

  /* ---------- Drawing ---------- */
  // Outlines make the parts readable on a coarse grid:
  // -1 = just behind a nearer part (drawn dark), 1 = on a part's outline (drawn bright), 0 = interior.
  function edgeKind(c) {
    var x = c % cols, near = zb[c] + EDGE, outline = false;
    var n = [x > 0 ? c - 1 : -1, x < cols - 1 ? c + 1 : -1, c - cols, c + cols < carV.length ? c + cols : -1];
    for (var k = 0; k < 4; k++) {
      var m = n[k];
      if (m < 0 || carV[m] < 0) { outline = true; continue; }
      if (zb[m] > near) return -1;
      if (cellPart[m] !== cellPart[c]) outline = true;
    }
    return outline ? 1 : 0;
  }
  function gray(v) { v = Math.round(v); return "rgb(" + v + "," + v + "," + Math.min(255, v + 3) + ")"; }

  // Car dots are written straight into a pixel buffer instead of being drawn as canvas paths.
  // Each dot is a stamp: the same anti-aliased circle the canvas would draw, rendered once per
  // sub-pixel position, so the result matches path drawing but costs a few array writes per dot.
  // The settings are computed here and handed to the painter (in the worker or on the page).
  function setupPixels() {
    var Wd = gridCanvas.width, Hd = gridCanvas.height, off = Math.ceil(dotR * dpr) + 1;
    function grid(n, origin, out, phase, seen) {
      for (var i = 0; i < n; i++) {
        var v = dpr * (origin + i * sp), b = Math.floor(v), q = Math.round((v - b) * 16);
        if (q === 16) { b++; q = 0; }
        out[i] = b; phase[i] = q; seen[q] = 1;
      }
    }
    var cx = {}, cy = {};
    var colX = new Int32Array(cols), colP = new Uint8Array(cols), rowY = new Int32Array(rows), rowP = new Uint8Array(rows);
    grid(cols, gox, colX, colP, cx); grid(rows, goy, rowY, rowP, cy);
    // one stamp per sub-pixel phase that actually occurs on this grid
    var stamps = {}, S = 2 * off + 1, c = document.createElement("canvas");
    c.width = c.height = S;
    var g = c.getContext("2d", { willReadFrequently: true });
    Object.keys(cx).forEach(function (qx) {
      Object.keys(cy).forEach(function (qy) {
        g.clearRect(0, 0, S, S);
        g.fillStyle = "#fff";
        g.beginPath(); g.arc(off + qx / 16, off + qy / 16, dotR * dpr, 0, Math.PI * 2); g.fill();
        var d = g.getImageData(0, 0, S, S).data, dx = [], dy = [], a = [];
        for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
          var al = d[(y * S + x) * 4 + 3];
          if (al) { dx.push(x - off); dy.push(y - off); a.push(al * 16777216); }
        }
        stamps[qx * 17 + +qy] = { n: a.length, dx: new Int16Array(dx), dy: new Int16Array(dy), a: new Uint32Array(a) };
      });
    });
    // packed RGB per brightness level (alpha comes from the stamp); little-endian ABGR
    var LUTp = new Uint32Array(LEVELS);
    for (var l = 0; l < LEVELS; l++) {
      var v = Math.round(BG_GRAY + (255 - BG_GRAY) * l / (LEVELS - 1));
      LUTp[l] = (Math.min(255, v + 3) << 16) | (v << 8) | v;
    }
    var cfg = { Wd: Wd, Hd: Hd, cols: cols, colX: colX, colP: colP, rowY: rowY, rowP: rowP, stamps: stamps, LUTp: LUTp, off: off };
    if (worker) worker.postMessage({ setup: cfg });
    else local.setup(cfg, carCanvas);
  }

  // Self-contained (no outside variables) so the same code can run inside the worker.
  function painter() {
    var ctx = null, canvas = null, img = null, pix = null, c = null, prev = null;
    return {
      setup: function (cfg, cv) {
        if (cv) { canvas = cv; ctx = canvas.getContext("2d"); }
        c = cfg; prev = null;
        canvas.width = c.Wd; canvas.height = c.Hd;
        img = ctx.createImageData(c.Wd, c.Hd);
        pix = new Uint32Array(img.data.buffer);
      },
      // Clears what the car covered last time, writes the new dots, uploads only that rectangle.
      draw: function (cells, lv) {
        var Wd = c.Wd, Hd = c.Hd, cols = c.cols, o = c.off, colX = c.colX, colP = c.colP, rowY = c.rowY, rowP = c.rowP;
        if (prev) for (var yy = prev[1]; yy <= prev[3]; yy++) pix.fill(0, yy * Wd + prev[0], yy * Wd + prev[2] + 1);
        var x0 = Wd, y0 = Hd, x1 = -1, y1 = -1;
        for (var j = 0; j < cells.length; j++) {
          var cell = cells[j], col = cell % cols, row = (cell - col) / cols;
          var bx = colX[col], by = rowY[row], st = c.stamps[colP[col] * 17 + rowP[row]], rgb = c.LUTp[lv[j]];
          if (bx - o < x0) x0 = bx - o; if (bx + o > x1) x1 = bx + o;
          if (by - o < y0) y0 = by - o; if (by + o > y1) y1 = by + o;
          var sdx = st.dx, sdy = st.dy, sa = st.a;
          for (var k = 0; k < st.n; k++) {
            var x = bx + sdx[k], y = by + sdy[k];
            if (x < 0 || y < 0 || x >= Wd || y >= Hd) continue;
            pix[y * Wd + x] = sa[k] | rgb;
          }
        }
        var box = x1 < 0 ? null : [Math.max(0, x0), Math.max(0, y0), Math.min(Wd - 1, x1), Math.min(Hd - 1, y1)];
        var u = prev && box ? [Math.min(prev[0], box[0]), Math.min(prev[1], box[1]), Math.max(prev[2], box[2]), Math.max(prev[3], box[3])] : (box || prev);
        if (u) ctx.putImageData(img, 0, 0, u[0], u[1], u[2] - u[0] + 1, u[3] - u[1] + 1);
        prev = box;
      }
    };
  }

  // Draws the car at full brightness into its own layer; only needed when the camera step changes.
  function drawLayer(step) {
    var p = projection(step);
    if (worker) worker.postMessage({ cells: p.cells, lv: p.lv });
    else local.draw(p.cells, p.lv);
    layerStep = step;
  }
  // One frame: redraw the car only if the camera stepped, then set its brightness as opacity.
  // The full-brightness car at opacity `level` over the gray grid gives gray + (car - gray) * level,
  // the same result as recolouring every dot.
  function render(step, level) {
    if (step !== layerStep) drawLayer(step);
    var l = level.toFixed(3);
    if (l !== lastLevel) { carCanvas.style.opacity = l; lastLevel = l; }
  }

  /* ---------- Scroll choreography ---------- */
  // The space between the title and the content is sized to the car as drawn on this screen,
  // so the content arrives just below the car whatever its height. --car-gap is read by style.css.
  function layoutGap() {
    var next = hero.nextElementSibling, first = next && next.querySelector("h2, h3, p");
    hero.style.setProperty("--car-gap", "0px");
    var pad = first ? first.getBoundingClientRect().top - hero.getBoundingClientRect().bottom : 0;
    hero.style.setProperty("--car-gap", Math.round(Math.max(0, carBot - carTop + 2 * gapMargin - pad)) + "px");
  }
  // Document position where the space under the title starts; measured once, not on every scroll frame.
  function measure() {
    var y = window.scrollY || window.pageYOffset || 0;
    spaceTop = copy ? copy.getBoundingClientRect().bottom + y : hero.getBoundingClientRect().top + y + H;
  }
  function update() {
    pending = 0;
    if (document.hidden || !model) return;
    var vh = H, y = window.scrollY || window.pageYOffset || 0;
    var revealEnd = Math.max(1, spaceTop - (carTop - gapMargin)); // title just above the car, content just below
    var reveal = smooth(y / (revealEnd * 0.9));                   // name fades, car lights up, camera lowers
    var dim = smooth((y - revealEnd) / Math.max(1, (carBot - carTop) * 0.8)); // content covers the car, layer fades to black
    var level = START_LEVEL + (1 - START_LEVEL) * reveal;
    var pitch = reduce.matches ? PITCH_LOW : PITCH_HIGH + (PITCH_LOW - PITCH_HIGH) * reveal;
    var copyOpacity = (1 - smooth(y / (vh * 0.4))).toFixed(3), fade = (1 - dim).toFixed(3);
    if (copy && copyOpacity !== lastCopy) { copy.style.opacity = copyOpacity; lastCopy = copyOpacity; }
    if (fade !== lastFade) { box.style.opacity = fade; lastFade = fade; }
    if (dim >= 1) return; // fully faded: nothing to draw
    render(Math.round(pitch / PITCH_STEP), level);
  }
  function schedule() { if (!pending) pending = requestAnimationFrame(update); }
  window.addEventListener("scroll", schedule, { passive: true });

  // Rebuild only when the width changes. Height-only changes (the iOS toolbar showing and hiding)
  // are ignored: the canvas is sized to the large viewport, so it never needs to grow. On desktop
  // (fine pointer), where the height only changes when the window itself is resized, that rebuilds too.
  var timer = 0;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var r = box.getBoundingClientRect();
      if (Math.round(r.width) !== W || (!coarsePointer && Math.abs(Math.round(r.height) - H) > 1)) build();
      else { measure(); schedule(); }
    }, 200);
  }, { passive: true });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { if (pending) cancelAnimationFrame(pending); pending = 0; }
    else schedule();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layoutGap(); measure(); schedule(); });
  function refresh() { update(); }
  if (reduce.addEventListener) reduce.addEventListener("change", refresh);
  else if (reduce.addListener) reduce.addListener(refresh);

  build();
})();
