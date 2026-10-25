// Petrogenic Synthesizer. Two things really change in the game, and nothing else moves:
// - models/block/petrogenic_synthesizer_active.json (the model the blockstate switches to while it works) lights the two status LEDs
//   (led vs led_off), the core field of the roof (field vs field_off) and the ports. None of its textures has a .mcmeta: it is a swap, not a loop.
// - client/render/RenderPetrogenicSynthesizer.java draws the chosen product on the roof, flat and still: the top face of the product's
//   block, a 3.3 px square from 6.35 to 9.65 at y = 16.07 (a hair above the core at 16.04), whether the machine works or not.
//   With no product the roof square stays teal (the renderer is not even called).
// The 13 products, their order and their fluid costs are the recipes data/mekanismengineering/recipe/petrogenic/*.json
// (water and lava in mB for one block; the same table is in the wiki page). Each texture is the top face of the vanilla block model
// (cube_all: the one texture; cube_column: its `end` texture, the block standing upright).
import { buildBlock } from '../mcmodel.js';
import { caption } from './ui.js';

// [id, name, top texture, water mB, lava mB], in the recipes' own `order`
const PRODUCTS = [
  ['cobblestone', 'Cobblestone', 'cobblestone', 250, 250],
  ['stone', 'Stone', 'stone', 250, 250],
  ['smooth_stone', 'Smooth Stone', 'smooth_stone', 250, 500],
  ['obsidian', 'Obsidian', 'obsidian', 1000, 1000],
  ['basalt', 'Basalt', 'basalt_top', 500, 500],
  ['granite', 'Granite', 'granite', 250, 500],
  ['diorite', 'Diorite', 'diorite', 250, 500],
  ['andesite', 'Andesite', 'andesite', 250, 500],
  ['cobbled_deepslate', 'Cobbled Deepslate', 'cobbled_deepslate', 250, 375],
  ['deepslate', 'Deepslate', 'deepslate_top', 250, 500],
  ['tuff', 'Tuff', 'tuff', 500, 500],
  ['blackstone', 'Blackstone', 'blackstone_top', 250, 500],
  ['smooth_basalt', 'Smooth Basalt', 'smooth_basalt', 500, 750],
];

// the roof square of RenderPetrogenicSynthesizer (pixels of the model facing north, which is how the page shows it)
const FROM = 6.35, TO = 9.65, TOP = 16.07;

/** A one-face model: the top of a block shrunk onto the roof square, whole texture, no shading (the renderer passes colour 1,1,1). */
function roofFace(texture) {
  return {
    textures: { top: 'minecraft:block/' + texture }, render_type: null, special: null,
    elements: [{ from: [FROM, TOP, FROM], to: [TO, TOP, TO], faces: { up: { texture: '#top', uv: [0, 0, 16, 16] } } }],
  };
}

export default async function setup({ stage, base, host, active, choice }) {
  const faces = new Map();
  let shown = null, current = 'cobblestone';
  const note = caption(host);

  const text = () => {
    const p = PRODUCTS.find(x => x[0] === current);
    const state = active.on ? 'Running: the LEDs, the core field and the ports are lit.' : 'Idle: the LEDs, the core field and the ports are dark.';
    return p ? `${state} ${p[1]} shows on the roof (${p[3].toLocaleString('en-US')} mB of water and ${p[4].toLocaleString('en-US')} mB of lava a block).`
      : `${state} No product chosen: the roof square stays teal.`;
  };

  async function show(id) {
    current = id;
    const p = PRODUCTS.find(x => x[0] === id);
    if (p && !faces.has(id)) {
      const o = await buildBlock(base, roofFace(p[2]));
      // the face lies 0.03 px over the core at 16.04: keep it in front at any zoom
      o.traverse(m => { if (m.material) { m.material.polygonOffset = true; m.material.polygonOffsetFactor = -2; m.material.polygonOffsetUnits = -2; } });
      o.visible = false; stage.root.add(o); faces.set(id, o);
    }
    if (shown) shown.visible = false;
    shown = p ? faces.get(id) : null;
    if (shown) shown.visible = true;
    note.set(text());
    stage.draw();
  }

  choice('Product on the roof', [['none', 'None'], ...PRODUCTS.map(p => [p[0], p[1]])], current, v => show(v));
  active.onChange(() => note.set(text()));
  await show(current);
  // pressing "Running" is the first thing a reader tries: start it
  active.set(true);
}
setup.active = true;
