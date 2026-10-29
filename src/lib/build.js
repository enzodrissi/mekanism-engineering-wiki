// "How to build it": the Quantum Ore Refinery placed block by block, in 3D and on a plan of the layer, with the mod's real
// models and textures. The cells and blocks are the drawing of refinery.js (RefineryTemplate.TEXT); every note repeats the
// mod's wiki (Quantum-Ore-Refinery-Structure.md, Quantum-Ore-Refinery.md "Building it").
import * as THREE from 'three';
import { Stage, MC, icon } from './viewer.js';
import { buildRefinery, cells } from './refinery.js';
import { L } from './i18n.js';

const R = 'ore_refinery_';
// x: 0 to 9 from the left as you face the controller; row: 0 front, 1 middle, 2 back; layer: 0 (bottom) to 3 (roof)
const xOf = c => 1 - c.dx;
const span = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const ALL = span(0, 9), ENDS = [0, 9], TANKS = [2, 3, 5, 6];
/** The order of the build: [layer, row, columns] in each part. */
export const PARTS = [
  { title: 'Controller row', at: [[0, 0, span(1, 8)]] },
  { title: 'Layer 1', at: [[0, 0, ENDS], [0, 2, ALL], [0, 1, ALL]] },
  { title: 'Layer 2', at: [[1, 0, ALL], [1, 2, ALL], [1, 1, TANKS]] },
  { title: 'Layer 3', at: [[2, 2, ALL], [2, 0, ENDS], [2, 1, TANKS]] },
  { title: 'Roof', at: [[3, 2, ALL], [3, 1, ENDS], [3, 0, ALL]] },
  { title: 'Quantum Module', at: [[1, 1, [9]]], optional: true },
];

/** The steps of the build, one block each: { cell, part, x, row, layer }. */
export function steps() {
  const all = cells({ accelerators: 8, module: true });
  const at = (layer, row, x) => all.find(c => c.dy === layer && c.dz === row && xOf(c) === x);
  const out = [];
  PARTS.forEach((p, part) => {
    for (const [layer, row, xs] of p.at) for (const x of xs) {
      const cell = at(layer, row, x);
      if (cell && cell.id) out.push({ cell, part, x, row, layer });
    }
  });
  return out;
}

const ordinal = n => L(n === 1 ? '{n}st from the left' : n === 2 ? '{n}nd from the left' : n === 3 ? '{n}rd from the left' : '{n}th from the left', { n });
const ROWS = ['front row', 'middle row', 'back row'];
function where(s) {
  const col = s.x === 0 ? L('left end') : s.x === 9 ? L('right end') : ordinal(s.x + 1);
  return L('Layer {n}', { n: s.layer + 1 }) + ' · ' + L(ROWS[s.row]) + ' · ' + col;
}

/** What to know about the block of a step, from the mod's wiki. */
function note(s, i, list) {
  const id = s.cell.id.replace(R, ''), last = list.filter(x => !PARTS[x.part].optional).length - 1;
  if (i === last) return L('Last required block. The structure forms: redstone dust runs along its edges, or the controller\'s screen says "Multiblock formed".');
  if (id === 'controller') return L('Place it first. It turns to face you, and the whole structure stands behind it and to its right. The drawing turns with it and is never mirrored.');
  if (id.startsWith('module_') && id !== 'module_quantum') return L('The seven process modules sit right of the controller, in this order: Dissolution, Washing, Crystallization, Injection, Purification, Enrichment, Smelting.');
  if (id === 'pillar') return L('A corner post. The four corners are columns of four pillars, which join the ones above and below.');
  if (id === 'input_port' && s.row === 1) return L('At an end of the middle row, an Input Port works on items only: a Configurator will not turn it to fluids or gases there.');
  if (id === 'input_port') return L('You need at least five Input Ports. Any cell of the back row of layers 1 and 2 takes one. A Configurator turns each one to Items, Fluids or Gases.');
  if (id === 'energy_port') return L('You need at least one. It goes on the back row of layer 1 or 2, never at an end of the middle row. It takes Joules or Forge Energy.');
  if (id === 'output_port') return L('Optional, at most one. The ingots leave here. Without it, the refinery needs a Quantum Module with a frequency.');
  if (id === 'casing' && s.row === 2 && s.layer < 2) return L('This back cell also takes any port, if you want more Input or Energy Ports.');
  if (id === 'casing') return L('The body of the multiblock.');
  if (id === 'conveyor') return L('The conveyors run along the front, right above the controller and the modules.');
  if (id.startsWith('tank_') && s.layer === 1) return L('Each tank is two blocks high: this is its bottom half. The empty cells of this middle row stay free (air, Ore Refinery Glass or a casing).');
  if (id.startsWith('tank_')) return L('The top half of the tank, on the bottom half.');
  if (id === 'accelerator') return L('One of eight accelerator places. Each accelerator makes a job shorter; a casing fits here too.');
  if (id === 'girder') return L('The roof. A girder turns to follow the axis it is placed on.');
  if (id === 'module_quantum') return L('Optional, at most one. It goes in one of two cells only: here, above the Output Port, or in the Output Port\'s place. Nowhere else. Choose a frequency on its screen and the ingots go to a Quantum or QIO network.');
  return '';
}

const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut = t => 1 - Math.pow(1 - t, 3);
function tween(ms, step) {
  if (still()) { step(1); return; }
  const t0 = performance.now();
  const tick = now => { const t = Math.min(1, (now - t0) / ms); step(t); if (t < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
const short = name => name.replace(/^(Quantum )?Ore Refinery /, '').replace(/ de (la )?(raffinerie de minerai|Quantum Ore Refinery)$/, '');

export async function mountBuild(host, { blocks: names = {} } = {}) {
  const list = steps();
  const nameOf = id => (names[id] || {}).name || id;
  host.classList.add('me-build-live');
  host.innerHTML = `<div class="me-build-parts" role="group" aria-label="${L('Parts of the build')}">`
      + PARTS.map((p, i) => `<button type="button" data-part="${i}"${p.optional ? ' class="opt"' : ''}><i>${i + 1}</i><b>${L(p.title)}</b><span>${p.optional ? L('optional') : L('{n} blocks', { n: list.filter(s => s.part === i).length })}</span></button>`).join('')
    + '</div><div class="me-build-main"><div class="me-build-view"><div class="me-stage"><span class="me-pill me-hint">' + L('⟲ Drag to turn') + `</span><div class="me-loading">${L('Loading the 3D view…')}</div></div>`
    + `<div class="me-build-bar"><button type="button" class="me-btn me-build-prev">${L('← Previous')}</button>`
    + `<button type="button" class="me-btn me-build-play" aria-pressed="false">${L('▶ Play')}</button>`
    + `<button type="button" class="me-btn primary me-build-next">${L('Next →')}</button></div>`
    + `<label class="me-build-range"><span>${L('Step')}</span><input type="range" min="1" max="${list.length}" value="1" aria-label="${L('Step')}"><output></output></label></div>`
    + '<div class="me-build-side"><div class="me-build-step" aria-live="polite"></div><div class="me-build-plan"></div></div></div>';
  const $ = s => host.querySelector(s);
  const stageEl = $('.me-stage');
  const stage = new Stage(stageEl, { yaw: 35, pitch: 32, pad: 0.06 });
  const { root, blocks } = await buildRefinery(MC, { accelerators: 8, module: true });
  stage.root.add(root);
  // the footprint of the structure on the ground: 10 by 3 cells
  const pts = [];
  for (let x = -8; x <= 2; x++) pts.push(x, 0, 0, x, 0, 3);
  for (let z = 0; z <= 3; z++) pts.push(-8, 0, z, 2, 0, z);
  const grid = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)),
    new THREE.LineBasicMaterial({ color: 0x64d1c7, transparent: true, opacity: 0.35 }));
  grid.position.y = -0.002; stage.root.add(grid);
  // the cell of the current block, seen through the others
  const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.06, 1.06, 1.06)),
    new THREE.LineBasicMaterial({ color: 0x64d1c7, depthTest: false, transparent: true }));
  box.renderOrder = 10; stage.root.add(box);
  stageEl.querySelector('.me-loading')?.remove();
  const key = c => `${c.dx},${c.dy},${c.dz}`;
  const byCell = new Map(blocks.map(b => [key(b.userData), b]));
  const order = list.map(s => byCell.get(key(s.cell)));
  const rank = new Map(order.map((b, i) => [b, i]));

  const state = { i: 0, playing: 0 };
  function show(i, drop = true) {
    i = Math.max(0, Math.min(list.length - 1, i));
    const was = state.i; state.i = i;
    const placed = b => rank.has(b) && rank.get(b) <= i;
    for (const b of blocks) {
      const r = rank.get(b), on = r !== undefined && r <= i;
      b.visible = on;
      const d = b.userData;
      if (d.alone) {
        // a pillar or tank shows its joined model only when its neighbours of the same kind are in place
        const up = byCell.get(key({ dx: d.dx, dy: d.dy + 1, dz: d.dz })), down = byCell.get(key({ dx: d.dx, dy: d.dy - 1, dz: d.dz }));
        const ok = n => !n || n.userData.id !== d.id || placed(n);
        const joined = ok(up) && ok(down);
        d.joined.visible = joined; d.alone.visible = !joined;
      }
      b.position.y = d.dy;
      b.traverse(m => m.material && m.material.color.setScalar(1));
    }
    const cur = order[i], s = list[i];
    cur.traverse(m => m.material && m.material.color.setRGB(0.75, 1.15, 1.1));
    box.position.set(cur.userData.dx + 0.5, cur.userData.dy + 0.5, cur.userData.dz + 0.5);
    if (drop && i === was + 1) tween(320, t => { cur.position.y = cur.userData.dy + (1 - easeOut(t)) * 1.4; stage.draw(); });
    stage.draw();

    const id = s.cell.id;
    $('.me-build-step').innerHTML = `<img src="${icon(id)}" alt=""><div><em>${L('Step {i} of {n}', { i: i + 1, n: list.length })}${PARTS[s.part].optional ? ' · ' + L('optional') : ''}</em>`
      + `<b>${nameOf(id)}</b><span class="me-build-where">${where(s)}</span><p>${note(s, i, list)}</p>`
      + '</div>';
    plan(s);
    for (const b of host.querySelectorAll('.me-build-parts button')) b.setAttribute('aria-pressed', String(+b.dataset.part === s.part));
    $('.me-build-range input').value = String(i + 1);
    $('.me-build-range output').textContent = `${i + 1} / ${list.length}`;
    $('.me-build-prev').disabled = i === 0; $('.me-build-next').disabled = i === list.length - 1;
  }
  // the plan of the current layer, as you see it from above standing in front of the controller
  function plan(s) {
    const rows = [2, 1, 0].map(row => {
      const cellsHtml = ALL.map(x => {
        const j = list.findIndex(t => t.layer === s.layer && t.row === row && t.x === x);
        if (j < 0) return `<span class="free" title="${L('Free cell')}"></span>`;
        const id = list[j].cell.id, st = j < state.i ? 'done' : j === state.i ? 'now' : 'todo';
        return `<button type="button" class="${st}" data-step="${j}" aria-label="${L('Step {i}', { i: j + 1 })}: ${short(nameOf(id))}" title="${short(nameOf(id))}"><img src="${icon(id)}" alt=""></button>`;
      }).join('');
      return `<div class="me-build-row"><span class="me-build-rl">${L(['Front', 'Middle', 'Back'][row])}</span>${cellsHtml}</div>`;
    }).join('');
    $('.me-build-plan').innerHTML = `<div class="me-build-plan-h"><b>${L('Layer {n}', { n: s.layer + 1 })}</b><span>${L('seen from above')}</span></div>${rows}`
      + `<div class="me-build-you"><span></span><i>${L('▲ You stand here, facing the controller')}</i></div>`;
  }
  function stop() { clearInterval(state.playing); state.playing = 0; $('.me-build-play').setAttribute('aria-pressed', 'false'); $('.me-build-play').textContent = L('▶ Play'); }
  $('.me-build-prev').addEventListener('click', () => { stop(); show(state.i - 1); });
  $('.me-build-next').addEventListener('click', () => { stop(); show(state.i + 1); });
  $('.me-build-play').addEventListener('click', () => {
    if (state.playing) { stop(); return; }
    if (state.i === list.length - 1) show(0, false);
    $('.me-build-play').setAttribute('aria-pressed', 'true'); $('.me-build-play').textContent = L('❚❚ Pause');
    state.playing = setInterval(() => { if (state.i >= list.length - 1) stop(); else show(state.i + 1); }, 700);
  });
  $('.me-build-range input').addEventListener('input', e => { stop(); show(+e.target.value - 1, false); });
  $('.me-build-parts').addEventListener('click', e => {
    const p = e.target.closest('button')?.dataset.part; if (p === undefined) return;
    stop(); show(list.findIndex(s => s.part === +p), false);
  });
  $('.me-build-plan').addEventListener('click', e => { const j = e.target.closest('button')?.dataset.step; if (j !== undefined) { stop(); show(+j, false); } });
  host.addEventListener('keydown', e => {
    if (e.target.matches('input')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); stop(); show(state.i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); show(state.i - 1); }
  });
  stage.resize(); stage.frame();
  show(0, false);
  host.__stage = stage; host.__show = show; // for the checks of the page
  return stage;
}
