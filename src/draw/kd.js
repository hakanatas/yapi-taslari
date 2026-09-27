/* Shared layout + Nokta helpers for "Sayıların Yapı Taşları". */
(function (LI) {
  'use strict';
  const { clamp } = LI.E;
  LI.KD = {
    /** positions for 16:9 and 9:16 */
    L(env) {
      return env.V
        ? {
          CX: { x: 0, y: -760, s: 44, w: 960 },
          GRID: { x: 0, y: -600, cell: 100, cols: 6, s: 46 },
          W: { x: 0, y: [-70, 10, 90, 170], s: 44, w: 960 },
          TA: { x: 0, y: -660, dy: 115, a: 160, b: 80, eq: -365, s: 50 },
          TA2: { x: 0, y: -660, dy: 115, a: 160, b: 80, eq: -365, s: 50 },
          TB: { x: 0, y: -270, dy: 115, a: 160, b: 80, eq: 30, s: 50 },
          RES: { x: 0, y: [130, 215], s: 56, w: 960 },
          SUM: { x: 0, y: [-560, -460, -360, -240], s: 50, w: 960 },
          nx: -360, gy: 560, s: 1.15 }
        : {
          CX: { x: 60, y: -440, s: 50, w: 1300 },
          GRID: { x: 100, y: -300, cell: 100, cols: 10, s: 50 },
          W: { x: 100, y: [-10, 70, 150, 230], s: 50, w: 1250 },
          TA: { x: 100, y: -330, dy: 125, a: 150, b: 75, eq: 20, s: 54 },
          TA2: { x: -190, y: -330, dy: 125, a: 150, b: 75, eq: 20, s: 54 },
          TB: { x: 430, y: -330, dy: 125, a: 150, b: 75, eq: 20, s: 54 },
          RES: { x: 120, y: [125, 210], s: 60, w: 1250 },
          SUM: { x: 100, y: [-230, -140, -50, 60], s: 56, w: 1250 },
          nx: -800, gy: 262, s: 1.15 };
    },
    cam(env, o = {}) { return Object.assign({ x: env.V ? 0 : -60, y: env.V ? 60 : 0, zoom: 1, rot: 0, tilt: 1 }, o); },
    /** pupils + face toward a world point */
    look(p, target) {
      const e = LI.Nokta.eyes(p)[0];
      const dx = target[0] - e[0], dy = target[1] - e[1], d = Math.hypot(dx, dy) || 1;
      p.lookX = clamp(dx / d * 1.1, -1, 1); p.lookY = clamp(dy / d * 1.1, -1, 1);
      p.turn = clamp(dx / 900, -0.5, 0.5);
      return p;
    },
    /** a short ground stroke under Nokta */
    ground(ctx, env, x, gy) { LI.Ambient.ground(ctx, x - 360, x + 360, gy + 6, { alpha: 0.32 }); },
  };
})(window.LI = window.LI || {});
