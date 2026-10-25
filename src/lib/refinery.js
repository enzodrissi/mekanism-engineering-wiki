// The Quantum Ore Refinery in 3D, block by block, with the mod's real models and textures.
// Drawing: RefineryTemplate.TEXT with one energy port, the least the structure takes (owner's rule, 24 October 2026); blocks and states: RefineryBuildPlan + RefineryBuilder.oriented (what /mekeng build places) + StackableBlock.
import * as THREE from 'three';
import { buildBlock, variantFor } from './mcmodel.js';

export const TEXT = `
P  C  G  F  C  G  G  E  C  P
I  C  C  C  C  C  C  C  C  O
P  K  Di Wa Cr In Pu En Sm P

P  C  C  C  C  C  C  C  C  P
.  .  a  w  .  h  o  .  .  Q
P  T  T  T  T  T  T  T  T  P

P  A  A  A  A  A  A  A  A  P
.  .  a  w  .  h  o  .  .  .
P  V  V  V  V  V  V  V  V  P

P  B  B  B  B  B  B  B  B  P
B  .  .  .  .  .  .  .  .  B
P  B  B  B  B  B  B  B  B  P`;

const R = 'ore_refinery_';
export const TOKENS = {
  P: R + 'pillar', C: R + 'casing', G: R + 'input_port', F: R + 'input_port', I: R + 'input_port', O: R + 'output_port',
  E: R + 'energy_port', K: R + 'controller', Di: R + 'module_dissolution', Wa: R + 'module_washing', Cr: R + 'module_crystallization',
  In: R + 'module_injection', Pu: R + 'module_purification', En: R + 'module_enrichment', Sm: R + 'module_smelting',
  a: R + 'tank_sulfuric_acid', w: R + 'tank_water', h: R + 'tank_hydrogen_chloride', o: R + 'tank_oxygen',
  A: R + 'accelerator', T: R + 'conveyor', B: R + 'girder', Q: R + 'module_quantum', V: null, '.': null,
};
export const NAMES = {
  pillar: 'Ore Refinery Pillar', casing: 'Ore Refinery Casing', input_port: 'Ore Refinery Input Port', output_port: 'Ore Refinery Output Port',
  energy_port: 'Ore Refinery Energy Port', controller: 'Quantum Ore Refinery Controller', module_dissolution: 'Dissolution Module',
  module_washing: 'Washing Module', module_crystallization: 'Crystallization Module', module_injection: 'Injection Module',
  module_purification: 'Purification Module', module_enrichment: 'Enrichment Module', module_smelting: 'Smelting Module',
  tank_sulfuric_acid: 'Sulfuric Acid Tank', tank_water: 'Water Tank', tank_hydrogen_chloride: 'Hydrogen Chloride Tank',
  tank_oxygen: 'Oxygen Tank', accelerator: 'Ore Refinery Accelerator', conveyor: 'Ore Refinery Conveyor', girder: 'Ore Refinery Girder',
  module_quantum: 'Ore Refinery Quantum Module', glass: 'Ore Refinery Glass',
};

/** Cells of the drawing: dx = 1 - x, dy = layer, dz = row (front 0, middle 1, back 2), as in RefineryTemplate. */
export function cells({ accelerators = 8, module = true, glass = false } = {}) {
  const layers = TEXT.trim().split(/\n\s*\n/).map(l => l.trim().split('\n').map(r => r.trim().split(/\s+/)));
  const out = []; let acc = 0;
  layers.forEach((rows, dy) => rows.forEach((row, ri) => row.forEach((tok, x) => {
    const dz = 2 - ri, dx = 1 - x;
    let id = TOKENS[tok];
    if (tok === 'A') id = acc++ < accelerators ? R + 'accelerator' : R + 'casing';
    if (tok === 'Q') id = module ? id : null;
    if (!id && glass) id = R + 'glass';
    out.push({ tok, dx, dy, dz, id });
  })));
  return out;
}

export function stateOf(cell, all) {
  const at = (x, y, z) => all.find(c => c.dx === x && c.dy === y && c.dz === z);
  const props = {};
  const id = cell.id;
  if (/pillar|tank_/.test(id)) {
    props.up = at(cell.dx, cell.dy + 1, cell.dz)?.id === id; props.down = at(cell.dx, cell.dy - 1, cell.dz)?.id === id;
  }
  if (/controller|_port|module_/.test(id)) {
    const t = /controller/.test(id) ? 0 : cell.dx === -8 ? 3 : cell.dx === 1 ? 1 : cell.dz === 2 ? 2 : 0;
    props.facing = ['north', 'east', 'south', 'west'][t];
  }
  if (/controller/.test(id)) props.active = false;
  if (/input_port/.test(id)) props.mode = 'items';
  if (/girder|conveyor/.test(id)) props.axis = /girder/.test(id) && (cell.dx === -8 || cell.dx === 1) ? 'z' : 'x';
  return props;
}

/** Builds the structure; returns the group and its blocks (for the exploded view, a single layer and the markers). */
export async function buildRefinery(base, opts) {
  const all = cells(opts), root = new THREE.Group(), blocks = [];
  for (const c of all) {
    if (!c.id) continue;
    const props = stateOf(c, all), id = `mekanismengineering:${c.id}`;
    const v = await variantFor(base, id, props);
    let obj = await buildBlock(base, v.model, { x: v.x || 0, y: v.y || 0 });
    const data = { ...c, name: NAMES[c.id.replace(R, '')] };
    // a pillar or tank joined to the same block above or below has open ends (StackableBlock): when the layers are apart,
    // it would look stripped, so it then shows its model on its own, with both ends (see arrange)
    if (props.up || props.down) {
      const s = await variantFor(base, id, { ...props, up: false, down: false });
      const alone = await buildBlock(base, s.model, { x: s.x || 0, y: s.y || 0 });
      alone.visible = false;
      const joined = obj; obj = new THREE.Group(); obj.add(joined, alone);
      Object.assign(data, { joined, alone });
    }
    obj.traverse(m => { if (m.material) m.material.onBeforeCompile = seeThrough; });
    obj.position.set(c.dx, c.dy, c.dz);
    obj.userData = data;
    root.add(obj); blocks.push(obj);
  }
  return { root, blocks };
}

// A faded block keeps its whole shape: as it fades, its see-through and cut-out pixels fill in with a steel tint, so a
// tank does not lose its glass and keep only its frame (which read as a stripped block, an arch with nothing inside).
// At full opacity nothing changes.
function seeThrough(shader) {
  shader.fragmentShader = shader.fragmentShader.replace('#include <alphatest_fragment>', `
    float meFade = clamp((1.0 - opacity) / 0.9, 0.0, 1.0);
    float meTex = diffuseColor.a / max(opacity, 1e-4);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.52, 0.56), meFade * (1.0 - meTex));
    diffuseColor.a = mix(meTex, max(meTex, 0.6), meFade) * opacity;
    #include <alphatest_fragment>`);
}

const DEPTH_ONLY = new THREE.MeshBasicMaterial({ colorWrite: false, transparent: true, side: THREE.DoubleSide });

/** Spreads the layers apart (gap in blocks) and fades every layer but `only` (1 to 4, 0 = all). */
export function arrange(blocks, { gap = 0, only = 0, ghost = 0.12 } = {}) {
  const apart = gap > 0 || only > 0;
  for (const b of blocks) {
    const d = b.userData;
    b.position.y = d.dy * (1 + gap);
    if (d.alone) { d.alone.visible = apart; d.joined.visible = !apart; }
    const dim = only && only !== d.dy + 1;
    b.traverse(m => { if (!m.material || m.userData.depthOnly) return;
      // a faded block first marks only its nearest surface, then draws there: one clear see-through skin per block
      // instead of every inner face stacked (see DEPTH_ONLY)
      if (dim && !m.userData.skin) { m.userData.skin = new THREE.Mesh(m.geometry, DEPTH_ONLY); Object.assign(m.userData.skin, { renderOrder: 2.5, raycast() {} }); m.userData.skin.userData.depthOnly = true; m.add(m.userData.skin); }
      if (m.userData.skin) m.userData.skin.visible = !!dim;
      if (m.userData.base === undefined) m.userData.base = { t: m.material.transparent, a: m.material.alphaTest, dw: m.material.depthWrite, ro: m.renderOrder };
      m.material.transparent = dim || m.userData.base.t; m.material.opacity = dim ? ghost : 1;
      m.material.alphaTest = dim ? 0.02 : m.userData.base.a; m.material.depthWrite = dim ? false : m.userData.base.dw; m.renderOrder = dim ? 3 : m.userData.base.ro; m.material.needsUpdate = true; });
  }
}
