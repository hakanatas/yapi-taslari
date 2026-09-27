/* SAHNE 1 — ÇOK ÇARPANLI, AZ ÇARPANLI (0–10 s)  7 and 12 again.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut, hump } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  /** timed lines at one place: [start, end, text, amber?] */
  function lines(ctx, t, P, list) {
    const f = F();
    list.forEach(([a, b, s, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.fit(ctx, s, P.x, P.y, P.s, P.w, Object.assign({ alpha: al, halo: true, p: seg(t, a, a + 1.2) }, hot ? f.AMB : {}));
    });
  }
  const at = (W, k) => ({ x: W.x, y: W.y[k], s: W.s, w: W.w });

  function context(ctx, env, t) {
    lines(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bazı sayıların çarpanı çok, bazılarının çok az'],
      [10.6, 15.6, 'Asal sayı: yalnızca 1’e ve kendisine bölünür', true],
      [15.8, 26.2, 'Eleyelim: 2’nin, 3’ün, 5’in katları asal olamaz'],
      [26.4, 29.8, '7’nin katları zaten elendi: kalanlar asal'],
      [30.0, 34.0, '30’a kadar 10 asal sayı var'],
      [34.4, 45.8, 'Asal sayıların özellikleri'],
      [46.4, 55.2, '60’ı asal çarpanlarına ayıralım'],
      [55.4, 62.8, 'Başka bir yoldan başlasak?'],
      [63.0, 69.6, 'Hangi yoldan gidersek gidelim: aynı asal çarpanlar!', true],
      [70.4, 76.8, 'Başka sayılarla deneyelim'],
      [77.0, 79.8, 'Bileşik sayılar asal sayıların çarpımıdır', true],
    ]);
  }

  function sieveWork(ctx, env, t) {
    const L = KD.L(env), W = L.W, f = F();
    const a = seg(t, 10.2, 10.6) * (1 - seg(t, 45.4, 46.2));
    const pulse = (n) => (n === 2 ? hump(t, 34.6, 36.6) : n === 1 ? hump(t, 37.6, 39.4) : n === 9 || n === 3 ? hump(t, 40.6, 42.4) : 0);
    f.sieve(ctx, L.GRID, t, a, pulse);
    lines(ctx, t, at(W, 0), [[5.0, 10.2, '7 = 1 × 7'], [14.4, 15.8, '1 asal değil: tek çarpanı var'], [16.0, 19.8, '2 asal · 2’nin katları elendi'],
      [20.2, 23.6, '3 asal · 3’ün katları elendi'], [24.0, 26.2, '5 asal · 25 elendi'], [26.4, 29.8, '7 asal · 7 × 7 = 49, 30’dan büyük'],
      [30.0, 34.0, '2, 3, 5, 7, 11, 13, 17, 19, 23, 29', true], [34.6, 45.8, '2, tek çift asal sayıdır']]);
    lines(ctx, t, at(W, 1), [[6.4, 10.2, '12 = 1 × 12 = 2 × 6 = 3 × 4'], [37.4, 45.8, '1 ne asal ne bileşiktir']]);
    lines(ctx, t, at(W, 2), [[40.4, 45.8, 'Asal olmayanlar bileşiktir: 9 = 3 × 3']]);
    lines(ctx, t, at(W, 3), [[42.8, 45.8, 'Bir asalın tam 2 çarpanı var: 1 ve kendisi', true]]);
  }

  function trees(ctx, env, t) {
    const L = KD.L(env), f = F(), out = 1 - seg(t, 69.4, 70.2);
    const aA = seg(t, 46.8, 47.0) * out, aB = seg(t, 56.8, 57.0) * out;
    if (aA > 0) {
      const m = inOut(seg(t, 55.6, 56.4)), P = Object.assign({}, L.TA, { x: lerp(L.TA.x, L.TA2.x, m), y: lerp(L.TA.y, L.TA2.y, m) });
      f.tree(ctx, P, 60, [6, 10], [[2, 3], [2, 5]], [47.0, 48.2, 50.0, 51.6], t, aA);
      lines(ctx, t, { x: P.x, y: P.eq, s: P.s * 0.8, w: env.V ? 900 : 520 }, [[53.0, 69.8, '60 = 2 × 3 × 2 × 5']]);
    }
    if (aB > 0) {
      const P = L.TB;
      f.tree(ctx, P, 60, [4, 15], [[2, 2], [3, 5]], [57.0, 58.0, 59.4, 60.8], t, aB);
      lines(ctx, t, { x: P.x, y: P.eq, s: P.s * 0.8, w: env.V ? 900 : 520 }, [[62.0, 69.8, '60 = 2 × 2 × 3 × 5']]);
    }
    const R = L.RES;
    lines(ctx, t, { x: R.x, y: R.y[0], s: R.s, w: R.w }, [[64.2, 69.8, 'Asal çarpanlar aynı: 2, 2, 3, 5', true]]);
    lines(ctx, t, { x: R.x, y: R.y[1], s: R.s * 0.8, w: R.w }, [[66.2, 69.8, '60’ın asal çarpanları: 2, 3 ve 5']]);
  }

  function examples(ctx, env, t) {
    const W = KD.L(env).W, f = F();
    [12, 30, 49, 29].forEach((n, k) => {
      const fs = f.factorize(n), s = fs.length === 1 ? `${n} = ${n}: kendisi asal` : `${n} = ${fs.join(' × ')}`;
      lines(ctx, t, at(W, k), [[71.0 + k * 1.4, 79.8, s, fs.length === 1]]);
    });
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Asal sayı: tam 2 çarpanı var', 80.6], ['1 asal değil · 2 tek çift asal', 81.6], ['Her bileşik sayı asalların çarpımıdır', 82.6], ['60 = 2 × 2 × 3 × 5', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.fit(ctx, s, S.x, S.y[i], S.s * (i === 3 ? 1.4 : 1), S.w, Object.assign({ alpha: al, halo: true, p: seg(t, t0, t0 + 1.2) }, hot ? f.AMB : {}));
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); sieveWork(ctx, env, t); trees(ctx, env, t); examples(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'Many or few factors', nameTr: 'Çok çarpan, az çarpan', concept: '7 and 12 again', conceptTr: 'Yine 7 ve 12', render });
})(window.LI = window.LI || {});
