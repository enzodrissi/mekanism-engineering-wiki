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
  [d => /input_port/.test(d.id) && d.dx === 1, 'Input Port (one of 5)'],
  [d => /module_dissolution/.test(d.id), 'Process modules (7)'],
  [d => /tank_water/.test(d.id) && d.dy === 2, 'Water Tank'],
  [d => /accelerator/.test(d.id) && d.dx === -7, 'Accelerators (8 places)'],
  [d => /module_quantum/.test(d.id), 'Quantum Module (optional)'],
  [d => /output_port/.test(d.id), 'Output Port'],
  [d => /girder/.test(d.id) && d.dx === -3 && d.dz === 0, 'Girders (roof)'],
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
  const tagEls = (tags || []).map(([f, label]) => {
    const b = blocks.find(x => f(x.userData)); const el = document.createElement('span');
    el.className = 'me-tag'; el.textContent = label; stageEl.appendChild(el); return { b, el };
  });
  const centre = b => new THREE.Vector3(0.5, 0.5, 0.5).applyMatrix4(b.matrixWorld);
  stage.onDraw(() => {
    for (const m of marks) {
      const p = stage.toScreen(centre(m.b));
      m.el.style.left = p.x + 'px'; m.el.style.top = p.y + 'px';
      m.el.style.opacity = state.only && m.b.userData.dy + 1 !== state.only ? 0.25 : 1;
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
      + (n.page ? `<a href="${BASE}/${n.page}/">Open its page →</a>` : '') + '</div>';
    info.hidden = false; stage.draw();
    const r = info.getBoundingClientRect();
    if (r.bottom > innerHeight || r.top < 0) info.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  stage.resize(); apply(true);
  return stage;
}
