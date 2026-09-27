/* ─────────────────────────────────────────────────────────────
   The film's continuous state as pure functions of time.
   A sieve on 1..30 finds the primes; two different factor trees of 60
   end in the same primes; every composite is a product of primes.
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, outBack, outCubic, inOut, hump } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;

  const T = (ctx, s, x, y, o = {}) => A.text(ctx, s, x, y, Object.assign({ size: 48 }, o));
  const AMB = { color: A.amber };
  /** text width in the brush font */
  function width(ctx, s, size) { ctx.save(); ctx.font = `${size}px "LI Brush", "Comic Sans MS", cursive`; const w = ctx.measureText(s).width; ctx.restore(); return w; }
  /** write text, shrinking it to fit width w */
  function fit(ctx, s, x, y, size, w, o = {}) { const m = width(ctx, s, size); T(ctx, s, x, y, Object.assign({ size: m > w ? size * w / m : size }, o)); }
  /** a hand-drawn check mark at (x, y) */
  function tick(ctx, x, y, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x, y], [x + 12, y + 14], [x + 38, y - 20]], { w: 7, p, alpha: a, color: LI.AMBER_RGB, seed: 401, taper: [0.05, 0.3] });
  }
  /** a hand-drawn cross over (x, y) */
  function cross(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, color: LI.AMBER_RGB, seed: 411, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, color: LI.AMBER_RGB, seed: 412, taper: [0.1, 0.3] });
  }

  /* ── the sieve: numbers 1..30 in a grid ─────────────────── */
  const N = 30;
  const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const spf = (n) => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return d; return n; };
  const PRIMES = []; for (let n = 2; n <= N; n++) if (isPrime(n)) PRIMES.push(n);
  /** prime factors in order, e.g. 60 → [2, 2, 3, 5] */
  function factorize(n) { const f = []; let m = n; for (let d = 2; m > 1; d++) while (m % d === 0) { f.push(d); m /= d; } return f; }
  const LATE = PRIMES.filter((p) => p > 7);
  /** when each prime gets its ring */
  const ringT = (n) => ({ 2: 16.0, 3: 20.2, 5: 24.0, 7: 26.4 })[n] ?? 28.0 + LATE.indexOf(n) * 0.3;
  /** when each composite gets crossed (by its smallest prime factor) */
  function crossT(n) {
    const p = spf(n);
    if (p === 2) return 16.8 + (n / 2 - 2) * 0.2;
    if (p === 3) return 21.0 + [9, 15, 21, 27].indexOf(n) * 0.6;
    return 24.8; // 25
  }
  function cellPos(G, n) {
    const i = n - 1, c = i % G.cols, r = Math.floor(i / G.cols);
    return [G.x + (c - (G.cols - 1) / 2) * G.cell, G.y + r * G.cell];
  }
  /** the grid at time t; a: overall alpha, pulse(n) → 0..1 extra glow */
  function sieve(ctx, G, t, a, pulse = () => 0) {
    if (a <= 0) return;
    for (let n = 1; n <= N; n++) {
      const k = seg(t, 10.4 + n * 0.03, 10.8 + n * 0.03); if (k <= 0) continue;
      const [x, y] = cellPos(G, n), pr = isPrime(n);
      const ring = pr ? seg(t, ringT(n), ringT(n) + 0.5) : 0, cr = !pr && n > 1 ? seg(t, crossT(n), crossT(n) + 0.35) : 0;
      const dim = n === 1 ? seg(t, 14.2, 14.8) : cr, pl = pulse(n);
      const size = G.s * (1 + 0.2 * pl), al = a * k * (1 - 0.6 * dim);
      if (ring < 1) T(ctx, String(n), x, y - 12 * (1 - outBack(k)), { size, alpha: al * (1 - ring) });
      if (ring > 0) { T(ctx, String(n), x, y, Object.assign({ size, alpha: al * ring }, AMB)); A.arc(ctx, [x, y - 2], G.cell * 0.4, 90, 450, { p: ring, alpha: a, w: 4, seed: 30 + n }); }
      if (cr > 0) crossInk(ctx, x, y - 2, G.cell * 0.22, cr, a * 0.7);
    }
  }

  /* ── factor trees ───────────────────────────────────────── */
  /** one node: a number, amber-ringed when prime */
  function node(ctx, x, y, n, k, P, a) {
    if (k <= 0 || a <= 0) return;
    const pr = isPrime(n), s = P.s * (0.7 + 0.3 * outBack(k));
    T(ctx, String(n), x, y, Object.assign({ size: s, alpha: a * clamp(k * 2) }, pr ? AMB : {}));
    if (pr) A.arc(ctx, [x, y - 2], P.s * 0.62, 90, 450, { p: seg(k, 0.3, 1), alpha: a, w: 4, seed: 60 + n + Math.round(x) });
  }
  /** a two-level factor tree: root = l[0]·l[1], l[0] = ll[0][0]·ll[0][1] …; T4 = [root, level 1, left pair, right pair] */
  function tree(ctx, P, root, l, ll, T4, t, a) {
    if (a <= 0) return;
    const X = (dx) => P.x + dx, Y = (lv) => P.y + lv * P.dy;
    const branch = (x0, y0, x1, y1, p, seed) => { if (p > 0) Ink.path(ctx, [[x0, y0 + P.s * 0.45], [x1, y1 - P.s * 0.5]], { w: 4, p, alpha: a * 0.8, seed, taper: [0.1, 0.2] }); };
    node(ctx, X(0), Y(0), root, seg(t, T4[0], T4[0] + 0.5), P, a);
    [-1, 1].forEach((sd, i) => {
      const t1 = T4[1] + i * 0.3, x1 = X(sd * P.a);
      branch(X(0), Y(0), x1, Y(1), seg(t, t1, t1 + 0.4), 70 + i);
      node(ctx, x1, Y(1), l[i], seg(t, t1 + 0.3, t1 + 0.8), P, a);
      const t2 = T4[2 + i];
      [-1, 1].forEach((s2, j) => {
        const x2 = x1 + s2 * P.b, tt = t2 + j * 0.3;
        branch(x1, Y(1), x2, Y(2), seg(t, tt, tt + 0.4), 80 + i * 2 + j);
        node(ctx, x2, Y(2), ll[i][j], seg(t, tt + 0.3, tt + 0.8), P, a);
      });
    });
  }
  /** an ink cross */
  function crossInk(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 5, p: clamp(p * 2), alpha: a, seed: 421, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 5, p: clamp(p * 2 - 1), alpha: a, seed: 422, taper: [0.1, 0.3] });
  }

  /** Nokta, as a function of time */
  function nokta(t, env) {
    const L = KD.L(env);
    const p = { x: L.nx, y: L.gy, s: L.s, mouth: 0.4, brow: 0.1 };
    const g = outCubic(seg(t, 1.3, 2.3));
    p.born = { body: lerp(0.3, 1, g), legs: outCubic(seg(t, 2.0, 2.6)), arms: outCubic(seg(t, 2.3, 2.8)), tuft: outBack(seg(t, 2.5, 2.9)) };
    if (t < 3.0) { p.sq = lerp(0.4, 1, clamp(LI.E.spring(seg(t, 1.3, 3.0) * 2, 8, 3.4), 0, 1.3)); p.drop = 1 - g; p.wobble = 1 - seg(t, 1.3, 2.8); }
    p.eyeOpen = outCubic(seg(t, 2.8, 3.1));
    KD.look(p, [L.GRID.x, L.GRID.y + 90]);
    if (t > 46 && t < 70) KD.look(p, [L.TA.x, L.TA.y + L.TA.dy]);
    if (t > 56 && t < 70) KD.look(p, [L.TB.x, L.TB.y + L.TB.dy]);
    if (t > 70 && t < 80) KD.look(p, [L.W.x, L.W.y[1]]);
    if (t > 80 && t < 84) KD.look(p, [L.SUM.x, L.SUM.y[1]]);
    if (t > 2.9 && t < 5.6) { p.hold = 'brush'; p.brushAng = -0.8 + 0.3 * Math.sin(t * 9); p.hands = { R: [1.35, -0.2 + 0.15 * Math.sin(t * 9)] }; }
    const pointing = (a, b) => { if (t > a && t < b) { p.point = 'R'; p.hands = { L: [-1.2, 0.55], R: [1.5, -0.35] }; } };
    pointing(12.6, 14.4); pointing(16.0, 17.4); pointing(20.2, 21.6); pointing(24.0, 25.2); pointing(30.2, 32.0); pointing(47.0, 48.6); pointing(53.0, 54.6); pointing(64.4, 66.0); pointing(75.2, 76.8); pointing(80.6, 82.4);
    const think = seg(t, 55.4, 55.8) * (1 - seg(t, 56.8, 57.1));
    if (think > 0) { p.hands = { L: [-1.2, 0.55], R: [0.75, -1.05 + 0.08 * Math.sin(t * 14)] }; p.brow = -0.5 * think; p.mouth = 0; p.lookY -= 0.3; }
    if (t > 63.0 && t < 64.2) { p.mouthOpen = 0.55; p.eyeScale = 1.1; }
    const joy = (a, b) => { if (t > a && t < b) { p.squint = 1; p.mouth = 1; p.sq = 1 + 0.1 * hump(t, a, a + 0.6); p.y -= 26 * hump(t, a, a + 0.6); p.hands = { L: [-1.3, -0.35], R: [1.3, -0.35] }; } };
    joy(28.6, 30.0); joy(44.0, 45.6); joy(66.4, 68.0); joy(77.4, 79.0);
    if (t > 84.0) {
      const j = (t - 84.0) % 1.4;
      p.squint = 1; p.mouth = 1; p.turn = 0.15; p.lookX = 0.3; p.lookY = 0;
      p.sq = 1 + 0.1 * Math.sin(Math.PI * clamp(j / 0.6)); p.y -= 40 * Math.sin(Math.PI * clamp(j / 0.6));
      p.hands = { L: [-1.35, -0.6 - 0.2 * Math.sin(t * 6)], R: [1.35, -0.6 + 0.2 * Math.sin(t * 6)] };
      if (t > 89.2) { p.squint = 0; p.lookX = 0; p.lookY = 0.2; p.turn = 0; p.y = L.gy; p.sq = 1; p.hands = { L: [-1.2, 0.55], R: [1.2, -1.0 + 0.25 * Math.sin(t * 10)] }; }
    }
    p.blink = Math.max(hump(t, 5.8, 5.95), hump(t, 18.0, 18.15), hump(t, 33.0, 33.15), hump(t, 50.0, 50.15), hump(t, 70.0, 70.15), hump(t, 81.0, 81.15));
    return p;
  }

  function base(ctx, env, t, cam, drawBefore) {
    const L = KD.L(env);
    LI.Ambient.specks(ctx, env, cam, t, { alpha: 0.22, n: 18, depth: 0.4, seed: 21 });
    LI.Camera.apply(ctx, env, cam);
    KD.ground(ctx, env, L.nx, L.gy);
    if (drawBefore) drawBefore();
    LI.Nokta.draw(ctx, LI.Nokta.follow((tt) => nokta(tt, env), t), t);
    if (t < 1.35 && t > 0.3) { const f = seg(t, 0.3, 1.3); Ink.dot(ctx, L.nx, lerp(-700, L.gy - 14, f * f), 15, { seed: 2, bleed: 0 }); }
    if (t > 1.3) Ink.drops(ctx, L.nx, L.gy - 4, t - 1.3, { n: 9, seed: 5, ground: L.gy + 4, scale: 0.8, alpha: 1 - seg(t, 4, 8) * 0.6 });
    return L;
  }

  LI.Film = { T, AMB, width, fit, tick, cross, crossInk, N, isPrime, PRIMES, factorize, cellPos, sieve, node, tree, nokta, base };
})(window.LI = window.LI || {});
