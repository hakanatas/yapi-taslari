/* SAHNE 5 — YAPI TAŞLARI (70–80 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 5, start: 70, end: 80, name: 'Building blocks', nameTr: 'Yapı taşları', concept: 'Every composite is a product of primes', conceptTr: 'Bileşik sayı = asalların çarpımı', render });
})(window.LI = window.LI || {});
