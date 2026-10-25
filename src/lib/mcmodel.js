// Reads Minecraft JSON block and item models and turns them into Three.js objects, the way the game draws them:
// elements, faces, UV, element and blockstate rotations, per-face shading, crisp pixel textures, glowing overlays
// (neoforge_data block_light), NeoForge composite models, Mekanism energy cubes and transmitters (OBJ).
// Files are read from `${base}/<namespace>/models|textures|blockstates/...`.
import * as THREE from 'three';

const jsonCache = new Map(), textCache = new Map(), texCache = new Map();
const loader = new THREE.TextureLoader();

const split = id => (id.includes(':') ? id.split(':') : ['minecraft', id]);
const fileUrl = (base, kind, id, ext) => { const [ns, p] = split(id); return `${base}/${ns}/${kind}/${p}${ext}`; };

// all the files in one download when the site has it (data/mc.json, next to the mc folder), else one file at a time
const bundles = new Map();
async function fromBundle(url) {
  const m = url.match(/^(.*)\/mc\/(.+)$/);
  if (!m) return undefined;
  if (!bundles.has(m[1])) bundles.set(m[1], fetch(`${m[1]}/data/mc.json`).then(r => (r.ok ? r.json() : {})).catch(() => ({})));
  return (await bundles.get(m[1]))[m[2]];
}
/** Starts downloading the files of the 3D views before a view needs them. */
export const preloadFiles = base => fromBundle(`${base}/_`);

async function getJson(url, optional = false) {
  if (!jsonCache.has(url)) jsonCache.set(url, fromBundle(url).then(b => b !== undefined ? b : fetch(url).then(r => (r.ok ? r.json() : null))));
  const j = await jsonCache.get(url);
  if (!j && !optional) throw new Error('missing ' + url);
  return j;
}
async function getText(url) {
  if (!textCache.has(url)) textCache.set(url, fromBundle(url).then(b => typeof b === 'string' ? b : fetch(url).then(r => (r.ok ? r.text() : ''))));
  return textCache.get(url);
}

const EMPTY = { textures: {}, elements: null, display: {}, render_type: null, special: null };

/** A model with its parents merged in. `special` keeps the data of a custom loader (composite, energy cube, transmitter). */
export async function loadModel(base, id) {
  const [ns, p] = split(id);
  if (ns === 'minecraft' && p === 'item/generated') return { ...EMPTY, generated: true };
  if (ns === 'minecraft' && p === 'builtin/entity') return { ...EMPTY, entity: true };
  const m = await getJson(fileUrl(base, 'models', id, '.json'), true);
  if (!m) return { ...EMPTY };
  const parent = m.parent ? await loadModel(base, m.parent) : EMPTY;
  const own = m.loader && m.loader !== 'neoforge:item_layers' ? { loader: m.loader, data: m } : null;
  return {
    textures: { ...parent.textures, ...(m.textures || {}) },
    elements: m.elements || parent.elements,
    display: { ...parent.display, ...(m.display || {}) },
    render_type: m.render_type || parent.render_type,
    special: own || parent.special,
    generated: parent.generated, entity: parent.entity,
  };
}

function resolveTex(textures, ref) {
  let r = ref, guard = 0;
  while (r && r.startsWith('#') && guard++ < 10) r = textures[r.slice(1)];
  return r && !r.startsWith('#') ? r : null;
}

export async function getTexture(base, id) {
  const url = fileUrl(base, 'textures', id, '.png');
  if (!texCache.has(id)) texCache.set(id, fromBundle(url).then(b => new Promise((ok, ko) => loader.load(b || url, async t => {
    t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
    t.colorSpace = THREE.SRGBColorSpace;
    const frames = t.userData.frames = Math.max(1, Math.round(t.image.height / t.image.width));
    // a tall texture is an animation strip, as in the game: its .mcmeta says how long each frame lasts (none = one tick each)
    if (frames > 1) t.userData.anim = parseAnimation(await getJson(url + '.mcmeta', true).catch(() => null), frames);
    ok(t);
  }, undefined, () => ko(new Error('missing texture ' + id))))));
  return texCache.get(id);
}

/** The frames of a texture strip in play order, each with its length in game ticks (a tick lasts 50 ms). */
function parseAnimation(meta, frames) {
  const a = (meta && meta.animation) || {}, base = a.frametime || 1;
  const seq = (a.frames || Array.from({ length: frames }, (_, i) => i)).map(f => (typeof f === 'number' ? { i: f, t: base } : { i: f.index, t: f.time || base }));
  return { seq, total: seq.reduce((n, f) => n + f.t, 0) || 1 };
}

/** Index of the strip's frame shown `ms` milliseconds after the start. */
export function frameAt(anim, ms) {
  let t = (ms / 50) % anim.total;
  for (const f of anim.seq) { if (t < f.t) return f.i; t -= f.t; }
  return 0;
}

/**
 * The animation of every animated texture drawn in `root` (a .mcmeta strip, like the pump's fan and glow). Call the result
 * with the clock in ms: it moves each strip to its frame and says whether any frame changed. Nothing moves until it is called.
 */
export function textureAnimator(root) {
  const texs = new Set();
  root.traverse(o => { const t = o.material && o.material.map; if (t && t.userData.anim) texs.add(t); });
  const shown = new Map();
  const step = ms => {
    let changed = false;
    for (const t of texs) {
      const f = frameAt(t.userData.anim, ms);
      if (shown.get(t) !== f) { shown.set(t, f); t.offset.y = -f / t.userData.frames; changed = true; }
    }
    return changed;
  };
  step.count = texs.size;
  return step;
}

/** Colours the faces that carry a model's tint index (the game tints them per block: the pump's glow takes its fluid's colour). */
export function setTint(root, index, hex) {
  root.traverse(o => { if (o.material && o.material.userData.tint === index) o.material.color.setHex(hex); });
}

const FACE = {
  north: (a, b) => [[b[0], b[1], a[2]], [a[0], b[1], a[2]], [a[0], a[1], a[2]], [b[0], a[1], a[2]]],
  south: (a, b) => [[a[0], b[1], b[2]], [b[0], b[1], b[2]], [b[0], a[1], b[2]], [a[0], a[1], b[2]]],
  west: (a, b) => [[a[0], b[1], a[2]], [a[0], b[1], b[2]], [a[0], a[1], b[2]], [a[0], a[1], a[2]]],
  east: (a, b) => [[b[0], b[1], b[2]], [b[0], b[1], a[2]], [b[0], a[1], a[2]], [b[0], a[1], b[2]]],
  up: (a, b) => [[a[0], b[1], a[2]], [b[0], b[1], a[2]], [b[0], b[1], b[2]], [a[0], b[1], b[2]]],
  down: (a, b) => [[a[0], a[1], b[2]], [b[0], a[1], b[2]], [b[0], a[1], a[2]], [a[0], a[1], a[2]]],
};
const DEFAULT_UV = {
  north: (a, b) => [16 - b[0], 16 - b[1], 16 - a[0], 16 - a[1]], south: (a, b) => [a[0], 16 - b[1], b[0], 16 - a[1]],
  west: (a, b) => [a[2], 16 - b[1], b[2], 16 - a[1]], east: (a, b) => [16 - b[2], 16 - b[1], 16 - a[2], 16 - a[1]],
  up: (a, b) => [a[0], a[2], b[0], b[2]], down: (a, b) => [a[0], 16 - b[2], b[0], 16 - a[2]],
};

function rotPoint(p, axis, deg, origin, rescale) {
  const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  let [x, y, z] = [p[0] - origin[0], p[1] - origin[1], p[2] - origin[2]];
  if (axis === 'x') [y, z] = [y * c - z * s, y * s + z * c];
  if (axis === 'y') [x, z] = [x * c + z * s, -x * s + z * c];
  if (axis === 'z') [x, y] = [x * c - y * s, x * s + y * c];
  if (rescale) { const k = 1 / Math.cos(Math.abs(r)); if (axis !== 'x') x *= k; if (axis !== 'y') y *= k; if (axis !== 'z') z *= k; }
  return [x + origin[0], y + origin[1], z + origin[2]];
}

const shadeOf = n => Math.min(n[0] * n[0] * 0.6 + n[1] * n[1] * ((3 + n[1]) / 4) + n[2] * n[2] * 0.8, 1);
const normalOf = (p0, p1, p3) => {
  const e1 = p1.map((v, i) => v - p0[i]), e2 = p3.map((v, i) => v - p0[i]);
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const L = Math.hypot(...n) || 1; return n.map(v => -v / L);
};

/** Parts to draw: lists of elements with their own textures and render type (composite children, energy cube frame...). */
async function partsOf(base, model) {
  const sp = model.special;
  if (sp && sp.loader === 'neoforge:composite') {
    const parts = [];
    for (const child of Object.values(sp.data.children || {})) {
      const c = child.parent ? await loadModel(base, child.parent) : EMPTY;
      parts.push({ elements: child.elements || c.elements || [], textures: { ...model.textures, ...c.textures, ...(child.textures || {}) },
        render_type: child.render_type || c.render_type || model.render_type });
    }
    return parts;
  }
  // energy cube: the frame of the block model (the item adds a spinning core that is drawn in code, not in a model file)
  if (sp && sp.loader === 'mekanism:energy_cube') return [{ elements: sp.data.frame || [], textures: model.textures, render_type: model.render_type }];
  return model.elements ? [{ elements: model.elements, textures: model.textures, render_type: model.render_type }] : [];
}

function bucket(buckets, texId, glow, translucent, tint) {
  const key = texId + (glow ? '|glow' : '') + (translucent ? '|t' : '') + (tint === undefined ? '' : '|tint' + tint);
  if (!buckets.has(key)) buckets.set(key, { texId, glow, translucent, tint, pos: [], uv: [], col: [] });
  return buckets.get(key);
}

// A Mekanism transmitter as its item shows it: the centre with its up and down connections (OBJ model + MTL).
async function transmitterQuads(base, model, buckets, turn) {
  const d = model.special.data;
  const [ns, p] = split(d.model);
  const objUrl = `${base}/${ns}/${p}`;
  const obj = await getText(objUrl);
  const mtl = await getText(objUrl.replace(/[^/]+\.obj\.mek$/, '') + (obj.match(/^mtllib (.+)$/m) || [])[1]);
  const matTex = {}; let cur = null;
  for (const line of mtl.split('\n')) {
    const [k, v] = line.trim().split(/\s+/);
    if (k === 'newmtl') cur = v; else if (k === 'map_Kd' && cur) matTex[cur] = v;
  }
  const show = new Set(['up', 'down', 'north', 'south', 'east', 'west'].map(s => s + (s === 'up' || s === 'down' ? 'NORMAL' : 'NONE')));
  const v = [], vt = []; let on = false, mat = null;
  for (const line of obj.split('\n')) {
    const t = line.trim().split(/\s+/);
    if (t[0] === 'v') v.push(t.slice(1, 4).map(Number));
    else if (t[0] === 'vt') vt.push(t.slice(1, 3).map(Number));
    else if (t[0] === 'o') on = show.has(t[1]);
    else if (t[0] === 'usemtl') mat = t[1];
    else if (t[0] === 'f' && on) {
      const texId = resolveTex(model.textures, matTex[mat] || '#side'); if (!texId) continue;
      const ix = t.slice(1).map(s => s.split('/').map(n => parseInt(n, 10) - 1));
      let pts = ix.map(i => v[i[0]].map(c => c * 16));
      if (turn.x) pts = pts.map(p => rotPoint(p, 'x', -turn.x, [8, 8, 8]));
      if (turn.y) pts = pts.map(p => rotPoint(p, 'y', -turn.y, [8, 8, 8]));
      const uvs = ix.map(i => vt[i[1]] || [0, 0]);
      const n = normalOf(pts[0], pts[1], pts[pts.length - 1]).map(x => -x);
      const sh = shadeOf(n), bk = bucket(buckets, texId, false, false);
      for (let k = 1; k + 1 < pts.length; k++) for (const i of [0, k, k + 1]) {
        bk.pos.push(pts[i][0] / 16, pts[i][1] / 16, pts[i][2] / 16);
        bk.uv.push(uvs[i][0], d.flip_v ? uvs[i][1] : 1 - uvs[i][1]);
        bk.col.push(sh, sh, sh);
      }
    }
  }
}

// Models the mod joins in code when they are baked (client/ClientSetup.java): the part, moved by whole blocks.
// The Petrogenic Synthesis Plant is one 3 x 3 x 3 part authored one block up; the block and the item show it facing north.
export const JOINED = {
  'mekanismengineering:block/petrogenic_synthesis_plant': [{ model: 'mekanismengineering:block/petrogenic_synthesis_plant/part_x0_y1_z0', offset: [0, 1, 0] }],
};

/**
 * Builds an Object3D for a model (in blocks, origin at the block corner), turned like a blockstate (x, y in degrees).
 * Glowing faces (block_light) keep full brightness and are drawn over the face they cover.
 */
export async function buildBlock(base, modelId, { x = 0, y = 0, id = null, tints = {} } = {}) {
  const model = typeof modelId === 'string' ? await loadModel(base, modelId) : modelId;
  const group = new THREE.Group();
  const key = id || (typeof modelId === 'string' ? modelId : null);
  for (const j of (key && JOINED[key]) || []) {
    const part = await buildBlock(base, j.model, { x, y, tints });
    const o = new THREE.Vector3(...j.offset);
    if (x) o.applyAxisAngle(new THREE.Vector3(1, 0, 0), -x * Math.PI / 180);
    if (y) o.applyAxisAngle(new THREE.Vector3(0, 1, 0), -y * Math.PI / 180);
    part.position.copy(o.round()); group.add(part);
  }
  const buckets = new Map();
  if (model.special && model.special.loader === 'mekanism:transmitter') await transmitterQuads(base, model, buckets, { x, y });
  for (const part of await partsOf(base, model)) {
    const translucent = part.render_type === 'minecraft:translucent';
    for (const el of part.elements) {
      const glow = !!(el.neoforge_data && el.neoforge_data.block_light);
      for (const [dir, face] of Object.entries(el.faces || {})) {
        const texId = resolveTex(part.textures, face.texture); if (!texId) continue;
        const bk = bucket(buckets, texId, glow, translucent, face.tintindex);
        let pts = FACE[dir](el.from, el.to);
        if (el.rotation) pts = pts.map(p => rotPoint(p, el.rotation.axis, el.rotation.angle, el.rotation.origin, el.rotation.rescale));
        if (x) pts = pts.map(p => rotPoint(p, 'x', -x, [8, 8, 8]));
        if (y) pts = pts.map(p => rotPoint(p, 'y', -y, [8, 8, 8]));
        const uv = face.uv || DEFAULT_UV[dir](el.from, el.to);
        let corners = [[uv[0], uv[1]], [uv[2], uv[1]], [uv[2], uv[3]], [uv[0], uv[3]]];
        const turns = ((face.rotation || 0) / 90) & 3;
        for (let i = 0; i < turns; i++) corners = [corners[3], corners[0], corners[1], corners[2]];
        const sh = el.shade === false || glow ? 1 : shadeOf(normalOf(pts[0], pts[1], pts[3]));
        for (const i of [0, 3, 2, 0, 2, 1]) {
          bk.pos.push(pts[i][0] / 16, pts[i][1] / 16, pts[i][2] / 16);
          bk.uv.push(corners[i][0] / 16, 1 - corners[i][1] / 16);
          bk.col.push(sh, sh, sh);
        }
      }
    }
  }
  for (const bk of buckets.values()) {
    let tex;
    try { tex = await getTexture(base, bk.texId); } catch (e) { console.warn(e.message); continue; }
    const fr = tex.userData.frames;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(bk.pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(fr > 1 ? bk.uv.map((v, i) => (i % 2 ? 1 - (1 - v) / fr : v)) : bk.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(bk.col, 3));
    g.computeBoundingBox();
    const mat = new THREE.MeshBasicMaterial({ map: tex, vertexColors: true, side: THREE.DoubleSide,
      transparent: bk.translucent, alphaTest: bk.translucent ? 0.01 : 0.5, depthWrite: !bk.translucent });
    if (bk.tint !== undefined) { mat.userData.tint = bk.tint; if (tints[bk.tint] !== undefined) mat.color.setHex(tints[bk.tint]); }
    if (bk.glow) { mat.polygonOffset = true; mat.polygonOffsetFactor = -2; mat.polygonOffsetUnits = -2; }
    const mesh = new THREE.Mesh(g, mat);
    mesh.renderOrder = bk.translucent ? 2 : bk.glow ? 1 : 0;
    group.add(mesh);
  }
  return group;
}

/** Picks the blockstate variant for some properties (key "a=b,c=d"); missing properties match anything. */
export async function variantFor(base, blockId, props = {}) {
  const bs = await getJson(fileUrl(base, 'blockstates', blockId, '.json'));
  const v = bs.variants || {};
  for (const [k, val] of Object.entries(v)) {
    const want = k === '' ? [] : k.split(',').map(s => s.split('='));
    if (want.every(([p, x]) => props[p] === undefined || String(props[p]) === x)) return Array.isArray(val) ? val[0] : val;
  }
  throw new Error('no variant ' + blockId + ' ' + JSON.stringify(props));
}

/** The flat picture of an item made of texture layers (item/generated), drawn on a canvas `size` pixels wide. */
export async function flatItem(base, model, size = 128) {
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
  for (let i = 0; model.textures['layer' + i]; i++) {
    const tex = await getTexture(base, resolveTex(model.textures, model.textures['layer' + i]));
    const img = tex.image, w = img.width;
    ctx.drawImage(img, 0, 0, w, w, 0, 0, size, size);
  }
  return cv;
}

/** The item's inventory transform (display.gui), as Minecraft applies it: translate, rotate X then Y then Z, scale. */
export function guiTransform(model) {
  const gui = (model.display && model.display.gui) || { rotation: [30, 225, 0], translation: [0, 0, 0], scale: [0.625, 0.625, 0.625] };
  const m = new THREE.Matrix4();
  const r = (gui.rotation || [0, 0, 0]).map(d => d * Math.PI / 180), t = gui.translation || [0, 0, 0], s = gui.scale || [1, 1, 1];
  m.makeTranslation(t[0] / 16, t[1] / 16, t[2] / 16);
  m.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(r[0], r[1], r[2], 'XYZ')));
  m.multiply(new THREE.Matrix4().makeScale(s[0], s[1], s[2]));
  m.multiply(new THREE.Matrix4().makeTranslation(-0.5, -0.5, -0.5));
  return m;
}
