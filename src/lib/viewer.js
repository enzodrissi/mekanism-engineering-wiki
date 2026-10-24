// 3D views of the wiki: a block or item on its own, and the Quantum Ore Refinery (assembled, exploded or layer by layer).
// Transparent background, orthographic camera like an isometric drawing, drag to turn, pinch or wheel to zoom, tap a block.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildBlock, loadModel, JOINED, preloadFiles } from './mcmodel.js';
import { buildRefinery, arrange } from './refinery.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const MC = `${BASE}/mc`;
/** Downloads the 3D code and files as soon as a page has a 3D view, while the reader is still at the top. */
export const preload = () => preloadFiles(MC);
export const icon = id => `${BASE}/icons/mekanismengineering/${id}.png`;

/** A canvas with a camera that turns around its content; it draws only when something changes. */
export class Stage {
  constructor(host, { yaw = 35, pitch = 30, pad = 0.06, zoom = true } = {}) {
    this.host = host; this.pad = pad;
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-label', 'Drag to turn the 3D view');
    host.prepend(this.canvas);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.root = new THREE.Group(); this.scene.add(this.root);
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -200, 200);
    this.dir = new THREE.Vector3(-Math.sin(yaw * Math.PI / 180) * Math.cos(pitch * Math.PI / 180), Math.sin(pitch * Math.PI / 180),
      -Math.cos(yaw * Math.PI / 180) * Math.cos(pitch * Math.PI / 180));
    this.controls = new OrbitControls(this.cam, this.canvas);
    Object.assign(this.controls, { enablePan: false, enableZoom: zoom, minZoom: 0.6, maxZoom: 4, rotateSpeed: 0.8, enableDamping: false });
    this.controls.minPolarAngle = 0.15; this.controls.maxPolarAngle = Math.PI - 0.15;
    this.controls.addEventListener('change', () => this.draw());
    this.controls.addEventListener('start', () => host.classList.add('touched'));
    this.listeners = [];
    new ResizeObserver(() => this.resize()).observe(host);
  }
  onDraw(fn) { this.listeners.push(fn); }
  resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.frame(false);
  }
  /** Fits the camera on the content; `reset` also turns it back to the starting angle. */
  frame(reset = true) {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h || !this.root.children.length) return;
    const box = new THREE.Box3().setFromObject(this.root), ctr = box.getCenter(new THREE.Vector3());
    if (reset || !this.fitted) {
      this.cam.position.copy(ctr).addScaledVector(this.dir, 60); this.cam.zoom = 1;
      this.controls.target.copy(ctr);
    }
    this.cam.lookAt(this.controls.target); this.cam.updateMatrixWorld();
    // size of the box seen from the starting angle, so that turning never cuts it
    const r = box.getSize(new THREE.Vector3()).length() / 2;
    const pts = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z])
      pts.push(new THREE.Vector3(x, y, z).applyMatrix4(this.cam.matrixWorldInverse));
    const sx = Math.max(...pts.map(p => p.x)) - Math.min(...pts.map(p => p.x)), sy = Math.max(...pts.map(p => p.y)) - Math.min(...pts.map(p => p.y));
    const s = Math.max(sx / w, sy / h, (r * 1.1) / Math.max(w, h)) * (1 + 2 * this.pad);
    Object.assign(this.cam, { left: -w * s / 2, right: w * s / 2, top: h * s / 2, bottom: -h * s / 2 });
    this.cam.updateProjectionMatrix();
    this.fitted = true;
    this.draw();
  }
  draw() {
    if (this.pending) return;
    this.pending = requestAnimationFrame(() => {
      this.pending = 0;
      this.renderer.render(this.scene, this.cam);
      for (const fn of this.listeners) fn();
    });
  }
  /** Screen position (CSS px in the host) of a point. */
  toScreen(v) {
    const p = v.clone().project(this.cam);
    return { x: (p.x + 1) / 2 * this.host.clientWidth, y: (1 - p.y) / 2 * this.host.clientHeight, behind: p.z > 1 };
  }
  /** The object under a pointer event, among `objects`. */
  pick(ev, objects) {
    const r = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster(); ray.setFromCamera(ndc, this.cam);
    const hit = ray.intersectObjects(objects, true).find(h => h.object.material.opacity > 0.5);
    let o = hit && hit.object;
    while (o && !objects.includes(o)) o = o.parent;
    return o || null;
  }
}

/** Calls `fn` on taps (not on drags) of the canvas. */
function onTap(canvas, fn) {
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', e => {
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) fn(e);
    down = null;
  });
}

/** An item or block of the mod as its inventory model shows it, centred. */
export async function itemObject(id) {
  const item = await (await fetch(`${MC}/mekanismengineering/models/item/${id}.json`)).json();
  const model = await loadModel(MC, `mekanismengineering:item/${id}`);
  const obj = await buildBlock(MC, model, { id: JOINED[item.parent] ? item.parent : null });
  return obj;
}

export async function mountBlock(host) {
  const stage = new Stage(host, { yaw: 35, pitch: 28, pad: 0.08 });
  const obj = await itemObject(host.dataset.item);
  stage.root.add(obj);
  stage.resize(); stage.frame();
  host.querySelector(':scope > img')?.remove();
  return stage;
}

// what the numbered markers point at, as in the frozen design
const MARKS = [
  [d => /controller/.test(d.id), 'Controller'],
  [d => /input_port/.test(d.id) && d.dx === 1, 'Input Port (at least 5)'],
  [d => /module_dissolution/.test(d.id), 'Process modules (7)'],
  [d => /tank_water/.test(d.id) && d.dy === 2, 'Water Tank'],
  [d => /accelerator/.test(d.id) && d.dx === -7, 'Accelerators (8 places)'],
  [d => /module_quantum/.test(d.id), 'Quantum Module (optional)'],
  [d => /output_port/.test(d.id), 'Output Port (optional)'],
  [d => /girder/.test(d.id) && d.dx === -5 && d.dz === 0, 'Girders (roof)'],
];

/**
 * The refinery viewer: Assembled / Exploded / Layer by layer, numbered markers with their legend, and a card that names the
 * block you tap (its in-game name and Shift description, how many the structure holds, a link to its page).
 */
export async function mountRefinery(host, { blocks: names = {}, mode = 'exploded', markers = true, tags = null } = {}) {
  host.classList.add('me-ref');
  host.innerHTML = `<div class="me-stage"><span class="me-pill me-hint">⟲ Drag to turn · tap a block</span><div class="me-loading">Loading the 3D view…</div></div>`
    + '<div class="me-info" hidden></div>'
    + (markers ? '<ul class="me-legend"></ul>' : '')
    + `<div class="me-ref-bar"><div class="me-seg" role="group" aria-label="View">
        <button type="button" data-mode="assembled">Assembled</button><button type="button" data-mode="exploded">Exploded</button>
        <button type="button" data-mode="layers">Layer by layer</button></div>
       <button type="button" class="me-pill me-reset" style="cursor:pointer">⟳ Reset view</button></div>
       <div class="me-layers" hidden></div>`;
  const stageEl = host.querySelector('.me-stage');
  const stage = new Stage(stageEl, { yaw: 35, pitch: 32, pad: 0.05 });
  const { root, blocks } = await buildRefinery(MC, { accelerators: 8, module: true });
  stage.root.add(root);
  stageEl.querySelector('.me-loading').remove();
  const counts = {};
  for (const b of blocks) counts[b.userData.id] = (counts[b.userData.id] || 0) + 1;

  // markers follow their block as the view turns
  const marks = markers ? MARKS.map(([f, label], i) => {
    const b = blocks.find(x => f(x.userData)); const el = document.createElement('span');
    el.className = 'me-mk'; el.textContent = i + 1; stageEl.appendChild(el);
    return { b, el, label };
  }) : [];
  if (markers) host.querySelector('.me-legend').innerHTML = marks.map((m, i) => `<li><i>${i + 1}</i>${m.label}</li>`).join('');
  if (markers) host.append(billOfMaterials(blocks, names));
  const tagEls = (tags || []).map(([f, label]) => {
    const b = blocks.find(x => f(x.userData)); const el = document.createElement('span');
    el.className = 'me-tag'; el.textContent = label; stageEl.appendChild(el); return { b, el };
  });
  const centre = b => new THREE.Vector3(0.5, 0.5, 0.5).applyMatrix4(b.matrixWorld);
  stage.onDraw(() => {
    for (const m of marks) {
      const p = stage.toScreen(centre(m.b));
      m.el.style.left = p.x + 'px'; m.el.style.top = p.y + 'px';
      m.el.style.opacity = state.mode === 'layers' && m.b.userData.dy + 1 !== state.only ? 0.25 : 1;
    }
    for (const t of tagEls) {
      const p = stage.toScreen(centre(t.b));
      t.el.style.left = p.x + 'px'; t.el.style.top = p.y + 'px'; t.el.style.transform = 'translate(-50%, -150%)';
    }
  });

  const state = { mode, only: mode === 'layers' ? 1 : 0 };
  const layersEl = host.querySelector('.me-layers');
  layersEl.innerHTML = [1, 2, 3, 4].map(n => `<button type="button" data-layer="${n}" aria-pressed="false"><img src="${icon('_layer' + n)}" alt="" loading="lazy">Layer ${n}</button>`).join('');
  function apply(reframe) {
    const gap = state.mode === 'assembled' ? 0 : state.mode === 'exploded' ? 1.1 : 0.6;
    arrange(blocks, { gap, only: state.mode === 'layers' ? state.only : 0, ghost: 0.1 });
    root.updateMatrixWorld(true);
    for (const b of host.querySelectorAll('.me-seg button')) b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode));
    layersEl.hidden = state.mode !== 'layers';
    for (const b of layersEl.querySelectorAll('button')) b.setAttribute('aria-pressed', String(+b.dataset.layer === state.only));
    if (reframe) stage.frame(); else stage.draw();
  }
  host.querySelector('.me-seg').addEventListener('click', e => {
    const m = e.target.closest('button')?.dataset.mode; if (!m) return;
    unselect();
    state.mode = m; if (m === 'layers' && !state.only) state.only = 1; apply(true);
  });
  layersEl.addEventListener('click', e => { const n = +e.target.closest('button')?.dataset.layer; if (n) { unselect(); state.only = n; apply(false); } });
  host.querySelector('.me-reset').addEventListener('click', () => stage.frame());

  // tap a block: its card
  const info = host.querySelector('.me-info');
  let lit = null;
  function unselect() {
    if (lit) lit.traverse(m => m.material && m.material.color.setScalar(1));
    lit = null; info.hidden = true;
  }
  onTap(stage.canvas, ev => {
    const b = stage.pick(ev, blocks);
    unselect(); lit = b;
    if (!b) { stage.draw(); return; }
    b.traverse(m => m.material && m.material.color.setRGB(0.75, 1.15, 1.1));
    const id = b.userData.id, n = names[id] || {};
    const many = counts[id] > 1 ? `${counts[id]} in the structure` : 'One in the structure';
    const where = b.userData.dy === 3 ? 'top layer' : `layer ${b.userData.dy + 1}`;
    info.innerHTML = `<img src="${icon(id)}" alt=""><div><em>Selected · ${many} · ${where}</em><b>${n.name || b.userData.name}</b>`
      + (n.text ? `<p>${n.text.replace(/</g, '&lt;')}</p>` : '')
      + '<span class="me-info-links">' + (markers ? '<button type="button" class="me-info-craft">See its craft</button>' : '')
      + (n.page ? `<a href="${BASE}/${n.page}/">Open its page →</a>` : '') + '</span></div>';
    const craftBtn = info.querySelector('.me-info-craft');
    if (craftBtn) craftBtn.onclick = () => openCraft(id, { ids: bomOrder(Object.keys(counts)), count: counts, names });
    info.hidden = false; stage.draw();
    const r = info.getBoundingClientRect();
    if (r.bottom > innerHeight || r.top < 0) info.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  stage.resize(); apply(true);
  return stage;
}

// the order of the bill of materials: the controller, the frame, the ports, the chain of modules, the tanks, the options
const BOM_ORDER = ['controller', 'casing', 'girder', 'pillar', 'conveyor', 'input_port', 'output_port', 'energy_port', 'module_dissolution',
  'module_washing', 'module_crystallization', 'module_injection', 'module_purification', 'module_enrichment', 'module_smelting',
  'tank_water', 'tank_sulfuric_acid', 'tank_hydrogen_chloride', 'tank_oxygen', 'accelerator', 'module_quantum'];
/** What the structure is made of, counted from the blocks of the 3D view itself: tap a block to see its craft. */
function billOfMaterials(blocks, names) {
  const count = {};
  for (const b of blocks) count[b.userData.id] = (count[b.userData.id] || 0) + 1;
  const optional = id => /module_quantum|output_port/.test(id);
  // the ports go where the player wants on the back of the two lower floors: a port left out is a casing
  const RULE = { input_port: 'at least 5', energy_port: 'at least 1', output_port: 'optional', module_quantum: 'optional' };
  const rule = id => RULE[Object.keys(RULE).find(k => id.endsWith(k))];
  const required = Object.entries(count).reduce((n, [id, c]) => n + (optional(id) ? 0 : c), 0);
  const ids = bomOrder(Object.keys(count));
  const el = document.createElement('section');
  el.className = 'me-bom';
  const short = id => ((names[id] || {}).name || id).replace(/^(Quantum )?Ore Refinery /, '');
  el.innerHTML = `<h3>Bill of materials</h3><p><b>${required}</b> blocks to place, plus the optional output port and Quantum Module. Tap a block to see its craft.</p><ul>`
    + ids.map(id => `<li${optional(id) ? ' class="opt"' : ''}><button type="button" data-id="${id}" aria-label="${(names[id] || {}).name || id}: see its craft"><img src="${icon(id)}" alt="" loading="lazy">`
      + `<b>×${count[id]}</b><span>${short(id)}${rule(id) ? `<em>${rule(id)}</em>` : ''}</span>`
      + '<i class="me-bom-go" aria-hidden="true"></i></button></li>').join('')
    + '</ul><ul class="me-bom-notes">'
    + '<li>Ports go anywhere on the back of the two lower floors: at least 5 input ports and 1 energy port. A port you leave out is a casing.</li>'
    + '<li>With the Quantum Module on, the output port is a backup buffer. Without one, ore processing stops when the network can\'t take the result.</li>'
    + '<li>Each accelerator place can hold a casing instead.</li></ul>';
  el.addEventListener('click', e => {
    const id = e.target.closest('button[data-id]')?.dataset.id;
    if (id) openCraft(id, { ids, count, names });
  });
  loadRecipes();
  return el;
}
const bomOrder = ids => {
  const rank = id => { const i = BOM_ORDER.findIndex(o => id.endsWith(o)); return i < 0 ? 99 : i; };
  return ids.sort((a, b) => rank(a) - rank(b));
};

// ---------- the crafting card: one dialog for the page, opened from the bill of materials or the 3D view ----------
let recipesP = null;
const loadRecipes = () => (recipesP ??= fetch(`${BASE}/data/recipes.json`).then(r => r.json()).catch(() => ({})));
const itemIcon = id => { const [ns, p] = id.split(':'); return `${BASE}/icons/${ns}/${p}.png`; };
const escH = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
let craftDlg = null;
const recipeOf = (recipes, id) => Object.values(recipes).find(r => r.result === `mekanismengineering:${id}`);
/** How many of a block the whole structure takes: the ones placed, plus the ones the crafts of its other blocks eat. */
function totalNeed(id, ctx, recipes, seen = new Set()) {
  if (seen.has(id)) return 0;
  seen.add(id);
  let n = ctx.count[id] || 0;
  for (const other of ctx.ids) {
    if (other === id) continue;
    const r = recipeOf(recipes, other); if (!r) continue;
    const uses = r.pattern.join('').split('').filter(c => r.key[c] && r.key[c].item === `mekanismengineering:${id}`).length;
    if (uses) n += Math.ceil(totalNeed(other, ctx, recipes, new Set(seen)) / r.count) * uses;
  }
  return n || 1;
}

function craftDialog() {
  if (craftDlg) return craftDlg;
  const d = document.createElement('dialog');
  d.className = 'me-craft not-content';
  d.setAttribute('aria-labelledby', 'me-craft-title');
  document.body.append(d);
  // one set of listeners: the card is redrawn for each block, its buttons say where to go
  d.addEventListener('click', e => {
    if (e.target === d || e.target.closest('.me-craft-x')) { d.close(); return; }
    const t = e.target.closest('[data-go]:not([disabled])');
    if (t) openCraft(t.dataset.go, d.ctx, +(t.dataset.dir || 1));
  });
  d.addEventListener('close', () => document.documentElement.classList.remove('me-craft-open'));
  d.addEventListener('keydown', e => {
    const t = e.target.closest?.('li[data-go]');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openCraft(t.dataset.go, d.ctx, 1); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); d.querySelector(e.key === 'ArrowRight' ? '.me-craft-next' : '.me-craft-prev')?.click(); }
  });
  // swipe sideways on a phone: the next or previous block
  let x0 = null;
  d.addEventListener('touchstart', e => { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
  d.addEventListener('touchend', e => {
    if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 60) d.querySelector(dx < 0 ? '.me-craft-next' : '.me-craft-prev')?.click();
  });
  return (craftDlg = d);
}

async function openCraft(id, ctx, dir = 0) {
  const d = craftDialog();
  const recipes = await loadRecipes();
  const rid = Object.keys(recipes).find(k => recipes[k].result === `mekanismengineering:${id}`);
  const r = recipes[rid];
  const { ids, count, names } = ctx;
  const i = ids.indexOf(id), name = (names[id] || {}).name || (r && r.name) || id, page = (names[id] || {}).page;
  const placed = count[id] || 1, need = totalNeed(id, ctx, recipes), used = need - placed;
  let body = '<p class="me-craft-none">No crafting table recipe for this block.</p>';
  if (r) {
    const rows = r.pattern.length === 1 && r.pattern[0].length === 1 ? ['   ', ` ${r.pattern[0]} `, '   '] : r.pattern.map(p => p.padEnd(3));
    while (rows.length < 3) rows.push('   ');
    const cells = rows.flatMap(row => [...row].map(c => (c === ' ' ? null : r.key[c])));
    const local = ing => ing && ing.item && ing.item.startsWith('mekanismengineering:') && ids.includes(ing.item.split(':')[1]) ? ing.item.split(':')[1] : null;
    const pic = ing => `<img src="${itemIcon(ing.show || ing.item || '')}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('b'),{textContent:${escH(JSON.stringify(ing.name.replace(/^any /, '').slice(0, 2)))}}))">`;
    const slot = (ing, n) => !ing ? `<span class="me-slot" style="--i:${n}"></span>`
      : local(ing) ? `<button type="button" class="me-slot me-slot-go" style="--i:${n}" data-name="${escH(ing.name)}" data-go="${local(ing)}" aria-label="${escH(ing.name)}: see its craft">${pic(ing)}</button>`
      : `<span class="me-slot" tabindex="0" style="--i:${n}" data-name="${escH(ing.name)}">${pic(ing)}</span>`;
    const crafts = Math.ceil(need / r.count);
    const per = {};
    for (const c of cells) if (c) (per[c.name] ??= { ing: c, n: 0 }).n++;
    const made = crafts * r.count;
    body = `<div class="me-craft-recipe"><div class="me-grid">${cells.map(slot).join('')}</div><span class="me-arrow">→</span>`
      + `<span class="me-slot me-out" data-name="${escH(r.name)}">${pic({ show: r.result, name: r.name })}${r.count > 1 ? `<i>${r.count}</i>` : ''}</span></div>`
      + `<p class="me-craft-need">${used > 0 ? `The structure places ${placed}, and the crafts of its other blocks use ${used} more: <b>${need}</b> in all.` : `The structure needs <b>${need}</b>.`} ${r.count > 1 ? `One craft makes ${r.count}, so craft it <b>${crafts}</b> times${made > need ? ` (${made - need} left over)` : ''}.` : need > 1 ? `Craft it <b>${crafts}</b> times.` : 'Craft it once.'}</p>`
      + `<h4>${crafts > 1 ? `For ${crafts} crafts` : 'For one craft'}</h4><ul class="me-craft-list">`
      + Object.values(per).map(({ ing, n }) => `<li${local(ing) ? ` data-go="${local(ing)}" tabindex="0" role="button"` : ''}>${pic(ing)}<b>${n * crafts}</b><span>${escH(ing.name)}</span></li>`).join('')
      + '</ul>';
  }
  d.innerHTML = `<div class="me-craft-card${dir ? (dir > 0 ? ' me-from-right' : ' me-from-left') : ''}">`
    + `<header><img src="${icon(id)}" alt=""><div><em>Craft${i >= 0 ? ` · ${i + 1} of ${ids.length}` : ''}</em><h3 id="me-craft-title">${escH(name)}</h3></div>`
    + '<button type="button" class="me-craft-x" aria-label="Close">×</button></header>'
    + body
    + `<footer><button type="button" class="me-craft-prev" data-go="${ids[i - 1] || ''}" data-dir="-1" ${i > 0 ? '' : 'disabled'}>← Previous</button>`
    + (page && location.pathname !== `${BASE}/${page}/` ? `<a href="${BASE}/${page}/">Open its page</a>` : '<span></span>')
    + `<button type="button" class="me-craft-next" data-go="${ids[i + 1] || ''}" ${i >= 0 && i < ids.length - 1 ? '' : 'disabled'}>Next →</button></footer></div>`;
  d.ctx = ctx;
  if (!d.open) { d.showModal(); document.documentElement.classList.add('me-craft-open'); }
  (d.querySelector(dir > 0 ? '.me-craft-next:not([disabled])' : dir < 0 ? '.me-craft-prev:not([disabled])' : '.me-craft-x') || d.querySelector('.me-craft-x')).focus({ preventScroll: true });
}
