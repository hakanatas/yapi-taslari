/* SAHNE 2 — ELEME (10–34 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 2, start: 10, end: 34, name: 'The sieve', nameTr: 'Eleme', concept: 'Crossing out multiples up to 30', conceptTr: '30’a kadar katları eleme', render });
})(window.LI = window.LI || {});
