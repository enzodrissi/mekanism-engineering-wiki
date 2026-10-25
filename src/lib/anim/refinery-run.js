// Quantum Ore Refinery: a job from the input port to the output, shown on the refinery viewer (mountRefinery).
// Sources (nothing here is made up):
//  - src/data/qor-levels.json (the wiki page's table): the steps of each level in order, what each takes from the tanks, the ingots one iron ore gives.
//  - the wiki page "Speed and accelerators" + RefinerySpeed.ticks (common/refinery/RefinerySpeed.java): the length of a job at a level with n accelerators.
//  - the in-game texts of the modules (wiki, "In-game texts"): what each module makes (dirty slurry, clean slurry, crystals, shards, clumps, dust, ingots),
//    and the Conveyor's: "the belt along the second layer that carries the ore past the modules".
//  - RefineryTemplate.TEXT (src/lib/refinery.js): the input port at the left end (items only), the modules in the order Dissolution ... Smelting under the belt,
//    the output port and the Quantum Module at the right end.
//  - minecraft:item/raw_iron and iron_ingot: the vanilla textures of the ore and of what it becomes.
// The Crusher is a step of the chain with no module in the structure (the wiki lists seven modules), so nothing lights for it.
// The tanks are not animated: their models show no fluid level (models/block/ore_refinery/tank_*), only the controller holds the stock.
import * as THREE from 'three';
import { getTexture } from '../mcmodel.js';
import levels from '../../data/qor-levels.json';

const R = 'ore_refinery_';
const MIN_STEP = 0.45;   // s: the shortest a step is shown (a real x1 job is 1 tick = 0.05 s, invisible)
const MIN_JOB = 1.2;     // s: the shortest a whole job is shown
const IN = 0.8, OUT = 1.4, GAP = 0.6; // s: ore coming in, ingots going out, pause before the next job (not part of the job's own time)
const DIM = 0.3, LIT = 1.25; // colour factor of a LED glow: waiting / working (1 is the model as the game draws it)
const SIZE = 0.6;
const BELT = 0.45;       // height of the belt surface of a conveyor, in blocks (models/block/ore_refinery/conveyor.json: its plate is 7/16 high)       // sprite size, in blocks
const MADE = { dissolution: 'dirty slurry', washing: 'clean slurry', crystallization: 'crystals', injection: 'shards', purification: 'clumps', enrichment: 'dust', smelting: 'ingots' };

// same formula as the calculator of the page (src/scripts/site.ts) and RefinerySpeed.ticks
const ticksOf = (level, n) => level <= 1 ? 1 : Math.max(1, Math.round(200 * Math.pow(50, -n / 8) * (level - 1) / 4));
const secs = t => `${t} tick${t === 1 ? '' : 's'} (${+(t / 20).toFixed(2)} s)`;
const clamp01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = x => { x = clamp01(x); return x * x * (3 - 2 * x); };

/** "Purification (ore and oxygen), Crusher, Enrichment, smelting" -> steps. */
function stepsOf(chain) {
  return chain.replace(/ only$/, '').split(/,\s*(?![^()]*\))/).map(s => {
    const m = s.trim().replace(/^then\s+/i, '').match(/^([A-Za-z]+)\s*(?:\((.*)\))?$/);
    const key = m[1].toLowerCase();
    return { key, name: m[1][0].toUpperCase() + m[1].slice(1).toLowerCase(), inputs: m[2] || '', module: key !== 'crusher' };
  });
}

function seg(label, items, value, pick) {
  const g = document.createElement('div');
  g.className = 'me-ref-run-seg'; // not .me-seg: the view buttons of the viewer reset every .me-seg button g.setAttribute('role', 'group'); g.setAttribute('aria-label', label);
  g.innerHTML = items.map(([v, text]) => `<button type="button" data-v="${v}" aria-pressed="false">${text}</button>`).join('');
  const set = v => { for (const b of g.children) b.setAttribute('aria-pressed', String(b.dataset.v === String(v))); };
  g.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { set(b.dataset.v); pick(b.dataset.v); } });
  set(value);
  return { el: g, set };
}

/**
 * @param stage    the Stage of the viewer     @param blocks   the blocks of the structure (their `position` is where they are now)
 * @param host     the .me-ref container       @param hero     the home page: runs alone, no controls
 */
export async function attachRun({ stage, blocks, host, hero = false, base }) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && still) return; // the home page stays a still picture
  const at = f => blocks.find(b => f(b.userData));
  const inPort = at(d => d.tok === 'I' && d.dx === 1 && d.dz === 1);
  const outPort = at(d => d.id === R + 'output_port'), quantum = at(d => d.id === R + 'module_quantum');
  const conv = new Map(blocks.filter(b => b.userData.id === R + 'conveyor').map(b => [b.userData.dx, b]));
  const mods = {};
  for (const k of Object.keys(MADE)) { const b = at(d => d.id === R + 'module_' + k); if (b) mods[k] = b; }
  if (!inPort || !outPort || Object.keys(mods).length < 7 || conv.size < 8) return;

  // sprites: the ore and up to five ingots (a level makes at most five from one iron ore)
  const [oreTex, ingotTex] = await Promise.all([getTexture(base, 'minecraft:item/raw_iron'), getTexture(base, 'minecraft:item/iron_ingot')]);
  const group = new THREE.Group(); // in the scene, not in stage.root, so that the "reset view" framing does not count it
  const mkSprite = tex => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: 0.02, depthWrite: false }));
    s.scale.set(SIZE, SIZE, 1); s.renderOrder = 6; s.visible = false; s.frustumCulled = false; group.add(s); return s;
  };
  const ore = mkSprite(oreTex), ingots = Array.from({ length: 5 }, () => mkSprite(ingotTex));
  stage.scene.add(group);

  // LED glows: the faces the model marks as glowing have their own materials; their colour factor dims or brightens the LED
  const glow = b => { const out = []; b.traverse(o => { if (o.material && o.material.polygonOffset) out.push(o.material); }); return out; };
  const leds = new Map(); // block -> { mats, v }
  const led = b => { if (!leds.has(b)) leds.set(b, { mats: glow(b), v: 1 }); return leds.get(b); };
  const setLed = (b, v) => { const l = led(b), moved = Math.abs(l.v - v) >= 0.004; l.v = v; for (const m of l.mats) m.color.setScalar(v); return moved; }; // written every time: a tapped block resets its colours
  const firstMat = new Map(); // ghosted layers fade the item too: it takes the opacity of the block it is on
  const opacityOf = b => { if (!firstMat.has(b)) { let f = null; b.traverse(o => { if (!f && o.material) f = o.material; }); firstMat.set(b, f); } return firstMat.get(b) ? firstMat.get(b).opacity : 1; };

  // state
  const S = { level: 5, acc: 0, dest: hero ? 'quantum' : 'port', running: false, t: 0, dimK: 0, frame: 1 };
  let cfg = null, lastKey = '';

  function build() {
    const L = levels.find(x => x.level === S.level), steps = stepsOf(L.chain), n = steps.length;
    const real = ticksOf(S.level, S.acc), shown = Math.max(real / 20, MIN_STEP * n, MIN_JOB), d = shown / n;
    // a step without a module (the Crusher) waits on the belt between its neighbours
    steps.forEach((s, i) => {
      if (s.module) { s.block = mods[s.key]; s.conv = conv.get(s.block.userData.dx); return; }
      let a = i - 1, z = i + 1;
      while (a >= 0 && !steps[a].module) a--;
      while (z < n && !steps[z].module) z++;
      s.between = [steps[a] || steps[z], steps[z] || steps[a]];
    });
    cfg = { L, steps, n, real, shown, d, cycle: IN + shown + OUT + GAP, floored: shown > real / 20 + 1e-6 };
    const takes = L.takes === 'nothing' ? 'nothing from the tanks' : `${L.takes} from the tanks`;
    sum.textContent = `${L.chain}. One iron ore gives ${L.ingots} ingot${L.ingots === 1 ? '' : 's'}; it takes ${takes}.`;
    time.textContent = `A job takes ${secs(real)} with ${S.acc} accelerator${S.acc === 1 ? '' : 's'}.`
      + (cfg.floored ? ` Shown over ${+shown.toFixed(1)} s so each step can be seen.` : '');
  }

  // positions, from the blocks as they are drawn now (the layers glide apart in the exploded and layer views)
  const V = Array.from({ length: 7 }, () => new THREE.Vector3()), tmp = new THREE.Vector3();
  const beltOf = (out, s) => { // on top of the conveyor above the module
    if (s.module) return out.set(s.conv.position.x + 0.5, s.conv.position.y + BELT + SIZE / 2, s.conv.position.z + 0.5);
    beltOf(out, s.between[0]); beltOf(tmp, s.between[1]); return out.lerp(tmp, 0.5);
  };
  const along = (out, pts, k, u) => { // a point at share u (0..1) of the polyline pts[0..k)
    let len = 0; for (let i = 1; i < k; i++) len += pts[i].distanceTo(pts[i - 1]);
    let r = clamp01(u) * len;
    for (let i = 1; i < k; i++) { const l = pts[i].distanceTo(pts[i - 1]); if (r <= l || i === k - 1) return out.lerpVectors(pts[i - 1], pts[i], l ? Math.min(1, r / l) : 1); r -= l; }
    return out.copy(pts[k - 1]);
  };

  let changed = false, ledBlocks = [];
  const led2 = (b, v) => { if (setLed(b, 1 + (v - 1) * S.dimK)) changed = true; };
  const destBlock = () => (S.dest === 'quantum' && quantum ? quantum : outPort);
  const watch = () => { ledBlocks = [...Object.values(mods), destBlock()]; };

  /** Puts everything where it is `t` seconds into a job; returns the text of the moment (null: keep the last). */
  function pose(t) {
    const { steps, n, d, shown } = cfg;
    let key = 'gap', i = -1, local = 0, u = 0, litBlock = null, litV = 0;
    ore.visible = false; for (const g of ingots) g.visible = false;
    if (t < IN) { key = 'in'; u = t / IN; } else if (t < IN + shown) { i = Math.min(n - 1, Math.floor((t - IN) / d)); key = 's' + i; local = (t - IN - i * d) / d; }
    else if (t < IN + shown + OUT) { key = 'out'; u = (t - IN - shown) / OUT; }
    const first = steps[0], last = steps[n - 1];
    if (key === 'in') {
      // from the input port, up the free column at the end of the structure, onto the belt
      V[0].set(inPort.position.x + 0.5, inPort.position.y + 0.5, inPort.position.z + 0.5);
      beltOf(V[2], first); V[1].set(V[0].x, V[2].y, V[0].z);
      along(ore.position, V, 3, smooth(u));
      ore.material.opacity = smooth(u / 0.25) * (opacityOf(inPort) * (1 - u) + opacityOf(first.conv) * u);
      ore.visible = true;
    } else if (i >= 0) {
      const s = steps[i], tf = i === 0 ? 0 : 0.3;
      if (i > 0) { beltOf(V[0], steps[i - 1]); beltOf(V[1], s); ore.position.lerpVectors(V[0], V[1], smooth(local / tf)); } else beltOf(ore.position, s);
      ore.material.opacity = opacityOf(s.conv || s.between[0].conv);
      ore.visible = true;
      if (s.module) { litBlock = s.block; litV = smooth((local - tf) / 0.12) * smooth((1 - local) / 0.15); }
    } else if (key === 'out') {
      // the ore is done: the ingots (as many as the level gives) leave in a line, by the output port or into the Quantum Module
      const q = destBlock() === quantum;
      beltOf(V[0], last);
      if (q) { V[1].set(quantum.position.x + 0.5, quantum.position.y + 1 + SIZE / 2, quantum.position.z + 0.5); V[2].set(V[1].x, quantum.position.y + 0.85, V[1].z); }
      else {
        const ox = outPort.position.x, oy = outPort.position.y, oz = outPort.position.z + 0.5;
        V[1].set(ox + 0.5, V[0].y, oz); V[2].set(ox - 0.5, V[0].y, oz); V[3].set(ox - 0.5, oy + 0.5, oz); V[4].set(ox - 1.3, oy + 0.5, oz);
      }
      const N = cfg.L.ingots, span = 1 - 0.09 * (N - 1), op = opacityOf(destBlock());
      for (let g = 0; g < N; g++) {
        const ug = (u - 0.09 * g) / span, sp = ingots[g];
        if (ug <= 0) sp.position.copy(V[0]); else along(sp.position, V, q ? 3 : 5, smooth(ug));
        sp.material.opacity = op * (1 - smooth((ug - 0.75) / 0.25)); sp.visible = ug < 1;
      }
      litBlock = destBlock(); litV = smooth(u / 0.25) * smooth((1 - u) / 0.25);
    }
    // LEDs: every module waits dimmed, the one working shines; the block the ingots go to shines while they arrive
    for (const b of ledBlocks) led2(b, DIM + (LIT - DIM) * (b === litBlock ? litV : 0));
    if (key === lastKey) return null;
    lastKey = key;
    if (key === 'in') return 'Ore comes in through an input port. One item stands for the stack (up to 64) that a job works.';
    if (key === 'out') return destBlock() === quantum ? 'Ingots go to the Quantum Module, then to its Quantum or QIO frequency.' : 'Ingots leave by the output port.';
    if (i < 0) return null;
    const s = steps[i];
    return `Step ${i + 1} of ${n} · ${s.name}${s.inputs ? ` (${s.inputs})` : ''}: ` + (s.module ? `makes ${MADE[s.key]}.` : 'no module of its own in the structure.');
  }

  function show() { // the picture of the moment and its text
    const text = pose(S.t);
    if (text !== null) step.textContent = text;
  }
  const restore = () => { lastKey = ''; for (const b of [...Object.values(mods), outPort, quantum]) if (b) setLed(b, 1); ore.visible = false; for (const g of ingots) g.visible = false; };

  // ---- controls ----
  const ui = document.createElement('div');
  ui.className = 'me-ref-run not-content';
  const sum = document.createElement('p'), time = document.createElement('p'), step = document.createElement('p');
  sum.className = 'me-ref-run-sum'; time.className = 'me-ref-run-sum'; step.className = 'me-ref-run-step';
  sum.setAttribute('aria-live', 'polite'); time.setAttribute('aria-live', 'polite');
  step.setAttribute('aria-live', still ? 'polite' : 'off'); // a step every second or so would drown a screen reader
  let go = null, next = null;
  if (!hero) {
    const top = document.createElement('div'); top.className = 'me-ref-run-top';
    if (still) {
      next = document.createElement('button'); next.type = 'button'; next.className = 'me-ref-run-go'; next.textContent = 'Next step';
      top.append(next);
    } else {
      go = document.createElement('button'); go.type = 'button'; go.className = 'me-ref-run-go'; go.textContent = 'Run a job'; top.append(go);
    }
    const opts = document.createElement('div'); opts.className = 'me-ref-run-opts';
    const grp = (label, s) => { const g = document.createElement('div'); g.className = 'me-ref-run-grp'; g.innerHTML = `<span>${label}</span>`; g.append(s.el); opts.append(g); };
    const lvl = seg('Level of the refinery', [1, 2, 3, 4, 5].map(n => [n, 'x' + n]), S.level, v => { S.level = +v; restart(); });
    const acc = seg('Accelerators in use', [0, 2, 4, 6, 8].map(n => [n, n]), S.acc, v => { S.acc = +v; restart(); });
    const out = seg('Where the ingots go', [['port', 'Output port'], ['quantum', 'Quantum Module']], S.dest, v => { S.dest = v; restore(); watch(); if (S.running || still) { show(); stage.draw(); } else stage.draw(); });
    grp('Level', lvl); grp('Accelerators in use (of 8 places)', acc); grp('Ingots go to', out);
    ui.append(top, step, opts, sum, time);
    host.querySelector('.me-stage').after(ui); // right under the view, so the controls and the animation fit on a phone screen together
  }

  let stopLive = null;
  function frameTime(k) { // the moment shown by the k-th still picture: 0 = ore in, 1..n = steps, n+1 = ingots out
    const { n, d, shown } = cfg;
    return k === 0 ? IN * 0.75 : k <= n ? IN + (k - 1) * d + d * 0.8 : IN + shown + OUT * 0.5;
  }
  function restart() {
    build();
    if (still) { S.frame = 1; S.t = frameTime(1); } else S.t = 0;
    restore();
    if (S.running || still) show();
    stage.draw();
  }
  function start() {
    S.running = true; S.t = 0; if (go) go.textContent = 'Stop';
    stopLive = stage.live((now, dt) => {
      S.t += dt / 1000; if (S.t >= cfg.cycle) S.t -= cfg.cycle;
      S.dimK = Math.min(1, S.dimK + dt / 500);
      show(); stage.draw(); // draw() joins the frame of the camera sway on the home page instead of drawing twice
      return false;
    }, { fps: hero ? 20 : 30 });
  }
  function stop() {
    S.running = false; S.dimK = 0; if (stopLive) stopLive(); stopLive = null; if (go) go.textContent = 'Run a job';
    restore(); step.textContent = ''; stage.draw();
  }
  build(); watch();
  if (go) go.addEventListener('click', () => (S.running ? stop() : start()));
  if (next) next.addEventListener('click', () => { S.frame = (S.frame + 1) % (cfg.n + 2); S.t = frameTime(S.frame); show(); stage.draw(); });
  if (still) { S.dimK = 1; S.frame = 1; S.t = frameTime(1); show(); stage.draw(); }
  else start();
}
