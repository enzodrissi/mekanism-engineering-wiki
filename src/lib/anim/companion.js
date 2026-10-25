// The Digital Miner Companion linked to a miner: the mod's item (registry id digital_miner_surveyor) and what its screen shows.
// Sources, in the mod (src/main/):
// - resources/assets/mekanismengineering/models/item/digital_miner_surveyor.json: three texture layers (body, screen, LED) and overrides on
//   two item properties, state and progress, that pick models/item/companion/<reset | running_N | paused_N | done>.json (N = tenths).
// - java/.../client/ClientSetup.java: state = MinerProgress.Status ordinal (OFFLINE 0, NOT_READY 1, WORKING 2, PAUSED 3, DONE 4),
//   progress = its decile; java/.../common/survey/MinerProgress.java: percent = (found - left) * 100 / found, never 100 while a block is
//   left, decile = percent / 10 (at most 9), 10 when done. A searching or mining miner is WORKING (0 % while it searches); a held-up one too.
// - java/.../item/DigitalMinerCompanionItem.java: the server refreshes that state every STATUS_PERIOD = 20 ticks (once a second).
// - textures/item/companion/*.png(.mcmeta): 32 x 32 layers; the running screens, the done and reset screens and the running LED are
//   animated strips (2, 6 and 14/10 ticks a frame). The screen and LED layers glow (neoforge_data block_light 15).
// It is an item (minecraft:item/generated): drawn here as the game builds such a model, the picture on both faces of a slab 1/16 of its
// width thick, with a side face on every edge of its pixels. It stands next to the machine as an illustration of the player's item.
import * as THREE from 'three';
import { getTexture, loadModel, frameAt } from '../mcmodel.js';

const NS = 'mekanismengineering:item/companion/';
const PX = 32;

/** The model of the item for a state and a tenth, as the overrides of digital_miner_surveyor.json choose it. */
export function companionModel(state, decile = 0) {
  if (state === 'not_ready') return 'reset';
  if (state === 'done') return 'done';
  return `${state === 'paused' ? 'paused' : 'running'}_${Math.max(0, Math.min(9, decile))}`;
}

/** The item as a 3D object (1 block wide, standing, its picture facing +z) with set(model) and step(ms) -> changed. */
export async function buildCompanion(base, models = []) {
  const layers = new Map();                                 // model -> [texture, texture, texture]
  for (const m of models) {
    const model = await loadModel(base, NS + m);
    layers.set(m, await Promise.all([0, 1, 2].map(i => getTexture(base, model.textures['layer' + i]))));
  }
  // the picture, redrawn when the model or a frame of its strips changes
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = PX;
  const g = canvas.getContext('2d'); g.imageSmoothingEnabled = false;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace; tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false;
  const frameOf = (t, ms) => (t.userData.anim ? frameAt(t.userData.anim, ms) : 0);
  const draw = (target, list, frames) => list.forEach((t, i) => target.drawImage(t.image, 0, frames[i] * PX, PX, PX, 0, 0, PX, PX));

  // the outline: every pixel any layer of any of these models ever fills
  const solid = new Uint8Array(PX * PX);
  const probe = document.createElement('canvas'); probe.width = probe.height = PX;
  const pg = probe.getContext('2d', { willReadFrequently: true });
  for (const list of layers.values()) for (const t of list) for (let f = 0; f < t.userData.frames; f++) {
    pg.clearRect(0, 0, PX, PX); pg.drawImage(t.image, 0, f * PX, PX, PX, 0, 0, PX, PX);
    const d = pg.getImageData(0, 0, PX, PX).data;
    for (let i = 0; i < PX * PX; i++) if (d[i * 4 + 3] > 0) solid[i] = 1;
  }
  const filled = (x, y) => x >= 0 && y >= 0 && x < PX && y < PX && solid[y * PX + x] === 1;

  // geometry in texture pixels, then scaled to 1 block: x right, y up, the picture on both faces of a slab 1/16 of the width thick (2 px)
  const pos = [], uv = [], col = [];
  const D = PX / 16 / 2;
  const quad = (pts, uvs, shade) => {
    for (const i of [0, 1, 2, 0, 2, 3]) { pos.push(...pts[i]); uv.push(...uvs[i]); col.push(shade, shade, shade); }
  };
  const full = [[0, 0], [1, 0], [1, 1], [0, 1]];
  quad([[0, 0, D], [PX, 0, D], [PX, PX, D], [0, PX, D]], full, 1);
  quad([[PX, 0, -D], [0, 0, -D], [0, PX, -D], [PX, PX, -D]], [[1, 0], [0, 0], [0, 1], [1, 1]], 1);
  // side faces take the colour of their pixel (texture coordinates at its centre); shaded like a block's faces (east/west 0.6, up 1, down 0.5)
  for (let y = 0; y < PX; y++) for (let x = 0; x < PX; x++) {
    if (!filled(x, y)) continue;
    const c = [(x + 0.5) / PX, 1 - (y + 0.5) / PX], cs = [c, c, c, c];
    const top = PX - y, bot = PX - y - 1;
    if (!filled(x, y - 1)) quad([[x, top, D], [x + 1, top, D], [x + 1, top, -D], [x, top, -D]], cs, 1);
    if (!filled(x, y + 1)) quad([[x, bot, -D], [x + 1, bot, -D], [x + 1, bot, D], [x, bot, D]], cs, 0.5);
    if (!filled(x - 1, y)) quad([[x, bot, -D], [x, bot, D], [x, top, D], [x, top, -D]], cs, 0.6);
    if (!filled(x + 1, y)) quad([[x + 1, bot, D], [x + 1, bot, -D], [x + 1, top, -D], [x + 1, top, D]], cs, 0.6);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos.map(v => v / PX), 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.translate(-0.5, 0, 0);                                  // origin at the middle of its bottom edge
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, vertexColors: true, alphaTest: 0.5, side: THREE.DoubleSide }));
  const obj = new THREE.Group(); obj.add(mesh);

  let current = null, shown = '';
  function step(ms) {
    const list = layers.get(current);
    if (!list) return false;
    const frames = list.map(t => frameOf(t, ms));
    const key = current + frames.join(',');
    if (key === shown) return false;
    shown = key;
    g.clearRect(0, 0, PX, PX); draw(g, list, frames);
    tex.needsUpdate = true;
    return true;
  }
  return {
    obj,
    get model() { return current; },
    /** Switches to a model of the overrides; returns true when the picture changed. */
    set(model, ms = 0) { if (model === current) return false; current = model; return step(ms); },
    step,
  };
}
