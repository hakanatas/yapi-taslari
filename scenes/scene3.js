/* SAHNE 3 — ÖZELLİKLER (34–46 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 3, start: 34, end: 46, name: 'Properties', nameTr: 'Özellikler', concept: '1, 2, and composite numbers', conceptTr: '1, 2 ve bileşik sayılar', render });
})(window.LI = window.LI || {});
