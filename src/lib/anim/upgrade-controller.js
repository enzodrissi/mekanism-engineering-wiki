// Precision Upgrade Controller. What the game shows, and where it is written:
//  - Idle / Running: models/block/precision_upgrade_controller_active.json swaps the front texture for front_active while the
//    Controller scans or applies upgrades (that is the whole difference between the two models).
//  - The work cube: client/render/RenderUpgradeController.java draws, when the Visuals tab of the screen is on, the same translucent
//    white box as the Quantum Digital Miner's zone (RenderQuantumDigitalMiner.zone), over AABB(blockPos).inflate(radius): a cube of
//    2 * radius + 1 blocks centred on the Controller, pulled in by 0.01 on every side. Face opacity comes from COLORS there
//    (up/down 0.82, north/south 0.8, east/west 0.78).
//  - The radius is the server setting upgrade_controller.radius: 1 to 64, 8 by default (ServerConfig.UPGRADE_RADIUS, wiki page).
//    Players cannot change it in the game; here it is a slider only so that the sizes can be compared.
// Not from the game: the game's opacity is kept in proportion (FACE_ALPHA) but scaled down so that the block stays visible through the
// box on a page, and thin teal edges are added so that a white box can be seen on the light theme.
import * as THREE from 'three';
import { bar, caption } from './ui.js';
import { L, num } from '../i18n.js';

const MIN = 1, MAX = 64, DEFAULT = 8;
const FACE_ALPHA = { x: 0.78, y: 0.82, z: 0.8 };  // COLORS in RenderQuantumDigitalMiner
const SCALE = 0.3;                                  // the page's legibility factor, see above

export default async function setup(ctx) {
  const { stage, host, active } = ctx;
  let radius = DEFAULT, shown = false, fade = 0, fadeRun = 0, camRun = 0;

  // one unit cube for every radius: only its scale changes. BoxGeometry order of the faces: +x, -x, +y, -y, +z, -z
  const alphas = [FACE_ALPHA.x, FACE_ALPHA.x, FACE_ALPHA.y, FACE_ALPHA.y, FACE_ALPHA.z, FACE_ALPHA.z];
  const mats = alphas.map(() => new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, forceSinglePass: true, depthWrite: false }));
  const box = new THREE.BoxGeometry(1, 1, 1);
  const zone = new THREE.Mesh(box, mats);
  zone.position.set(0.5, 0.5, 0.5); zone.renderOrder = 5;
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x2bc4ad, transparent: true, opacity: 0 });
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(box), edgeMat);
  edges.renderOrder = 6; zone.add(edges);
  const paint = () => { mats.forEach((m, i) => { m.opacity = alphas[i] * SCALE * fade; }); edgeMat.opacity = 0.85 * fade; };

  /** Size of the cube for a radius, in blocks (the game pulls it in by 0.01 on each side). */
  const side = r => 2 * r + 1;
  function resize() { zone.scale.setScalar(side(radius) - 0.02); }

  /** Fits the camera to what is in the view now, gliding from where it is (at once with reduced motion). */
  function refit() {
    const c = stage.cam, from = [c.left, c.right, c.top, c.bottom];
    stage.frame(false, false);
    const to = [c.left, c.right, c.top, c.bottom], me = ++camRun;
    if (ctx.still) { stage.draw(); return; }
    const put = a => { [c.left, c.right, c.top, c.bottom] = a; c.updateProjectionMatrix(); };
    put(from);
    ctx.tween(350, t => { if (me !== camRun) return; const k = ctx.easeInOut(t); put(from.map((v, i) => v + (to[i] - v) * k)); stage.draw(); });
  }

  /**
   * Shows or hides the cube. The camera fits what is in `stage.root`, so the cube is there only while shown; while it fades out
   * it waits in the scene, outside the fit.
   */
  function show(on) {
    if (on === shown) return;
    shown = on; const me = ++fadeRun;
    if (on) { resize(); stage.root.add(zone); } else stage.scene.add(zone);
    const from = fade, to = on ? 1 : 0;
    if (ctx.still) { fade = to; paint(); if (!on) stage.scene.remove(zone); }
    else ctx.tween(260, t => {
      if (me !== fadeRun) return;
      fade = from + (to - from) * t; paint();
      if (t === 1 && !shown) stage.scene.remove(zone);
      stage.draw();
    });
    refit(); sync();
  }

  // ---- controls: a real toggle button and a slider, under the view ----
  const tog = document.createElement('div');
  tog.className = 'me-seg me-anim-seg';
  tog.innerHTML = `<button type="button" aria-pressed="false">${L('Show work cube')}</button>`;
  const btn = tog.firstChild;
  bar(host).append(tog);
  btn.addEventListener('click', () => show(!shown));

  const rng = document.createElement('label');
  rng.className = 'me-anim-range';
  rng.innerHTML = `<span class="me-anim-range-name">${L('Radius')}</span><input type="range" min="${MIN}" max="${MAX}" step="1" value="${DEFAULT}" aria-label="${L("Work cube radius in blocks (the game's server setting allows 1 to {max})", { max: MAX })}"><output aria-hidden="true"></output>`;
  const input = rng.querySelector('input'), out = rng.querySelector('output');
  bar(host).append(rng);
  const note = caption(host, '');

  function sync() {
    btn.setAttribute('aria-pressed', String(shown));
    const s = side(radius);
    const v = { r: num(radius), s: num(s), max: MAX, def: DEFAULT };
    out.textContent = radius === DEFAULT ? L('{r} (default)', v) : v.r;
    input.setAttribute('aria-valuetext', L('{r} blocks, a cube of {s} by {s} by {s}', v));
    note.set(shown
      ? L('Work cube: {s} × {s} × {s} blocks, centred on the Controller. In the game it is shown by the Visuals tab, and the radius is a server setting (1 to {max}, {def} by default).', v)
      : L('The Controller fits upgrades into every machine inside a cube around it. Press Show work cube to see it.') + (active.on ? ' ' + L('Running: the front panel is lit.') : ''));
  }
  input.addEventListener('input', () => {
    radius = +input.value;
    if (!shown) { show(true); return; }
    resize(); sync(); refit();
  });
  active.onChange(() => sync());
  sync();
}
setup.active = true;
